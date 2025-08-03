<!-- src/components/GanttSchedule.vue -->
<template>
  <v-card>
    <v-toolbar color="transparent" dark class="pa-3">
      <v-toolbar-title>Schedules</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-select
        v-if="enableEntityFilter"
        v-model="internalEntityId"
        :items="entityData"
        item-title="value.title"
        item-value="id"
        label="Machine"
        prepend-icon="mdi-cog"
        :rules="[v => !!v || 'Machine is required']"
        required
        @update:modelValue="applyFilters"
      ></v-select>
      <div class="d-flex align-center gap-4">
        <input
          v-if="enableTimeFilter"
          type="month"
          v-model="internalDate"
          :max="currentDate"
          @change="applyFilters"
          style="max-width: 300px; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"
        />
        <v-divider class="ma-2"></v-divider>
        <v-btn variant="outlined" @click="$emit('refresh')">Refresh</v-btn>
      </div>
    </v-toolbar>

    <v-divider class="ma-2"></v-divider>

    <v-card-text>
      <div class="gantt-container">
        <div class="svg-container">
          <svg :id="chartId" preserveAspectRatio="xMinYMin meet"></svg>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="js">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { GanttChart } from './gantt-chart';

// Props definition
const props = defineProps({
  scheduleData: {
    type: Array,
    default: () => [],
  },
  entityData: {
    type: Array,
    default: () => [],
  },
  defaultEntityValue: {
    type: String,
    default: '',
  },
  defaultTimeValue: {
    type: String,
    default: () => new Date().toISOString().slice(0, 7), // YYYY-MM format
  },
  enableTimeFilter: {
    type: Boolean,
    default: true,
  },
  enableEntityFilter: {
    type: Boolean,
    default: true,
  },
});

// Emits definition
const emit = defineEmits(['refresh', 'select-schedule']);

// Reactive state
const chart = ref(null);
const filteredTasks = ref([]);
const internalDate = ref(props.enableTimeFilter ? props.defaultTimeValue : props.defaultTimeValue);
const internalEntityId = ref(props.enableEntityFilter ? props.defaultEntityValue : props.defaultEntityValue);
const currentDate = ref(new Date().toISOString().slice(0, 7));
// Generate a unique chart ID to avoid conflicts when multiple instances are used
const chartId = `gantt-chart-${Math.random().toString(36).substring(2, 9)}`;

const processScheduleData = (data) => {
  if (data && Array.isArray(data)) {
    return data.map(x => ({
      ...x,
      target_entity: x.target_entity || 'brrrrrr',
      schedule_name: `Work Order: ${x.schedule_data?.work_order_number || 'Unknown'}`,
    }));
  }
  console.warn('Invalid or no payload in schedule data:', data);
  return [];
};

const initGanttChart = () => {
  const svgElement = document.getElementById(chartId);
  if (!svgElement || !filteredTasks.value.length) return;

  const [year, month] = internalDate.value.split('-').map(Number);
  chart.value = new GanttChart(svgElement, filteredTasks.value, {
    dayWidth: 40,
    rowHeight: 50,
    topHeaderHeight: 50,
    categoryLabelWidth: 150,
    selectedMonth: month,
    selectedYear: year,
    useTimeOffset: true,
    alwaysRenderTaskOnANewRow: true,
  });

  chart.value.onTaskClick = (task) => {
    console.log('Task clicked:', task);
    emit('select-schedule', task); // Emit the selected task data
  };

  chart.value.render();
  setupViewBox();
};

const setupViewBox = () => {
  const svgElement = document.getElementById(chartId);
  if (!svgElement) return;

  const width = parseInt(svgElement.getAttribute('width') || 800);
  const height = parseInt(svgElement.getAttribute('height') || 500);
  svgElement.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svgElement.style.width = '100%';
  svgElement.style.height = 'auto';
};

const applyFilters = () => {
  const [year, month] = internalDate.value.split('-').map(Number);
  filteredTasks.value = processScheduleData(props.scheduleData).filter(task => {
    const startDate = new Date(task.planned_start_time);
    const matchesDate = startDate.getMonth() + 1 === month && startDate.getFullYear() === year;
    const matchesEntity = props.enableEntityFilter ? task.target_entity === internalEntityId.value : true;
    return matchesDate && matchesEntity;
  });

  if (chart.value) {
    chart.value.tasks = filteredTasks.value;
    chart.value.options.selectedMonth = month;
    chart.value.options.selectedYear = year;
    chart.value.render();
    setupViewBox();
  } else if (filteredTasks.value.length > 0) {
    initGanttChart();
  }
};

// Watch for changes in props.scheduleData to reprocess and reapply filters
watch(
  () => props.scheduleData,
  (newData) => {
    filteredTasks.value = processScheduleData(newData);
    applyFilters();
  },
  { immediate: true }
);

// Watch for changes in props.entityData to update internalEntityId if needed
watch(
  () => props.entityData,
  (newData) => {
    if (newData.length && !internalEntityId.value) {
      internalEntityId.value = props.defaultEntityValue || newData[0]?.id || '';
      applyFilters();
    }
  },
  { immediate: true }
);

onMounted(() => {
  applyFilters();
});

onUnmounted(() => {
  // if (chart.value) chart.value.destroy();
});
</script>

<style scoped>
.gantt-container {
  width: 100%;
  overflow-x: auto;
}

.svg-container {
  width: 100%;
}

svg {
  width: 100%;
  height: auto;
  min-height: 300px;
}

input[type="month"] {
  font-family: inherit;
  font-size: 14px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: transparent;
  color: inherit;
}

input[type="month"]:focus {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
}
</style>
<template>
  <div>
    <div v-if="loading">Loading schedules...</div>
    <div v-else-if="error">Error: {{ error }}</div>
    <div v-else>
      <v-sheet class="px-5">
        <v-sheet class="d-flex flex-row ga-3 py-2 justify-space-between align-end">
          <v-sheet>
            <atoms-atom-base-label :bold="true">Month & Year Filter</atoms-atom-base-label>
            <atoms-atom-base-calendar-native
              v-model="filterMonthYear"
              type="month"
              label="Month & Year Filter"
              :use-now="true"
              :clearable="false"/>
          </v-sheet>
          <v-sheet>
            <v-btn variant="outlined" color="primary" @click="getData" :loading="loading">Refresh</v-btn>
          </v-sheet>
        </v-sheet>       
        <atoms-atom-base-chart-gantt-schedule
          :tasks="schedules"
          :selectedMonth="filterMonth"
          :selectedYear="filterYear"
          :dayWidth="50"
          :onTaskClick="handleTaskClick"
          :forceRender="forceCounter"/>
      </v-sheet>
    </div>
  </div>
</template>

<script setup lang="js">
import { ref, computed, onMounted } from 'vue';
import { getAllSchedulesByEntityId } from '~/services/schedules/service-schedule';
import { transformScheduleData, validateGanttData } from '~/components/molecules/schedule-data-checker'

const schedules = ref([]);
const originalData = ref([]);
const forceCounter = ref(0);
const loading = ref(true);
const error = ref(null);
const filterMonthYear = ref('');
const validationResult = ref({ isValid: true, errors: [] });

const emit = defineEmits(['selectedTask'])


const filterYear = computed(() => {
  if (!filterMonthYear.value) return null;
  const parts = filterMonthYear.value.split('-');
  return parts.length >= 1 ? Number(parts[0]) : null;
});

const filterMonth = computed(() => {
  if (!filterMonthYear.value) return null;
  const parts = filterMonthYear.value.split('-');
  return parts.length >= 2 ? Number(parts[1]) : null;
});

const triggerChart = () => {
  forceCounter.value++;
  console.log('Force render triggered:', forceCounter.value);
}

const getData = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    console.log('Fetching schedules from API...');
    const response = await getAllSchedulesByEntityId();
        
    // Handle different response formats
    let rawData = [];
    if (Array.isArray(response)) {
      rawData = response;
    } else if (response?.data && Array.isArray(response.data)) {
      rawData = response.data;
    } else if (response?.schedules && Array.isArray(response.schedules)) {
      rawData = response.schedules;
    } else {
      throw new Error('Invalid response format: expected array or object with data/schedules property');
    }
    
    // Store original data for debugging
    originalData.value = rawData;
    
    // Transform data to be compatible with GanttChart
    const transformedData = transformScheduleData(rawData);

    // Validate transformed data
    const validation = validateGanttData(transformedData);
    validationResult.value = validation;
    
    if (!validation.isValid) {
      console.warn('Data validation failed:', validation.errors);
      // You can choose to proceed with invalid data or throw an error
    }
    
    schedules.value = transformedData;
    console.log(`Successfully processed ${transformedData.length} schedules`);
    
    // Trigger chart render after data is ready
    if (transformedData.length > 0) {
      setTimeout(() => {
        triggerChart();
      }, 100);
    } else {
      console.warn('No valid schedules found after transformation');
    }
    
  } catch (err) {
    console.error('Error in getData:', err);
    error.value = err.message || 'Failed to fetch or process data';
    schedules.value = [];
    originalData.value = [];
    validationResult.value = { isValid: false, errors: [err.message] };
  } finally {
    loading.value = false;
  }
};

const handleTaskClick = (data) => {
  emit('selectedTask', data)
};

onMounted(() => {
  console.log('Parent component mounted');
  getData();
});
</script>

<style scoped>
.controls {
  /* margin-top: 1rem; */
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.debug-info {
  background: #f5f5f5;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.errors {
  color: #d32f2f;
  margin-top: 0.5rem;
}

.errors ul {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}
</style>
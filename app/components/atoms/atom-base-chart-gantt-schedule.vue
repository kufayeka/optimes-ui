<template>
  <div class="gantt-container">
    <div class="filter-info" v-if="selectedMonth && selectedYear">
      <p>Showing tasks for: {{ getMonthName(selectedMonth) }} {{ selectedYear }} | Total tasks: {{ filteredTasks.length }} (from {{ props.tasks.length }} total)</p>
    </div>
    <atoms-atom-base-wrapper max-height="500px">
      <div class="svg-container" v-if="selectedMonth && selectedYear">
        <svg :id="chartId" preserveAspectRatio="xMinYMin meet"></svg>
      </div>
    </atoms-atom-base-wrapper>
  </div>
</template>

<script setup lang="js">
import { watch, onMounted, onUnmounted, nextTick, computed } from 'vue';
import { GanttChart } from '../gantt-chart-new';

const props = defineProps({
  tasks: { type: Array, default: () => [] },
  dayWidth: { type: Number, default: 40 },
  rowHeight: { type: Number, default: 50 },
  topHeaderHeight: { type: Number, default: 40 },
  categoryLabelWidth: { type: Number, default: 120 },
  selectedMonth: { type: Number, default: new Date().getMonth() + 1 },
  selectedYear: { type: Number, default: new Date().getFullYear() },
  useTimeOffset: { type: Boolean, default: true },
  alwaysRenderTaskOnANewRow: { type: Boolean, default: true },
  onTaskClick: { type: Function, default: null },
  forceRender: { type: Number, default: 0 }
});

const chartId = `gantt-chart-${Math.random().toString(36).substring(2, 9)}`;
let chartInstance = null;

// Filter tasks berdasarkan selectedMonth dan selectedYear
const filteredTasks = computed(() => {
  if (!props.selectedMonth || !props.selectedYear || !props.tasks.length) {
    return props.tasks;
  }

  return props.tasks.filter(task => {
    // Parse tanggal dari planned_start_time dan planned_finish_time
    const startDate = new Date(task.planned_start_time);
    const finishDate = new Date(task.planned_finish_time);
    
    // Cek apakah task berada dalam bulan dan tahun yang dipilih
    // Task akan ditampilkan jika:
    // 1. Start date berada dalam month/year yang dipilih, ATAU
    // 2. Finish date berada dalam month/year yang dipilih, ATAU  
    // 3. Task span melintasi month/year yang dipilih (start sebelum, finish sesudah)
    
    const selectedDate = new Date(props.selectedYear, props.selectedMonth - 1, 1); // Tanggal 1 bulan yang dipilih
    const selectedMonthStart = new Date(props.selectedYear, props.selectedMonth - 1, 1);
    const selectedMonthEnd = new Date(props.selectedYear, props.selectedMonth, 0, 23, 59, 59); // Akhir bulan
    
    // Kondisi 1: Start date dalam bulan/tahun yang dipilih
    const startInMonth = startDate.getFullYear() === props.selectedYear && 
                        startDate.getMonth() === props.selectedMonth - 1;
    
    // Kondisi 2: Finish date dalam bulan/tahun yang dipilih  
    const finishInMonth = finishDate.getFullYear() === props.selectedYear && 
                         finishDate.getMonth() === props.selectedMonth - 1;
    
    // Kondisi 3: Task span melintasi bulan yang dipilih
    const taskSpansMonth = startDate <= selectedMonthEnd && finishDate >= selectedMonthStart;
    
    return startInMonth || finishInMonth || taskSpansMonth;
  });
});

// Helper function untuk mendapatkan nama bulan
function getMonthName(monthNumber) {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'Desember'
  ];
  return months[monthNumber - 1] || 'Unknown';
}

function cleanupChart() {
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }
}

function renderChart() {
  nextTick(() => {
    console.log('render chart with filtered tasks:', filteredTasks.value.length);
    console.log('filtered tasks:', filteredTasks.value);
    
    const svg = document.getElementById(chartId);
    if (!svg || !chartInstance) return;
    
    if (props.onTaskClick) chartInstance.onTaskClick = props.onTaskClick;
    
    // Render dengan filtered tasks
    chartInstance.render(filteredTasks.value, {
      dayWidth: props.dayWidth,
      rowHeight: props.rowHeight,
      topHeaderHeight: props.topHeaderHeight,
      categoryLabelWidth: props.categoryLabelWidth,
      selectedMonth: props.selectedMonth,
      selectedYear: props.selectedYear,
      useTimeOffset: props.useTimeOffset,
      alwaysRenderTaskOnANewRow: props.alwaysRenderTaskOnANewRow
    });
    setupViewBox();
  });
}

function setupViewBox() {
  const svg = document.getElementById(chartId);
  if (!svg) return;
  const width = parseInt(svg.getAttribute('width') || 800);
  const height = parseInt(svg.getAttribute('height') || 300);
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.style.width = '100%';
  svg.style.height = 'auto';
}

onMounted(() => {
  nextTick(() => {
    const svg = document.getElementById(chartId);
    if (!svg) return;
    chartInstance = new GanttChart(svg);
    if (props.onTaskClick) chartInstance.onTaskClick = props.onTaskClick;
    renderChart();
  });
});

// Watch filtered tasks dan properti lainnya
watch(
  () => [
    filteredTasks.value, // Watch filtered tasks instead of raw tasks
    props.dayWidth,
    props.rowHeight,
    props.topHeaderHeight,
    props.categoryLabelWidth,
    props.selectedMonth,
    props.selectedYear,
    props.useTimeOffset,
    props.alwaysRenderTaskOnANewRow,
    props.forceRender
  ],
  renderChart,
  { deep: true }
);

onUnmounted(cleanupChart);
</script>

<style scoped>
.gantt-container {
  width: 100%;
  overflow-x: auto;
}

.filter-info {
  background: #f5f5f5;
  padding: 8px 12px;
  margin-bottom: 12px;
  border-radius: 4px;
  border-left: 4px solid #2196F3;
  font-size: 14px;
}

.filter-info p {
  margin: 4px 0;
  color: #666;
}

.svg-container {
  width: 100%;
}

svg {
  width: 100%;
  height: 100px;
  min-height: 100px;
}
</style>
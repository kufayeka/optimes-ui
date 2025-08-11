<template>
  <atoms-atom-data-display-col title="Machine Speed" class="d-flex gap-2 flex-column">
    <atoms-atom-base-chip size="large" color="primary">
      <atoms-atom-base-label-xxl class="d-flex flex-col justify-center">
        {{ formattedMachineSpeed }} meter / minute
      </atoms-atom-base-label-xxl>
    </atoms-atom-base-chip>

    <v-btn @click="getData" class="mt-3">Refresh</v-btn>

    <pre>{{ eventCapturedValuesData?.captured_values_history }}</pre>

    <Line
      :data="chartData"
      :options="chartOptions"
      class="mt-4"
      style="height: 350px"
    />
  </atoms-atom-data-display-col>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'vue-chartjs';
import { apiServices } from '@/composables/optimesHttpClient';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const eventCapturedValuesData = ref(null);

const getData = async () => {
  try {
    const response = await apiServices.getCapturedValues({
      params: {
        capture_type: 'history',
      },
    });
    eventCapturedValuesData.value = response.data[0];
  } catch (err) {
    console.error('Error fetching data:', err);
  }
};

const formatNumber = (num) => {
  if (typeof num !== 'number' || isNaN(num)) return '-';
  return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
};

const latestMachineSpeed = computed(() => {
  const history = eventCapturedValuesData.value?.captured_values_history?.machine_speed;
  if (!history || history.length === 0) return null;
  const lastEntry = history[history.length - 1];
  const speedNum = Number(lastEntry.value);
  return isNaN(speedNum) ? null : speedNum;
});

const formattedMachineSpeed = computed(() => {
  return latestMachineSpeed.value === null ? '-' : formatNumber(latestMachineSpeed.value);
});

// Chart.js data configuration
const chartData = ref({
  labels: [],
  datasets: [{
    label: 'Machine Speed (m/min)',
    data: [],
    borderColor: '#3b82f6',
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderWidth: 2,
    pointRadius: 3,
    fill: false,
    tension: 0.4 // Smooth curve
  }]
});

// Chart.js options configuration
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top'
    },
    title: {
      display: true,
      text: 'Machine Speed History'
    },
    tooltip: {
      callbacks: {
        title: (tooltipItems) => {
          return new Date(tooltipItems[0].label).toLocaleString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          });
        },
        label: (context) => {
          return `${context.dataset.label}: ${formatNumber(context.parsed.y)} m/min`;
        }
      }
    }
  },
  scales: {
    x: {
      type: 'time',
      time: {
        unit: 'second',
        displayFormats: {
          second: 'HH:mm:ss'
        }
      },
      title: {
        display: true,
        text: 'Timestamp'
      }
    },
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Speed (m/min)'
      },
      ticks: {
        callback: (value) => formatNumber(value)
      }
    }
  }
});

// Update chart data when eventCapturedValuesData changes
watch(
  eventCapturedValuesData,
  (newVal) => {
    const history = newVal?.captured_values_history?.machine_speed ?? [];
    const sorted = [...history].sort((a, b) => new Date(a.ts) - new Date(b.ts));
    
    chartData.value = {
      labels: sorted.map(item => new Date(item.ts)),
      datasets: [{
        label: 'Machine Speed (m/min)',
        data: sorted.map(item => Number(item.value)),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderWidth: 2,
        pointRadius: 3,
        fill: false,
        tension: 0.4
      }]
    };
  },
  { immediate: true }
);

let intervalId = null;
onMounted(() => {
  getData();
  intervalId = setInterval(getData, 5000);
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
});
</script>
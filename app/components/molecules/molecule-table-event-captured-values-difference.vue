<template>
  <atoms-atom-base-label bold="true" class="mt-3">Event Information</atoms-atom-base-label>
  <atoms-atom-data-display-col>
    <div class="d-flex flex-row gap-3">
      <atoms-atom-base-chip color="primary">
        <p class="ml-3">Event Name: {{ eventCapturedValuesData?.event_name }}</p>
      </atoms-atom-base-chip>
    </div>
  </atoms-atom-data-display-col>

  <!-- CAPTURED VALUE -->
  <atoms-atom-base-label bold="true" class="mt-3">Unwind Paper Length</atoms-atom-base-label>
  <atoms-atom-data-display-col class="d-flex gap-2">
    <atoms-atom-base-chip size="x-large" color="primary">
      <atoms-atom-base-label-xxxl>
        {{ formatNumber(cm) }} cm
      </atoms-atom-base-label-xxxl>
    </atoms-atom-base-chip>
 
    <atoms-atom-base-chip size="x-large" color="secondary">
      <atoms-atom-base-label-xxxl>
        {{ formatNumber(meter) }} m
      </atoms-atom-base-label-xxxl>
    </atoms-atom-base-chip>

    <atoms-atom-base-chip size="x-large" color="success">
      <atoms-atom-base-label-xxxl>
        {{ formatNumber(inch) }} inch
      </atoms-atom-base-label-xxxl>
    </atoms-atom-base-chip>
  </atoms-atom-data-display-col>
  <!-- DURATION -->
  <atoms-atom-base-label bold="true" class="mt-3">Duration</atoms-atom-base-label>
  <atoms-atom-data-display-col class="d-flex gap-2">
    <div class="d-flex flex-row gap-3">
      <atoms-atom-base-chip color="primary" class="">
        <p class="ml-3">Event Start Time: {{ formatDateTime(eventCapturedValuesData?.start_time) }}</p>
      </atoms-atom-base-chip>
      <atoms-atom-base-chip color="primary" class="">
        <p class="ml-3">Event End Time: {{ formatDateTime(eventCapturedValuesData?.end_time) }}</p>
      </atoms-atom-base-chip>      
      <atoms-atom-base-chip color="primary" class="">
        <p class="ml-3">Total Event Duration: {{ duration }}</p>
      </atoms-atom-base-chip>  
    </div>
  </atoms-atom-data-display-col>

</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { apiServices } from '@/composables/optimesHttpClient';

const eventCapturedValuesData = ref(null);

// ambil data
const getData = async () => {
  try {
    const response = await apiServices.getCapturedValues({
      params: { capture_type: "difference" }
    });
    eventCapturedValuesData.value = response.data[0];
  } catch (err) {
    console.error('Error:', err);
  }
};

// format angka
const formatNumber = (num) => {
  if (typeof num !== 'number' || isNaN(num)) return '-';
  return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
};

// hitung cm/m/inch
const cm = computed(() => eventCapturedValuesData.value?.captured_values_difference?.raw_paper_roll_length ?? 0);
const meter = computed(() => cm.value / 100);
const inch = computed(() => cm.value / 2.54);

// hitung durasi (HH:MM:SS)
const formatDuration = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
  const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

const duration = computed(() => {
  if (!eventCapturedValuesData.value) return '00:00:00';
  
  const start = new Date(eventCapturedValuesData.value.start_time); // UTC date
  const end = eventCapturedValuesData.value.end_time 
    ? new Date(eventCapturedValuesData.value.end_time) 
    : new Date(); // kalau null → pakai waktu sekarang
  
  return formatDuration(end - start);
});


const formatDateTime = (dateTime) => {
    if (!dateTime) return '-';
    try {
        return new Date(dateTime).toLocaleString('id-ID', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    } catch (error) {
        return dateTime;
    }
};

let intervalId = null;
onMounted(() => {
  getData();
  intervalId = setInterval(getData, 2000);
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
});
</script>

<style scoped>
.d-flex {
  display: flex;
  gap: 12px;
  /* supaya chipnya rapih berdampingan */
}
</style>

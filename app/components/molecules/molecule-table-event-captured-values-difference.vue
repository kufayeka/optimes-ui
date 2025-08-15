<template>
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
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { apiServices } from '@/composables/optimesHttpClient';

const eventCapturedValuesData = ref(null);

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

const formatNumber = (num) => {
  if (typeof num !== 'number' || isNaN(num)) return '-';
  return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
};

const cm = computed(() => eventCapturedValuesData.value?.captured_values_difference?.raw_paper_roll_length ?? 0);
const meter = computed(() => cm.value / 100);
const inch = computed(() => cm.value / 2.54);

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

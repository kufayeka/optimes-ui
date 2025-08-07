<template>
  <p>difference</p>
  <v-btn @click="getData">refresh</v-btn>
  <pre>{{ eventCapturedValuesData?.captured_values_difference }}</pre>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const eventCapturedValuesData = ref(null);

const getData = async () => {
  try {
    const response = await apiServices.getCapturedValues({
      params: {
        capture_type: "difference"
      }
    });
    eventCapturedValuesData.value = response.data[0];
  } catch (err) {
    console.error('Error:', err);
  }
};

const formatDate = (iso) => {
  return new Date(iso).toLocaleString('id-ID', {
    hour12: false,
    dateStyle: 'short',
    timeStyle: 'medium',
  });
};

let intervalId = null;
onMounted(() => {
  //getData(); 
  //intervalId = setInterval(getData, 1000);
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
});
</script>
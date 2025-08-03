<template>
  <molecules-molecule-table-event-captured-values/>
</template>

<script setup lang="js">
import { ref, onMounted } from 'vue';
import { getProcessEventCapturedValues } from '~/services/events/service-events';

const processEventCapturedValues = ref([]);

const handleGetProcessEventCapturedValues = async () => {
  try {
    const response = await getProcessEventCapturedValues();
    processEventCapturedValues.value = response.data;
} catch (err) {
    console.error('Error handleGetProcessEventCapturedValues:', err);
  }
};
 
onMounted(() => {
  handleGetProcessEventCapturedValues();
});
</script>
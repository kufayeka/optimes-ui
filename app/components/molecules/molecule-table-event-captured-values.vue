<template>
  <molecules-molecule-form-section :title="'Captured Values'">
    {{  processEventCapturedValues }}
    <div v-for="(event, idx) in processEventCapturedValues" :key="event.id" class="captured-event">
      <h3 class="event-title">{{ event.event_type.title }} ({{ formatDate(event.start_time) }})</h3>

      <v-table dense class="captured-table">
        <thead>
          <tr>
            <th><atoms-atom-base-label>Data Point</atoms-atom-base-label></th>
            <th><atoms-atom-base-label>Start Value</atoms-atom-base-label></th>
            <th><atoms-atom-base-label>End Value</atoms-atom-base-label></th>
            <th><atoms-atom-base-label>Difference</atoms-atom-base-label></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(startVal, key) in event.captured_values_at_start_time" :key="key">
            <td>{{ key }}</td>
            <td>{{ startVal }}</td>
            <td>{{ event.captured_values_at_end_time[key] }}</td>
            <td>
                <atoms-atom-base-chip>
                <atoms-atom-base-label-lg bold="true">
                    {{ getDiff(startVal, event.captured_values_at_end_time[key]) }}
                </atoms-atom-base-label-lg>
                </atoms-atom-base-chip>
            </td>
          </tr>
        </tbody>
      </v-table>
    </div>
  </molecules-molecule-form-section>
</template>

<script setup>
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

const getDiff = (start, end) => {
  const isNumeric = !isNaN(parseFloat(start)) && !isNaN(parseFloat(end));
  if (!isNumeric) return '-';
  return parseFloat(end) - parseFloat(start);
};

const formatDate = (iso) => {
  return new Date(iso).toLocaleString('id-ID', {
    hour12: false,
    dateStyle: 'short',
    timeStyle: 'medium',
  });
};

onMounted(() => {
  handleGetProcessEventCapturedValues();
});


</script>

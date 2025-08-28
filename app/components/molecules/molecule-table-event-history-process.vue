<template>
  <v-data-table
    density="compact"
    :headers="headers"
    :items="eventHistoryData"
    :items-per-page="10"
  >
    <template v-slot:item="{ item }">
      <tr>
        <td>
          <atoms-atom-base-chip variant="flat" :color="item.event_type.color">
            {{ item.event_name }}
          </atoms-atom-base-chip>
        </td>
        <td>{{ formatDateTime(item.start_time) }}</td>
        <td>{{ formatDateTime(item.end_time) }}</td>
        <!-- Durasi -->
        <td>{{ calcDuration(item.start_time, item.end_time) }}</td>
        <td class="d-flex flex-row align-center justify-center">
          <v-btn size="small"
            class="mx-1"
            :disabled="item.end_time"
            :color="item.end_time ? 'gray' : 'orange'"
            @click="emit('endEvent', item)"
          >
            End
          </v-btn>
          <v-btn size="small" color="primary" class="mx-1" @click="emit('editEvent', item)">Edit</v-btn>
          <v-btn size="small" color="primary" class="mx-1" @click="emit('applyEvent', item)">Apply</v-btn>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script setup lang="js">
const props = defineProps({
  eventHistoryData: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['endEvent', 'editEvent', 'applyEvent']);

const headers = [
  { title: 'Name', key: 'event_name' },
  { title: 'Start Time', key: 'start_time' },
  { title: 'End Time', key: 'end_time' },
  { title: 'Duration', key: 'duration' },
  { title: 'Action', key: 'action', sortable: false }
];

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
  } catch {
    return dateTime;
  }
};

const calcDuration = (start, end) => {
  if (!start) return '00:00:00';
  const startDate = new Date(start);
  const endDate = end ? new Date(end) : new Date();
  const ms = endDate - startDate;
  if (ms < 0) return '00:00:00';
  const totalSeconds = Math.floor(ms / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};
</script>

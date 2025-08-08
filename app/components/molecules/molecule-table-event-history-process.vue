<template>
    <v-data-table
        density="compact"
        :headers="headers"
        :items="eventHistoryData"
        class=""
        :items-per-page="10"
    >
      <template v-slot:top>
      </template>
      <template v-slot:item="{ item }">
        <tr>
          <td><atoms-atom-base-chip variant="flat" :color="item.event_type.color">{{ item.event_name }}</atoms-atom-base-chip></td>
          <td>{{ formatDateTime(item.start_time) }}</td>
          <td>{{ formatDateTime(item.end_time) }}</td>
          <td class="d-flex flex-row align-center justify-center">
            <v-btn size="small" class="mx-1" 
                :disabled="item.end_time" 
                :color="item.end_time ? 'gray':'orange'"
                @click="emit('endEvent', item)"
            >End</v-btn>
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
        default: {},
        required: true
    }
});

const emit = defineEmits(['endEvent', 'editEvent', 'applyEvent'])

const headers = [
    { title: 'Name', key: 'event_name' },
    { title: 'Start Time', key: 'start_time' },
    { title: 'End Time', key: 'end_time' },
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
    } catch (error) {
        return dateTime;
    }
};

</script>
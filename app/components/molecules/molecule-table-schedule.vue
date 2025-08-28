<template>
    <v-data-table 
        density="compact"
        :headers="headers"
        :items="scheduleData"
        class=""
        :items-per-page="10"
    >
      <template v-slot:top>
      </template>
      <template v-slot:item="{ item }">
        <tr>
            <td>{{ item.id }}</td>
            <td>{{ item.populated?.shift?.value?.shift_name }}</td>
            <td>{{ item.populated?.routing?.value?.machine_name }}</td>
            <td><atoms-atom-base-chip>{{ item.schedule_data?.work_order_number }}</atoms-atom-base-chip></td>
            <td><atoms-atom-base-chip>{{ item.schedule_data?.sales_order_number }}</atoms-atom-base-chip></td>
            <td>{{ formatDateTime(item.planned_start_time) }}</td>
            <td>{{ formatDateTime(item.planned_finish_time) }}</td> 
            <td>{{ formatDateTime(item.created_on) }}</td> 
            <td>{{ formatDateTime(item.updated_on) }}</td> 
            <td class="d-flex flex-row align-center justify-center">
                <v-btn size="small" class="mx-1" color="warning" @click="emit('edit', item)">Edit</v-btn>
                <v-btn size="small" class="mx-1" color="primary" @click="emit('view', item)">View</v-btn>
            </td>
        </tr>
      </template>
    </v-data-table>
</template>

<script setup lang="js">
const props = defineProps({
    scheduleData: {
        default: {},
        required: true
    }
});

const emit = defineEmits(['edit', 'view', 'delete'])

const headers = [
    { title: 'ID', key: 'id' },
    { title: 'Shift', key: 'schedule_data.shift' },
    { title: 'Routing', key: 'schedule_data.routing' },
    { title: 'Work Order', key: 'schedule_data.work_order_number' },
    { title: 'Sales Order', key: 'schedule_data.sales_order_number' },

    { title: 'Planned Start Time', key: 'planned_start_time' },
    { title: 'Planned Finish Time', key: 'planned_finish_time' },

    { title: 'Created On', key: 'created_at' },
    { title: 'Updated On', key: 'updated_at' },

    { title: 'Action', key: 'action', sortable: false }
];

const formatDateTime = (dateTime) => {
  if (!dateTime) return '-';
  try {
    let d;

    // Kalau object {year, month, date, ...}
    if (
      typeof dateTime === 'object' &&
      dateTime.year &&
      dateTime.month &&
      dateTime.date
    ) {
      d = new Date(
        dateTime.year,
        (dateTime.month ?? 1) - 1,
        dateTime.date ?? 1,
        dateTime.hour ?? 0,
        dateTime.minute ?? 0,
        dateTime.second ?? 0
      );
    } else if (typeof dateTime === 'string' || dateTime instanceof Date) {
      // Kalau string ISO atau Date object
      d = new Date(dateTime);
    } else {
      return '-';
    }

    if (isNaN(d.getTime())) return '-'; // jaga-jaga kalau tetep invalid

    return d.toLocaleString('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  } catch (error) {
    return '-';
  }
};



</script>
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
            <td>{{ item.schedule_category }}</td>
            <td>{{ item.schedule_data?.shift }}</td>
            <td>{{ item.schedule_data?.routing_name?.title }}</td>
            <td>{{ item.schedule_data?.work_order_number }}</td>
            <td>{{ item.schedule_data?.sales_order_number }}</td>
            <td>{{ formatDateTime(item.planned_start_time) }}</td>
            <td>{{ formatDateTime(item.planned_finish_time) }}</td> 
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

const emit = defineEmits(['edit', 'view'])

const headers = [
    { title: 'Category', key: 'schedule_category' },
    { title: 'Shift', key: 'schedule_data.shift' },
    { title: 'Routing', key: 'schedule_data.routing' },
    { title: 'Work Order', key: 'schedule_data.work_order_number' },
    { title: 'Sales Order', key: 'schedule_data.sales_order_number' },

    { title: 'Planned Start Time', key: 'planned_start_time' },
    { title: 'Planned Finish Time', key: 'planned_finish_time' },
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
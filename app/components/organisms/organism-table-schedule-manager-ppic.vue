<template>
  <v-row>
    <v-col>
      <input
        type="file"
        accept=".xlsx, .xls"
        @change="handleFileChange"
        ref="fileInput"
      />
    </v-col>

    <v-col>
      <v-btn
        color="primary"
        @click="createSchedules"
        :loading="isCreating"
      >
        Create Schedules
      </v-btn>
    </v-col>

    <v-col>
      <v-btn
        color="error"
        @click="replaceSchedules"
        :loading="isCreating"
      >
        Replace Schedules
      </v-btn>
    </v-col>
  </v-row>

  <!-- ✅ Tabel Schedule -->
  <v-data-table
    :headers="headers"
    :items="_data_all_schedules"
    :items-per-page="10"
    class="mt-4"
  >
    <template v-slot:item="{ item }">
      <tr>
        <td>{{ item.schedule_data?.work_order_number }}</td>
        <td>{{ item.schedule_data?.shift }}</td>
        <td>{{ item.schedule_data?.material }}</td>
        <td>{{ item.schedule_data?.routing_name?.title }}</td>
        <td>{{ item.schedule_data?.quantity_order }} {{ item.schedule_data?.quantity_unit }}</td>
        <td>{{ formatDateTime(item.planned_start_time) }}</td>
        <td>{{ formatDateTime(item.planned_finish_time) }}</td>
        <td>
          <v-btn>Edit</v-btn>
          <v-btn>Remove</v-btn>
        </td>
      </tr>
    </template>
  </v-data-table>

  <!-- ✅ Message Popups -->
  <molecules-molecule-popup-error
    :autoClose="false"
    :open="_data_error_message"
    :title="'Error'"
    @close="_close_error"
    maxWidth="400"
  >
    <atoms-atom-base-wrapper width="400px" height="50px" maxWidth="100%" maxHeight="50px">
      <atoms-atom-base-label>{{ _data_error_message }}</atoms-atom-base-label>
    </atoms-atom-base-wrapper>
  </molecules-molecule-popup-error>

  <molecules-molecule-popup-success
    :open="_data_success_message"
    :autoClose="false"
    :title="'Success'"
    @close="_close_success"
    maxWidth="400"
  >
    <atoms-atom-base-wrapper width="400px" height="50px" maxWidth="100%" maxHeight="50px">
      <atoms-atom-base-label>{{ _data_success_message }}</atoms-atom-base-label>
    </atoms-atom-base-wrapper>
  </molecules-molecule-popup-success>
</template>

<script setup>
import { useScheduleManagerProcess } from '@/composables/useScheduleManagerProcess'

const {
  _data_success_message,
  _data_error_message,
  _close_success,
  _close_error,
  handleFileUpload,
  createSchedules,
  replaceSchedules,
  isCreating,
  _data_all_schedules
} = useScheduleManagerProcess()

const handleFileChange = (event) => {
  const files = event.target.files
  if (files && files.length > 0) {
    handleFileUpload(files[0])
  }
}

// ✅ Header untuk table schedule
const headers = [
  { title: 'Work Order', key: 'work_order' },
  { title: 'Shift', key: 'shift' },
  { title: 'Material', key: 'material' },
  { title: 'Routing', key: 'routing' },
  { title: 'Quantity', key: 'quantity' },
  { title: 'Start Time', key: 'start_time' },
  { title: 'End Time', key: 'end_time' },
]

// ✅ Format tanggal
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
}
</script>

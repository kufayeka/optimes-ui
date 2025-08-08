<template>
  <molecules-molecule-form-section :title="'Schedule Manager'">
    <template #endSection>
      <input
        type="file"
        accept=".xlsx, .xls"
        @change="handleFileChange"
        ref="fileInput"
      />
      <v-btn
        color="primary"
        @click="createSchedules"
        :loading="isCreating"
      >
        Create Schedules
      </v-btn>
      <v-btn variant="outlined" color="primary" @click="_handle_fetch_all">Refresh</v-btn>
    </template>
    <molecules-molecule-table-schedule
      class="mt-4"
      :schedule-data="_data_all_schedules"
      @edit="_open_edit_schedule"
      @view="_open_view_schedule"
    />
  </molecules-molecule-form-section>

  <molecules-molecule-popup-information
      :title="'View Schedule'"
      :open="_toggle_popup_schedule_view"
      @close="_close_view_popup"
      maxWidth="700"
  >
    <molecules-molecule-popup-content-base>
        <template #content>
            <atoms-atom-base-wrapper max-width="100%" max-height="400px">
                <molecules-molecule-data-display-schedule :schedule-data="_data_selected_schedule"/>
            </atoms-atom-base-wrapper>
        </template>
        <template #actions>
        </template>
    </molecules-molecule-popup-content-base>
  </molecules-molecule-popup-information>


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
  _set_data_selected_schedule,
  _data_selected_schedule,
  _close_edit_popup,
  _close_view_popup,
  _close_success,
  _close_error,
  _open_view_schedule,
  handleFileUpload,
  createSchedules,
  _toggle_popup_schedule_view,
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

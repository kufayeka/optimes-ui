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
} = useScheduleManagerProcess()

const handleFileChange = (event) => {
  const files = event.target.files
  if (files && files.length > 0) {
    handleFileUpload(files[0])
  }
}
</script>

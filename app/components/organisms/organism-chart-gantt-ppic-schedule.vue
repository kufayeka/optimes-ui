<template>
  {{ _data_all_schedule_data  }}
  <molecules-molecule-chart-gantt-schedule 
    :rawSchedules="ganttTasks"
    @refresh="null"
    @selectedTask="null"
  />

  <molecules-molecule-popup-information 
    title="Schedule View"
    :open="nill"
    @close="null"
    maxWidth="700"
  >
    <molecules-molecule-popup-content-base>
      <template #content>
        <atoms-atom-base-wrapper max-width="100%" max-height="400px">
          <molecules-molecule-data-display-schedule :schedule-data="_data_selected_schedule_data" />
        </atoms-atom-base-wrapper>
      </template>
      <template #actions>
      </template>
    </molecules-molecule-popup-content-base>
  </molecules-molecule-popup-information>
</template>

<script setup lang="js">
import { useScheduleManager2 } from '@/composables/use-schedule-manager2';
import {transformScheduleDataForGantt} from '../transformScheduleDataForGantt'
const ganttTasks = computed(() => transformScheduleDataForGantt(_data_all_schedule_data.value.raw));

const {
  _data_all_schedule_data,
  _data_selected_schedule_data,
  _data_modified_schedule_data,
  _data_created_schedule_data,
  _data_success_msg,
  _data_error_msg,
  
  _state_popup_error,
  _state_popup_success,
  _state_popup_create_schedule_data,
  _state_popup_edit_schedule_data,
  _state_popup_confirm_edit_schedule_data,
  _state_popup_view_schedule_data,
  _state_popup_confirm_create_schedule_data,
  _state_popup_confirm_delete_schedule_data,

  ui_command_popup_create_schedule_data_close,
  ui_command_popup_create_schedule_data_open,
  ui_command_popup_edit_schedule_data_close,
  ui_command_popup_edit_schedule_data_open,
  ui_command_popup_confirm_edit_schedule_data_close,
  ui_command_popup_confirm_edit_schedule_data_open,
  ui_command_popup_view_schedule_data_close,
  ui_command_popup_view_schedule_data_open,
  ui_command_popup_confirm_create_schedule_data_open,
  ui_command_popup_confirm_create_schedule_data_close,
  ui_command_popup_confirm_delete_schedule_data_open,
  ui_command_popup_confirm_delete_schedule_data_close,

  pipe_execute_refresh_schedule_data,
  pipe_execute_update_schedule_data,
  pipe_execute_create_schedule_data,
  pipe_execute_delete_schedule_data,
} = useScheduleManager2('schedule:entity:machine:*');



</script>

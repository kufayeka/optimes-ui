<template>
  <molecules-molecule-chart-gantt-schedule 
    :rawSchedules="_data_all_schedule"
    @refresh="pipe_execute_refresh_schedule"
    @selectedTask="_open_view_schedule"
  />

  <molecules-molecule-popup-information 
    title="Schedule View"
    :open="_toggle_popup_schedule_view"
    @close="_close_view_popup"
    maxWidth="700"
  >
    <molecules-molecule-popup-content-base>
      <template #content>
        <atoms-atom-base-wrapper max-width="100%" max-height="400px">
          {{ _data_selected_schedule }}
          <molecules-molecule-data-display-schedule :schedule-data="_data_selected_schedule" />
        </atoms-atom-base-wrapper>
      </template>
      <template #actions>
      </template>
    </molecules-molecule-popup-content-base>
  </molecules-molecule-popup-information>
</template>

<script setup lang="js">
const {
  // state
  _data_all_schedules, 
  _data_selected_schedule,

  // setters
  _set_data_selected_schedule,

  // toggles
  _toggle_popup_schedule_view,
  _toggle_popup_schedule_edit,

  // actions
  _handle_fetch_all,
  _close_view_popup,
  _close_edit_popup,
  _open_edit_popup,
  _open_view_schedule,

} = useScheduleManagerProcess()

const {
  _data_all_schedule,

  _state_popup_error,
  _state_popup_success,
  _state_popup_schedule_view,
  _state_popup_schedule_edit,
  _state_popup_schedule_create,
  _state_popup_schedule_delete,
  _state_popup_schedule_create_confirmation,
  _state_popup_schedule_delete_confirmation,
  _state_popup_schedule_edit_confirmation,

  open_popup_schedule_view,
  close_popup_schedule_view,
  open_popup_schedule_edit,
  close_popup_schedule_edit,
  open_popup_schedule_create,
  close_popup_schedule_create,
  open_popup_schedule_edit_confirmation,
  close_popup_schedule_edit_confirmation,
  open_popup_schedule_create_confirmation,
  close_popup_schedule_create_confirmation,
  open_popup_schedule_delete_confirmation,
  close_popup_schedule_delete_confirmation,

  pipe_execute_edit_schedule,
  pipe_execute_create_schedule,
  pipe_execute_refresh_schedule,
  pipe_execute_delete_schedule,

} = useScheduleProcess();
</script>

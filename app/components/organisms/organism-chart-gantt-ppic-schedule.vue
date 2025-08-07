<template>
  <molecules-molecule-chart-gantt-schedule 
    :rawSchedules="_data_all_schedules"
    @refresh="_handle_fetch_all"
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
</script>

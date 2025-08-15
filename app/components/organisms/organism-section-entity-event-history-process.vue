<template>
  <molecules-molecule-form-section :title="'Event History'">
    <template #endSection>
      <v-btn variant="outlined" color="primary" @click="pipe_execute_refresh_event_history">Refresh</v-btn>
    </template>
    <molecules-molecule-table-event-history-process :event-history-data="_data_all_entity_event_history_process" @endEvent="pipe_execute_end_event" @editEvent="ui_command_popup_edit_event_open" @applyEvent="pipe_execute_apply_event" />
  </molecules-molecule-form-section>
  <!-- POPUP: EVENT EDIIT -->
  <molecules-molecule-popup-edit :title="'Edit Event'" max-width="800px" :open="_state_popup_edit_event" @close="ui_command_popup_edit_event_close">
    <molecules-molecule-popup-content-base>
        <template #content>
          <atoms-atom-base-wrapper width="800px" max-width="100%" max-height="400px">
            <molecules-molecule-form-edit-generic :form-initial-data="_data_modified_event_history_process" :form-template="ui_edit_event_form_template" v-model:form-updated-data="_data_modified_event_history_process"/>
          </atoms-atom-base-wrapper>
        </template>
        <template #actions>
          <molecules-molecule-group-button-save-discard @save="pipe_execute_update_event_attributes" @discard="ui_command_popup_edit_event_close"/>
        </template>
      </molecules-molecule-popup-content-base>
  </molecules-molecule-popup-edit>
  <!-- POPUP: ERROR -->
  <molecules-molecule-popup-error
    :autoClose="false"
    :open="_state_popup_error"
    :title="'Error'"
    @close="ui_command_popup_error_close"
    maxWidth="400"
  >
    <atoms-atom-base-wrapper width="400px" height="50px" maxWidth="100%" maxHeight="50px">
      <atoms-atom-base-label>{{ _data_error_msg }}</atoms-atom-base-label>
    </atoms-atom-base-wrapper>
  </molecules-molecule-popup-error>
  <!-- POPUP: SUCCESS -->
  <molecules-molecule-popup-success
    :open="_state_popup_success"
    :title="'Success'"
    @close="ui_command_popup_success_close"
    auto-close="true"
    maxWidth="400"
  >
    <atoms-atom-base-wrapper width="400px" height="50px" maxWidth="100%" maxHeight="50px">
      <atoms-atom-base-label>{{ _data_success_msg }}</atoms-atom-base-label>
    </atoms-atom-base-wrapper>
  </molecules-molecule-popup-success>
</template>

<script setup lang="js">
import { useEventHistoryProcess } from '@/composables/use-event-history-process'


const {
  _data_all_entity_event_history_process,
  _data_selected_event_history_process,
  _data_modified_event_history_process,
  _data_success_msg,
  _data_error_msg,

  _state_popup_error,
  _state_popup_success,
  _state_popup_edit_event,

  ui_command_popup_error_open,
  ui_command_popup_error_close,
  ui_command_popup_success_open,
  ui_command_popup_success_close,
  ui_command_popup_edit_event_close,
  ui_command_popup_edit_event_open,


  pipe_execute_refresh_event_history,
  pipe_execute_update_event_attributes,
  pipe_execute_end_event,
  pipe_execute_apply_event,

} = useEventHistoryProcess();


const ui_edit_event_form_template = computed(() => [
  { key: 'event_attributes.activity_code', label: 'Activity Code', type: 'array', required: true },
  { key: 'event_attributes.material_code', label: 'Material Code / ID', type: 'text', required: true },
  { key: 'event_attributes.notes', label: 'Notes', type: 'textarea', required: false },
  { key: 'event_attributes.scrap_flag', label: 'Scrap Flag', type: 'checkbox', required: false },
  { key: 'event_attributes.supplementary_flag', label: 'Supplementary Flag', type: 'checkbox', required: false },
]);


const edit_form_template = computed(() => [
  { key: 'schedule_data.shift', type: 'select', label: 'Shift', items: _data_all_shift.value, itemTitle: 'value.title', itemValue: 'id' },
  { key: 'planned_start_time', label: 'Planned Start Time', type: 'datetime', required: true, isISOString: true },
  { key: 'planned_finish_time', label: 'Planned Finish Time', type: 'datetime', required: true, isISOString: true },
  { key: 'schedule_data.routing', type: 'select', label: 'Machine', items: _data_all_machine.value, itemTitle: 'value.title', itemValue: 'id' },
  { key: 'schedule_data.work_order_number', label: 'Work Order', type: 'text', required: true },
  { key: 'schedule_data.sales_order_number', label: 'Sales Order', type: 'text', required: true },
  { key: 'schedule_data.quantity_order', label: 'Quantity Order', type: 'number', required: true, max: 9999999, min: 0 },
  { key: 'schedule_data.quantity_unit', label: 'Quantity Unit', type: 'text', required: true },
  { key: 'notes', label: 'Notes', type: 'textarea', required: false },
]);


</script>

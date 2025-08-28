<template>
  <molecules-molecule-form-section title="Schedule Manager (Production)">
    <template #endSection>
      <div class="d-flex flex-row ga-3 justify-space-evenly">
        <v-btn variant="outlined" color="primary" @click="ui_command_popup_create_schedule_data_open">Create</v-btn>
        <v-btn variant="outlined" color="primary" @click="pipe_execute_refresh_schedule_data">Refresh</v-btn>
      </div>
    </template>

    <!-- POPUP: ERROR -->
    <molecules-molecule-popup-error :open="_state_popup_error" title="Error" autoClose="false" maxWidth="400" @close="_state_popup_error = false">
      <atoms-atom-base-wrapper width="100%" height="100px" maxHeight="400px">
          <atoms-atom-base-wrapper max-width="100%" max-height="400px">
            <pre>{{ _data_error_msg }}</pre>
          </atoms-atom-base-wrapper>
      </atoms-atom-base-wrapper>
    </molecules-molecule-popup-error>

    <!-- POPUP: SUCCESS -->
    <molecules-molecule-popup-success :open="_state_popup_success" title="Success" auto-close="true" maxWidth="400" @close="_state_popup_success = false">
      <atoms-atom-base-wrapper width="100%" height="100px" maxHeight="400px">
      <atoms-atom-base-wrapper max-width="100%" max-height="400px">
            <pre>{{ _data_success_msg }}</pre>
          </atoms-atom-base-wrapper>
      </atoms-atom-base-wrapper>
    </molecules-molecule-popup-success>

    <!-- TABLE: schedule Data -->
    <molecules-molecule-table-schedule :scheduleData="_data_all_schedule_data" @view="ui_command_popup_view_schedule_data_open" @edit="ui_command_popup_edit_schedule_data_open" @delete="ui_command_popup_confirm_delete_schedule_data_open"/>

    <!-- POPUP: VIEW schedule Data -->
    <molecules-molecule-popup-information title="schedule Data View" max-width="800" :open="_state_popup_view_schedule_data" @close="_state_popup_view_schedule_data = false">
      <molecules-molecule-popup-content-base>
        <template #content>
          <atoms-atom-base-wrapper max-width="100%" max-height="400px">
            <pre>{{ JSON.stringify(_data_selected_schedule_data, null, 2) }}</pre>
          </atoms-atom-base-wrapper>
        </template>
        <template #actions>
          <v-btn variant="outlined" size="small" color="red" @click="ui_command_popup_confirm_delete_schedule_data_open">Delete</v-btn>
        </template>    
      </molecules-molecule-popup-content-base>
    </molecules-molecule-popup-information>

    <!-- POPUP: EDIT schedule Data -->
    <molecules-molecule-popup-edit title="Edit schedule Data" max-width="700" :open="_state_popup_edit_schedule_data" @close="_state_popup_edit_schedule_data = false">
      <molecules-molecule-popup-content-base>
        <template #content>
          <atoms-atom-base-wrapper max-width="100%" max-height="400px">
            <molecules-molecule-form-edit-generic :form-initial-data="_data_modified_schedule_data" :form-template="edit_schedule_form_template" v-model:formUpdatedData="_data_modified_schedule_data"/>
          </atoms-atom-base-wrapper>
        </template>
        <template #actions>
          <molecules-molecule-group-button-save-discard @save="ui_command_popup_confirm_edit_schedule_data_open" @discard="_state_popup_edit_schedule_data = false"/>
        </template>
      </molecules-molecule-popup-content-base>
    </molecules-molecule-popup-edit>

    <!-- POPUP: EDIT CONFIRMATION -->
    <molecules-molecule-popup-confirmation title="Edit Confirmation" :open="_state_popup_confirm_edit_schedule_data" maxWidth="500" @close="_state_popup_confirm_edit_schedule_data = false">
      <molecules-molecule-popup-content-base>
        <template #content>
          <atoms-atom-base-label>Are you sure you want to modify this schedule Data?</atoms-atom-base-label>
        </template>
        <template #actions>
          <molecules-molecule-group-button-yes-no @yes="pipe_execute_update_schedule_data" @no="_state_popup_confirm_edit_schedule_data = false"/>
        </template>
      </molecules-molecule-popup-content-base>
    </molecules-molecule-popup-confirmation>

    <!-- POPUP: CREATE schedule Data -->
    <molecules-molecule-popup-edit title="Create schedule Data" max-width="700" :open="_state_popup_create_schedule_data" @close="ui_command_popup_create_schedule_data_close">
      <molecules-molecule-popup-content-base>
        <template #content>
          <atoms-atom-base-wrapper max-width="100%" max-height="400px">
            <molecules-molecule-form-create-generic debug :form-template="create_schedule_form_template" :initial-data="create_schedule_form_initial_data" v-model:formData="_data_created_schedule_data"/>
          </atoms-atom-base-wrapper>
        </template>
        <template #actions>
          <molecules-molecule-group-button-save-discard @save="ui_command_popup_confirm_create_schedule_data_open" @discard="ui_command_popup_create_schedule_data_close"/>
        </template>
      </molecules-molecule-popup-content-base>
    </molecules-molecule-popup-edit>

    <!-- POPUP: CREATE CONFIRMATION -->
    <molecules-molecule-popup-confirmation title="Create Confirmation" :open="_state_popup_confirm_create_schedule_data" maxWidth="500" @close="_state_popup_confirm_create_schedule_data = false">
      <molecules-molecule-popup-content-base>
        <template #content>
          <atoms-atom-base-label>Are you sure you want to create this schedule Data?</atoms-atom-base-label>
        </template>
        <template #actions>
          <molecules-molecule-group-button-yes-no @yes="pipe_execute_create_schedule_data" @no="_state_popup_confirm_create_schedule_data = false"/>
        </template>
      </molecules-molecule-popup-content-base>
    </molecules-molecule-popup-confirmation>

    <!-- POPUP: DELETE CONFIRMATION -->
    <molecules-molecule-popup-confirmation title="Delete Confirmation" :open="_state_popup_confirm_delete_schedule_data" maxWidth="500" @close="_state_popup_confirm_delete_schedule_data = false">
      <molecules-molecule-popup-content-base>
        <template #content>
          <atoms-atom-base-label>Are you sure you want to DELETE this schedule Data?</atoms-atom-base-label>
        </template>
        <template #actions>
          <molecules-molecule-group-button-yes-no @yes="pipe_execute_delete_schedule_data" @no="_state_popup_confirm_delete_schedule_data = false"/>
        </template>
      </molecules-molecule-popup-content-base>
    </molecules-molecule-popup-confirmation>
    
  </molecules-molecule-form-section>
</template>

<script setup>
import { computed } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { useScheduleManager2 } from '@/composables/use-schedule-manager2';
import { useReferenceManager } from '@/composables/use-reference-manager';

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
} = useScheduleManager2('schedule/production/*');

const {
  _data_all_reference_data: machine_list
} = useReferenceManager('reference/entity/machine/*');

const {
  _data_all_reference_data: shift_list
} = useReferenceManager('reference/work_shift/*');

const edit_schedule_form_template = computed(() => [ 
  { key: 'id', label: 'Schedule ID', type: 'text', disabled: true }, 
  { key: 'schedule_data.work_order_number', label: 'Work Order', type: 'text', required: true }, 
  { key: 'schedule_data.sales_order_number', label: 'Sales Order', type: 'text', required: true }, 
  { key: 'schedule_data.shift', type: 'select', label: 'Shift', items: shift_list.value, itemTitle: 'value.shift_name', itemValue: 'key' },
  { key: 'schedule_data.routing', type: 'select', label: 'Routing', items: machine_list.value, itemTitle: 'value.machine_name', itemValue: 'key' },

  { key: 'planned_start_time', label: 'Planned Start Time', type: 'datetime', required: true }, 
  { key: 'planned_finish_time', label: 'Planned Finish Time', type: 'datetime', required: true }, 

  { key: 'schedule_data.quantity_order', label: 'Quantity Order', type: 'number', min: 0, max: 9999999, required: true }, 
  { key: 'schedule_data.quantity_unit', label: 'Quantity Unit', type: 'text', required: true }, 
  { key: 'notes', label: 'Notes', type: 'textarea', required: false }, 
  { key: 'created_on', label: 'Created On', type: 'datetime', required: true, disabled: true  }, 
  { key: 'updated_on', label: 'Updated On', type: 'datetime', required: true, disabled: true  } 
]); 

const create_schedule_form_template = computed(() => [ 
  { key: 'id', label: 'Schedule ID', type: 'text', disabled: true }, 
  { key: 'schedule_data.work_order_number', label: 'Work Order', type: 'text', required: true }, 
  { key: 'schedule_data.sales_order_number', label: 'Sales Order', type: 'text', required: true }, 
  { key: 'schedule_data.shift', type: 'select', label: 'Shift', items: shift_list.value, itemTitle: 'value.shift_name', itemValue: 'key' },
  { key: 'schedule_data.routing', type: 'select', label: 'Routing', items: machine_list.value, itemTitle: 'value.machine_name', itemValue: 'key' },

  { key: 'planned_start_time', label: 'Planned Start Time', type: 'datetime', required: true }, 
  { key: 'planned_finish_time', label: 'Planned Finish Time', type: 'datetime', required: true }, 

  { key: 'schedule_data.quantity_order', label: 'Quantity Order', type: 'number', min: 0, max: 9999999, required: true }, 
  { key: 'schedule_data.quantity_unit', label: 'Quantity Unit', type: 'text', required: true }, 
  { key: 'notes', label: 'Notes', type: 'textarea', required: false }
]);


const create_schedule_form_initial_data = computed(() => {
  if (!_state_popup_create_schedule_data.value) return null;

  return {
    id: `schedule/production/${uuidv4()}`,
    schedule_category: 'production',
    actual_finish_time: {},
    actual_start_time: {},
    planned_finish_time: {},
    planned_start_time: {},
    schedule_data: {
      work_order_number: '',
      sales_order_number: '',
      shift: '',
      routing: '',
      quantity_order: 0,
      quantity_unit: '',
    }, 
    schedule_status: 'planned',
    notes: 'no notes.',
    created_on: {},
    updated_on: {},
  };
});
</script>


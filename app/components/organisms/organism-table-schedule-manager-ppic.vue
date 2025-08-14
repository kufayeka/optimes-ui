<template>
  <molecules-molecule-form-section :title="'Schedule Manager'">
    <template #endSection>
      <div class="d-flex flex-row ga-3 justify-space-evenly">
        <v-btn variant="outlined" color="primary" @click="">Upload Schedule</v-btn>
        <v-btn variant="outlined" color="primary" @click="open_popup_schedule_create">Create</v-btn>
        <v-btn variant="outlined" color="primary" @click="pipe_execute_refresh_schedule">Refresh</v-btn>
      </div>
    </template>
    <!-- POPUP: ERROR -->
    <molecules-molecule-popup-error :autoClose="false" :open="_state_popup_error" :title="'Error'" @close="_state_popup_error = false" maxWidth="400">
      <atoms-atom-base-wrapper width="400px" height="100px" maxWidth="100%" maxHeight="400px">
          <pre>{{ _data_error_msg }}</pre>
      </atoms-atom-base-wrapper>
    </molecules-molecule-popup-error>
    <!-- POPUP: SUCCESS -->
    <molecules-molecule-popup-success :open="_state_popup_success" :title="'Success'" @close="_state_popup_success = false" maxWidth="400">
      <atoms-atom-base-wrapper width="400px" height="100px" maxWidth="100%" maxHeight="400px">
          <atoms-atom-base-label>{{ _data_success_msg }}</atoms-atom-base-label>
      </atoms-atom-base-wrapper>
    </molecules-molecule-popup-success>
    <!-- TABLE: SCHEDULE TABLE -->
    <molecules-molecule-table-schedule class="mt-4" :schedule-data="_data_all_schedule" @edit="open_popup_schedule_edit" @view="open_popup_schedule_view" />
    <!-- POPUP: VIEW SCHEDULE -->
    <molecules-molecule-popup-information :title="'Schedule View'" max-width="800" :open="_state_popup_schedule_view" @close="close_popup_schedule_view">
      <molecules-molecule-popup-content-base>
        <template #content>
          <atoms-atom-base-wrapper max-width="100%" max-height="400px">
            <molecules-molecule-data-display-schedule :schedule-data="_data_selected_schedule"/>
          </atoms-atom-base-wrapper>
        </template>
        <template #actions>
          <v-btn variant="outlined" size="small" color="red" @click="open_popup_schedule_delete_confirmation">Delete</v-btn>
        </template>
      </molecules-molecule-popup-content-base>
    </molecules-molecule-popup-information>
    <!-- POPUP: EDIT SCHEDULE -->
    <molecules-molecule-popup-edit :title="'Edit Schedule'" max-width="700" :open="_state_popup_schedule_edit" @close="close_popup_schedule_edit">
      <molecules-molecule-popup-content-base>
        <template #content>
          <atoms-atom-base-wrapper max-width="100%" max-height="400px">
            {{  }}
            <molecules-molecule-form-edit-generic :form-initial-data="_data_selected_schedule" :form-template="edit_form_template" v-model:formUpdatedData="_data_modified_schedule"/>
          </atoms-atom-base-wrapper>
        </template>
        <template #actions>
          <molecules-molecule-group-button-save-discard @save="open_popup_schedule_edit_confirmation" @discard="close_popup_schedule_edit"/>
        </template>
      </molecules-molecule-popup-content-base>
    </molecules-molecule-popup-edit>
    <!-- POPUP: EDIT CONFIRMATION -->
    <molecules-molecule-popup-confirmation :title="'Edit Confirmation'" :open="_state_popup_schedule_edit_confirmation" @close="close_popup_schedule_edit_confirmation" maxWidth="500">
      <molecules-molecule-popup-content-base>
        <template #content>
            <atoms-atom-base-label>Are you sure you want to modify this schedule?</atoms-atom-base-label>
        </template>
        <template #actions>
            <molecules-molecule-group-button-yes-no @yes="pipe_execute_edit_schedule" @no="close_popup_schedule_edit_confirmation"/>
        </template>
      </molecules-molecule-popup-content-base>
    </molecules-molecule-popup-confirmation>
    <!-- POPUP: CREATE SCHEDULE -->
    <molecules-molecule-popup-edit :title="'Create Schedule'" max-width="700" :open="_state_popup_schedule_create" @close="close_popup_schedule_create">
      <molecules-molecule-popup-content-base>
        <template #content>
          <atoms-atom-base-wrapper max-width="100%" max-height="400px">
            <molecules-molecule-form-create-generic :form-template="create_form_template" :initial-data="create_form_initial_data" v-model:formData="_data_created_schedule" />
          </atoms-atom-base-wrapper>
        </template>
        <template #actions>
          <molecules-molecule-group-button-save-discard @save="open_popup_schedule_create_confirmation" @discard="close_popup_schedule_create"/>
        </template>
      </molecules-molecule-popup-content-base>
    </molecules-molecule-popup-edit>
    <!-- POPUP: CREATE CONFIRMATION -->
    <molecules-molecule-popup-confirmation :title="'Create Confirmation'" :open="_state_popup_schedule_create_confirmation" @close="close_popup_schedule_create_confirmation" maxWidth="500">
      <molecules-molecule-popup-content-base>
        <template #content>
            <atoms-atom-base-label>Are you sure you want to create this schedule?</atoms-atom-base-label>
        </template>
        <template #actions>
            <molecules-molecule-group-button-yes-no @yes="pipe_execute_create_schedule" @no="close_popup_schedule_create_confirmation"/>
        </template>
      </molecules-molecule-popup-content-base>
    </molecules-molecule-popup-confirmation>
    <!-- POPUP: DELETE CONFIRMATION -->
    <molecules-molecule-popup-confirmation :title="'Delete Confirmation'" :open="_state_popup_schedule_delete_confirmation" @close="close_popup_schedule_delete_confirmation" maxWidth="500">
      <molecules-molecule-popup-content-base>
        <template #content>
            <atoms-atom-base-label>Are you sure you want to DELETE this schedule?</atoms-atom-base-label>
        </template>
        <template #actions>
            <molecules-molecule-group-button-yes-no @yes="pipe_execute_delete_schedule" @no="close_popup_schedule_delete_confirmation"/>
        </template>
      </molecules-molecule-popup-content-base>
    </molecules-molecule-popup-confirmation>

</molecules-molecule-form-section>
</template>

<script setup>
import { computed } from 'vue';
import { useScheduleProcess } from '@/composables/use-schedule-process';
import { useDataReferences } from '@/composables/use-data-references';


const {
  _data_all_machine,
  _data_all_shift,
} = useDataReferences();

const {
  _data_all_schedule,
  _data_selected_schedule,
  _data_modified_schedule,
  _data_success_msg,
  _data_error_msg,
  _data_created_schedule,
  _data_uploaded_schedule,

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


const create_form_template = computed(() => [
  { key: 'schedule_data.work_order_number', label: 'Work Order', type: 'text', required: true },
  { key: 'schedule_data.sales_order_number', label: 'Sales Order', type: 'text', required: true },
  { key: 'schedule_data.shift', type: 'select', label: 'Shift', items: _data_all_shift.value, itemTitle: 'value.title', itemValue: 'id' },
  { key: 'planned_start_time', label: 'Planned Start Time', type: 'datetime', required: true, isISOString: true },
  { key: 'planned_finish_time', label: 'Planned Finish Time', type: 'datetime', required: true, isISOString: true },
  { key: 'schedule_data.routing', type: 'select', label: 'Machine', items: _data_all_machine.value, itemTitle: 'value.title', itemValue: 'id' },
  { key: 'schedule_data.quantity_order', label: 'Quantity Order', type: 'number', min: 0, max: 9999999, required: true },
  { key: 'schedule_data.quantity_unit', label: 'Quantity Unit', type: 'text', required: true },
  { key: 'notes', label: 'Notes', type: 'textarea', required: false },
]);

const create_form_initial_data = {
  schedule_data: {
    work_order_number: '',
    sales_order_number: '',
    shift: '', 
    routing: '', 
    quantity_order: 0,
    quantity_unit: '',
  },
  schedule_category: 'production',
  planned_start_time: '',  
  planned_finish_time: '',
  notes: '',
};


</script>

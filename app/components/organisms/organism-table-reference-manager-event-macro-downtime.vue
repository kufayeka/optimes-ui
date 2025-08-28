<template>
  <molecules-molecule-form-section title="Reference Manager (Event Macro Downtime)">
    <template #endSection>
      <div class="d-flex flex-row ga-3 justify-space-evenly">
        <v-btn variant="outlined" color="primary" @click="ui_command_popup_create_reference_data_open">Create</v-btn>
        <v-btn variant="outlined" color="primary" @click="pipe_execute_refresh_reference_data">Refresh</v-btn>
      </div>
    </template>

    <!-- POPUP: ERROR -->
    <molecules-molecule-popup-error :open="_state_popup_error" title="Error" autoClose="false" maxWidth="400" @close="_state_popup_error = false">
      <atoms-atom-base-wrapper width="100%" height="100px" maxHeight="400px">
        <pre>{{ _data_error_msg }}</pre>
      </atoms-atom-base-wrapper>
    </molecules-molecule-popup-error>

    <!-- POPUP: SUCCESS -->
    <molecules-molecule-popup-success :open="_state_popup_success" title="Success" auto-close="true" maxWidth="400" @close="_state_popup_success = false">
      <atoms-atom-base-wrapper width="100%" height="100px" maxHeight="400px">
        <atoms-atom-base-label>{{ _data_success_msg }}</atoms-atom-base-label>
      </atoms-atom-base-wrapper>
    </molecules-molecule-popup-success>

    <!-- TABLE: Reference Data -->
    <molecules-molecule-table-reference :referenceData="_data_all_reference_data" @view="ui_command_popup_view_reference_data_open" @edit="ui_command_popup_edit_reference_data_open" @delete="ui_command_popup_confirm_delete_reference_data_open"/>

    <!-- POPUP: VIEW Reference Data -->
    <molecules-molecule-popup-information title="Reference Data View" max-width="800" :open="_state_popup_view_reference_data" @close="_state_popup_view_reference_data = false">
      <molecules-molecule-popup-content-base>
        <template #content>
          <atoms-atom-base-wrapper max-width="100%" max-height="400px">
            <pre>{{ JSON.stringify(_data_selected_reference_data, null, 2) }}</pre>
          </atoms-atom-base-wrapper>
        </template>
      </molecules-molecule-popup-content-base>
    </molecules-molecule-popup-information>

    <!-- POPUP: EDIT Reference Data -->
    <molecules-molecule-popup-edit title="Edit Reference Data" max-width="700" :open="_state_popup_edit_reference_data" @close="_state_popup_edit_reference_data = false">
      <molecules-molecule-popup-content-base>
        <template #content>
          <atoms-atom-base-wrapper max-width="100%" max-height="400px">
            <molecules-molecule-form-edit-generic :form-initial-data="_data_modified_reference_data" :form-template="edit_reference_form_template" v-model:formUpdatedData="_data_modified_reference_data"/>
          </atoms-atom-base-wrapper>
        </template>
        <template #actions>
          <molecules-molecule-group-button-save-discard @save="ui_command_popup_confirm_edit_reference_data_open" @discard="_state_popup_edit_reference_data = false"/>
        </template>
      </molecules-molecule-popup-content-base>
    </molecules-molecule-popup-edit>

    <!-- POPUP: EDIT CONFIRMATION -->
    <molecules-molecule-popup-confirmation title="Edit Confirmation" :open="_state_popup_confirm_edit_reference_data" maxWidth="500" @close="_state_popup_confirm_edit_reference_data = false">
      <molecules-molecule-popup-content-base>
        <template #content>
          <atoms-atom-base-label>Are you sure you want to modify this Reference Data?</atoms-atom-base-label>
        </template>
        <template #actions>
          <molecules-molecule-group-button-yes-no @yes="pipe_execute_update_reference_data" @no="_state_popup_confirm_edit_reference_data = false"/>
        </template>
      </molecules-molecule-popup-content-base>
    </molecules-molecule-popup-confirmation>

    <!-- POPUP: CREATE Reference Data -->
    <molecules-molecule-popup-edit title="Create Reference Data" max-width="700" :open="_state_popup_create_reference_data" @close="ui_command_popup_create_reference_data_close">
      <molecules-molecule-popup-content-base>
        <template #content>
          <atoms-atom-base-wrapper max-width="100%" max-height="400px">
            <molecules-molecule-form-create-generic :form-template="create_reference_form_template" :initial-data="create_reference_initial_data" v-model:formData="_data_created_reference_data"/>
          </atoms-atom-base-wrapper>
        </template>
        <template #actions>
          <molecules-molecule-group-button-save-discard @save="ui_command_popup_confirm_create_reference_data_open" @discard="ui_command_popup_create_reference_data_close"/>
        </template>
      </molecules-molecule-popup-content-base>
    </molecules-molecule-popup-edit>

    <!-- POPUP: CREATE CONFIRMATION -->
    <molecules-molecule-popup-confirmation title="Create Confirmation" :open="_state_popup_confirm_create_reference_data" maxWidth="500" @close="_state_popup_confirm_create_reference_data = false">
      <molecules-molecule-popup-content-base>
        <template #content>
          <atoms-atom-base-label>Are you sure you want to create this Reference Data?</atoms-atom-base-label>
        </template>
        <template #actions>
          <molecules-molecule-group-button-yes-no @yes="pipe_execute_create_reference_data" @no="_state_popup_confirm_create_reference_data = false"/>
        </template>
      </molecules-molecule-popup-content-base>
    </molecules-molecule-popup-confirmation>

    <!-- POPUP: DELETE CONFIRMATION -->
    <molecules-molecule-popup-confirmation title="Delete Confirmation" :open="_state_popup_confirm_delete_reference_data" maxWidth="500" @close="_state_popup_confirm_delete_reference_data = false">
      <molecules-molecule-popup-content-base>
        <template #content>
          <atoms-atom-base-label>Are you sure you want to DELETE this Reference Data?</atoms-atom-base-label>
        </template>
        <template #actions>
          <molecules-molecule-group-button-yes-no @yes="pipe_execute_delete_reference_data" @no="_state_popup_confirm_delete_reference_data = false"/>
        </template>
      </molecules-molecule-popup-content-base>
    </molecules-molecule-popup-confirmation>
  </molecules-molecule-form-section>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useReferenceManager } from '@/composables/use-reference-manager';

const {
  _data_all_reference_data,
  _data_selected_reference_data,
  _data_modified_reference_data,
  _data_created_reference_data,
  _data_success_msg,
  _data_error_msg,
  
  _state_popup_error,
  _state_popup_success,
  _state_popup_create_reference_data,
  _state_popup_edit_reference_data,
  _state_popup_confirm_edit_reference_data,
  _state_popup_view_reference_data,
  _state_popup_confirm_create_reference_data,
  _state_popup_confirm_delete_reference_data,

  ui_command_popup_create_reference_data_close,
  ui_command_popup_create_reference_data_open,
  ui_command_popup_edit_reference_data_close,
  ui_command_popup_edit_reference_data_open,
  ui_command_popup_confirm_edit_reference_data_close,
  ui_command_popup_confirm_edit_reference_data_open,
  ui_command_popup_view_reference_data_close,
  ui_command_popup_view_reference_data_open,
  ui_command_popup_confirm_create_reference_data_open,
  ui_command_popup_confirm_create_reference_data_close,
  ui_command_popup_confirm_delete_reference_data_open,
  ui_command_popup_confirm_delete_reference_data_close,

  pipe_execute_refresh_reference_data,
  pipe_execute_update_reference_data,
  pipe_execute_create_reference_data,
  pipe_execute_delete_reference_data,
} = useReferenceManager('reference/event_macro/downtime/*');

const edit_reference_form_template = computed(() => [
  { key: 'key', label: 'Reference Key', type: 'text', required: true, disabled: false },
  { key: 'value.title', label: 'Title', type: 'text', required: true },
  { key: 'value.value', label: 'Value', type: 'text', required: true },
  { key: 'value.color', label: 'Color', type: 'text', required: true },
  { key: 'description', label: 'Description', type: 'textarea', required: true },
]);

const create_reference_form_template = computed(() => [
  { key: 'key', label: 'Reference Key', type: 'text', required: true },
  { key: 'value.title', label: 'Title', type: 'text', required: true },
  { key: 'value.value', label: 'Value', type: 'text', required: true },
  { key: 'value.color', label: 'Color', type: 'text', required: true },
  { key: 'description', label: 'Description', type: 'textarea', required: true },
]);

const create_reference_initial_data = {
  key: '',
  value: { title: '', value: '', color: '#000000' },
  description: ''
};
</script>
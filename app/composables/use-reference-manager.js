// composables/use-reference-manager.js
import { ref, onMounted } from 'vue';
import * as R from 'ramda';
import { apiServices } from '@/composables/optimesHttpClient';

export const useReferenceManager = (referenceKey) => {
  // State
  const _data_all_reference_data = ref([]);
  const _data_selected_reference_data = ref({});
  const _data_modified_reference_data = ref({});
  const _data_created_reference_data = ref({});
  const _data_success_msg = ref('');
  const _data_error_msg = ref('');

  const _state_popup_error = ref(false);
  const _state_popup_success = ref(false);
  const _state_popup_create_reference_data = ref(false);
  const _state_popup_view_reference_data = ref(false);
  const _state_popup_edit_reference_data = ref(false);
  const _state_popup_confirm_edit_reference_data = ref(false);
  const _state_popup_confirm_create_reference_data = ref(false);
  const _state_popup_confirm_delete_reference_data = ref(false);

  // Helpers
  const set_ref = R.curry((refVar, val) => {
    refVar.value = val;
  });

  const set_object = R.curry((refVar, val) => {
    refVar.value = R.defaultTo({}, val);
  });

  const set_array = R.curry((refVar, val) => {
    refVar.value = R.defaultTo([], val);
  });

  const set_string = R.curry((refVar, val) => {
    refVar.value = R.defaultTo('No message.', val);
  });

  const extract_data = R.propOr([], 'entries');
  const extract_error_data = R.propOr('Unknown error', 'message');

  const normalise_entry = entry => ({
    key: entry.key,
    value: R.pathOr({}, ['data', 'value'], entry),
    description: R.pathOr('', ['data', 'description'], entry)
  });

  const normalise_entries = R.map(normalise_entry);

  // Generic async API processor
  const pipe_process_api_response = (successPipe, errorPipe) => (apiCall) => () => 
    apiCall().then(R.tryCatch(successPipe, errorPipe)).catch(errorPipe);

  // Generic popup open/close helpers
  const open_popup = (popupRef, dataRef, data) => {
    if (dataRef) dataRef.value = R.clone(data ?? {});
    popupRef.value = true;
  };

  const close_popup = (popupRef, dataRef) => {
    if (dataRef) dataRef.value = {};
    popupRef.value = false;
  };

  // Popup commands
  const ui_command_popup_error_open = () => open_popup(_state_popup_error, null);
  const ui_command_popup_error_close = () => close_popup(_state_popup_error, null);
  const ui_command_popup_success_open = () => open_popup(_state_popup_success, null);
  const ui_command_popup_success_close = () => close_popup(_state_popup_success, null);

  const ui_command_popup_view_reference_data_open = (data) => open_popup(_state_popup_view_reference_data, _data_selected_reference_data, data);
  const ui_command_popup_view_reference_data_close = () => close_popup(_state_popup_view_reference_data, _data_selected_reference_data);

  const ui_command_popup_create_reference_data_open = () =>  open_popup(_state_popup_create_reference_data, _data_created_reference_data, {});
  const ui_command_popup_create_reference_data_close = () => close_popup(_state_popup_create_reference_data, _data_created_reference_data);

  const ui_command_popup_edit_reference_data_open = (data) => open_popup(_state_popup_edit_reference_data, _data_modified_reference_data, data);
  const ui_command_popup_edit_reference_data_close = () => close_popup(_state_popup_edit_reference_data, _data_modified_reference_data);

  const ui_command_popup_confirm_edit_reference_data_open = () => open_popup(_state_popup_confirm_edit_reference_data, null);
  const ui_command_popup_confirm_edit_reference_data_close = () => close_popup(_state_popup_confirm_edit_reference_data, null);

  const ui_command_popup_confirm_create_reference_data_open = () => open_popup(_state_popup_confirm_create_reference_data, null);
  const ui_command_popup_confirm_create_reference_data_close = () => close_popup(_state_popup_confirm_create_reference_data, null);

  const ui_command_popup_confirm_delete_reference_data_open = (data) => open_popup(_state_popup_confirm_delete_reference_data, _data_selected_reference_data, data);
  const ui_command_popup_confirm_delete_reference_data_close = () => close_popup(_state_popup_confirm_delete_reference_data, _data_selected_reference_data);

  // API calls
  const api_get_all_reference_data = () =>
    pipe_process_api_response(
      R.pipe(
        extract_data,
        normalise_entries,
        set_array(_data_all_reference_data),
        () => set_string(_data_success_msg, 'Successfully retrieved reference data.'),
        ui_command_popup_success_open
      ),
      R.pipe(
        extract_error_data,
        set_string(_data_error_msg),
        ui_command_popup_error_open
      )
    )(() =>
      apiServices.postGetAllReference({
        body: { pattern: referenceKey }
      })
    )();

  const api_create_reference_data = (data) =>
    pipe_process_api_response(
      R.pipe(
        () => set_string(_data_success_msg, 'Reference data created successfully.'),
        ui_command_popup_success_open,
        () => delay(1000).then(api_get_all_reference_data)
      ),
      R.pipe(
        extract_error_data,
        set_string(_data_error_msg),
        ui_command_popup_error_open
      )
    )(() =>
      apiServices.putUpdateReference({
        body: {
          key: data.key,
          value: JSON.stringify(data.value),
          description: data.description,
        }
      })
    )();

  const api_update_reference_data = (data) =>
    pipe_process_api_response(
      R.pipe(
        () => set_string(_data_success_msg, 'Reference data updated successfully.'),
        ui_command_popup_success_open,
        () => delay(1000).then(api_get_all_reference_data)
      ),
      R.pipe(
        extract_error_data,
        set_string(_data_error_msg),
        ui_command_popup_error_open
      )
    )(() =>
      apiServices.putUpdateReference({
        body: {
          key: data.key,
          value: JSON.stringify(data.value),
          description: data.description,
        }
      })
    )();

  const api_delete_reference_data = (data) =>
    pipe_process_api_response(
      R.pipe(
        () => set_string(_data_success_msg, 'Reference data deleted successfully.'),
        ui_command_popup_success_open,
        () => delay(1000).then(api_get_all_reference_data)
      ),
      R.pipe(
        extract_error_data,
        set_string(_data_error_msg),
        ui_command_popup_error_open
      )
    )(() =>
      apiServices.postDeleteReference({
        body: { key: data.key }
      })
    )();

  // Action pipelines
  const pipe_execute_create_reference_data = () => {
    api_create_reference_data(_data_created_reference_data.value);
    ui_command_popup_confirm_create_reference_data_close();
    ui_command_popup_create_reference_data_close();
  };

  const pipe_execute_update_reference_data = () => {
    api_update_reference_data(_data_modified_reference_data.value);
    ui_command_popup_confirm_edit_reference_data_close();
    ui_command_popup_edit_reference_data_close();
  };

  const pipe_execute_delete_reference_data = () => {
    api_delete_reference_data(_data_selected_reference_data.value);
    ui_command_popup_confirm_delete_reference_data_close();
  };

  const pipe_execute_refresh_reference_data = () => {
    api_get_all_reference_data();
  };

  // Lifecycle
  onMounted(() => {
    api_get_all_reference_data();
  });

  return {
    _data_all_reference_data,
    _data_selected_reference_data,
    _data_modified_reference_data,
    _data_created_reference_data,
    _data_success_msg,
    _data_error_msg,

    _state_popup_error,
    _state_popup_success,
    _state_popup_create_reference_data,
    _state_popup_view_reference_data,
    _state_popup_edit_reference_data,
    _state_popup_confirm_edit_reference_data,
    _state_popup_confirm_create_reference_data,
    _state_popup_confirm_delete_reference_data,

    ui_command_popup_error_open,
    ui_command_popup_error_close,
    ui_command_popup_success_open,
    ui_command_popup_success_close,
    ui_command_popup_view_reference_data_open,
    ui_command_popup_view_reference_data_close,
    ui_command_popup_create_reference_data_open,
    ui_command_popup_create_reference_data_close,
    ui_command_popup_edit_reference_data_open,
    ui_command_popup_edit_reference_data_close,
    ui_command_popup_confirm_edit_reference_data_open,
    ui_command_popup_confirm_edit_reference_data_close,
    ui_command_popup_confirm_create_reference_data_open,
    ui_command_popup_confirm_create_reference_data_close,
    ui_command_popup_confirm_delete_reference_data_open,
    ui_command_popup_confirm_delete_reference_data_close,

    pipe_execute_refresh_reference_data,
    pipe_execute_create_reference_data,
    pipe_execute_update_reference_data,
    pipe_execute_delete_reference_data,
  };
};

// Utility function for delay
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
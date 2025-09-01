// composables/use-schedule-manager.js
import { ref, onMounted } from 'vue';
import * as R from 'ramda';
import { apiServicesNew } from './optimesHttpClient2';

export const useEntityMachineManager = () => {
  // State
  const _data_all_machines = ref([]);
  const _data_selected_machine = ref({});
  const _data_success_msg = ref('');
  const _data_error_msg = ref('');
  
  const _state_popup_error = ref(false);
  const _state_popup_success = ref(false);
  const _state_popup_view_machine = ref(false);

  // Helpers
  const set_array = R.curry((refVar, val) => {
    refVar.value = R.defaultTo([], val);
  });
  const set_object = R.curry((refVar, val) => {
    refVar.value = R.defaultTo({}, val);
  });
  const set_string = R.curry((refVar, val) => {
    refVar.value = R.defaultTo('No message.', val);
  });
  const extract_data_array = R.propOr([], 'data');
  const extract_data = R.propOr({}, 'data');
  const extract_error_data = R.propOr('Unknown error', 'message');

  // Generic async API processor
  const pipe_process_api_response = (successPipe, errorPipe) => (apiCall) => () =>
    apiCall().then(R.tryCatch(successPipe, errorPipe)).catch(errorPipe);

  // Popup helpers
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
  const ui_command_popup_view_machine_open = (data) =>
    open_popup(_state_popup_view_machine, _data_selected_machine, data);
  const ui_command_popup_view_machine_close = () =>
    close_popup(_state_popup_view_machine, _data_selected_machine);

  // API calls

  // Get all machines
  const api_validate_machine = () =>
    pipe_process_api_response(
      R.pipe(
        (res) => { console.log('Pure API response getAllMachines:', res); return res; },
        extract_data_array,
        set_array(_data_all_machines),
        () => set_string(_data_success_msg, 'Machine validation successful.'),
        ui_command_popup_success_open
      ),
      R.pipe(
        extract_error_data,
        set_string(_data_error_msg),
        ui_command_popup_error_open
      )
    )(() =>
      apiServicesNew.get_REDis_entity_machine_getAll({})
    )();

  // Get one machine (by key)
  const api_get_machine_details = (key) =>
    pipe_process_api_response(
      R.pipe(
        (res) => { console.log('Pure API response getOneMachine:', res); return res; },
        extract_data,
        set_object(_data_selected_machine),
        () => set_string(_data_success_msg, 'Machine details loaded successfully.'),
        ui_command_popup_success_open
      ),
      R.pipe(
        extract_error_data,
        set_string(_data_error_msg),
        ui_command_popup_error_open
      )
    )(() =>
      apiServicesNew.get_REDis_entity_machine_getOne({})
    )();

  onMounted(() => {
    api_get_machine_details();
  });

  return {
    _data_all_machines,
    _data_selected_machine,
    _data_success_msg,
    _data_error_msg,

    _state_popup_error,
    _state_popup_success,
    _state_popup_view_machine,

    ui_command_popup_error_open,
    ui_command_popup_error_close,
    ui_command_popup_success_open,
    ui_command_popup_success_close,
    ui_command_popup_view_machine_open,
    ui_command_popup_view_machine_close,

    api_validate_machine,
    api_get_machine_details,
  };
};

// Utility function for delay jika diperlukan
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
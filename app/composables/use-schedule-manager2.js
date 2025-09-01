// composables/use-schedule-manager.js
import { ref, onMounted } from 'vue';
import * as R from 'ramda';
import { apiServicesNew } from './optimesHttpClient2';

export const useScheduleManager2 = (scheduleKey) => {
  // State
  const _data_all_schedule_data = ref([]);
  const _data_selected_schedule_data = ref({});
  const _data_modified_schedule_data = ref({});
  const _data_created_schedule_data = ref({});
  const _data_success_msg = ref('');
  const _data_error_msg = ref(''); 

  const _state_popup_error = ref(false);
  const _state_popup_success = ref(false);
  const _state_popup_create_schedule_data = ref(false);
  const _state_popup_view_schedule_data = ref(false);
  const _state_popup_delete_schedule_data = ref(false);
  const _state_popup_edit_schedule_data = ref(false);
  const _state_popup_confirm_edit_schedule_data = ref(false);
  const _state_popup_confirm_create_schedule_data = ref(false);
  const _state_popup_confirm_delete_schedule_data = ref(false);

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

  const extract_data = R.propOr([], 'data');
  const extract_error_data = R.propOr('Unknown error', 'message');

  const normalise_entry = entry => ({
    ...entry
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

  const ui_command_popup_view_schedule_data_open = (data) => open_popup(_state_popup_view_schedule_data, _data_selected_schedule_data, data);
  const ui_command_popup_view_schedule_data_close = () => close_popup(_state_popup_view_schedule_data, _data_selected_schedule_data);

  const ui_command_popup_create_schedule_data_open = () =>  open_popup(_state_popup_create_schedule_data, _data_created_schedule_data, {});
  const ui_command_popup_create_schedule_data_close = () => close_popup(_state_popup_create_schedule_data, _data_created_schedule_data);

  const ui_command_popup_edit_schedule_data_open = (data) => open_popup(_state_popup_edit_schedule_data, _data_modified_schedule_data, data);
  const ui_command_popup_edit_schedule_data_close = () => close_popup(_state_popup_edit_schedule_data, _data_modified_schedule_data);

  const ui_command_popup_delete_schedule_data_open = () => open_popup(_state_popup_delete_schedule_data, null);
  const ui_command_popup_delete_schedule_data_close = () => close_popup(_state_popup_delete_schedule_data, null);

  const ui_command_popup_confirm_edit_schedule_data_open = () => open_popup(_state_popup_confirm_edit_schedule_data, null);
  const ui_command_popup_confirm_edit_schedule_data_close = () => close_popup(_state_popup_confirm_edit_schedule_data, null);

  const ui_command_popup_confirm_create_schedule_data_open = () => open_popup(_state_popup_confirm_create_schedule_data, null);
  const ui_command_popup_confirm_create_schedule_data_close = () => close_popup(_state_popup_confirm_create_schedule_data, null);

  const ui_command_popup_confirm_delete_schedule_data_open = () => open_popup(_state_popup_confirm_delete_schedule_data, null);
  const ui_command_popup_confirm_delete_schedule_data_close = () => close_popup(_state_popup_confirm_delete_schedule_data, null);

  // API calls
  const api_get_all_schedule_data = () =>
    pipe_process_api_response(
      R.pipe(
        extract_data,
        normalise_entries,
        set_array(_data_all_schedule_data),
        () => set_string(_data_success_msg, 'Successfully retrieved schedule data.'),
        ui_command_popup_success_open
      ),
      R.pipe(
        extract_error_data,
        set_string(_data_error_msg),
        ui_command_popup_error_open
      )
    )(() =>
      apiServicesNew.get_REDis_schedule_getAll({})
    )();

  const api_create_schedule_data = (data) =>
    pipe_process_api_response(
      R.pipe(
        () => set_string(_data_success_msg, 'schedule data created successfully.'),
        ui_command_popup_success_open,
        () => delay(1000).then(api_get_all_schedule_data)
      ),
      R.pipe(
        extract_error_data,
        set_string(_data_error_msg),
        ui_command_popup_error_open
      )
    )(() =>
      apiServicesNew.post_REDis_schedule_create({
        body: {
          ...data,
        }
      })
    )();

  const api_update_schedule_data = (data) =>
    pipe_process_api_response(
      R.pipe(
        () => set_string(_data_success_msg, 'Schedule data updated successfully.'),
        ui_command_popup_success_open,
        () => delay(1000).then(api_get_all_schedule_data)
      ),
      R.pipe(
        extract_error_data,
        set_string(_data_error_msg),
        ui_command_popup_error_open
      )
    )(() =>
      apiServicesNew.put_REDis_schedule_update({
        body: {
          ...data,
        }
      })
    )();

  const api_delete_schedule_data = (data) =>
    pipe_process_api_response(
      R.pipe(
        () => set_string(_data_success_msg, 'schedule data deleted successfully.'),
        ui_command_popup_success_open,
        () => delay(1000).then(api_get_all_schedule_data)
      ),
      R.pipe(
        extract_error_data,
        set_string(_data_error_msg),
        ui_command_popup_error_open
      )
    )(() =>
      apiServicesNew.post_REDis_schedule_delete({
        body: {
          key: data.key,
        }
      })
    )();

  // Action pipelines
  const pipe_execute_create_schedule_data = () => {
    api_create_schedule_data(_data_created_schedule_data.value);
    ui_command_popup_confirm_create_schedule_data_close();
    ui_command_popup_create_schedule_data_close();
  };

  const pipe_execute_update_schedule_data = () => {
    const { populated, ...raw } = _data_modified_schedule_data.value;
    api_update_schedule_data(raw.raw);
    ui_command_popup_confirm_edit_schedule_data_close();
    ui_command_popup_edit_schedule_data_close();
  };

  const pipe_execute_delete_schedule_data = () => {
    const { populated, raw } = _data_selected_schedule_data.value;
    api_delete_schedule_data(raw);
    ui_command_popup_confirm_delete_schedule_data_close();
    ui_command_popup_view_schedule_data_close();
  };

  const pipe_execute_refresh_schedule_data = () => {
    api_get_all_schedule_data();
  };

  // Lifecycle
  onMounted(() => {
    api_get_all_schedule_data();
  });

  return {
    _data_all_schedule_data,
    _data_selected_schedule_data,
    _data_modified_schedule_data,
    _data_created_schedule_data,
    _data_success_msg,
    _data_error_msg,

    _state_popup_error,
    _state_popup_success,
    _state_popup_create_schedule_data,
    _state_popup_view_schedule_data,
    _state_popup_edit_schedule_data,
    _state_popup_delete_schedule_data,
    _state_popup_confirm_edit_schedule_data,
    _state_popup_confirm_create_schedule_data,
    _state_popup_confirm_delete_schedule_data,

    ui_command_popup_error_open,
    ui_command_popup_error_close,
    ui_command_popup_success_open,
    ui_command_popup_success_close,
    ui_command_popup_view_schedule_data_open,
    ui_command_popup_view_schedule_data_close,
    ui_command_popup_create_schedule_data_open,
    ui_command_popup_create_schedule_data_close,
    ui_command_popup_edit_schedule_data_open,
    ui_command_popup_edit_schedule_data_close,
    ui_command_popup_delete_schedule_data_open,
    ui_command_popup_delete_schedule_data_close,
    ui_command_popup_confirm_edit_schedule_data_open,
    ui_command_popup_confirm_edit_schedule_data_close,
    ui_command_popup_confirm_create_schedule_data_open,
    ui_command_popup_confirm_create_schedule_data_close,
    ui_command_popup_confirm_delete_schedule_data_open,
    ui_command_popup_confirm_delete_schedule_data_close,

    pipe_execute_refresh_schedule_data,
    pipe_execute_create_schedule_data,
    pipe_execute_update_schedule_data,
    pipe_execute_delete_schedule_data,
  };
};

// Utility function for delay
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const getNowObject = () => {
  const now = new Date();
  return {
    date: now.getDate(),      
    month: now.getMonth() + 1,
    year: now.getFullYear(),
    hour: now.getHours(),
    minute: now.getMinutes(),
    second: now.getSeconds()
  };
}
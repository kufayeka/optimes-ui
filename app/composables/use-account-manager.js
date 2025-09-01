// composables/use-schedule-manager.js
import { ref, onMounted } from 'vue';
import * as R from 'ramda';
import { apiServicesNew } from './optimesHttpClient2';

export const useAccountManager = () => {
  // State
  const _data_all_accounts = ref([]);
  const _data_selected_account = ref({});
  const _data_modified_account = ref({});
  const _data_created_account = ref({});
  const _data_success_msg = ref('');
  const _data_error_msg = ref(''); 

  const _state_popup_error = ref(false);
  const _state_popup_success = ref(false);
  const _state_popup_create_account = ref(false);
  const _state_popup_view_account = ref(false);
  const _state_popup_edit_account = ref(false);
  const _state_popup_confirm_edit_account = ref(false);
  const _state_popup_confirm_create_account = ref(false);
  const _state_popup_login = ref(false);

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

  const extract_data = R.propOr({}, 'data');
  const extract_error_data = R.propOr('Unknown error', 'message');

  const normalise_entry = entry => ({ ...entry });
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

  const ui_command_popup_view_account_open = (data) =>
    open_popup(_state_popup_view_account, _data_selected_account, data);
  const ui_command_popup_view_account_close = () =>
    close_popup(_state_popup_view_account);

  const ui_command_popup_create_account_open = () =>
    open_popup(_state_popup_create_account, _data_created_account, {});
  const ui_command_popup_create_account_close = () =>
    close_popup(_state_popup_create_account, _data_created_account);

  const ui_command_popup_edit_account_open = (data) =>
    open_popup(_state_popup_edit_account, _data_modified_account, data);
  const ui_command_popup_edit_account_close = () =>
    close_popup(_state_popup_edit_account, _data_modified_account);

  const ui_command_popup_confirm_edit_account_open = () =>
    open_popup(_state_popup_confirm_edit_account, null);
  const ui_command_popup_confirm_edit_account_close = () =>
    close_popup(_state_popup_confirm_edit_account, null);

  const ui_command_popup_confirm_create_account_open = () =>
    open_popup(_state_popup_confirm_create_account, null);
  const ui_command_popup_confirm_create_account_close = () =>
    close_popup(_state_popup_confirm_create_account, null);

  // API calls

  // Validasi account (misalnya cek status login)
  const api_validate_account = () =>
    pipe_process_api_response(
      R.pipe(
        extract_data,
        set_object(_data_selected_account),
        () => set_string(_data_success_msg, 'Account validation successful.'),
        ui_command_popup_success_open
      ),
      R.pipe(
        extract_error_data,
        set_string(_data_error_msg),
        ui_command_popup_error_open
      )
    )(() =>
      apiServicesNew.get_REDis_entity_account_validate({})
    )();

  const api_create_account = (data) =>
    pipe_process_api_response(
      R.pipe(
        () => set_string(_data_success_msg, 'Account created successfully.'),
        ui_command_popup_success_open,
        () => api_validate_account()
      ),
      R.pipe(
        extract_error_data,
        set_string(_data_error_msg),
        ui_command_popup_error_open
      )
    )(() =>
      apiServicesNew.post_REDis_entity_account_create({
        body: { ...data }
      })
    )();

  const api_update_account = (data) =>
    pipe_process_api_response(
      R.pipe(
        () => set_string(_data_success_msg, 'Account updated successfully.'),
        ui_command_popup_success_open,
        () => api_validate_account()
      ),
      R.pipe(
        extract_error_data,
        set_string(_data_error_msg),
        ui_command_popup_error_open
      )
    )(() =>
      apiServicesNew.put_REDis_entity_account_update({
        body: { ...data }
      })
    )();

  const api_account_login = (credentials) =>
    pipe_process_api_response(
      R.pipe(
        extract_data,
        set_object(_data_selected_account),
        () => set_string(_data_success_msg, 'Login successful.'),
        ui_command_popup_success_open
      ),
      R.pipe(
        extract_error_data,
        set_string(_data_error_msg),
        ui_command_popup_error_open
      )
    )(() =>
      apiServicesNew.post_REDis_entity_account_login({
        body: { ...credentials }
      })
    )();

  const api_account_logout = () =>
    pipe_process_api_response(
      R.pipe(
        () => {
          _data_selected_account.value = {};
          set_string(_data_success_msg, 'Logout successful.');
        },
        ui_command_popup_success_open
      ),
      R.pipe(
        extract_error_data,
        set_string(_data_error_msg),
        ui_command_popup_error_open
      )
    )(() =>
      apiServicesNew.post_REDis_entity_account_logout({})
    )();

  // Action pipelines
  const pipe_execute_create_account = () => {
    api_create_account(_data_created_account.value);
    ui_command_popup_confirm_create_account_close();
    ui_command_popup_create_account_close();
  };

  const pipe_execute_update_account = () => {
    const { populated, ...raw } = _data_modified_account.value;
    api_update_account(raw.raw);
    ui_command_popup_confirm_edit_account_close();
    ui_command_popup_edit_account_close();
    setTimeout(()=>{
      window.location.reload();
    }, 1000)
  };

  const pipe_execute_login = (credentials) => {
    api_account_login(credentials);
    _state_popup_login.value = false;
  };

  const pipe_execute_logout = () => {
    api_account_logout();
    setTimeout(()=>{
      window.location.reload();
    }, 1000)
  };

  onMounted(() => {
    // Misalnya validasi account saat mounted
    api_validate_account();
  });

  return {
    _data_all_accounts,
    _data_selected_account,
    _data_modified_account,
    _data_created_account,
    _data_success_msg,
    _data_error_msg,

    _state_popup_error,
    _state_popup_success,
    _state_popup_create_account,
    _state_popup_view_account,
    _state_popup_edit_account,
    _state_popup_confirm_edit_account,
    _state_popup_confirm_create_account,
    _state_popup_login,

    ui_command_popup_error_open,
    ui_command_popup_error_close,
    ui_command_popup_success_open,
    ui_command_popup_success_close,
    ui_command_popup_view_account_open,
    ui_command_popup_view_account_close,
    ui_command_popup_create_account_open,
    ui_command_popup_create_account_close,
    ui_command_popup_edit_account_open,
    ui_command_popup_edit_account_close,
    ui_command_popup_confirm_edit_account_open,
    ui_command_popup_confirm_edit_account_close,
    ui_command_popup_confirm_create_account_open,
    ui_command_popup_confirm_create_account_close,

    pipe_execute_create_account,
    pipe_execute_update_account,
    pipe_execute_login,
    pipe_execute_logout,
    api_validate_account,
  };
};

// Utility function for delay jika diperlukan
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
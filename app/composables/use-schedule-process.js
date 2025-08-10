import { ref, onMounted } from 'vue';
import * as R from 'ramda';
import { apiServices } from '@/composables/optimesHttpClient';

export const useScheduleProcess = () => {
    // --- State
    const _data_all_schedule = ref([]);
    const _data_selected_schedule = ref({});
    const _data_modified_schedule = ref({});
    const _data_created_schedule = ref({});
    const _data_uploaded_schedule = ref([]);

    const _data_success_msg = ref('');
    const _data_error_msg = ref('');

    const _state_popup_error = ref(false);
    const _state_popup_success = ref(false);
    const _state_popup_schedule_view = ref(false);
    const _state_popup_schedule_edit = ref(false);
    const _state_popup_schedule_create = ref(false);
    const _state_popup_schedule_delete = ref(false);
    const _state_popup_schedule_edit_confirmation = ref(false);
    const _state_popup_schedule_create_confirmation = ref(false);
    const _state_popup_schedule_delete_confirmation = ref(false);

    // --- Helpers
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
        refVar.value = R.defaultTo('no message.', val);
    });

    const extract_data = R.propOr([], 'data');
    const extract_error_data = R.propOr('Unknown error', 'message');

    // --- Generic async API processor
    const pipe_process_api_response =
        (successPipe, errorPipe) => (apiCall) =>
        () =>
        apiCall()
            .then(R.tryCatch(successPipe, errorPipe))
            .catch(errorPipe);

    // --- Generic popup open/close helpers
    const open_popup = (popupRef, dataRef, data) => {
        if (dataRef) dataRef.value = R.clone(data ?? {});
        popupRef.value = true;
    };

    const close_popup = (popupRef, dataRef) => {
        if (dataRef) dataRef.value = {};
        popupRef.value = false;
    };

    // --- Wrappers supaya event handler siap pakai & bawa data
    const open_popup_schedule_view = (data) =>
        open_popup(_state_popup_schedule_view, _data_selected_schedule, data);
    const close_popup_schedule_view = () =>
        close_popup(_state_popup_schedule_view, _data_selected_schedule);

    const open_popup_schedule_edit = (data) =>
        open_popup(_state_popup_schedule_edit, _data_modified_schedule, data);
    const close_popup_schedule_edit = () =>
        close_popup(_state_popup_schedule_edit, _data_modified_schedule);

    const open_popup_schedule_create = (data) =>
        open_popup(_state_popup_schedule_create, _data_modified_schedule, data);
    const close_popup_schedule_create = () =>
        close_popup(_state_popup_schedule_create, _data_modified_schedule);

    const open_popup_schedule_edit_confirmation = () =>
        open_popup(_state_popup_schedule_edit_confirmation, null);
    const close_popup_schedule_edit_confirmation = () =>
        close_popup(_state_popup_schedule_edit_confirmation, null);

    const open_popup_schedule_delete_confirmation = () =>
        open_popup(_state_popup_schedule_delete_confirmation, null);
    const close_popup_schedule_delete_confirmation = () =>
        close_popup(_state_popup_schedule_delete_confirmation, null);

    const open_popup_schedule_create_confirmation = () =>
        open_popup(_state_popup_schedule_create_confirmation, null);
    const close_popup_schedule_create_confirmation = () =>
        close_popup(_state_popup_schedule_create_confirmation, null);

    // --- API: Get All Schedule
    const api_get_all_schedule = pipe_process_api_response(
        R.pipe(
            extract_data,
            set_array(_data_all_schedule),
            () => set_string(_data_success_msg, 'Schedule refreshed.'),
            () => set_ref(_state_popup_success, true)
        ),
        R.pipe(
            extract_error_data,
            set_string(_data_error_msg),
            () => set_ref(_state_popup_error, true)
        )
    )(() => apiServices.getAllSchedules({ params: { schedule_type: 'all' } }));

    // --- API: Execute Edit Schedule
    const api_edit_schedule = (data) =>
        pipe_process_api_response(
        R.pipe(
            () => set_ref(_state_popup_success, true),
            () => set_string(_data_success_msg, 'Edit schedule success.'),
            () => api_get_all_schedule()
        ),
        R.pipe(
            extract_error_data,
            set_string(_data_error_msg),
            () => set_ref(_state_popup_error, true)
        )
        )(() =>
        apiServices.putModifyScheduleData({
            params: { schedule_id: data.id },
            body: data,
        })
    )();

    // --- API: Execute Edit Schedule
    const api_create_schedule = (data) =>
        pipe_process_api_response(
        R.pipe(
            () => set_ref(_state_popup_success, true),
            () => set_string(_data_success_msg, 'Schedule created.'),
            () => api_get_all_schedule()
        ),
        R.pipe(
            extract_error_data,
            set_string(_data_error_msg),
            () => set_ref(_state_popup_error, true)
        )
        )(() =>
        apiServices.postCreateScheduleData({
            body: data,
        })
    )();

    // --- API: Execute delete Schedule
    const api_delete_schedule = (data) => pipe_process_api_response(
        R.pipe(
            () => set_string(_data_success_msg, 'Schedule deleted.'),
            () => set_ref(_state_popup_success, true),
            () => api_get_all_schedule()
        ),
        R.pipe(
            extract_error_data,
            set_string(_data_error_msg),
            () => set_ref(_state_popup_error, true)
        )
    )(() => apiServices.deleteDeleteScheduleData({ params: { schedule_id: data.id } }))();

    // --- PIPE: Action edit Schedule
    const pipe_execute_edit_schedule = () => {
        api_edit_schedule(_data_modified_schedule.value);
        close_popup_schedule_edit();
        close_popup_schedule_edit_confirmation();
    };

    // --- PIPE: Action create schedule
    const pipe_execute_create_schedule = () => {
        api_create_schedule(_data_created_schedule.value);
        close_popup_schedule_create_confirmation();
        close_popup_schedule_create();
    };

    // --- PIPE: Action delete schedule
    const pipe_execute_delete_schedule = () => {
        api_delete_schedule(_data_selected_schedule.value);
        close_popup_schedule_view();
        close_popup_schedule_delete_confirmation();
    };

    // --- PIPE: Action refresh schedule
    const pipe_execute_refresh_schedule = () => {
        api_get_all_schedule();
    };

    // --- Lifecycle
    onMounted(() => {
        api_get_all_schedule();
    });

    return {
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
    };
};

import { ref, onMounted } from 'vue';
import * as R from 'ramda';
import { apiServices } from '@/composables/optimesHttpClient';
import { da } from 'date-fns/locale';

export const useEventHistoryProcess = () => {
    // --- State
    const _data_all_event_history_process = ref([]);
    const _data_all_entity_event_history_process = ref([]);
    const _data_selected_event_history_process = ref({});
    const _data_modified_event_history_process = ref({});

    const _data_success_msg = ref('');
    const _data_error_msg = ref('');

    const _state_popup_error = ref(false);
    const _state_popup_success = ref(false);
    const _state_popup_edit_event = ref(false);

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
    const ui_command_popup_error_open = () => open_popup(_state_popup_error, null);
    const ui_command_popup_error_close = () => close_popup(_state_popup_error, null);
    const ui_command_popup_success_open = () => open_popup(_state_popup_success, null);
    const ui_command_popup_success_close = () => close_popup(_state_popup_success, null);
    const ui_command_popup_edit_event_open = (data) => open_popup(_state_popup_edit_event, _data_modified_event_history_process, data);
    const ui_command_popup_edit_event_close = () => close_popup(_state_popup_edit_event, null);

    // --- API: Get All Event History
    const api_get_all_event_history_process = () =>
        pipe_process_api_response(
            R.pipe(
                extract_data,
                set_array(_data_all_event_history_process),
                () => set_ref(_state_popup_success, true),
                () => set_string(_data_success_msg, 'Get all event history success.'),
            ),
            R.pipe(
                extract_error_data,
                set_string(_data_error_msg),
                () => set_ref(_state_popup_error, true)
            )
        )(() =>
        apiServices.getEventHistoryAll({
            params: {
                event_type: "process"
            }
        })
    )();

    // --- API: Get All Event History (Entity)
    const api_get_all_entity_event_history_process = () =>
        pipe_process_api_response(
            R.pipe(
                extract_data,
                set_array(_data_all_entity_event_history_process),
                () => set_ref(_state_popup_success, true),
                () => set_string(_data_success_msg, 'Get all entity event history success.'),
            ),
            R.pipe(
                extract_error_data,
                set_string(_data_error_msg),
                () => set_ref(_state_popup_error, true)
            )
        )(() =>
        apiServices.getEventHistoryEntity({
            params: {
                event_type: "process"
            }
        })
    )();

    // --- API: End Spesific Event by ID
    const api_end_entity_event_history_process = (data) =>
        pipe_process_api_response(
            R.pipe(
                () => set_ref(_state_popup_success, true),
                () => set_string(_data_success_msg, 'Event ended successfully.'),
                () => api_get_all_entity_event_history_process(),
            ),
            R.pipe(
                extract_error_data,
                set_string(_data_error_msg),
                () => set_ref(_state_popup_error, true)
            ),
        )(() =>
        apiServices.postEventProcessEnd({
            params: {
                eventId: data.id
            }
        })
    )();

    // --- API: update spesific event attributes by ID
    const api_update_attributes_event_history_process = (data) =>
        pipe_process_api_response(
            R.pipe(
                () => set_ref(_state_popup_success, true),
                () => set_string(_data_success_msg, 'Event attribute updated successfully.'),
                () => api_get_all_entity_event_history_process(),
            ),
            R.pipe(
                extract_error_data,
                set_string(_data_error_msg),
                () => set_ref(_state_popup_error, true)
            ),
        )(() =>
        apiServices.putEventProcessUpdateAttributes({
           params: { eventId: data.id },
           body: data.event_attributes,
        })
    )();

        // --- API: update spesific event attributes by ID
    const api_apply_process_event = (data) =>
        pipe_process_api_response(
            R.pipe(
                () => set_ref(_state_popup_success, true),
                () => set_string(_data_success_msg, 'Event attribute updated successfully.'),
                () => api_get_all_entity_event_history_process(),
            ),
            R.pipe(
                extract_error_data,
                set_string(_data_error_msg),
                () => set_ref(_state_popup_error, true)
            ),
        )(() => 
        apiServices.postEventApply({
           params: {
            event_id: data.id,
            event_type: 'process', 
           }
        })
    )();

    // --- PIPE: Action end event
    const pipe_execute_end_event = (data) => {
        set_ref(_data_selected_event_history_process, data);
        api_end_entity_event_history_process(_data_selected_event_history_process.value);
    };

    // --- PIPE: Action update event attributes
    const pipe_execute_update_event_attributes = () => {
        api_update_attributes_event_history_process(_data_modified_event_history_process.value);
    };

    // --- PIPE: Action refresh event
    const pipe_execute_refresh_event_history = () => {
        api_get_all_entity_event_history_process();
    };

    // --- PIPE: Action apply event
    const pipe_execute_apply_event = (data) => {
        set_ref(_data_selected_event_history_process, data);
        api_apply_process_event(_data_selected_event_history_process.value);
    };


    // --- Lifecycle
    onMounted(() => {
        api_get_all_entity_event_history_process();
    });

    return {
        _data_all_event_history_process,
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
    };
};

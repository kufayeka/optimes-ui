import { ref, onMounted } from 'vue';
import * as R from 'ramda';
import { apiServices } from '@/composables/optimesHttpClient';

export const useDataReferences = () => {
    // --- State
    const _data_all_machine = ref([]);
    const _data_all_shift = ref([]);
    const _data_all_account_role = ref([]);
    const _data_all_downtime_severity = ref([]);
    const _data_all_macro_event_process = ref([]);
    const _data_all_macro_event_scheduled_downtime = ref([]);
    const _data_all_macro_event_downtime = ref([]);

    const _state_popup_error = ref(false);
    const _state_popup_success = ref(false);
    const _data_success_msg = ref('');
    const _data_error_msg = ref('');

    // --- Helpers
    const set_ref = R.curry((refVar, val) => { refVar.value = val });
    const set_array = R.curry((refVar, val) => { refVar.value = R.defaultTo([], val) });
    const set_string = R.curry((refVar, val) => { refVar.value = R.defaultTo('no message.', val) });

    const extract_data = R.propOr([], 'data');
    const extract_error_data = R.pathOr('Unknown error', ['response', 'data', 'message']);

    const pipe_process_api_response = (successPipe, errorPipe) => (apiCall) => () =>
    apiCall()
        .then(R.tryCatch(successPipe, errorPipe))
        .catch(errorPipe);

    // --- Generic data fetcher by category
    const make_api_fetcher = (refTarget, category) =>
        pipe_process_api_response(
            R.pipe(
                extract_data,
                set_array(refTarget),
                () => set_ref(_state_popup_success, true)
            ),
            R.pipe(
                extract_error_data,
                set_string(_data_error_msg),
                () => set_ref(_state_popup_error, true)
            )
    )(() => apiServices.getDataReferenceAll({ params: { reference_category: category } }));

    // --- Lifecycle
    onMounted(() => {
        make_api_fetcher(_data_all_machine, 'machine')();
        make_api_fetcher(_data_all_shift, 'shift')();
        make_api_fetcher(_data_all_account_role, 'account_role')();
        make_api_fetcher(_data_all_downtime_severity, 'downtime_severity')();
        make_api_fetcher(_data_all_macro_event_process, 'macro_event_process')();
        make_api_fetcher(_data_all_macro_event_scheduled_downtime, 'macro_event_scheduled_downtime')();
        make_api_fetcher(_data_all_macro_event_downtime, 'macro_event_downtime')();
    });

    return {
        _data_all_machine,
        _data_all_shift,
        _data_all_account_role,
        _data_all_downtime_severity,
        _data_all_macro_event_process,
        _data_all_macro_event_scheduled_downtime,
        _data_all_macro_event_downtime,
        _state_popup_error,
        _state_popup_success,
        _data_success_msg,
        _data_error_msg,
    };
};

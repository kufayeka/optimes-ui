import { ref, onMounted } from 'vue'
import * as R from 'ramda'

export const useEventHistoryProcess = () => {
    // --- State ---
    const _success_message = ref(null)
    const _error_message = ref(null)
    const _event_history = ref([])
    const _selected_event = ref({})
    const _updated_event = ref({})
    const _popup_open = ref(false)

    // --- Data Handlers (with fallback) ---
    const _set_all_event_history = R.tap((data) => (_event_history.value = R.defaultTo([], data)))
    const _set_selected_event = R.tap((data) => (_selected_event.value = R.defaultTo({}, data)))
    const _set_updated_event = R.tap((data) => (_updated_event.value = R.defaultTo({}, data)))
    const _set_success_msg = R.tap((msg) => (_success_message.value = R.defaultTo(null, msg)))
    const _set_error_msg = R.tap((msg) => (_error_message.value = R.defaultTo(null, msg)))

    // --- Popup Handlers ---
    const _open_popup = () => { _popup_open.value = true }
    const _close_popup = () => { _popup_open.value = false }
    const _close_success = () => { _success_message.value = null }
    const _close_error = () => { _error_message.value = null }

    // --- Reset Handler ---
    const _reset_all = () => {
        _set_all_event_history([])
        _set_selected_event({})
        _set_updated_event({})
        _set_success_msg(null)
        _set_error_msg(null)
        _close_popup()
    }

    const _handle_fetch_all = async () => {
        try {
            const res = await apiServices.getEventHistoryEntity({ 
                params: { event_type: 'process' } 
            })

            R.ifElse(
                R.prop('success'),
                () => _set_success_msg('Data Loaded.'),
                () => _set_error_msg('Failed Loading Data.')
            )(res)
            _set_all_event_history(R.propOr([], 'data', res))
        }
        catch(err) {
            _set_all_event_history([])
            return _set_error_msg(`Error Loading Data: ${err.message}`)
        }
        finally {}
    }


    // const obj1 = {a:1,b:2}

    // function isEven(x){
    //     const result = x / 2;

    //     if (result == 0) {
    //         return true 
    //     } else {
    //         false
    //     }
    // }

    // const res = isEven(a);
    // console.log()


    // R.ifElse(
    //     R.prop('success'),
    //     () => _set_success_msg('...'),
    //     () => _set_error_msg('...')
    // )(res)



    const _handle_end_event = async (event_data) => {
        try {
            const res = await apiServices.postEventProcessEnd({
                params: { eventId: R.prop('id', event_data) },
            })

            R.ifElse(
                R.prop('success'),
                () => _set_success_msg('End Event Success.'),
                () => _set_error_msg('Failed End Event.')
            )(res)

            _handle_fetch_all()
        } catch (err) {
            _set_error_msg(`Error End Event: ${err.message}`)
        }
    }


    const _handle_edit_event = async () => {
        try {
            const res = await apiServices.putEventProcessUpdateAttributes({
                body: R.prop('event_attributes', _updated_event.value),
                params: { eventId: R.prop('id', _updated_event.value) },
            })

            R.ifElse(
                R.prop('success'),
                () => _set_success_msg('Edit Event Success.'),
                () => _set_error_msg('Failed Edit Event.')
            )(res)

            _close_popup()
            _handle_fetch_all()
        } catch (err) {
            _set_error_msg(`Error Edit Event: ${err.message}`)
        }
    }


    const _handle_apply_event = async (event_data) => {
        try {
            const res = await apiServices.postEventApply({
                params: {
                    event_id: R.prop('id', event_data),
                    event_type: 'process',
                },
            })

            R.ifElse(
            R.prop('success'),
                () => _set_success_msg('Apply Event Success.'),
                () => _set_error_msg('Failed Apply Event.')
            )(res)

            _handle_fetch_all()
        } catch (err) {
            _set_error_msg(`Error apply event: ${err.message}`)
        }
    }





  // --- Open edit popup handler ---
  const _open_edit_popup = R.pipe(
    _set_selected_event,
    _set_updated_event,
    R.tap(_open_popup)
  )

  // --- Auto Fetch on Mount ---
  onMounted(_handle_fetch_all)


  return {
    // state
    _success_message,
    _error_message,
    _event_history,
    _selected_event,
    _updated_event,
    _popup_open,

    // api
    _handle_fetch_all,
    _handle_end_event,
    _handle_edit_event,
    _handle_apply_event,

    // popup
    _open_edit_popup,
    _close_popup,
    _close_success,
    _close_error,

    // utils
    _reset_all,
  }
}

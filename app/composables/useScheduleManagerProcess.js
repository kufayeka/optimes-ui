import { ref, onMounted } from 'vue'
import * as R from 'ramda'
import * as XLSX from 'xlsx'
import moment from 'moment'

export const useScheduleManagerProcess = () => {
  // --- State ---
  const _data_success_message = ref(null)
  const _data_error_message = ref(null)
  const _data_all_schedules = ref([])
  const _data_selected_schedule = ref({})
  const _data_updated_schedule = ref({})
  const excelData = ref([])
  const isUploading = ref(false)
  const isCreating = ref(false)

  const _toggle_popup_schedule_edit = ref(false)
  const _toggle_popup_schedule_view = ref(false)

  // --- Data Handlers ---
  const _set_data_all_schedules = R.tap((data) =>
    (_data_all_schedules.value = R.defaultTo([], data))
  )
  const _set_data_selected_schedule = R.tap((data) =>
    (_data_selected_schedule.value = R.defaultTo({}, data))
  )
  const _set_data_updated_schedule = R.tap((data) =>
    (_data_updated_schedule.value = R.defaultTo({}, data))
  )
  const _set_data_success_msg = R.tap((msg) =>
    (_data_success_message.value = R.defaultTo(null, msg))
  )
  const _set_data_error_msg = R.tap((msg) =>
    (_data_error_message.value = R.defaultTo(null, msg))
  )

  // --- Popup Handlers ---
  const _open_edit_popup = () => { _toggle_popup_schedule_edit.value = true }
  const _close_edit_popup = () => { _toggle_popup_schedule_edit.value = false }
  const _open_view_popup = () => { _toggle_popup_schedule_view.value = true }
  const _close_view_popup = () => { _toggle_popup_schedule_view.value = false }

  const _close_success = () => { _data_success_message.value = null }
  const _close_error = () => { _data_error_message.value = null }

  // --- Excel File Handler ---
  const handleFileUpload = async (file) => {
    if (!file || !(file instanceof File)) {
      _set_data_error_msg('Please select a valid Excel file.')
      return
    }

    isUploading.value = true

    try {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result)
          const workbook = XLSX.read(data, { type: 'array', cellDates: true })

          if (!workbook.Sheets['Sheet1']) {
            throw new Error('Sheet1 not found in the Excel file.')
          }

          const sheet = workbook.Sheets['Sheet1']
          const json = XLSX.utils.sheet_to_json(sheet)

          excelData.value = json.map(row => ({
            schedule_category: row['Schedule Category'] || 'production',
            schedule_status: row['Schedule Status'],
            work_order_number: row['Work Order Number'],
            sales_order_number: row['Sales Order Number'],
            shift: row['Shift'],
            planned_start_time: row['Planned Start Time'],
            planned_end_time: row['Planned End Time'],
            routing: row['Routing'],
            quantity_order: row['Quantity Order'],
            quantity_unit: row['Quantity Unit'],
          }))

          _set_data_success_msg(`Excel file processed successfully. ${excelData.value.length} records loaded.`)
        } catch (parseError) {
          _set_data_error_msg(`Error parsing Excel file: ${parseError.message}`)
        }
      }

      reader.onerror = () => {
        _set_data_error_msg('Error reading Excel file.')
      }

      reader.readAsArrayBuffer(file)
    } catch (err) {
      _set_data_error_msg(`Error processing Excel file: ${err.message}`)
    } finally {
      isUploading.value = false
    }
  }

  // --- SQL Generator (Insert per row)
  const generateSqlInserts = (data) => {
    return data.map(row => {
      const plannedStartTime = moment(row.planned_start_time, ['DD/MM/YYYY HH:mm', 'YYYY-MM-DD HH:mm:ss']).toISOString()
      const plannedEndTime = moment(row.planned_end_time, ['YYYY-MM-DD HH:mm:ss', 'DD/MM/YYYY HH:mm']).toISOString()

      const scheduleData = {
        shift: row.shift,
        routing: row.routing,
        material: row.material || 'MAT-001',
        quantity_unit: row.quantity_unit,
        quantity_order: row.quantity_order,
        work_order_number: row.work_order_number,
        sales_order_number: row.sales_order_number
      }

      return `INSERT INTO schedule (
        schedule_category,
        planned_start_time,
        planned_finish_time,
        schedule_data
      )
      VALUES (
        '${row.schedule_category}',
        '${plannedStartTime}',
        '${plannedEndTime}',
        '${JSON.stringify(scheduleData)}'::jsonb
      );`
    }).join('\n')
  }

  // --- SQL Generator (Batch VALUES + TRUNCATE)
  const generateSqlBatchValuesOnlyInsert = (data) => {
    const values = data.map(row => {
      const plannedStartTime = moment(row.planned_start_time, ['DD/MM/YYYY HH:mm', 'YYYY-MM-DD HH:mm:ss']).toISOString()
      const plannedEndTime = moment(row.planned_end_time, ['DD/MM/YYYY HH:mm', 'YYYY-MM-DD HH:mm:ss']).toISOString()

      const scheduleData = {
        shift: row.shift,
        routing: row.routing,
        material: row.material || 'MAT-001',
        quantity_unit: row.quantity_unit,
        quantity_order: row.quantity_order,
        work_order_number: row.work_order_number,
        sales_order_number: row.sales_order_number
      }

      return `(
        '${row.schedule_category}',
        '${plannedStartTime}',
        '${plannedEndTime}',
        '${JSON.stringify(scheduleData)}'::jsonb
      )`
    }).join(',\n')

    return `
      TRUNCATE TABLE schedule;
      INSERT INTO schedule (
        schedule_category,
        planned_start_time,
        planned_finish_time,
        schedule_data
      )
      VALUES
      ${values};
    `
  }

  // --- Create Schedules (Insert Only)
  const createSchedules = async () => {
    if (!excelData.value.length) {
      _set_data_error_msg('No Excel data to process.')
      return
    }

    isCreating.value = true
    try {
      const sqlBatch = generateSqlInserts(excelData.value)
      const res = await apiServices.postSchedulesBatchUpload({
        params: { schedule_type: 'production' },
        body: { sql_script: sqlBatch }
      })

      R.ifElse(
        R.prop('success'),
        () => {
          _set_data_success_msg('Schedules Uploaded.')
          excelData.value = []
          window.location.reload();
        },
        () => _set_data_error_msg('Failed Upload Schedules.')
      )(res)

      _set_data_all_schedules(R.propOr([], 'data', res))
    } catch (err) {
      _set_data_all_schedules([])
      _set_data_error_msg(`Error Uploading Schedules: ${err.message}`)
    } finally {
      isCreating.value = false
    }
  }

  // --- Replace Schedules (TRUNCATE + Insert Batch)
  const replaceSchedules = async () => {
    if (!excelData.value.length) {
      _set_data_error_msg('No Excel data to process.')
      return
    }

    isCreating.value = true
    try {
      const sqlReplaceScript = generateSqlBatchValuesOnlyInsert(excelData.value)
      const res = await apiServices.postSchedulesBatchReplace({
        params: { schedule_type: 'production' },
        body: { sql_script: sqlReplaceScript }
      })

      R.ifElse(
        R.prop('success'),
        () => {
          _set_data_success_msg('Schedules Replaced Successfully.')
          excelData.value = []
          window.location.reload();
        },
        () => _set_data_error_msg('Failed Replacing Schedules.')
      )(res)

      _set_data_all_schedules(R.propOr([], 'data', res))
    } catch (err) {
      _set_data_all_schedules([])
      _set_data_error_msg(`Error Replacing Schedules: ${err.message}`)
    } finally {
      isCreating.value = false
    }
  }

  // --- Fetch Schedules
  const _handle_fetch_all = async () => {
    try {
      const res = await apiServices.getAllSchedules({
        params: { schedule_type: 'all' }
      })

      R.ifElse(
        R.prop('success'),
        () => _set_data_success_msg('Data Loaded.'),
        () => _set_data_error_msg('Failed Loading Data.')
      )(res)

      _set_data_all_schedules(R.propOr([], 'data', res))
    } catch (err) {
      _set_data_all_schedules([])
      _set_data_error_msg(`Error Loading Data: ${err.message}`)
    }
  }

  // --- View Schedule
  const _open_view_schedule = R.pipe(
    _set_data_selected_schedule,
    R.tap(_open_view_popup)
  )

    // --- Edit Schedule
  const _open_edit_schedule = R.pipe(
    _set_data_updated_schedule,
    R.tap(_open_edit_popup)
  )

  // --- Lifecycle
  onMounted(_handle_fetch_all)

  return {
    _data_success_message,
    _data_error_message,
    _data_all_schedules,
    _data_selected_schedule,
    _data_updated_schedule,
    _toggle_popup_schedule_edit,
    _toggle_popup_schedule_view,
    excelData,
    isUploading,
    isCreating,

    _set_data_all_schedules,
    _set_data_selected_schedule,
    _set_data_updated_schedule,
    _set_data_success_msg,
    _set_data_error_msg,

    _open_edit_popup,
    _close_edit_popup,
    _open_view_popup,
    _close_view_popup,
    _open_view_schedule,
    _close_success,
    _close_error,

    _handle_fetch_all,
    handleFileUpload,
    createSchedules,
    replaceSchedules,
  }
}

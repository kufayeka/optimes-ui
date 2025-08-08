import { useApi } from './useApi';

const { get, post, put, del, patch } = useApi();

export const apiServices = {
  postEventProcessCreate: ({ body: { event_type, scrap_flag, supplementary_flag, notes }, ...options }) => post(`/event-process-create`, { event_type, scrap_flag, supplementary_flag, notes }, options),
  postEventProcessEnd: ({ params: { eventId }, ...options }) => post(`/event-process-end/${eventId}`, {}, options),
  putEventProcessUpdateAttributes: ({ body: { scrap_flag, supplementary_flag, notes }, params: { eventId }, ...options }) => put(`/event-process-update-attributes/${eventId}`, { scrap_flag, supplementary_flag, notes }, options),
  postEventOperationalAccount: ({ body: { action, account, entity }, ...options }) => post(`/event-operational-account`, { action, account, entity }, options),
  getEventHistoryAll: ({ params: { event_type }, ...options }) => get(`/event-history-all/${event_type}`, options),
  getEventHistoryEntity: ({ params: { event_type }, ...options }) => get(`/event-history-entity/${event_type}`, options),
  getCapturedValues: ({ params: { capture_type }, ...options }) => get(`/captured-values/${capture_type}`, options),
  postEventApply: ({ params: { event_type, event_id }, ...options }) => post(`/event-apply/${event_type}/${event_id}`, {}, options),
  getAllSchedules: ({ params: { schedule_type }, ...options }) => get(`/all-schedules/${schedule_type}`, options),
  getAllSchedulesEntity: ({ params: { schedule_type }, ...options }) => get(`/all-schedules-entity/${schedule_type}`, options),
  getLoadedScheduleData: ({ ...options }) => get(`/loaded-schedule-data`, options),
  getLoadSchedule: ({ params: { schedule_id }, ...options }) => get(`/load-schedule/${schedule_id}`, options),
  getUnloadSchedule: ({ ...options }) => get(`/unload-schedule`, options),
  postSchedulesBatchUpload: ({ body: { sql_script }, params: { schedule_type }, ...options }) => post(`/schedules-batch-upload/${schedule_type}`, { sql_script }, options),
  postSchedulesBatchReplace: ({ body: { sql_script }, params: { schedule_type }, ...options }) => post(`/schedules-batch-replace/${schedule_type}`, { sql_script }, options),
  getHealthCheck: ({ ...options }) => get(`/health-check`, options),
  getDataReferenceAll: ({ params: { reference_category }, ...options }) => get(`/data-reference-all/${reference_category}`, options),
  getDataReferenceOne: ({ params: { reference_category }, ...options }) => get(`/data-reference-one/${reference_category}`, options),
  getAccountValidate: ({ ...options }) => get(`/account-validate`, options),
  postAccountLogin: ({ body: { username, password, role, selectedEntityId, selectedShiftId }, ...options }) => post(`/account-login`, { username, password, role, selectedEntityId, selectedShiftId }, options),
  postAccountLogout: ({ ...options }) => post(`/account-logout`, {}, options),
  putAccountUpdate: ({ body: { fullname, role, username, password, status }, params: { accountId }, ...options }) => put(`/account-update/${accountId}`, { fullname, role, username, password, status }, options),
};

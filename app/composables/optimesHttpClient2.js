import { useApiNew } from './useApi2';

const { get, post, put, del, patch } = useApiNew();

export const apiServicesNew = {
  post_REDis_schedule_create: ({ body: { schedule_notes, created_on, updated_on, planned_start_time, planned_finish_time, actual_start_time, actual_finish_time, work_order, sales_order, shift, routing, quantity_order, quantity_unit }, ...options }) => post(`/REDis/schedule/create`, { schedule_notes, created_on, updated_on, planned_start_time, planned_finish_time, actual_start_time, actual_finish_time, work_order, sales_order, shift, routing, quantity_order, quantity_unit }, options),
  get_REDis_schedule_getAll: ({ ...options }) => get(`/REDis/schedule/getAll`, options),
  post_REDis_schedule_getOne: ({ body: { id }, ...options }) => post(`/REDis/schedule/getOne`, { id }, options),
  post_REDis_schedule_delete: ({ body: { key }, ...options }) => post(`/REDis/schedule/delete`, { key }, options),
  put_REDis_schedule_update: ({ body: { id, key, schedule_notes, created_on, updated_on, planned_start_time, planned_finish_time, actual_start_time, actual_finish_time, work_order, sales_order, shift, routing, quantity_order, quantity_unit }, ...options }) => put(`/REDis/schedule/update`, { id, key, schedule_notes, created_on, updated_on, planned_start_time, planned_finish_time, actual_start_time, actual_finish_time, work_order, sales_order, shift, routing, quantity_order, quantity_unit }, options),
  post_REDis_entity_machine_operator_assign: ({ body: { machine_key, assigned_operator_keys }, ...options }) => post(`/REDis/entity/machine/operator/assign`, { machine_key, assigned_operator_keys }, options),
  post_REDis_entity_machine_job_load: ({ body: { schedule_key, machine_key }, ...options }) => post(`/REDis/entity/machine/job/load`, { schedule_key, machine_key }, options),
  post_REDis_entity_machine_job_unload: ({ body: { schedule_key, machine_key }, ...options }) => post(`/REDis/entity/machine/job/unload`, { schedule_key, machine_key }, options),
  get_REDis_entity_machine_getAll: ({ ...options }) => get(`/REDis/entity/machine/getAll`, options),
  get_REDis_entity_machine_getOne: ({ ...options }) => get(`/REDis/entity/machine/getOne`, options),
  post_REDis_entity_account_create: ({ body: { account_id, username, password, role, status, fullname }, ...options }) => post(`/REDis/entity/account/create`, { account_id, username, password, role, status, fullname }, options),
  put_REDis_entity_account_update: ({ body: { id, key, username, password, role, status, fullname }, ...options }) => put(`/REDis/entity/account/update`, { id, key, username, password, role, status, fullname }, options),
  post_REDis_entity_account_login: ({ body: { username, password, role }, ...options }) => post(`/REDis/entity/account/login`, { username, password, role }, options),
  post_REDis_entity_account_logout: ({ ...options }) => post(`/REDis/entity/account/logout`, {}, options),
  get_testing: ({ ...options }) => get(`/testing`, options),
  get_REDis_entity_account_validate: ({ ...options }) => get(`/REDis/entity/account/validate`, options),
};

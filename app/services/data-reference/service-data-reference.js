import { useApi } from "../api-calls";

const { get, post, del } = useApi();

const get_all = '/all-data-reference'
const get_one = '/data-reference'

//..............................//
export const getAllMachineReferences = async () => {
  const data = await get(`${get_all}/machine`);
  return data;
};

export const getOneMachineReference = async () => {
  const data = await get(`${get_one}/machine`);
  return data;
};

//..............................//
export const getAllAccountRoleReferences = async () => {
  const data = await get(`${get_all}/account_role`);
  return data;
};

export const getOneAccountRoleReferences = async () => {
  const data = await get(`${get_one}/account_role`);
  return data;
};

//..............................//
export const getAllShiftReferences = async () => {
  const data = await get(`${get_all}/shift`);
  return data;
};

//..............................//
export const getAllMacroEventProcessReferences = async () => {
  const data = await get(`${get_all}/macro_event_process`);
  return data;
};

//..............................//
export const getAllMacroEventDowntimeReferences = async () => {
  const data = await get(`${get_all}/macro_event_downtime`);
  return data;
};

//..............................//
export const getAllMacroEventScheduledDowntimeReferences = async () => {
  const data = await get(`${get_all}/macro_event_scheduled_downtime`);
  return data;
};


//..............................//
export const getAllDowntimeSeverityReferences = async () => {
  const data = await get(`${get_all}/downtime_severity`);
  return data;
};

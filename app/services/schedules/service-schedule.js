import { useApi } from "../api-calls";

const { get, post, del, put } = useApi();

const baseEndpoint = '/schedule'


export const getAllProductionSchedules = async () => {
  const data = await get(`${baseEndpoint}/all/production`);
  return data;
};

export const getAllMaintenanceSchedules = async () => {
  const data = await get(`${baseEndpoint}/all/maintenance`);
  return data;
};

export const getAllSchedulesByEntityId = async () => {
  const data = await get(`${baseEndpoint}/entity/all`);
  return data;
};

export const getAllProductionSchedulesByEntityId = async () => {
  const data = await get(`${baseEndpoint}/entity/production`);
  return data;
};

export const getAllMaintenanceSchedulesByEntityId = async () => {
  const data = await get(`${baseEndpoint}/entity/maintenance`);
  return data;
};


export const loadSchedule = async (scheduleId) => {
  const data = await post(`${baseEndpoint}/load`, {
    scheduleId
  });
  return data;
};

export const unloadSchedule = async (scheduleId) => {
  const data = await post(`${baseEndpoint}/unload`, {
    scheduleId
  });
  return data;
};

export const viewSchedule = async () => {
  const data = await get(`${baseEndpoint}/view`);
  return data;
};
import { useApi } from "../api-calls";

const { get, post, del, put } = useApi();

const base_url = '/event'

export const createProcessEvent = async (reqBody) => {
  const data = await post(`${base_url}/create/process`, reqBody);
  return data;
};

export const endProcessEvent = async (reqBody) => {
  const data = await post(`${base_url}/end/process`, reqBody);
  return data;
};

export const updateProcessEvent = async (reqBody) => {
  const data = await put(`${base_url}/update/process`, reqBody);
  return data;
};

export const getAllEntityProcessEventHistory = async (reqBody) => {
  const data = await get(`/all-entity-event/process?limit=50`, reqBody);
  return data;
};

export const applyProcessEvent = async (reqBody) => {
  const data = await post(`${base_url}/captured-values/apply/process`, reqBody);
  return data;
};

export const getProcessEventCapturedValues = async (selector) => {
  const data = await get(`${base_url}/process/captured-values/${selector}`, );
  return data;
};

import { useApi } from "../api-calls";

const { get, post, del, put } = useApi();


export const accountLogin = async (form) => {
  const data = await post('/account/login', form);
  return data;
};

export const accountLogout = async (form) => {
  const data = await post('/account/logout', form);
  return data;
};

export const accountUpdate = async (form) => {
  const data = await put('/account/update', form);
  return data;
};

export const validateLoginCookie = async (options = {}) => {
  // options = { cookie: '...' } dari middleware SSR
  const headers = useRequestHeaders(['cookie']);
  const cookies = headers.cookie || '';

  return await get('/account/validate', {
    headers: cookies
      ? { cookie: cookies } 
      : undefined,
  });
};


export default defineNuxtRouteMiddleware(async (to) => {
  const expectedRole = '3603e39e-602a-475e-8275-97c30554b8c9'; // sys adm

  try {
    const headers = useRequestHeaders(['cookie']);
    const cookies = headers.cookie || ''; 
    const response = await apiServices.getAccountValidate({
      headers: cookies
      ? { cookie: cookies } 
      : undefined,
    });

    if (!response.success) {
      console.warn('Login failed or cookie invalid');
      return navigateTo('/unauthorised');
    }

    const accountRole = response.data.role;

    if (accountRole !== expectedRole) {
      console.warn(`Invalid role: ${accountRole}`);
      return navigateTo('/unauthorised');
    }

    console.log('✅ Access granted for role:', accountRole);
    return;

  } catch (err) {
    console.error('Error validating cookie:', err);
    return navigateTo('/unauthorised');
  }
});

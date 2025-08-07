
export default defineNuxtRouteMiddleware(async (to) => {
  const expectedRole = 'a8071b9d-3229-4354-805a-abb48f925f57'; // operator

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

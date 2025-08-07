
export default defineNuxtRouteMiddleware(async (to) => {
  const expectedRole = 'b2c8916e-9f9b-4d3d-8132-d397444ff17f'; // ppic role ID


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


import { apiServicesNew } from '@/composables/optimesHttpClient2';

export default defineNuxtRouteMiddleware(async (to) => {
  const expectedRole = 'operator'; // operator

  try {
    const headers = useRequestHeaders(['cookie']);
    const cookies = headers.cookie || '';

    const response = await apiServicesNew.get_REDis_entity_account_validate({
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

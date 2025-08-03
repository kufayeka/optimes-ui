import { validateLoginCookie } from "~/services/accounts/service-account";

export default defineNuxtRouteMiddleware(async (to) => {
  const expectedRole = 'ee811716-5d5c-49d0-a2be-8fc6e0fe49d3'; // head maintenance

  try {
    const response = await validateLoginCookie();

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

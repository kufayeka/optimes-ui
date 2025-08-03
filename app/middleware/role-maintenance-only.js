import { validateLoginCookie } from "~/services/accounts/service-account";

export default defineNuxtRouteMiddleware(async (to) => {
  const expectedRole = '6c158410-0823-45f1-aa14-4bbfb3bf517e'; // maintenance

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

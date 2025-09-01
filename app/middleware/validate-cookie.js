
import { apiServicesNew } from '@/composables/optimesHttpClient2';

export default defineNuxtRouteMiddleware(async (to) => {
  const accountRoleReferenceId = {
    system_administrator: 'admin',
    ppic: 'ppic',
    operator: 'operator',
    maintenance: 'maintenance',
    head_of_maintenance: 'head_of_maintenance',
  };

  const roleRouteMap = {
    [accountRoleReferenceId.system_administrator]: '/system-administrator',
    [accountRoleReferenceId.ppic]: '/ppic',
    [accountRoleReferenceId.operator]: '/operator',
    [accountRoleReferenceId.maintenance]: '/maintenance',
    [accountRoleReferenceId.head_of_maintenance]: '/head-maintenance',
  };

  try {
    const headers = useRequestHeaders(['cookie']);
    const cookies = headers.cookie || '';

    const response = await apiServicesNew.get_REDis_entity_account_validate({
      headers: cookies
      ? { cookie: cookies } 
      : undefined,
    });
    
    const userRoleId = response.data.role;
    const targetRoute = roleRouteMap[userRoleId];

    console.log("VALIDATE COOKIE", response)
    console.log("TARGET PAGE", targetRoute)

    return navigateTo(targetRoute);


  } catch (err) {
    console.error(err);
    console.log("TARGET PAGE", "/unauthorised")
  }
});

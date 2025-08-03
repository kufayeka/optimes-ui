import { validateLoginCookie } from '~/services/accounts/service-account';

export default defineNuxtRouteMiddleware(async (to) => {
  const accountRoleReferenceId = {
    system_administrator: '3603e39e-602a-475e-8275-97c30554b8c9',
    ppic: 'b2c8916e-9f9b-4d3d-8132-d397444ff17f',
    operator: 'a8071b9d-3229-4354-805a-abb48f925f57',
    maintenance: '6c158410-0823-45f1-aa14-4bbfb3bf517e',
    head_of_maintenance: 'ee811716-5d5c-49d0-a2be-8fc6e0fe49d3',
  };

  const roleRouteMap = {
    [accountRoleReferenceId.system_administrator]: '/system-administrator',
    [accountRoleReferenceId.ppic]: '/ppic',
    [accountRoleReferenceId.operator]: '/operator',
    [accountRoleReferenceId.maintenance]: '/maintenance',
    [accountRoleReferenceId.head_of_maintenance]: '/head-maintenance',
  };

  try {
    const response = await validateLoginCookie();

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

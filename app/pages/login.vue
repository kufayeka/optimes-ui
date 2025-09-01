<template>
    <organisms-organism-form-login-new></organisms-organism-form-login-new>
</template>

<script setup lang="js">
definePageMeta({
  name: 'login',
  title: 'Login',
  description: 'Login page for the application',
  keywords: 'login, authentication, user access',
  icon: 'mdi-login',
  layout: 'layout-logged-out',
  middleware: ['validate-cookie'],
});

useHead({
  title: 'Login',
  meta: [
    { name: 'description', content: 'Login page for the application' },
    { name: 'keywords', content: 'login, authentication, user access' }
  ]
});


</script>

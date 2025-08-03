<template>
    <h3>page 0</h3>
    <organisms-organism-form-login></organisms-organism-form-login>
</template>

<script setup lang="js">
definePageMeta({
  name: 'login',
  title: 'Login',
  description: 'Login page for the application',
  keywords: 'login, authentication, user access',
  icon: 'mdi-login',
  layout: 'layout-logged-in',
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

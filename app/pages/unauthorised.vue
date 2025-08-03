<template>
  <v-container>
    <v-card>
      <v-card-title>Unauthorized Access</v-card-title>
      <v-card-text>
        You do not have permission to access this page.
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="goBack">Go Back</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
const goBack = () => {
  navigateTo('/'); // Redirect ke halaman utama atau halaman login
};
</script>
<template>
  <v-card variant="outlined">
    <v-toolbar color="primary" dark title="Head Maintenance Dashboard">
      <!-- Toolbar bisa diisi sesuai kebutuhan -->
    </v-toolbar>

    <div class="d-flex flex-column">
      <v-tabs v-model="tab" color="primary" direction="horizontal">
        <v-tab prepend-icon="mdi-calendar-clock" value="maintenance-schedules">Maintenance Schedules Manager</v-tab>
        <v-tab prepend-icon="mdi-file-chart" value="reports">Reports</v-tab>
      </v-tabs>

      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="maintenance-schedules">
          <v-card flat>
            <v-card-text>
              <p>Maintenance Schedules Manager content for head-maintenance.</p>
            </v-card-text>
          </v-card>
        </v-tabs-window-item>
        <v-tabs-window-item value="reports">
          <v-card flat>
            <v-card-text>
              <p>Reports content for head-maintenance.</p>
            </v-card-text>
          </v-card>
        </v-tabs-window-item>
      </v-tabs-window>
    </div>
  </v-card>
</template>

<script setup lang="ts">
definePageMeta({
  name: 'head-maintenance',
  title: 'Head Maintenance Dashboard',
  description: 'Dashboard for head maintenance personnel to manage maintenance schedules and reports',
  keywords: 'head maintenance, dashboard, schedules, reports',
  icon: 'mdi-wrench',
  layout: 'layout-logged-in',
  middleware: ['role-head-maintenance-only'],
});

useHead({
  title: 'Head Maintenance Dashboard',
  meta: [
    { name: 'description', content: 'Dashboard for head maintenance personnel to manage maintenance schedules and reports' },
    { name: 'keywords', content: 'head maintenance, dashboard, schedules, reports' }
  ]
});

import { ref } from 'vue';

const tab = ref('maintenance-schedules');
</script>
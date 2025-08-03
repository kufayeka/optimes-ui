<template>
  <v-card variant="outlined">
    <v-toolbar color="primary" dark title="Maintenance Dashboard">
      <!-- Toolbar bisa diisi sesuai kebutuhan -->
    </v-toolbar>

    <div class="d-flex flex-column">
      <v-tabs v-model="tab" color="primary" direction="horizontal">
        <v-tab prepend-icon="mdi-calendar" value="schedules">Schedules</v-tab>
        <v-tab prepend-icon="mdi-clock-alert" value="downtime">Downtime Events</v-tab>
      </v-tabs>

      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="schedules">
          <v-card flat>
            <v-card-text>
              <p>Schedules content for maintenance.</p>
            </v-card-text>
          </v-card>
        </v-tabs-window-item>
        <v-tabs-window-item value="downtime">
          <v-card flat>
            <v-card-text>
              <p>Downtime Events content for maintenance.</p>
            </v-card-text>
          </v-card>
        </v-tabs-window-item>
      </v-tabs-window>
    </div>
  </v-card>
</template>

<script setup lang="ts">
definePageMeta({
  name: 'maintenance',
  title: 'Maintenance Dashboard',
  description: 'Dashboard for maintenance personnel to manage schedules and downtime events',
  keywords: 'maintenance, dashboard, schedules, downtime',
  icon: 'mdi-wrench',
  layout: 'layout-logged-in',
  middleware: ['role-maintenance-only'],
});

useHead({
  title: 'Maintenance Dashboard',
  meta: [
    { name: 'description', content: 'Dashboard for maintenance personnel to manage schedules and downtime events' },
    { name: 'keywords', content: 'maintenance, dashboard, schedules, downtime' }
  ]
});

import { ref } from 'vue';

const tab = ref('schedules');
</script>
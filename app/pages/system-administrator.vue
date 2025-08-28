<template>
  <v-card variant="outlined">
    <v-toolbar color="primary" dark title="System Administrator Dashboard">
      <!-- Toolbar bisa diisi sesuai kebutuhan -->
    </v-toolbar>

    <div class="d-flex flex-column">
      <v-tabs v-model="tab" color="primary" direction="horizontal">
        <v-tab prepend-icon="mdi-account-group" value="account-manager">Account Manager</v-tab>
        <v-tab prepend-icon="mdi-account-group" value="event-macro-process-manager">Event Macro Process Manager</v-tab>
        <v-tab prepend-icon="mdi-account-group" value="entity-manager">Entity Manager</v-tab>
        <v-tab prepend-icon="mdi-account-group" value="schedule-manager">Schedule Manager</v-tab>
        <v-tab prepend-icon="mdi-account-group" value="shift-manager">Shift Manager</v-tab>
      </v-tabs>

      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="account-manager">
          <v-card flat>
            <v-card-text>
              <p>Account Manager content for system-administrator.</p>
            </v-card-text>
          </v-card>
        </v-tabs-window-item>

        <v-tabs-window-item value="event-macro-process-manager">
          <v-card flat>
            <v-card-text>
              <organisms-organism-table-reference-manager-event-macro-process/>
            </v-card-text>
          </v-card>
        </v-tabs-window-item>

        <v-tabs-window-item value="event-macro-downtime-manager">
          <v-card flat>
            <v-card-text>
              <organisms-organism-table-reference-manager-event-macro-downtime/>
            </v-card-text>
          </v-card>
        </v-tabs-window-item>

        <v-tabs-window-item value="entity-manager">
          <v-card flat>
            <v-card-text>
              <organisms-organism-table-reference-manager-entity/>
            </v-card-text>
          </v-card>
        </v-tabs-window-item>

        <v-tabs-window-item value="schedule-manager">
          <v-card flat>
            <v-card-text>
              <organisms-organism-table-schedule-manager-production/>
            </v-card-text>
          </v-card>
        </v-tabs-window-item>

        <v-tabs-window-item value="shift-manager">
          <v-card flat>
            <v-card-text>
              <organisms-organism-table-reference-manager-shift/>
            </v-card-text>
          </v-card>
        </v-tabs-window-item>

      </v-tabs-window>
    </div>
  </v-card>
</template>

<script setup lang="ts">
definePageMeta({
  name: 'system-administrator',
  title: 'System Administrator Dashboard',
  description: 'Dashboard for system administrators to manage accounts and system settings',
  keywords: 'system administrator, dashboard, account management',
  icon: 'mdi-account-cog', 
  layout: 'layout-logged-in',
  middleware: ['role-sys-admin-only'],
});

useHead({
  title: 'System Administrator Dashboard',
  meta: [
    { name: 'description', content: 'Dashboard for system administrators to manage accounts and system settings' },
    { name: 'keywords', content: 'system administrator, dashboard, account management' }
  ]
});

import { ref } from 'vue';

const tab = ref('account-manager');
</script>
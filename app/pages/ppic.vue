<template>
  <v-card variant="outlined">
    <v-toolbar color="primary" dark title="PPIC Dashboard">
      <!-- Toolbar bisa diisi sesuai kebutuhan -->
    </v-toolbar>

    <div class="d-flex flex-column">
      <v-tabs v-model="tab" color="primary" direction="horizontal">
        <v-tab prepend-icon="mdi-calendar-clock" value="production-schedules">Production Schedules Manager</v-tab>
        <v-tab prepend-icon="mdi-file-chart" value="reports">Reports</v-tab>
      </v-tabs>

      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="production-schedules">
          <v-card flat>
            <v-card-text>
              <p>Production Schedules Manager content for ppic.</p>
            </v-card-text>
          </v-card>
        </v-tabs-window-item>
        <v-tabs-window-item value="reports">
          <v-card flat>
            <v-card-text>
              <p>Reports content for ppic.</p>
            </v-card-text>
          </v-card>
        </v-tabs-window-item>
      </v-tabs-window>
    </div>
  </v-card>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'layout-logged-out'
});

import { ref } from 'vue';

const tab = ref('production-schedules');
</script>
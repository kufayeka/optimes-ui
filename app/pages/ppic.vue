<template>
  <v-card variant="outlined">
    <v-toolbar color="primary" dark title="PPIC Dashboard">
      <!-- Toolbar bisa diisi sesuai kebutuhan -->
    </v-toolbar>

    <div class="d-flex flex-column">
      <v-tabs v-model="tab" color="primary" direction="horizontal">
        <v-tab prepend-icon="mdi-calendar-clock" value="schedule-overview">Schedules Overview</v-tab>
        <v-tab prepend-icon="mdi-calendar-clock" value="schedules-manager">Schedules Manager</v-tab>
        <v-tab prepend-icon="mdi-file-chart" value="schedule-report">Schedule Report</v-tab>
      </v-tabs>

      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="schedule-overview">
          <v-card flat>
            <v-card-text>
              <organisms-organism-chart-gantt-ppic-schedule/>              
            </v-card-text>
          </v-card>
        </v-tabs-window-item>
        <v-tabs-window-item value="schedules-manager">
          <v-card flat>
            <v-card-text>
              <organisms-organism-table-schedule-manager-ppic/>     
            </v-card-text>
          </v-card>
        </v-tabs-window-item>
        <v-tabs-window-item value="schedule-report">
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
  layout: 'layout-logged-in'
});

import { ref } from 'vue';

const tab = ref('production-schedules');

</script>
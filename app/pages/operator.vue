<template>
  <v-card>
    <v-toolbar>
      <template #title>
        <atoms-atom-base-label-lg :bold="true">Operator Dashboard</atoms-atom-base-label-lg>
      </template>
      <template #append>
          loaded
      </template>
      <template v-slot:extension>
        <v-tabs v-model="tab" color="primary" direction="horizontal">
          <v-tab prepend-icon="mdi-calendar" value="schedules">Schedules</v-tab>
          <v-tab prepend-icon="mdi-factory" value="process">Process Events</v-tab>
          <v-tab prepend-icon="mdi-clock-alert" value="downtime">Downtime Events</v-tab>
        </v-tabs>
      </template>
    </v-toolbar>

    <div class="d-flex flex-column">
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="schedules">
          <v-card flat>

          </v-card>
        </v-tabs-window-item>
        <v-tabs-window-item value="process">
          <v-card flat>
             <v-card-text>
                
             </v-card-text>
          </v-card>
        </v-tabs-window-item>
        <v-tabs-window-item value="downtime">
          <v-card flat>
            <v-card-text>
                       
            </v-card-text>
          </v-card>
        </v-tabs-window-item>
      </v-tabs-window>
    </div>
  </v-card>
</template>

<script setup lang="ts">
definePageMeta({
  name: 'operator',
  title: 'Operator Dashboard',
  description: 'Dashboard for operators to manage schedules, process, and downtime events',
  keywords: 'operator, dashboard, schedules, process, downtime',
  icon: 'mdi-account-cog',
  layout: 'layout-logged-in',
  middleware: ['role-operator-only'],
});

useHead({
  title: 'Operator Dashboard',
  meta: [
    { name: 'description', content: 'Dashboard for operators to manage schedules, process, and downtime events' },
    { name: 'keywords', content: 'operator, dashboard, schedules, process, downtime' }
  ]
});


import { ref } from 'vue';

const tab = ref('schedules');

const datetime = ref('');
const time = ref('');
const month = ref('');

</script>
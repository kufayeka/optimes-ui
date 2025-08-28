<template>
  <v-card>
    <v-card-title  class="bg-surface-light text-center justify-center py-6">
        <atoms-atom-base-label-lg :bold="true">Event Captured Values</atoms-atom-base-label-lg>
    </v-card-title>


    <div class="d-flex flex-row">

      <v-tabs v-model="tab" color="primary" direction="vertical">
        <v-tab prepend-icon="mdi-factory" value="tracker">Delta</v-tab>
        <v-tab prepend-icon="mdi-factory" value="occurence">Tracker</v-tab>
        <v-tab prepend-icon="mdi-factory" value="aggregate">Statistic</v-tab>
        <v-tab prepend-icon="mdi-factory" value="history">History</v-tab>
      </v-tabs>

      <v-tabs-window v-model="tab" class="w-100 px-3">
        <v-tabs-window-item value="tracker">
          <v-card flat>
            <molecules-molecule-tab-content-event-captured-values-tracker/>
          </v-card>
        </v-tabs-window-item>

        <!-- konten occurence -->
        <v-tabs-window-item value="occurence">
          <v-card flat>
            <molecules-molecule-tab-content-event-captured-values-occurence/>
          </v-card>
        </v-tabs-window-item>

        <!-- konten aggregate -->
        <v-tabs-window-item value="aggregate">
          <v-card flat>
            <molecules-molecule-tab-content-event-captured-values-aggregate/>
          </v-card>
        </v-tabs-window-item>

        <v-tabs-window-item value="history">
          <v-card flat>
            
          </v-card>
        </v-tabs-window-item>
      </v-tabs-window>
    </div>
  </v-card>
</template>

<script setup lang="js">
import { ref, onMounted } from 'vue';

const tab = ref('tracker');
const eventData = ref({});

const processData = (x) => {
  eventData.value = x;
};


onMounted(() => {
  // preload jika perlu
});
</script>

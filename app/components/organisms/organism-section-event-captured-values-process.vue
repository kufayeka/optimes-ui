<template>
  <molecules-molecule-form-section :title="'Captured Values View'">
  <v-tabs v-model="tab" color="primary" direction="horizontal">
    <v-tab prepend-icon="mdi-factory" value="difference">Difference</v-tab>
    <v-tab prepend-icon="mdi-factory" value="counter">Counter</v-tab>
    <v-tab prepend-icon="mdi-factory" value="aggregate">Aggregate</v-tab>
    <v-tab prepend-icon="mdi-factory" value="history">History</v-tab>
  </v-tabs>
  <v-tabs-window v-model="tab">
    <v-tabs-window-item value="difference">
      <v-card flat>
        <molecules-molecule-table-event-captured-values-difference/>
      </v-card>
    </v-tabs-window-item>
    <v-tabs-window-item value="counter">
      <v-card flat>
      </v-card>
    </v-tabs-window-item>
    <v-tabs-window-item value="aggregate">
      <v-card flat>
      </v-card>
    </v-tabs-window-item>
    <v-tabs-window-item value="history">
      <v-card flat>
        <molecules-molecule-table-event-captured-values-history/>
      </v-card>
    </v-tabs-window-item>       
  </v-tabs-window>
  </molecules-molecule-form-section>
</template>

<script setup lang="js">
import { ref, onMounted, watch } from 'vue';

const tab = ref('difference');



// Optional: preload default tab on mount
onMounted(() => {

});
</script>

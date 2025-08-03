<template>
  <div>
    <v-btn class="mr-2" @click="refreshTime">
        RTC: {{ currentDateTime }}
    </v-btn>
    <organisms-organism-popup-display-selected-entity/>
    <organisms-organism-popup-display-loaded-schedule/>
    <organisms-organism-popup-display-logged-account/>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const currentDateTime = ref('');

const updateTime = () => {
  const now = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Jakarta',
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  currentDateTime.value = `${now} WIB`;
};

const refreshTime = () => {
  updateTime();
  setInterval(updateTime, 1000);
};


onMounted(() => {
  refreshTime();
});

onUnmounted(() => {

});
</script>

<style scoped>
.v-toolbar-title {
  display: flex;
  align-items: center;
}
</style>
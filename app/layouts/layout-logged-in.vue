<template>
  <v-app>
    <!-- Header Sticky -->
    <v-app-bar app color="primary" dark :elevation="2">
      <template v-slot:prepend>
        <img src="/img/jvt_optimes.png" alt="optimes" class="w-70 h-50" />
      </template>

      <v-app-bar-title></v-app-bar-title>

      <template v-slot:append>
        <organisms-organism-popup-display-selected-entity/>
        <organisms-organism-popup-display-loaded-schedule/>
        <organisms-organism-popup-display-logged-account/>
      </template>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <slot></slot>
      </v-container>
    </v-main>

    <!-- Footer -->
    <v-footer
      app
      color="grey-darken-3"
      class="d-flex flex-row py-2 justify-space-between"
    >
      <span class="white-text"
        >&copy; {{ new Date().getFullYear() }} Made by Javindotech</span
      >
      <v-btn class="mr-2" @click="refreshTime">
        RTC: {{ currentDateTime }}
      </v-btn>
    </v-footer>
  </v-app>
</template>

<script setup>
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
    hour12: false,
  });

  currentDateTime.value = `${now} WIB`;
};

let intervalId = null;

const refreshTime = () => {
  if (intervalId) {
    clearInterval(intervalId);
  }
  updateTime();
  intervalId = setInterval(updateTime, 1000);
};

onMounted(() => {
  refreshTime();
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>

<style scoped>
.v-main {
  min-height: calc(100vh - 64px - 56px);
}
</style>
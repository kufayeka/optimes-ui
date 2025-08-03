<!-- src/components/atoms/AtomBaseCard.vue -->
<template>
  <v-card :elevation="elevation" :class="['base-card', { outlined: outlined }]">
    <slot></slot>
  </v-card>
</template>

<script setup lang="js">
defineProps({
  elevation: {
    type: [Number, String],
    default: 2,
  },
  outlined: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
.base-card {
  padding: 16px;
}
.outlined {
  border: 1px solid var(--v-theme-on-surface);
}
</style>
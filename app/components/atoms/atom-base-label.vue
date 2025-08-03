<!-- src/components/atoms/AtomBaseLabel.vue -->
<template>
  <v-label :for="forId" :class="['base-label', { bold: bold }]">
    <slot></slot>
  </v-label>
</template>

<script setup lang="js">
defineProps({
  forId: {
    type: String,
    default: '', // ID of the associated input (for accessibility)
  },
  bold: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
.base-label {
  color: var(--v-theme-on-surface);
}
.bold {
  font-weight: bold;
}
</style>
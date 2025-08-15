<!-- src/components/atoms/AtomBaseChip.vue -->
<template>
  <v-chip
    :color="color"
    :variant="variant"
    :size="size"
    :closable="closable"
    :prepend-icon="prependIcon"
    @click="$emit('click')"
    @click:close="$emit('close')"
    class="base-chip align-center justify-center"
  >
    <slot></slot>
  </v-chip>
</template>

<script setup lang="js">
defineProps({
  color: {
    type: String,
    default: 'primary', // Vuetify theme color or custom hex
  },
  variant: {
    type: String,
    default: 'tonal',
    validator: (value) => ['elevated', 'flat', 'tonal', 'outlined', 'text'].includes(value),
  },
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['x-small', 'small', 'default', 'large', 'x-large'].includes(value),
  },
  closable: {
    type: Boolean,
    default: false,
  },
  prependIcon: {
    type: String,
    default: null, // e.g., 'mdi-label'
  },
});
defineEmits(['click', 'close']);
</script>

<style scoped>
.base-chip {
  padding: 3px;
}
</style>
<!-- src/components/atoms/AtomBaseIcon.vue -->
<template>
  <v-icon :class="icon" :icon="icon" :size="size" :color="color" />
</template>

<script setup lang="js">
defineProps({
  icon: {
    type: String,
    required: true, // e.g., 'mdi-cog'
  },
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['x-small', 'small', 'default', 'large', 'x-large'].includes(value),
  },
  color: {
    type: String,
    default: 'primary', // Use Vuetify theme colors or custom hex
  },
});
</script>
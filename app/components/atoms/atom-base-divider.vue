<!-- src/components/atoms/AtomBaseDivider.vue -->
<template>
  <v-divider :vertical="vertical" :thickness="thickness" />
</template>

<script setup lang="js">
defineProps({
  vertical: {
    type: Boolean,
    default: false,
  },
  thickness: {
    type: [Number, String],
    default: 1,
  },
});
</script>
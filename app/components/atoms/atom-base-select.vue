<!-- src/components/atoms/AtomBaseSelect.vue -->
<template>
  <v-select
    :model-value="modelValue"
    :items="items"
    :item-title="itemTitle"
    :item-value="itemValue"
    :label="label"
    :rules="rules"
    variant="outlined"
    density="compact"
    :prepend-icon="prependIcon"
    @update:modelValue="$emit('update:modelValue', $event)"
  />
</template>

<script setup lang="js">
defineProps({
  modelValue: {
    type: [String, Number, Object],
    default: null,
  },
  items: {
    type: Array,
    default: () => [],
  },
  itemTitle: {
    type: String,
    default: 'title', // Property name for display text
  },
  itemValue: {
    type: String,
    default: 'value', // Property name for value
  },
  label: {
    type: String,
    default: '',
  },
  rules: {
    type: Array,
    default: () => [],
  },
  prependIcon: {
    type: String,
    default: '', // e.g., 'mdi-menu-down'
  },
});
defineEmits(['update:modelValue']);
</script>
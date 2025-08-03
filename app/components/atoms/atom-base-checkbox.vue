<!-- src/components/atoms/AtomBaseCheckbox.vue -->
<template>
  <v-checkbox
    :model-value="modelValue"
    :label="label"
    :rules="rules"
    :disabled="disabled"
    :id="id"
    @update:modelValue="$emit('update:modelValue', $event)"
  />
</template>

<script setup lang="js">
defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: '',
  },
  rules: {
    type: Array,
    default: () => [],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  id: {
    type: String,
    default: '',
  },
});
defineEmits(['update:modelValue']);
</script>

<style scoped>
:deep(.v-checkbox) {
  margin: 4px 0;
}
</style>
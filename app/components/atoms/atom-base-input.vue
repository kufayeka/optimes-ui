<template>
  <v-text-field
    :type="type"
    :model-value="modelValue"
    :placeholder="placeholder"
    :rules="rules"
    variant="outlined"
    density="compact"
    @update:modelValue="$emit('update:modelValue', $event)"
  />
</template>

<script setup lang="js">
defineProps({
  type: { type: String, default: 'text' },
  modelValue: { type: [String, Number], default: '' },
  placeholder: { type: String, default: '' },
  rules: { type: Array, default: () => [] },
});
defineEmits(['update:modelValue']);
</script>
<!-- src/components/molecules/MoleculesFormFieldCheckbox.vue -->
<template>
  <div class="d-flex flex-col">
    <atoms-atom-base-checkbox
      :model-value="modelValue"
      :label="checkboxLabel"
      :rules="rules"
      :disabled="disabled"
      :id="inputId"
      @update:modelValue="$emit('update:modelValue', $event)"
    />
    <atoms-atom-base-label :for-id="inputId" :bold="bold">
      {{ label }}
    </atoms-atom-base-label>
  </div>
</template>

<script setup lang="js">

const inputId = `checkbox-input-${Math.random().toString(36).substr(2, 9)}`;

defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: '',
  },
  checkboxLabel: {
    type: String,
    default: '',
  },
  rules: {
    type: Array,
    default: () => [],
  },
  bold: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
defineEmits(['update:modelValue']);
</script>

<style scoped>
</style>
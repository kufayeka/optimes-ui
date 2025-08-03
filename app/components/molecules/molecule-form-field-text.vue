<!-- src/components/molecules/MoleculesFormFieldText.vue -->
<template>
  <div class="form-field-text">
    <atoms-atom-base-label :for-id="inputId" :bold="bold">
      {{ label }}
    </atoms-atom-base-label>
    <atoms-atom-base-input
      :type="'text'"
      :model-value="modelValue"
      :placeholder="placeholder"
      :rules="rules"
      :id="inputId"
      @update:modelValue="$emit('update:modelValue', $event)"
    />
  </div>
</template>

<script setup lang="js">

const inputId = `text-input-${Math.random().toString(36).substr(2, 9)}`;

defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  placeholder: {
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
});
defineEmits(['update:modelValue']);
</script>

<style scoped>
.form-field-text {
  display: flex;
  flex-direction: column;
}
</style>
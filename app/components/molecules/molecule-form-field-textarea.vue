<!-- src/components/molecules/MoleculesFormFieldTextarea.vue -->
<template>
  <div class="form-field-textarea">
    <atoms-atom-base-label :for-id="inputId" :bold="bold">
      {{ label }}
    </atoms-atom-base-label>
    <atoms-atom-base-textarea
      :model-value="modelValue"
      :placeholder="placeholder"
      :width="'100%'"
      :rows="rows"
      @update:modelValue="$emit('update:modelValue', $event)"
    />
  </div>
</template>

<script setup lang="js">
const inputId = `textarea-input-${Math.random().toString(36).substr(2, 9)}`;

defineProps({
  modelValue: {
    type: String,
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
  bold: {
    type: Boolean,
    default: false,
  },
  rows: {
    type: Number,
    default: 4,
  },
});
defineEmits(['update:modelValue']);
</script>

<style scoped>
.form-field-textarea {
  display: flex;
  flex-direction: column;
}
</style>

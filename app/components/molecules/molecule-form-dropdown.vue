<!-- src/components/molecules/MoleculesFormFieldDropdown.vue -->
<template>
  <div class="form-field-dropdown">
    <atoms-atom-base-label :for-id="inputId" :bold="bold">
      {{ label }}
    </atoms-atom-base-label>
    <atoms-atom-base-select
      :model-value="modelValue"
      :items="items"
      :item-title="itemTitle"
      :item-value="itemValue"
      :label="placeholder"
      :rules="rules"
      :prepend-icon="prependIcon"
      :id="inputId"
      @update:modelValue="$emit('update:modelValue', $event)"
    />
  </div>
</template>

<script setup lang="js">

const inputId = `dropdown-input-${Math.random().toString(36).substr(2, 9)}`;

defineProps({
  modelValue: {
    type: [String, Number, Object],
    default: null,
  },
  label: {
    type: String,
    default: '',
  },
  items: {
    type: Array,
    default: () => [],
  },
  itemTitle: {
    type: String,
    default: 'title',
  },
  itemValue: {
    type: String,
    default: 'value',
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
  prependIcon: {
    type: String,
    default: '',
  },
});
defineEmits(['update:modelValue']);
</script>

<style scoped>
.form-field-dropdown {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}
</style>
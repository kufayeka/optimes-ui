<!-- src/components/molecules/MoleculesFormFieldWithButton.vue -->
<template>
  <div class="form-field-with-button">
    <atoms-atom-base-label :for-id="inputId" :bold="bold">
      {{ label }}
    </atoms-atom-base-label>
    <div class="input-button-container">
      <atoms-atom-base-input
        :type="type"
        :model-value="modelValue"
        :placeholder="placeholder"
        :rules="rules"
        :id="inputId"
        @update:modelValue="$emit('update:modelValue', $event)"
      />
      <atoms-atom-base-button
        :variant="buttonVariant"
        :size="buttonSize"
        :disabled="disabled"
        @click="$emit('button-click')"
      >
        {{ buttonText }}
      </atoms-atom-base-button>
    </div>
  </div>
</template>

<script setup lang="js">

const inputId = `input-with-button-${Math.random().toString(36).substr(2, 9)}`;

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
  type: {
    type: String,
    default: 'text',
    validator: (value) => ['text', 'number', 'email', 'password'].includes(value),
  },
  rules: {
    type: Array,
    default: () => [],
  },
  bold: {
    type: Boolean,
    default: false,
  },
  buttonText: {
    type: String,
    default: 'Submit',
  },
  buttonVariant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'default'].includes(value),
  },
  buttonSize: {
    type: String,
    default: 'default',
    validator: (value) => ['x-small', 'small', 'default', 'large', 'x-large'].includes(value),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
defineEmits(['update:modelValue', 'button-click']);
</script>

<style scoped>
.form-field-with-button {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}
.input-button-container {
  display: flex;
  gap: 8px;
  align-items: center;
}
</style>
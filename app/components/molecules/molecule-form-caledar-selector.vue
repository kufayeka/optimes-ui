<template>
  <div>
    <atoms-atom-base-label v-if="label" :for="inputId" :bold="labelBold">{{ label }}</atoms-atom-base-label>

    <atoms-atom-base-calendar-native
      v-model="internalValue"
      :type="type"
      :min="min"
      :max="max"
      :placeholder="placeholder"
      :clearable="clearable"
      :useNow="useNow"
      :id="inputId"
    />

    <atoms-atom-base-alert
      v-if="errorMessage"
      type="error"
      :text="errorMessage"
      size="sm"
      closable
      style="margin-top: 8px;"
    />
  </div>
</template>

<script setup lang="js">
import { ref, computed, watch } from 'vue';

const props = defineProps({
  modelValue: { type: [String, Date], default: null },
  label: { type: String, default: 'Select Date' },
  labelBold: { type: Boolean, default: true },
  type: { type: String, default: 'date' }, // 'date', 'datetime', 'time', 'month'
  min: { type: String, default: null },
  max: { type: String, default: null },
  placeholder: { type: String, default: '' },
  clearable: { type: Boolean, default: true },
  useNow: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue']);

const internalValue = ref(props.modelValue);
const errorMessage = ref('');

const inputId = computed(() => `calendar-selector-${Math.random().toString(36).slice(2, 10)}`);

watch(() => props.modelValue, (val) => {
  internalValue.value = val;
  validate(val);
});

watch(internalValue, (val) => {
  emit('update:modelValue', val);
  validate(val);
});

function validate(val) {
  errorMessage.value = '';
  if (props.required && !val) {
    errorMessage.value = 'Field is required.';
    return;
  }
  if (props.min && val && val < props.min) {
    errorMessage.value = `Value must be after ${props.min}.`;
    return;
  }
  if (props.max && val && val > props.max) {
    errorMessage.value = `Value must be before ${props.max}.`;
    return;
  }
}
</script>
<template>
  <div>
    <input
      v-if="type === 'date'"
      :id="inputId"
      type="date"
      v-model="internalValue"
      :disabled="disabled"
      :min="min"
      :max="max"
      :placeholder="placeholder"
      :style="inputStyle"
      @change="updateValue"
    />
    <input
      v-if="type === 'month'"
      :id="inputId"
      type="month"
      v-model="internalValue"
      :disabled="disabled"
      :min="min"
      :max="max"
      :placeholder="placeholder"
      :style="inputStyle"
      @change="updateValue"
    />
    <input
      v-if="type === 'time'"
      :id="inputId"
      type="time"
      :disabled="disabled"
      v-model="internalValue"
      :placeholder="placeholder"
      :style="inputStyle"
      @change="updateValue"
    />
    <input
      v-if="type === 'datetime'"
      :id="inputId"
      type="datetime-local"
      v-model="internalValue"
      :disabled="disabled"
      :min="min"
      :max="max"
      :placeholder="placeholder"
      :style="inputStyle"
      @change="updateValue"
    />
    <button
      v-if="clearable && internalValue"
      :disabled="disabled"
      type="button"
      @click="clear"
      style="margin-left: 8px;"
    >Clear</button>
  </div>
</template>

<script setup lang="js">
import { ref, watch, computed } from 'vue';

const props = defineProps({
  modelValue: { type: [String, Date], default: null },
  type: { type: String, default: 'date' }, // 'date', 'datetime', 'time', 'month',
  placeholder: { type: String, default: '' },
  min: { type: String, default: null },
  max: { type: String, default: null },
  disabled: { type: Boolean, default: false },
  clearable: { type: Boolean, default: true },
  useNow: { type: Boolean, default: false }, 
});

const emit = defineEmits(['update:modelValue']);

function getNowValue() {
  const now = new Date();
  if (props.type === 'date') return now.toISOString().slice(0, 10);
  if (props.type === 'month') return now.toISOString().slice(0, 7);
  if (props.type === 'time') return now.toTimeString().slice(0, 5);
  if (props.type === 'datetime') {
    const date = now.toISOString().slice(0, 16);
    return date;
  }
  return '';
}

const internalValue = ref(props.modelValue);

if (props.useNow && !props.modelValue) {
  internalValue.value = getNowValue();
  emit('update:modelValue', internalValue.value);
}

watch(() => props.modelValue, (val) => {
  internalValue.value = val;
});

function updateValue(e) {
  emit('update:modelValue', internalValue.value);
}

function clear() {
  internalValue.value = '';
  emit('update:modelValue', '');
}

const inputId = computed(() => `calendar-input-${Math.random().toString(36).slice(2, 10)}`);

const inputStyle = 'max-width: 300px; padding: 8px; border: 1px solid #ccc; border-radius: 4px;';
</script>
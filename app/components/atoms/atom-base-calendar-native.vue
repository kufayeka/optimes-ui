<template>
  <div class="calendar-wrapper">
    <!-- native date/time input -->
    <input
      v-if="['date','datetime','time','month'].includes(type)"
      :id="id"
      :type="nativeType"
      :disabled="disabled"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />

    <!-- custom year picker -->
    <select
      v-else-if="type === 'year'"
      :id="id"
      :disabled="disabled"
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option value="">-- Select Year --</option>
      <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
    </select>

    <!-- custom monthYear picker -->
    <div v-else-if="type === 'monthYear'" class="month-year-picker">
      <select
        :id="id + '-month'"
        :disabled="disabled"
        :value="selectedMonth"
        @change="onMonthChange($event.target.value)"
      >
        <option value="">-- Month --</option>
        <option v-for="m in 12" :key="m" :value="m">{{ m }}</option>
      </select>
      <select
        :id="id + '-year'"
        :disabled="disabled"
        :value="selectedYear"
        @change="onYearChange($event.target.value)"
      >
        <option value="">-- Year --</option>
        <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  id: String,
  type: { type: String, required: true },
  modelValue: String,
  disabled: Boolean,
  clearable: Boolean
});

const emit = defineEmits(['update:modelValue']);

const nativeType = computed(() => {
  if (props.type === 'datetime') return 'datetime-local';
  if (props.type === 'time') return 'time';
  if (props.type === 'month') return 'month';
  if (props.type === 'date') return 'date';
  return 'text';
});

const years = Array.from({ length: 51 }, (_, i) => new Date().getFullYear() - 25 + i);

const selectedMonth = computed(() => {
  if (!props.modelValue) return '';
  const [m] = props.modelValue.split('/');
  return m;
});
const selectedYear = computed(() => {
  if (!props.modelValue) return '';
  const [, y] = props.modelValue.split('/');
  return y;
});

function onMonthChange(m) {
  emit('update:modelValue', m && selectedYear.value ? `${m}/${selectedYear.value}` : '');
}
function onYearChange(y) {
  emit('update:modelValue', selectedMonth.value && y ? `${selectedMonth.value}/${y}` : '');
}
</script>

<style scoped>
.calendar-wrapper {
  display: flex;
  gap: 8px;
}
.month-year-picker select {
  padding: 4px 6px;
}
</style>

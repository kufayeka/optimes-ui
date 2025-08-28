<template>
  <div class="create-form">
    <div v-for="(field, i) in formTemplate" :key="i" class="form-field-wrapper">
      <atoms-atom-base-label :bold="true" :for="field.key">
        {{ field.label }}
      </atoms-atom-base-label>

      <!-- TEXT -->
      <atoms-atom-base-input
        v-if="field.type === 'text'"
        :id="field.key"
        :disabled="field.disabled"
        :placeholder="field.placeholder || ''"
        :model-value="getValue(field)"
        @update:modelValue="val => updateValue(field.key, val)"
      />

      <!-- TEXTAREA -->
      <atoms-atom-base-textarea
        v-else-if="field.type === 'textarea'"
        :id="field.key"
        :rows="field.rows || 4"
        :disabled="field.disabled"
        :placeholder="field.placeholder || ''"
        :model-value="getValue(field)"
        @update:modelValue="val => updateValue(field.key, val)"
      />

      <!-- NUMBER -->
      <atoms-atom-base-input
        v-else-if="field.type === 'number'"
        :id="field.key"
        type="number"
        :disabled="field.disabled"
        :min="field.min !== undefined ? field.min : null"
        :max="field.max !== undefined ? field.max : null"
        :model-value="getValue(field)"
        @update:modelValue="val => updateValue(field.key, sanitizeNumber(field, val))"
      />

      <!-- PASSWORD -->
      <atoms-atom-base-input
        v-else-if="field.type === 'password'"
        :id="field.key"
        type="password"
        :disabled="field.disabled"
        :model-value="getValue(field)"
        @update:modelValue="val => updateValue(field.key, val)"
      />

      <!-- SELECT -->
      <atoms-atom-base-select
        v-else-if="field.type === 'select'"
        :id="field.key"
        :model-value="getValue(field)"
        :items="field.items"
        :disabled="field.disabled"
        :item-title="field.itemTitle"
        :item-value="field.itemValue"
        @update:modelValue="val => updateValue(field.key, val)"
      />

      <!-- CALENDAR -->
      <atoms-atom-base-calendar-native
        v-else-if="['datetime','date','time','month','year','monthYear'].includes(field.type)"
        :id="field.key"
        :type="field.type"
        :disabled="field.disabled"
        :model-value="getCalendarValue(field)"
        :clearable="field.clearable ?? true"
        @update:modelValue="val => updateCalendarValue(field.key, val, field.type)"
        class="mb-5"
      />

      <!-- CHECKBOX -->
      <label
        v-else-if="field.type === 'checkbox'"
        class="checkbox-field"
        :for="field.key"
      >
        <input
          type="checkbox"
          :disabled="field.disabled"
          :id="field.key"
          :checked="!!getValue(field)"
          @change="e => updateValue(field.key, e.target.checked)"
        />
        {{ field.label }}
      </label>
    </div>

    <pre v-if="debug">Current Data: {{ formData }}</pre>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { get, set, cloneDeep } from 'lodash-es';

const props = defineProps({
  debug: { type: Boolean, default: false },
  formTemplate: { type: Array, required: true },
  initialData: { type: Object, default: () => ({}) }
});

const emit = defineEmits(['update:formData']);

const formData = reactive(cloneDeep(props.initialData));

/* Calendar Helpers */
function parseToObj(date) {
  if (!date) return null;
  const d = new Date(date);
  return {
    date: d.getDate(),
    month: d.getMonth() + 1,
    year: d.getFullYear(),
    hour: d.getHours(),
    minute: d.getMinutes(),
    second: d.getSeconds()
  };
}

function formatFromObj(obj, type) {
  if (!obj) return '';
  const pad = (n) => String(n).padStart(2, '0');
  switch (type) {
    case 'datetime':
      return `${obj.year}-${pad(obj.month)}-${pad(obj.date)}T${pad(obj.hour)}:${pad(obj.minute)}`;
    case 'date':
      return `${obj.year}-${pad(obj.month)}-${pad(obj.date)}`;
    case 'time':
      return `${pad(obj.hour)}:${pad(obj.minute)}:${pad(obj.second ?? 0)}`;
    case 'month':
      return `${obj.year}-${pad(obj.month)}`;
    case 'year':
      return `${obj.year}`;
    case 'monthYear':
      return `${pad(obj.month)}/${obj.year}`;
    default:
      return '';
  }
}

const getCalendarValue = (field) => {
  const obj = get(formData, field.key, null);
  return formatFromObj(obj, field.type);
};

const updateCalendarValue = (key, val, type) => {
  if (!val) {
    set(formData, key, null);
  } else {
    let d;
    if (type === 'time') {
      const [hh, mm, ss] = val.split(':').map(Number);
      d = new Date();
      d.setHours(hh, mm, ss || 0, 0);
    } else if (type === 'year') {
      d = new Date(Number(val), 0, 1);
    } else if (type === 'monthYear') {
      const [m, y] = val.split('/').map(Number);
      d = new Date(y, m - 1, 1);
    } else {
      d = new Date(val);
    }
    set(formData, key, parseToObj(d));
  }
  emit('update:formData', cloneDeep(formData));
};

/* Common */
const getValue = (field) => get(formData, field.key, '');
const updateValue = (key, value) => {
  set(formData, key, value);
  emit('update:formData', cloneDeep(formData));
};
const sanitizeNumber = (field, val) => {
  if (val === '' || val === null) return '';
  let num = Number(val);
  if (field.allowNegative === false && num < 0) num = Math.abs(num);
  if (field.min !== undefined && num < field.min) num = field.min;
  if (field.max !== undefined && num > field.max) num = field.max;
  return num;
};
</script>

<style scoped>
.create-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.form-field-wrapper {
  display: flex;
  flex-direction: column;
}
.checkbox-field {
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: 600;
}
</style>

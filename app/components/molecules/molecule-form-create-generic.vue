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

      <!-- CALENDAR (native inputs) -->
      <div
        v-else-if="['datetime','date','time'].includes(field.type)"
        class="calendar-field"
      >
        <input
          class="native-calendar"
          :id="field.key"
          :type="field.type === 'datetime' ? 'datetime-local' : field.type"
          :disabled="field.disabled"
          :value="getCalendarValue(field, field.type)"
          @input="val => updateCalendarValue(field.key, val.target.value, field.type)"
        />
      </div>

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

/* Calendar Get */
const getCalendarValue = (field, type) => {
  const val = get(formData, field.key, null);
  if (!val) return '';

  const d = new Date(val);
  if (isNaN(d)) return '';

  const pad = (n) => String(n).padStart(2, '0');

  switch (type) {
    case 'datetime':
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    case 'date':
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    case 'time':
      return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
    default:
      return '';
  }
};

/* Calendar Update */
const updateCalendarValue = (key, val, type) => {
  if (!val) {
    set(formData, key, null);
  } else {
    let d;
    if (type === 'time') {
      const [hh, mm] = val.split(':').map(Number);
      d = new Date();
      d.setHours(hh, mm, 0, 0);
    } else {
      d = new Date(val);
    }
    set(formData, key, d.toISOString()); // simpan sebagai ISO string
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
  gap: 6px;
}
.checkbox-field {
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: 600;
}
.calendar-field {
  display: flex;
  flex-direction: column;
}
.native-calendar {
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
}
</style>

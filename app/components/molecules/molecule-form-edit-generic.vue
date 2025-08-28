<template>
  <div class="form-edit-generic">
    <div
      v-for="(field, index) in formTemplate"
      :key="index"
      class="form-field-wrapper"
    >
      <!-- TEXT -->
      <template v-if="field.type === 'text'">
        <atoms-atom-base-label :bold="true">{{ field.label }}</atoms-atom-base-label>
        <atoms-atom-base-input
          :disabled="field.disabled"
          :placeholder="field.placeholder || ''"
          :model-value="getValue(field)"
          @update:modelValue="updateValue(field.key, $event)"
        />
      </template>

      <!-- PASSWORD -->
      <template v-else-if="field.type === 'password'">
        <atoms-atom-base-label :bold="true">{{ field.label }}</atoms-atom-base-label>
        <atoms-atom-base-input
          type="password"
          :disabled="field.disabled"
          :placeholder="field.placeholder || ''"
          :model-value="getValue(field)"
          @update:modelValue="updateValue(field.key, $event)"
        />
      </template>

      <!-- TEXTAREA -->
      <template v-else-if="field.type === 'textarea'">
        <atoms-atom-base-label :bold="true">{{ field.label }}</atoms-atom-base-label>
        <atoms-atom-base-textarea
          :placeholder="field.placeholder || ''"
          :disabled="field.disabled"
          :rows="field.rows || 4"
          :model-value="getValue(field)"
          @update:modelValue="updateValue(field.key, $event)"
        />
      </template>

      <!-- NUMBER -->
      <template v-else-if="field.type === 'number'">
        <atoms-atom-base-label :bold="true">
          {{ field.label }} (min: {{ field.min }}, max: {{ field.max }})
        </atoms-atom-base-label>
        <atoms-atom-base-input
          type="number"
          :disabled="field.disabled"
          :placeholder="field.placeholder || ''"
          :min="field.min !== undefined ? field.min : null"
          :max="field.max !== undefined ? field.max : null"
          :model-value="getValue(field)"
          @update:modelValue="updateValue(field.key, sanitizeNumber(field, $event))"
        />
      </template>

      <!-- CHECKBOX -->
      <template v-else-if="field.type === 'checkbox'">
        <label class="checkbox-field">
          <input
            :disabled="field.disabled"
            type="checkbox"
            :checked="!!getValue(field)"
            @change="updateValue(field.key, $event.target.checked)"
          />
          {{ field.label }}
        </label>
      </template>

      <!-- CALENDAR -->
      <template v-else-if="['date','datetime','time','month','year','monthYear'].includes(field.type)">
        <atoms-atom-base-label :bold="true">{{ field.label }}</atoms-atom-base-label>
        <atoms-atom-base-calendar-native
          class="mb-5"
          :type="field.type"
          :disabled="field.disabled"
          :model-value="getCalendarValue(field)"
          :clearable="field.clearable ?? true"
          @update:modelValue="updateCalendarValue(field.key, $event, field.type)"
        />
      </template>

      <!-- DROPDOWN GENERIC -->
      <template v-else-if="field.type === 'select'">
        <atoms-atom-base-label :bold="true">{{ field.label }}</atoms-atom-base-label>
        <atoms-atom-base-select
          :disabled="field.disabled"   
          :model-value="getValue(field)"
          :items="field.items"
          :item-title="field.itemTitle"
          :item-value="field.itemValue"
          @update:modelValue="updateValue(field.key, $event)"
        />
      </template>

      <!-- ARRAY -->
      <template v-else-if="field.type === 'array'">
        <atoms-atom-base-label :bold="true">{{ field.label }}</atoms-atom-base-label>
        <div class="array-field d-flex flex-col justify-center">
          <div v-for="(item, idx) in getValue(field)" :key="idx" class="d-flex flex-row">
            <atoms-atom-base-input
              class="mr-3"
              :disabled="field.disabled"
              :model-value="item"
              :placeholder="`Item ${idx + 1}`"
              @update:modelValue="updateArrayItem(field.key, idx, $event)"
            />
            <v-btn color="red" variant="tonal" @click="removeArrayItem(field.key, idx)">Remove</v-btn>
          </div>
          <div class="d-flex flex-row justify-center">
            <v-btn class="w-33" color="primary" variant="tonal" @click="addArrayItem(field.key)">Add</v-btn>
          </div>
        </div>
      </template>

      <v-divider class="my-2"/>
    </div>
  </div>
</template>

<script setup>
import { get, set, cloneDeep, merge } from 'lodash-es';

const props = defineProps({
  formTemplate: { type: Array, required: true },
  formInitialData: { type: Object, default: () => ({}) },
  formUpdatedData: { type: Object, required: true },
});

const emit = defineEmits(['update:formUpdatedData']);

/* Calendar Helpers */
function parseToObj(date) {
  if (!date) return null;
  const d = new Date(date);
  return {
    day: d.getDay(),
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

/* Calendar Get/Update */
const getCalendarValue = (field) => {
  const obj =
    get(props.formUpdatedData, field.key) ??
    get(props.formInitialData, field.key) ??
    null;
  return formatFromObj(obj, field.type);
};

const updateCalendarValue = (key, val, type) => {
  const mergedData = cloneDeep(props.formInitialData);
  merge(mergedData, props.formUpdatedData);

  if (!val) {
    set(mergedData, key, null);
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
    set(mergedData, key, parseToObj(d));
  }

  emit('update:formUpdatedData', mergedData);
};

/* Normal Get/Update */
const getValue = (field) =>
  get(props.formUpdatedData, field.key) ??
  get(props.formInitialData, field.key) ??
  (field.type === 'array' ? [] : '');

const updateValue = (key, value) => {
  const mergedData = cloneDeep(props.formInitialData);
  merge(mergedData, props.formUpdatedData);
  set(mergedData, key, value);
  emit('update:formUpdatedData', mergedData);
};

/* Number sanitize */
function sanitizeNumber(field, val) {
  if (val === '' || val === null) return '';
  let num = Number(val);
  if (field.allowNegative === false && num < 0) num = Math.abs(num);
  if (field.min !== undefined && num < field.min) num = field.min;
  if (field.max !== undefined && num > field.max) num = field.max;
  return num;
}

/* Array handlers */
const updateArrayItem = (key, index, value) => {
  const mergedData = cloneDeep(props.formInitialData);
  merge(mergedData, props.formUpdatedData);
  const array = get(mergedData, key, []).slice();
  array[index] = value;
  set(mergedData, key, array);
  emit('update:formUpdatedData', mergedData);
};

const addArrayItem = (key) => {
  const mergedData = cloneDeep(props.formInitialData);
  merge(mergedData, props.formUpdatedData);
  const array = get(mergedData, key, []).slice();
  array.push('');
  set(mergedData, key, array);
  emit('update:formUpdatedData', mergedData);
};

const removeArrayItem = (key, index) => {
  const mergedData = cloneDeep(props.formInitialData);
  merge(mergedData, props.formUpdatedData);
  const array = get(mergedData, key, []).slice();
  array.splice(index, 1);
  set(mergedData, key, array);
  emit('update:formUpdatedData', mergedData);
};
</script>

<style scoped>
.form-edit-generic {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.checkbox-field {
  display: flex;
  align-items: center;
  gap: 5px;
}
.array-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.array-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
}
</style>

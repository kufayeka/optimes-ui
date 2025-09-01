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

      <!-- CALENDAR (native inputs) -->
      <template v-else-if="['date','datetime','time'].includes(field.type)">
        <div class="calendar-field">
            <atoms-atom-base-label :bold="true">{{ field.label }}</atoms-atom-base-label>
            <input
              class="native-calendar"
              :type="field.type === 'datetime' ? 'datetime-local' : field.type"
              :disabled="field.disabled"
              :value="getCalendarValue(field, field.type)"
              @input="updateCalendarValue(field.key, $event.target.value, field.type)"
            />
          </div>
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
    <pre v-if="debug">Current Data: {{ formData }}</pre>
  </div>
</template>

<script setup>
import { get, set, cloneDeep, merge } from 'lodash-es';
import { computed } from 'vue';

const props = defineProps({
  debug: { type: Boolean, default: false },
  formTemplate: { type: Array, required: true },
  formInitialData: { type: Object, default: () => ({}) },
  formUpdatedData: { type: Object, required: true },
});

const emit = defineEmits(['update:formUpdatedData']);

// Gunakan computed property supaya data debug live sesuai update yang di‑emit
const formData = computed(() => props.formUpdatedData);

/* Calendar Get */
const getCalendarValue = (field, type) => {
  const val =
    get(props.formUpdatedData, field.key) ??
    get(props.formInitialData, field.key) ??
    null;
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
  const mergedData = cloneDeep(props.formInitialData);
  merge(mergedData, props.formUpdatedData);

  if (!val) {
    set(mergedData, key, null);
  } else {
    let d;
    if (type === 'time') {
      const [hh, mm] = val.split(':').map(Number);
      d = new Date();
      d.setHours(hh, mm, 0, 0);
    } else {
      d = new Date(val);
    }
    set(mergedData, key, d.toISOString());
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
.calendar-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

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
.native-calendar {
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
}
</style>

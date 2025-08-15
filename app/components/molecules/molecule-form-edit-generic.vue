<!-- src/components/molecules/molecules-molecule-form-edit-generic.vue -->
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
            type="checkbox"
            :checked="!!getValue(field)"
            @change="updateValue(field.key, $event.target.checked)"
          />
          {{ field.label }}
        </label>
      </template>

      <!-- DATE / TIME / MONTH / DATETIME -->
      <template v-else-if="['date', 'month', 'time', 'datetime'].includes(field.type)">
        <atoms-atom-base-label :bold="true">{{ field.label }}</atoms-atom-base-label>
        <atoms-atom-base-calendar-native
          class="mb-5"
          :type="field.type"
          :model-value="getValue(field)"
          :min="field.min || null"
          :max="field.max || null"
          :use-now="field.useNow || false"
          :clearable="field.clearable ?? true"
          @update:modelValue="updateValue(field.key, $event, field.type)"
        />
      </template>

      <!-- DROPDOWN GENERIC -->
      <template v-else-if="field.type === 'select'">
        <atoms-atom-base-label :bold="true">{{ field.label }}</atoms-atom-base-label>
        <atoms-atom-base-select
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
        <div class="array-field">
          <!-- Tampilkan elemen array -->
          <div v-for="(item, idx) in getValue(field)" :key="idx" class="d-flex flex-row">
            <atoms-atom-base-input
              class="mr-3"
              :model-value="item"
              :placeholder="`Item ${idx + 1}`"
              @update:modelValue="updateArrayItem(field.key, idx, $event)"
            />
            <v-btn color="red" variant="tonal" @click="removeArrayItem(field.key, idx)">Remove</v-btn>
          </div>
          <!-- Tombol untuk menambah elemen baru -->
          <button class="add-btn" @click="addArrayItem(field.key)">Add</button>
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

/* Helper: Konversi UTC (ISO string) ke format lokal sesuai tipe */
function utcToLocal(utcVal, type) {
  if (!utcVal) return '';
  const date = new Date(utcVal);
  if (isNaN(date)) return utcVal;
  const tzOffset = date.getTimezoneOffset() * 60000;
  const localDate = new Date(date.getTime() - tzOffset);
  if (type === 'datetime') {
    return localDate.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"
  } else if (type === 'date') {
    return localDate.toISOString().slice(0, 10); // "YYYY-MM-DD"
  } else if (type === 'time') {
    return localDate.toISOString().slice(11, 16); // "HH:MM"
  } else if (type === 'month') {
    return localDate.toISOString().slice(0, 7); // "YYYY-MM"
  }
  return utcVal;
}

/* Helper: Konversi nilai lokal ke UTC ISO string sesuai tipe */
function localToUtcIso(localStr, type) {
  if (!localStr) return '';
  if (type === 'datetime') {
    const [datePart, timePart] = localStr.split('T');
    const [y, m, d] = datePart.split('-').map(Number);
    const [hh, mm] = timePart.split(':').map(Number);
    const date = new Date(y, m - 1, d, hh, mm);
    return date.toISOString();
  } else if (type === 'date') {
    const [y, m, d] = localStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.toISOString();
  } else if (type === 'time') {
    const [hh, mm] = localStr.split(':').map(Number);
    const now = new Date();
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hh, mm);
    return date.toISOString();
  } else if (type === 'month') {
    const [y, m] = localStr.split('-').map(Number);
    const date = new Date(y, m - 1, 1);
    return date.toISOString();
  }
  return localStr;
}

/* Fungsi getValue: Ambil nilai dari form data */
const getValue = (field) => {
  let value =
    get(props.formUpdatedData, field.key) ??
    get(props.formInitialData, field.key) ??
    (field.type === 'array' ? [] : '');
  if (['datetime', 'date', 'time', 'month'].includes(field.type) && value && typeof value === 'string') {
    return utcToLocal(value, field.type);
  }
  return value;
};

/* Fungsi updateValue: Update form data */
const updateValue = (key, value, type = null) => {
  const mergedData = cloneDeep(props.formInitialData);
  merge(mergedData, props.formUpdatedData);
  if (value && typeof value === 'string' && type && ['datetime', 'date', 'time', 'month'].includes(type)) {
    set(mergedData, key, localToUtcIso(value, type));
  } else {
    set(mergedData, key, value);
  }
  emit('update:formUpdatedData', mergedData);
};

/* Fungsi untuk sanitasi angka */
function sanitizeNumber(field, val) {
  if (val === '' || val === null) return '';
  let num = Number(val);
  if (field.allowNegative === false && num < 0) num = Math.abs(num);
  if (field.min !== undefined && num < field.min) num = field.min;
  if (field.max !== undefined && num > field.max) num = field.max;
  return num;
}

/* Fungsi untuk menangani array: Update item di index tertentu */
const updateArrayItem = (key, index, value) => {
  const mergedData = cloneDeep(props.formInitialData);
  merge(mergedData, props.formUpdatedData);
  const array = get(mergedData, key, []).slice(); // Ambil salinan array
  array[index] = value; // Update item
  set(mergedData, key, array);
  emit('update:formUpdatedData', mergedData);
};

/* Fungsi untuk menambahkan item baru ke array */
const addArrayItem = (key) => {
  const mergedData = cloneDeep(props.formInitialData);
  merge(mergedData, props.formUpdatedData);
  const array = get(mergedData, key, []).slice();
  array.push(''); // Tambah item baru (kosong)
  set(mergedData, key, array);
  emit('update:formUpdatedData', mergedData);
};

/* Fungsi untuk menghapus item dari array */
const removeArrayItem = (key, index) => {
  const mergedData = cloneDeep(props.formInitialData);
  merge(mergedData, props.formUpdatedData);
  const array = get(mergedData, key, []).slice();
  array.splice(index, 1); // Hapus item di index
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
.remove-btn {
  background-color: #ff4d4f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.add-btn {
  background-color: #1890ff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}
</style>
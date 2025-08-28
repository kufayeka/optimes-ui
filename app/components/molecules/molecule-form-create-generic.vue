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
        @update:modelValue="val => updateValue(field.key, sanitizeNumber(field, val))"
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

      <!-- DATE/TIME -->
      <atoms-atom-base-calendar-native
        v-else-if="['date', 'datetime', 'time', 'month'].includes(field.type)"
        :id="field.key"
        :type="field.type"
        :disabled="field.disabled"
        :model-value="getValue(field)"
        :min="field.min || null"
        :max="field.max || null"
        :use-now="field.useNow || false"
        :clearable="field.clearable ?? true"
        @update:modelValue="val => updateValue(field.key, val, field.type)"
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
import { get, set, cloneDeep, merge } from 'lodash-es';

const props = defineProps({
  debug: { type: Boolean, default: false },
  formTemplate: { type: Array, required: true },
  initialData: { type: Object, default: () => ({}) }
});

const emit = defineEmits(['update:formData']);

const formData = reactive(cloneDeep(props.initialData));

function utcToLocal(utcVal, type) {
  if (!utcVal) return '';
  const date = new Date(utcVal);
  if (isNaN(date)) return utcVal;

  if (type === 'datetime') {
    return date.toISOString().slice(0, 16);
  } else if (type === 'date') {
    return date.toISOString().slice(0, 10);
  } else if (type === 'time') {
    // ambil jam & menit lokal aja
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  } else if (type === 'month') {
    return date.toISOString().slice(0, 7);
  }
  return utcVal;
}

function localToUtcIso(localStr, type) {
  if (!localStr) return '';

  if (type === 'datetime') {
    const [datePart, timePart] = localStr.split('T');
    const [y, m, d] = datePart.split('-').map(Number);
    const [hh, mm] = timePart.split(':').map(Number);
    return new Date(y, m - 1, d, hh, mm).toISOString();
  } else if (type === 'date') {
    const [y, m, d] = localStr.split('-').map(Number);
    return new Date(y, m - 1, d).toISOString();
  } else if (type === 'time') {
    // biarin jadi "HH:MM" aja, jangan iso
    return localStr;
  } else if (type === 'month') {
    const [y, m] = localStr.split('-').map(Number);
    return new Date(y, m - 1, 1).toISOString();
  }
  return localStr;
}


/* Fungsi getValue untuk mendapatkan nilai dari formData dan mengkonversi UTC ke lokal jika perlu */
const getValue = (field) => {
  const val = get(formData, field.key, '');
  if (['datetime','date','time','month'].includes(field.type) && val) {
    return utcToLocal(val, field.type);
  }
  return val;
};

/* Fungsi updateValue menerima parameter tambahan type untuk field tanggal */
const updateValue = (key, value, type = null) => {
  if (value && typeof value === 'string' && type && ['datetime','date','time','month'].includes(type)) {
    set(formData, key, localToUtcIso(value, type));
  } else {
    set(formData, key, value);
  }
  emit('update:formData', cloneDeep(formData));
};

/* Fungsi untuk sanitasi angka, jika diperlukan */
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

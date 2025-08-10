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
        <atoms-atom-base-label :bold="true">{{ field.label }} (min: {{ field.min }}, max: {{ field.max }})</atoms-atom-base-label>
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
          @update:modelValue="updateValue(field.key, $event)"
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

    </div>
  </div>
</template>

<script setup>
import { get, set, cloneDeep, merge } from 'lodash-es';

const props = defineProps({
  formTemplate: { type: Array, required: true },
  formInitialData: { type: Object, default: () => ({}) },
  formUpdatedData: { type: Object, required: true }
});

const emit = defineEmits(['update:formUpdatedData']);

function toDatetimeLocal(val) {
  if (!val) return '';
  const date = new Date(val);
  if (isNaN(date)) return val;
  const tzOffset = date.getTimezoneOffset() * 60000;
  return new Date(date - tzOffset).toISOString().slice(0, 16);
}

const getValue = (field) => {
  let value =
    get(props.formUpdatedData, field.key) ??
    get(props.formInitialData, field.key) ??
    '';

  if (field.type === 'datetime' && field.isISOString) {
    return toDatetimeLocal(value);
  }

  return value;
};

const updateValue = (key, value) => {
  const mergedData = cloneDeep(props.formInitialData);
  merge(mergedData, props.formUpdatedData);
  set(mergedData, key, value);
  emit('update:formUpdatedData', mergedData);
};

function sanitizeNumber(field, val) {
  if (val === '' || val === null) return '';
  let num = Number(val);
  if (!field.allowNegative && num < 0) num = Math.abs(num);
  if (field.min !== undefined && num < field.min) num = field.min;
  if (field.max !== undefined && num > field.max) num = field.max;
  return num;
}
</script>

<style scoped>
.form-edit-generic {
  display: flex;
  flex-direction: column;
}
.checkbox-field {
  display: flex;
  align-items: center;
  gap: 5px;
}
</style>

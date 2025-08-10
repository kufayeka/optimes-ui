<template>
  <div class="create-form">
    <div v-for="(field, i) in formTemplate" :key="i" class="form-field-wrapper">
      <atoms-atom-base-label :bold="true" :for="field.key">{{ field.label }}</atoms-atom-base-label>

      <!-- TEXT -->
      <atoms-atom-base-input
        v-if="field.type === 'text'"
        :id="field.key"
        :placeholder="field.placeholder || ''"
        :model-value="getValue(field)"
        @update:modelValue="val => updateValue(field.key, val)"
      />

      <!-- TEXTAREA -->
      <atoms-atom-base-textarea
        v-else-if="field.type === 'textarea'"
        :id="field.key"
        :rows="field.rows || 4"
        :placeholder="field.placeholder || ''"
        :model-value="getValue(field)"
        @update:modelValue="val => updateValue(field.key, val)"
      />

      <!-- NUMBER -->
      <atoms-atom-base-input
        v-else-if="field.type === 'number'"
        :id="field.key"
        type="number"
        :min="field.min !== undefined ? field.min : null"
        :max="field.max !== undefined ? field.max : null"
        :model-value="getValue(field)"
        @update:modelValue="val => updateValue(field.key, sanitizeNumber(field, val))"
      />

      <!-- SELECT -->
      <atoms-atom-base-select
        v-else-if="field.type === 'select'"
        :id="field.key"
        :model-value="getValue(field)"
        :items="field.items"
        :item-title="field.itemTitle"
        :item-value="field.itemValue"
        @update:modelValue="val => updateValue(field.key, val)"
      />

      <!-- DATE/TIME -->
      <atoms-atom-base-calendar-native
        v-else-if="['date', 'datetime', 'time', 'month'].includes(field.type)"
        :id="field.key"
        :type="field.type"
        :model-value="getValue(field)"
        :min="field.min || null"
        :max="field.max || null"
        :use-now="field.useNow || false"
        :clearable="field.clearable ?? true"
        @update:modelValue="val => updateValue(field.key, val)"
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
          :id="field.key"
          :checked="!!getValue(field)"
          @change="e => updateValue(field.key, e.target.checked)"
        />
        {{ field.label }}
      </label>
    </div>

    <pre>Current Data: {{ formData }}</pre>
  </div>
</template>

<script setup>
import { reactive, toRefs } from 'vue';
import { get, set, cloneDeep } from 'lodash-es';

const props = defineProps({
  formTemplate: { type: Array, required: true },
  initialData: { type: Object, default: () => ({}) }
});

const emit = defineEmits(['update:formData']);

const formData = reactive(cloneDeep(props.initialData));

const getValue = (field) => {
  return get(formData, field.key, '');
};

const updateValue = (key, value) => {
  set(formData, key, value);
  emit('update:formData', cloneDeep(formData));
};

const sanitizeNumber = (field, val) => {
  if (val === '' || val === null) return '';
  let num = Number(val);
  if (!field.allowNegative && num < 0) num = Math.abs(num);
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

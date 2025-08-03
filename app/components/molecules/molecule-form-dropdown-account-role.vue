<!-- src/components/molecules/MoleculesFormFieldApiDropdown.vue -->
<template>
  <div class="form-field-api-dropdown">
    <atoms-atom-base-select
      v-model="selectedData"
      :items="apiData"
      item-title="value.title"
      item-value="id"
      :label="label"
      :rules="rules"
      @update:modelValue="$emit('update:modelValue', $event)"
    />

    <atoms-atom-base-alert
      v-if="error"
      type="error"
      text="Failed to load dropdown data"
      :closable="true"
      @click:close="error = false"
    />
  </div>
</template>

<script setup lang="js">
import { ref, onMounted, watch } from 'vue';
import { getAllAccountRoleReferences } from '~/services/data-reference/service-data-reference';

// State
const isLoading = ref(false);
const error = ref(false);
const apiData = ref([]);
const selectedData = ref(null);

// Generate unique ID for accessibility
const inputId = `api-dropdown-${Math.random().toString(36).substr(2, 9)}`;

// Props
const props = defineProps({
  modelValue: {
    type: [String, Number, Object],
    default: null,
  },
  label: {
    type: String,
    default: 'Select Role',
  },
  placeholder: {
    type: String,
    default: '',
  },
  rules: {
    type: Array,
    default: () => [],
  },
  bold: {
    type: Boolean,
    default: false,
  },
  prependIcon: {
    type: String,
    default: 'mdi-menu-down',
  },
});

// Emits
const emit = defineEmits(['update:modelValue']);

// Fetch data from API
const fetchData = async () => {
  isLoading.value = true;
  error.value = false;
  try {
    const response = await getAllAccountRoleReferences();
    console.log(response);
    if (response.success) {
      apiData.value = response.data;
      // Set the first item as default if no modelValue is provided
      if (apiData.value.length > 0 && !props.modelValue && selectedData.value === null) {
        selectedData.value = apiData.value[0].id;
        emit('update:modelValue', selectedData.value);
      }
    } else {
      error.value = true;
    }
  } catch (err) {
    console.error(err);
    error.value = true;
  } finally {
    isLoading.value = false;
  }
};

// Sync modelValue with selectedData
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== selectedData.value) {
      selectedData.value = newValue;
    }
  }
);

// Emit changes to selectedData
watch(selectedData, (newValue) => {
  emit('update:modelValue', newValue);
});

// Fetch data on component mount
onMounted(fetchData);
</script>

<style scoped>
.form-field-api-dropdown {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}
</style>
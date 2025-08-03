<template>
  <div>
    <v-text-field
      v-if="type === 'date' || type === 'datetime' || type === 'month'"
      :label="label"
      :model-value="displayValue"
      @click="dialog = true"
      readonly
      :placeholder="placeholder"
      :prepend-icon="icon"
      :clearable="clearable"
      @click:clear="clear"
    />
    <v-text-field
      v-if="type === 'time'"
      :label="label"
      :model-value="displayValue"
      @click="dialog = true"
      readonly
      :placeholder="placeholder"
      :prepend-icon="icon"
      :clearable="clearable"
      @click:clear="clear"
    />

    <v-dialog v-model="dialog" max-width="400">
      <template v-slot:default>
        <v-card>
          <v-card-text>
            <v-date-picker
              v-if="type === 'date'"
              v-model="internalValue"
              @update:model-value="onSelect"
              :max="max"
              :min="min"
              :show-current="true"
            />
            <v-date-picker
              v-if="type === 'month'"
              v-model="internalValue"
              @update:model-value="onSelect"
              :max="max"
              :min="min"
              :type="'month'"
              :show-current="true"
            />
            <div v-if="type === 'datetime'">
              <v-date-picker
                v-model="datePart"
                @update:model-value="onDatePart"
                :max="max"
                :min="min"
                :show-current="true"
              />
              <v-time-picker
                v-model="timePart"
                @update:model-value="onTimePart"
                format="24hr"
              />
            </div>
            <v-time-picker
              v-if="type === 'time'"
              v-model="internalValue"
              @update:model-value="onSelect"
              format="24hr"
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn text @click="dialog = false">Cancel</v-btn>
            <v-btn color="primary" text @click="confirm">OK</v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </div>
</template>

<script setup lang="js">
import { ref, computed, watch } from 'vue';

const props = defineProps({
  modelValue: { type: [String, Date], default: null },
  type: { type: String, default: 'date' }, // 'date', 'datetime', 'time', 'month'
  label: { type: String, default: 'Select Date' },
  placeholder: { type: String, default: '' },
  icon: { type: String, default: 'mdi-calendar' },
  clearable: { type: Boolean, default: true },
  min: { type: String, default: null },
  max: { type: String, default: null },
});

const emit = defineEmits(['update:modelValue']);

const dialog = ref(false);
const internalValue = ref(props.modelValue);
const datePart = ref(props.modelValue ? props.modelValue.split('T')[0] : null);
const timePart = ref(props.modelValue ? props.modelValue.split('T')[1]?.slice(0,5) : null);

watch(() => props.modelValue, (val) => {
  internalValue.value = val;
  if (props.type === 'datetime' && val) {
    datePart.value = val.split('T')[0];
    timePart.value = val.split('T')[1]?.slice(0,5);
  }
});

const displayValue = computed(() => {
  if (!props.modelValue) return '';
  if (props.type === 'date') return props.modelValue;
  if (props.type === 'month') return props.modelValue?.slice(0,7);
  if (props.type === 'time') return props.modelValue;
  if (props.type === 'datetime') return props.modelValue.replace('T', ' ');
  return props.modelValue;
});

function onSelect(val) {
  internalValue.value = val;
}

function onDatePart(val) {
  datePart.value = val;
}

function onTimePart(val) {
  timePart.value = val;
}

function confirm() {
  if (props.type === 'datetime') {
    if (datePart.value && timePart.value) {
      emit('update:modelValue', `${datePart.value}T${timePart.value}`);
    }
  } else {
    emit('update:modelValue', internalValue.value);
  }
  dialog.value = false;
}

function clear() {
  emit('update:modelValue', null);
  internalValue.value = null;
  datePart.value = null;
  timePart.value = null;
}
</script>
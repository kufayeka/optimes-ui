<!-- src/components/atoms/AtomBaseTextarea.vue -->
<template>
  <textarea
    class="base-textarea"
    :style="{ width: width, textAlign: align }"
    :placeholder="placeholder"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    :rows="rows"
  />
</template>

<script setup lang="js">
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  width: {
    type: String,
    default: '100%',
  },
  align: {
    type: String,
    default: 'left', // 'left', 'center', 'right'
  },
  placeholder: {
    type: String,
    default: '',
  },
  rows: {
    type: Number,
    default: 4,
  },
});
defineEmits(['update:modelValue']);
</script>

<style scoped>
.base-textarea {
  font-size: 1rem;
  line-height: 1.5;
  color: var(--v-theme-on-surface, #222);
  padding: 8px;
  resize: vertical;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  background-color: var(--v-theme-surface, #fff);
}
</style>

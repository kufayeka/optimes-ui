<!-- molecule-display-row-text.vue -->
<template>
  <div class="display-row">
    <span class="title">{{ title }}</span>
    <span class="separator">:</span>
    <span class="value">{{ formattedValue }}</span>
  </div>
</template>

<script setup lang="js">
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number, Boolean, Object, Array],
    default: null
  }
})

const formattedValue = computed(() => {
  if (props.value === null || props.value === undefined) {
    return '-'
  }
  
  if (typeof props.value === 'object') {
    return JSON.stringify(props.value, null, 2)
  }
  
  if (typeof props.value === 'boolean') {
    return props.value ? 'Yes' : 'No'
  }
  
  return String(props.value)
})
</script>

<style scoped>
.display-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.title {
  font-weight: 500;
  color: #666;
  min-width: fit-content;
}

.separator {
  color: #999;
}

.value {
  color: #333;
  flex: 1;
  word-break: break-word;
}

/* For JSON objects */
.value {
  white-space: pre-wrap;
  font-family: monospace;
}
</style>
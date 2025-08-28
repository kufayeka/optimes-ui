<!-- molecule-display-column-text.vue -->
<template>
  <div class="display-column">
    <div class="title">{{ title }}</div>
    <div class="value">
      <slot v-if="$slots.default" />
      <span v-else>{{ formattedValue }}</span>
    </div>
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
.display-column {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;
}

.title {
  font-weight: 500;
  color: #8c8b8b;
}

.value {
  color: #333;
  word-break: break-word;
  padding: 5px 12px;
  background-color: #EEEEEE;
  border-radius: 5px;
  border: 1px solid #78909C;
}

/* For JSON objects */
.value {
  white-space: pre-wrap;
}
</style>

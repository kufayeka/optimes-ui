<!-- src/components/atoms/AtomBaseAlert.vue -->
<template>
  <v-alert
    :type="type"
    :title="title"
    :text="text"
    :closable="closable"
    :color="color"
    :icon="icon"
    :variant="variant"
    class="base-alert"
    :class="sizeClass"
  >
    <slot></slot>
  </v-alert>
</template>

<script setup lang="js">
const props = defineProps({
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'info', 'warning', 'error'].includes(value),
  },
  title: {
    type: String,
    default: '',
  },
  text: {
    type: String,
    default: '',
  },
  closable: {
    type: Boolean,
    default: false,
  },
  color: {
    type: String,
    default: null,
  },
  icon: {
    type: String,
    default: null,
  },
  variant: {
    type: String,
    default: 'tonal',
    validator: (value) => ['elevated', 'flat', 'tonal', 'outlined', 'text'].includes(value),
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value),
  },
});

const sizeClass = computed(() => {
  return {
    'alert-sm': props.size === 'sm',
    'alert-md': props.size === 'md',
    'alert-lg': props.size === 'lg',
  };
});
</script>

<style scoped>
.base-alert {
  margin-bottom: 16px;
}
.alert-sm {
  font-size: 0.8rem;
  padding: 4px 8px;
}
.alert-md {
  font-size: 1rem;
  padding: 8px 16px;
}
.alert-lg {
  font-size: 1.2rem;
  padding: 16px 24px;
}
</style>
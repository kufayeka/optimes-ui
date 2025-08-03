<template>
  <v-btn
    :color="variant === 'primary' ? 'primary' : variant === 'secondary' ? 'secondary' : 'default'"
    :size="size"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot></slot>
  </v-btn>
</template>

<script setup lang="js">
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'default'].includes(value),
  },
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['x-small', 'small', 'default', 'large', 'x-large'].includes(value),
  },
  disabled: { type: Boolean, default: false },
});
defineEmits(['click']);
</script>
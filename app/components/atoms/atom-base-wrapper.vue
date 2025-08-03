<template>
  <div
    class="base-wrapper"
    :style="wrapperStyle"
  >
    <slot />
  </div>
</template>

<script setup lang="js">
const props = defineProps({
  width: { type: String, default: '100%' },   // contoh: '400px', '100%', '50vw'
  height: { type: String, default: 'auto' },  // contoh: '300px', '100%', '60vh'
  maxWidth: { type: String, default: null },  // opsional
  maxHeight: { type: String, default: null }, // opsional
});

const wrapperStyle = {
  width: props.width,
  height: props.height,
  maxWidth: props.maxWidth,
  maxHeight: props.maxHeight,
  overflow: 'auto',
  boxSizing: 'border-box',
};
</script>

<style scoped>
.base-wrapper {
  /* Tambahan agar scroll smooth dan padding default */
  padding: 8px;
  background: transparent;
}
</style>
<template>
  <div
    class="base-text-content"
    :style="{
      width: width,
      textAlign: align,
      wordBreak: 'break-word',
      whiteSpace: 'pre-line'
    }"
  >
    <slot />
  </div>
</template>

<script setup lang="js">
const props = defineProps({
  width: { type: String, default: '100%' }, // contoh: '100%', '400px'
  align: { type: String, default: 'left' }, // 'left', 'center', 'right'
});
</script>

<style scoped>
.base-text-content {
  font-size: 1rem;
  line-height: 1.5;
  color: var(--v-theme-on-surface, #222);
  overflow-wrap: anywhere;
  /* Agar wrap di parent yang overflow/scroll */
  box-sizing: border-box;
}
</style>
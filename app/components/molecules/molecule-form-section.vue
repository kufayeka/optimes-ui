<!-- src/components/molecules/MoleculesFormSection.vue -->
<template>
  <atoms-atom-base-card :elevation="elevation" :outlined="outlined" class="form-section">
    <div class="d-flex flex-row justify-space-between">
      <atoms-atom-base-label-lg :bold="true">{{ title }}</atoms-atom-base-label-lg>
      <slot name="endSection"></slot>
    </div>
    <atoms-atom-base-divider :thickness="dividerThickness" />
    <slot></slot>
  </atoms-atom-base-card>
</template>

<script setup lang="js">


defineProps({
  title: {
    type: String,
    default: '',
  },
  elevation: {
    type: [Number, String],
    default: 2,
  },
  outlined: {
    type: Boolean,
    default: false,
  },
  dividerThickness: {
    type: [Number, String],
    default: 1,
  },
});
</script>

<style scoped>
.form-section {
  margin-bottom: 16px;
}
.form-section :deep(.base-label) {
  margin-bottom: 8px;
}
.form-section :deep(.v-divider) {
  margin: 8px 0;
}
</style>
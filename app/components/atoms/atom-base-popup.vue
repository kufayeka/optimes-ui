<template>
  <v-dialog :model-value="open" :max-width="maxWidth" @update:model-value="emitClose">
    <template v-slot:default>
      <slot></slot>
    </template>
  </v-dialog>
</template>

<script setup lang="js">
import { watch, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  open: { type: Boolean, required: true },
  autoClose: { type: Boolean, default: false },
  duration: { type: Number, default: 3000 },
  maxWidth: { type: [String, Number], default: 500 }
});

const emit = defineEmits(['close']);

let timer = null;

const emitClose = (val) => {
  if (!val) emit('close');
};

watch(
  () => props.open,
  (val) => {
    if (val && props.autoClose) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        emit('close');
      }, props.duration);
    } else {
      clearTimeout(timer);
    }
  }
);

onBeforeUnmount(() => {
  clearTimeout(timer);
});
</script>
<template>
  <!-- Teleport hanya aktif jika prop active true -->
  <teleport v-if="active" to="#loadedContextDataPlace">
    <div class="d-flex flex-row w-100">
        <organisms-organism-popup-display-selected-entity/>
        <organisms-organism-popup-display-loaded-schedule/>
    </div>
  </teleport>
</template>

<script setup lang="js">
import { ref, onMounted } from 'vue';

const props = defineProps({
  active: { type: Boolean, default: false }
});


onMounted(() => {

});
</script>

<style scoped>
.full-bold-btn {
  height: 50px;
  font-weight: bold;
  font-size: 1rem;
  padding-top: 16px;
  padding-bottom: 16px;
}
</style>

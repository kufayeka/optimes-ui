<template>
  <teleport v-if="active" to="#eventMacroPlace">
    <molecules-molecule-form-section :title="'Event Macro (Downtime)'">
      <div class="d-flex flex-row w-100">
        <v-btn
          class="mx-5 full-bold-btn"
          v-for="item in macroEventDowntimeReferences"
          :key="item.id"
          :color="item.value.color"
          :value="item.id"
          variant="elevated"
          @click="handleCreateProcessEvent(item)"
        >
          {{ item.value.title }}
        </v-btn>
      </div>
      <molecules-molecule-form-dropdown-downtime-severity/>
    </molecules-molecule-form-section>
  </teleport>
</template>

<script setup>
import { ref } from 'vue';
import { getAllMacroEventDowntimeReferences } from '~/services/data-reference/service-data-reference';
import { createProcessEvent } from '~/services/events/service-events';

const props = defineProps({
  active: { type: Boolean, default: false }
});

const macroEventDowntimeReferences = ref([]);
const errorMessage = ref(null);
const successMessage = ref(null);

const handleGetMacroEventDowntimeReferences = async () => {
  try {
    const response = await getAllMacroEventDowntimeReferences();
    macroEventDowntimeReferences.value = Array.isArray(response.data) ? response.data : [];
  } catch (err) {
    console.error('Error handleGetMacroEventDowntimeReferences:', err);
  }
};

const handleCreateProcessEvent = async (macro) => {
  try {
    await createProcessEvent({
      event_type: macro.id,
      scrap_flag: false,
      supplementary_flag: false,
      notes: '',
    });
    successMessage.value = `${macro.value.title} Process Event Created.`;
  } catch (err) {
    errorMessage.value = true;
    console.error('Error handleCreateProcessEvent:', err);
  }
};

onMounted(() => {
  handleGetMacroEventDowntimeReferences();
});
</script>

<style scoped>
</style>
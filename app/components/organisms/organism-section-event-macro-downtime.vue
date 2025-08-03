<template>
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

    <molecules-molecule-popup-error
        :autoClose="false"
        :open="errorMessage"
        :title="'Error'"
        @close="errorMessage = false"
        maxWidth="400"
    >
        <atoms-atom-base-wrapper width="400px" height="50px" maxWidth="100%" maxHeight="50px">
            <atoms-atom-base-label>{{ errorMessage }}</atoms-atom-base-label>
        </atoms-atom-base-wrapper>
    </molecules-molecule-popup-error>

    <molecules-molecule-popup-success
          :open="successMessage"
          :title="'Success'"
          @close="successMessage = false"
          maxWidth="400"
    >
        <atoms-atom-base-wrapper width="400px" height="50px" maxWidth="100%" maxHeight="50px">
            <atoms-atom-base-label>{{ successMessage }}</atoms-atom-base-label>
        </atoms-atom-base-wrapper>
    </molecules-molecule-popup-success>

</template>

<script setup lang="js">
import { ref, onMounted } from 'vue';
import { getAllMacroEventDowntimeReferences } from '~/services/data-reference/service-data-reference';
import { createProcessEvent } from '~/services/events/service-events';

const errorMessage = ref(null);
const successMessage = ref(null);

const macroEventDowntimeReferences = ref([]);

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
    const response = await createProcessEvent({
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
.full-bold-btn {
  height: 50px;
  font-weight: bold;
  font-size: 1rem;
  padding-top: 16px;
  padding-bottom: 16px;
}
</style>
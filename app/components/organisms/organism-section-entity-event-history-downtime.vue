<template>
    <molecules-molecule-form-section :title="'Event History'">
      <template #endSection>
        <v-btn variant="outlined" color="primary" @click="handleGetAllEventHistoryProcess">Refresh</v-btn>
      </template>
      <molecules-molecule-table-event-history-process 
        :eventHistoryData="eventHistoryProcess"
        @endEvent="handleEndProcessEvent"
        @editEvent="handleOpenEditEventPopUp"
        @applyEvent="handleApplyProcessEvent"
      />
    </molecules-molecule-form-section>

    <molecules-molecule-popup-edit
      :title="'Edit Event'"
      :open="popupOpenEditEvent"
      @close="popupOpenEditEvent = false"
      maxWidth="700px">
          <molecules-molecule-popup-content-base>
            <template #content>
              <atoms-atom-base-wrapper width="700px" max-width="100%" max-height="400px">
                <molecules-molecule-data-edit-event-process 
                  :initialData="selectedEventData" 
                  @update="updatedEventData = $event"
                />
              </atoms-atom-base-wrapper>
            </template>
            <template #actions>
                <molecules-molecule-group-button-save-discard 
                    @save="handleProcessEventUpdate" 
                    @discard="popupOpenEditEvent = false"
                />
            </template>
      </molecules-molecule-popup-content-base>       
    </molecules-molecule-popup-edit>
    
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
import { getAllEntityProcessEventHistory, endProcessEvent, updateProcessEvent, applyProcessEvent} from '~/services/events/service-events';

const popupOpenEditEvent = ref(false);
const errorMessage = ref(null);
const successMessage = ref(null);

const eventHistoryProcess = ref([]);
const selectedEventData = ref(null);
const updatedEventData = ref(null);

const handleGetAllEventHistoryProcess = async () => {
  try {
    const response = await getAllEntityProcessEventHistory();
    eventHistoryProcess.value = Array.isArray(response.data) ? response.data : [];
  } catch (err) {
    console.error('Error handleGetAllEventHistoryProcess:', err);
  }
};


function handleOpenEditEventPopUp(eventData) {
  popupOpenEditEvent.value = true
  selectedEventData.value = eventData;
  updatedEventData.value = eventData;
};


const handleEndProcessEvent = async (eventData) => {
  try {
    const response = await endProcessEvent({
      event_id: eventData.id
    });

    if(response.success){
      successMessage.value = response.data;
    } else {
      errorMessage.value = response.data;
    }
  } catch (err) {
    console.error('Error handleEndProcessEvent:', err);
  }
};

const handleProcessEventUpdate = async () => {
  try {
    console.log('update', updatedEventData.value)
    const response = await updateProcessEvent(updatedEventData.value);

    if(response.success){
      successMessage.value = response.data;
    } else {
      errorMessage.value = response.data;
    }
  } catch (err) {
    console.error('Error handleProcessEventUpdate:', err);
  }
};

const handleApplyProcessEvent = async (eventData) => {
  try {
    const response = await applyProcessEvent({
      event_id: eventData.id
    });

    if(response.success){
      successMessage.value = response.data;
    } else {
      errorMessage.value = response.data;
    }
  } catch (err) {
    console.error('Error handleApplyProcessEvent:', err);
  }
};


 
onMounted(() => {
  handleGetAllEventHistoryProcess();
});
</script>
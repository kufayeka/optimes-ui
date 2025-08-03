<template>
    <molecules-molecule-popup-information
        :title="'Loaded Schedule'"
        :open="popupOpen"
        @close="popupOpen = false"
        maxWidth="700"
    >
        <molecules-molecule-popup-content-base>
            <template #content>
                <atoms-atom-base-wrapper max-width="100%" max-height="400px">
                    <molecules-molecule-data-display-schedule :schedule-data="loadedSchedule"/>
                </atoms-atom-base-wrapper>
            </template>
            <template #actions>
                <v-btn variant="outlined" color="warning" @click="popupUnloadScheduleConfirmation = true">Unload</v-btn>
            </template>
        </molecules-molecule-popup-content-base>
    </molecules-molecule-popup-information>
    
    <molecules-molecule-popup-confirmation
        :title="'Unload Schedule Confirmation'"
        :open="popupUnloadScheduleConfirmation" 
        @close="popupUnloadScheduleConfirmation = false"
        maxWidth="500">
        <molecules-molecule-popup-content-base>
            <template #content>
                <atoms-atom-base-label>Are you sure you want to unload this schedule?</atoms-atom-base-label>
            </template>
            <template #actions>
                <molecules-molecule-group-button-yes-no @yes="handleUnloadSchedule()" @no="popupUnloadScheduleConfirmation = false"/>
            </template>
        </molecules-molecule-popup-content-base>
    </molecules-molecule-popup-confirmation>

    <v-btn 
        class="mr-2" 
        prepend-icon="mdi-note-text" 
        variant="outlined" 
        @click="popupOpen = true"
        :disabled="!loadedSchedule"
    >
        Schedule ({{ loadedScheduleId }})
    </v-btn>
</template>

<script setup lang="js">
import { ref, computed, onMounted } from 'vue';
import { unloadSchedule, viewSchedule } from '~/services/schedules/service-schedule';

const popupOpen = ref(false);
const popupUnloadScheduleConfirmation = ref(false);
const loadedSchedule = ref(null);

const loadedScheduleId = computed(() => {
    if (loadedSchedule.value && loadedSchedule.value.id) {
        const id = loadedSchedule.value.id.trim();
        return id.length > 10 ? id.slice(0, 10) + '…' : id;
    } else {
        return 'Unloaded';
    }
});


const handleViewSchedule = async () => {
    try {
        const response = await viewSchedule();
        if (response && response.length > 0) {
            loadedSchedule.value = response[0];
        } else {
            loadedSchedule.value = null;
        }
    } catch (err) {
        console.error('Error handleViewSchedule:', err);
        loadedSchedule.value = null;
    }
};

const handleUnloadSchedule = async () => {
    try {
        const response = await unloadSchedule();
        
        loadedSchedule.value = null;
        popupOpen.value = false;
        popupUnloadScheduleConfirmation.value = false;
    } catch (err) {
        console.error('Error handleUnloadSchedule:', err);
        loadedSchedule.value = null;
        popupUnloadScheduleConfirmation.value = false;
    }
};

onMounted(() => {
    handleViewSchedule();
});
</script>
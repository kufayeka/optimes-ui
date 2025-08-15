<template>
    <molecules-molecule-chart-gantt-entity-schedule @selected-task="handleTaskClick"/>

    <molecules-molecule-popup-information 
        :title="'Schedule View'" 
        :open="popupViewScheduleOpen" 
        @close="popupViewScheduleOpen = false"
        maxWidth="700"> 
        <molecules-molecule-popup-content-base>
            <template #content>
                <atoms-atom-base-wrapper max-width="100%" max-height="400px">
                    <molecules-molecule-data-display-schedule :schedule-data="selectedSchedule"/>
                </atoms-atom-base-wrapper>
            </template>
            <template #actions>
                <v-btn variant="outlined" color="success" @click="popupLoadSchedulConfirmationOpen = true">Load Schedule</v-btn>
            </template>
        </molecules-molecule-popup-content-base> 
    </molecules-molecule-popup-information>

    <molecules-molecule-popup-confirmation 
        :title="'Load Schedule Confirmation'"
        :open="popupLoadSchedulConfirmationOpen"  
        @close="popupLoadSchedulConfirmationOpen =  false"
        maxWidth="500">
        <molecules-molecule-popup-content-base>
            <template #content>
                <atoms-atom-base-label>Are you sure you want to load this schedule?</atoms-atom-base-label>
            </template>
            <template #actions>
                <molecules-molecule-group-button-yes-no 
                    @yes="handleLoadTask()" 
                    @no="popupLoadSchedulConfirmationOpen = false"
                />
            </template>
        </molecules-molecule-popup-content-base>
    </molecules-molecule-popup-confirmation>
</template>

<script setup lang="js">
import { ref } from 'vue';

const selectedSchedule = ref({});
const popupViewScheduleOpen = ref(false);
const popupLoadSchedulConfirmationOpen = ref(false);

const handleTaskClick = (data) => {
  popupViewScheduleOpen.value = true;
  selectedSchedule.value = data;
};

const handleLoadTask = async () => {
    try {
        const response = await apiServices.getLoadSchedule({
            params: {
                schedule_id: selectedSchedule.value.id
            }
        });

        popupViewScheduleOpen.value = false;
        popupLoadSchedulConfirmationOpen.value = false;
        
        setTimeout(()=>{
            window.location.reload();
        }, 500)
        return;
    } catch (err) {
        console.error('Error handleLoadTask:', err);
    }
};


</script>
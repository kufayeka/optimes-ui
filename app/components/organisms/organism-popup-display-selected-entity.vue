<template>
    <molecules-molecule-popup-information
        :open="popupOpen"
        @close="popupOpen = false"
        maxWidth="500"
    >
        <molecules-molecule-popup-content-base>
            <template #content>
                <molecules-molecule-data-display-entity :entity-data="entityData"/>
            </template>
            <template #actions>
            </template>
        </molecules-molecule-popup-content-base>
    </molecules-molecule-popup-information>
    
    <v-btn 
        class="mx-5 full-bold-btn"        
        v-if="entityData"
        prepend-icon="$vuetify" 
        variant="tonal"
        color="primary" 
        @click="popupOpen = !popupOpen"
    >Entity ({{ entityData.value.title }})</v-btn>
</template>

<script setup lang="js">
import { ref } from 'vue';

const popupOpen = ref(false);
const entityData = ref(null);


const getSelectedEntity = async () => {
    try {
        const response = await apiServices.getDataReferenceOne({
            params: {
                reference_category: "machine"
            }
        });

        entityData.value = response.data;

        return;

    } catch (err) {
        console.error('Error getSelectedEntity:', err);
    }
};

onMounted(() => {
    getSelectedEntity();
});

onUnmounted(() => {

});

</script>
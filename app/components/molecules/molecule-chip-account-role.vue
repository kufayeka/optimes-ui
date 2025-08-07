<template>
    <atoms-atom-base-chip v-if="accountRole">{{ accountRole.title }}</atoms-atom-base-chip>
</template>

<script setup lang="js">
import { ref } from 'vue';
import { apiServices } from '#imports';

const accountRole = ref('no-role');

const getAccountRole = async () => {
    try {
        const response = await apiServices.getDataReferenceOne({
            params: {
                reference_category: "account_role"
            }
        });

        accountRole.value = response.data.value;

        return;
    } catch (err) {
        console.error('Error getAccountRole:', err);
    }
};

onMounted(() => {
    getAccountRole();
});
</script>
<template>
    <atoms-atom-base-chip v-if="accountRole">{{ accountRole.title }}</atoms-atom-base-chip>
</template>

<script setup lang="js">
import { ref } from 'vue';
import { getOneAccountRoleReferences } from '~/services/data-reference/service-data-reference';

const accountRole = ref('no-role');

const getAccountRole = async () => {
    try {
        const response = await getOneAccountRoleReferences();

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
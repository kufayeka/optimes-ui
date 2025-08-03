<template>
    <atoms-atom-data-display-col title="Entity ID" :value="entityData.id"/>
    <atoms-atom-data-display-col title="Entity Machine" :value="entityData.value.title"/>
    <atoms-atom-data-display-col title="Entity Category">
        <atoms-atom-base-chip>{{ entityData.category }}</atoms-atom-base-chip>
    </atoms-atom-data-display-col>
    <atoms-atom-data-display-col title="Entity Description" :value="entityData.description"/>
</template>

<script setup lang="js">
defineProps({
    entityData: {
        required: true,
        type: Object
    }
})

const formatDateTime = (dateTime) => {
    if (!dateTime) return '-';
    try {
        return new Date(dateTime).toLocaleString('id-ID', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    } catch (error) {
        return dateTime;
    }
};
</script>
<template>
    <atoms-atom-data-display-col title="Schedule ID" :value="scheduleData?.id || '-'"/>
    <atoms-atom-data-display-col title="Schedule Category & Status">
        <atoms-atom-base-chip>{{ scheduleData?.schedule_category || '-' }}</atoms-atom-base-chip>
        <span>
            <atoms-atom-base-chip>{{ scheduleData?.schedule_status || '-' }}</atoms-atom-base-chip>
        </span>
    </atoms-atom-data-display-col>
    <atoms-atom-data-display-col title="Planned Start Time" :value="formatDateTime(scheduleData?.planned_start_time)"/>
    <atoms-atom-data-display-col title="Planned Finish Time" :value="formatDateTime(scheduleData?.planned_finish_time)"/>
    <atoms-atom-data-display-col title="Schedule Data" :value="scheduleData?.schedule_data"/>
    <atoms-atom-data-display-col title="Created On" :value="formatDateTime(scheduleData?.created_at)"/>
    <atoms-atom-data-display-col title="Updated On" :value="formatDateTime(scheduleData?.updated_at)"/>
</template>

<script setup lang="js">
defineProps({
    scheduleData: {
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
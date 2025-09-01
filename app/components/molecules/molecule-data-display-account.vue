<template>
    <atoms-atom-data-display-col title="Account ID" :value="accountData.id"/>
    <atoms-atom-data-display-col title="Username" :value="accountData.username"/>
    <atoms-atom-data-display-col title="Fullname" :value="accountData.fullname"/>
    <atoms-atom-data-display-col title="Role & Status">
        <molecules-molecule-chip-account-role/>
        <span>
            <atoms-atom-base-chip>{{ accountData.role }}</atoms-atom-base-chip>
            <atoms-atom-base-chip>{{ accountData.status }}</atoms-atom-base-chip>
        </span>
    </atoms-atom-data-display-col>
    <atoms-atom-data-display-col title="Last Login" :value="formatDateTime(accountData.last_login)"/>
    <atoms-atom-data-display-col title="Last Update" :value="formatDateTime(accountData.updated_on)"/>
    <atoms-atom-data-display-col title="Created On" :value="formatDateTime(accountData.created_on)"/>
</template>

<script setup lang="js">
defineProps({
    accountData: {
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
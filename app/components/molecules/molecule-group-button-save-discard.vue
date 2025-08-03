<template>
    <v-sheet class="d-flex flex-row ga-3 justify-space-evenly">
        <v-btn color="success" variant="outlined" @click="emit('save')">Save</v-btn>
        <v-btn color="warning" variant="outlined" @click="emit('discard')">Discard</v-btn>
    </v-sheet>
</template>

<script setup lang="js">

const emit = defineEmits(['save', 'discard'])


</script>
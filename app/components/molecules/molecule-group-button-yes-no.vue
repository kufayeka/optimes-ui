<template>
    <v-sheet class="d-flex flex-row ga-3 justify-space-evenly">
        <v-btn color="primary" variant="outlined" @click="emit('yes',$event)">Yes</v-btn>
        <v-btn color="red" variant="outlined" @click="emit('no',$event)">No</v-btn>
    </v-sheet>
</template>

<script setup lang="js">
import { ref } from 'vue'

const emit = defineEmits(['yes', 'no'])


</script>
<template>
    <v-sheet class="d-flex flex-column w-100">
        <v-sheet class="pa-2">
            <slot name="content"></slot>
        </v-sheet>
        <v-sheet class="pa-2">
            <atoms-atom-base-divider/>
        </v-sheet>
        <v-sheet class="d-flex flex-row ga-3 justify-space-evenly">
            <slot name="actions"></slot>
        </v-sheet>
        
        <!-- Optional: Default slot jika tidak ada named slot -->
        <v-sheet class="pa-2" v-if="$slots.default">
            <slot></slot>
        </v-sheet>
    </v-sheet>
</template>

<script setup lang="js">

</script>
<template>
    <atoms-atom-base-popup
        :open="open"
        :autoClose="autoClose"
        :duration="duration"
        :maxWidth="maxWidth"
        @close="emit('close')"
    >
        <atoms-atom-base-card>
            <v-col>
                <v-row class="ga-3 align-center justify-space-between">
                    <div class="d-flex align-center">
                        <atoms-atom-base-icon
                        icon="mdi-information"
                        size="48"
                        color="red"
                        />
                        <atoms-atom-base-label-lg class="ml-2">{{ title }}</atoms-atom-base-label-lg>
                    </div>
                    <v-btn icon="mdi-close" @click="emit('close')"></v-btn>
                </v-row>
                <v-row>
                    <atoms-atom-base-divider class="my-3"/>
                    <div :style="{ width: typeof maxWidth === 'number' ? maxWidth + 'px' : maxWidth }">
                        <slot></slot>
                    </div>
                </v-row>
            </v-col>
        </atoms-atom-base-card>
    </atoms-atom-base-popup>
</template>

<script setup lang="js">

const props = defineProps({
  open: { type: Boolean, default: false },
  autoClose: { type: Boolean, default: true },
  title: { type: String, default: 'Error' },
  duration: { type: Number, default: 2000 },
  maxWidth: { type: [String, Number], default: '100%' }
});

const emit = defineEmits(['close']);
</script>
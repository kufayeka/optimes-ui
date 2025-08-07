<template>
  <atoms-atom-data-display-col title="Event Name" :value="internalData.event_name" />

  <atoms-atom-data-display-col title="Event Type">
    <atoms-atom-base-chip :color="internalData.event_type.color">
      {{ internalData.event_type.title }}
    </atoms-atom-base-chip>
  </atoms-atom-data-display-col>

  <div class="d-flex flex-col gap-7">
    <atoms-atom-base-checkbox
      v-model="internalData.event_attributes.scrap_flag"
      bold
      label="Scrap / Waste"
    />
    <atoms-atom-base-checkbox
      v-model="internalData.event_attributes.supplementary_flag"
      bold
      label="Supplementary"
    />
  </div>

  <molecules-molecule-form-field-textarea
    label="Notes"
    bold
    v-model="internalData.event_attributes.notes"
  />
</template>

<script setup lang="js">
import { reactive, watch } from 'vue'

const props = defineProps({
  initialData: { type: Object, required: true }
})

const emit = defineEmits(['update'])

// Deep clone props.initialData agar tidak mutasi langsung
const internalData = reactive(JSON.parse(JSON.stringify(props.initialData)))

// Jika initialData berubah dari luar, sync ulang internalData
watch(
  () => props.initialData,
  (val) => {
    Object.assign(internalData, JSON.parse(JSON.stringify(val)))
  }
)

// Saat internalData berubah, emit salinan data PENUH ke parent
watch(
  internalData,
  (val) => {
    emit('update', JSON.parse(JSON.stringify(val))) // atau gunakan structuredClone(val)
  },
  { deep: true }
)
</script>

<template>
  <div>
    <div v-if="loading">Processing schedules...</div>
    <div v-else-if="error">Error: {{ error }}</div>
    <div v-else>
      <v-sheet class="px-5">
        <v-sheet class="d-flex flex-row ga-3 py-2 justify-space-between align-end">
          <v-sheet>
            <atoms-atom-base-label :bold="true">Month & Year Filter</atoms-atom-base-label>
            <atoms-atom-base-calendar-native
              v-model="filterMonthYear"
              type="month"
              label="Month & Year Filter"
              :use-now="true"
              :clearable="false"
            />
          </v-sheet>
          <v-sheet>
            <v-btn variant="outlined" color="primary" @click="emit('refresh')" :loading="loading">
              Refresh
            </v-btn>
          </v-sheet>
        </v-sheet>       

        <atoms-atom-base-chart-gantt-schedule
          :tasks="schedules"
          :selectedMonth="filterMonth"
          :selectedYear="filterYear"
          :dayWidth="50"
          :alwaysRenderTaskOnANewRow="true"
          :onTaskClick="handleTaskClick"
          :forceRender="forceCounter"
        />
      </v-sheet>
    </div>
  </div>
</template>

<script setup lang="js">
import { ref, watch, computed } from 'vue'
import { transformScheduleData, validateGanttData } from '~/components/molecules/schedule-data-checker'

const props = defineProps({
  rawSchedules: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['refresh', 'selectedTask'])

const schedules = ref([])
const forceCounter = ref(0)
const filterMonthYear = ref('')
const validationResult = ref({ isValid: true, errors: [] })
const loading = ref(false)
const error = ref(null)

const filterYear = computed(() => {
  const parts = filterMonthYear.value?.split('-') ?? []
  return parts.length >= 1 ? Number(parts[0]) : null
})

const filterMonth = computed(() => {
  const parts = filterMonthYear.value?.split('-') ?? []
  return parts.length >= 2 ? Number(parts[1]) : null
})

const triggerChart = () => {
  forceCounter.value++
}

const handleTaskClick = (data) => {
  emit('selectedTask', data)
}

const processSchedules = async () => {
  try {
    loading.value = true
    error.value = null

    const rawData = Array.isArray(props.rawSchedules) ? props.rawSchedules : []

    const transformed = transformScheduleData(rawData)
    const validation = validateGanttData(transformed)
    validationResult.value = validation

    if (!validation.isValid) {
      console.warn('Validation failed:', validation.errors)
    }

    schedules.value = transformed

    if (transformed.length > 0) {
      setTimeout(triggerChart, 100)
    }

  } catch (err) {
    schedules.value = []
    error.value = err.message || 'Error processing schedules'
    validationResult.value = { isValid: false, errors: [err.message] }
  } finally {
    loading.value = false
  }
}

// Auto-process when props change
watch(() => props.rawSchedules, processSchedules, { immediate: true })
</script>

<template>
  <v-data-table 
    density="compact"
    :headers="headers"
    :items="referenceData"
    class=""
    :items-per-page="10"
  >
    <template v-slot:item="{ item }">
      <tr>
        <td>{{ item?.key }}</td>
        <td>{{ item?.value }}</td>
        <td>{{ item?.description }}</td>
        <td class="d-flex flex-row align-center justify-center">
          <v-btn size="small" class="mx-1" color="warning" @click="emit('edit', item)">Edit</v-btn>
          <v-btn size="small" class="mx-1" color="primary" @click="emit('view', item)">View</v-btn>
          <v-btn size="small" class="mx-1" color="error" @click="emit('delete', item)">Delete</v-btn>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script setup lang="js">

const props = defineProps({
  referenceData: {
    type: Array,
    default: () => [],
    required: true
  }
});

const emit = defineEmits(['edit', 'view', 'delete'])

const headers = [
  { title: 'Reference Key', key: 'key' },
  { title: 'Value', key: 'value' },
  { title: 'Description', key: 'description' },
  { title: 'Action', key: 'action', sortable: false }
];
</script>

<template>
  aggregate
</template>

<script setup>
import { ref, onMounted } from 'vue';


const formatDate = (iso) => {
  return new Date(iso).toLocaleString('id-ID', {
    hour12: false,
    dateStyle: 'short',
    timeStyle: 'medium',
  });
};

onMounted(() => {

});


</script>

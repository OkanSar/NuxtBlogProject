<script setup>
defineProps({
  items: Array
})
</script>

<template>
  <ul class="ml-10 mb-8">
    <li v-for="(item, index) in items" :key="index">- {{ item }}</li>
  </ul>
</template>

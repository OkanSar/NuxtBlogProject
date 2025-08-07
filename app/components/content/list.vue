<script setup>
defineProps({
  items: Array
})
</script>

<template>
  <ul class="ml-10 mb-8 text-gray-500 dark:text-white">
    <li v-for="(item, index) in items" :key="index">- {{ item }}</li>
  </ul>
</template>

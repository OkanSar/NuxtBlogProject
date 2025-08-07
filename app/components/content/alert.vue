<script setup>
defineProps({
  type: {
    type: String,
    default: 'info',
  }
})
</script>

<template>
  <div
      :class="[
      'p-4 rounded-lg border-l-4 mt-10',
      type === 'warning' ? 'bg-yellow-100 border-yellow-500 text-yellow-700' :
      type === 'error' ? 'bg-red-100 border-red-500 text-red-700' :
      'bg-blue-100 border-blue-500 text-blue-700'
    ]"
  >
    <slot />
  </div>
</template>

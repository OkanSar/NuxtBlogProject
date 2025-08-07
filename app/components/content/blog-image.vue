<script setup lang="ts">
const {image = "Blog İçerik"} = defineProps({
      image: String
})
</script>

<template>
  <div class="flex flex-col items-center">
    <img
        v-if="image"
        :src="image"
        alt="Blog image"
        class="max-h-[400px] object-contain mb-8"
    />
  </div>
</template>

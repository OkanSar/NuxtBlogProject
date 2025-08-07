<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
  error: Object as () => NuxtError
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="bg-white h-screen flex flex-col items-center justify-center text-center">
    <img
        src="/images/404_page-not-found.png"
        class="w-full max-h-[70vh] object-contain"
        alt="404 Not Found"
    />
  <div>
    <div class="text-lg font-bold">
      <p class="text-black">{{ error?.statusCode }}</p>
    </div>
    <p class="text-black">{{ error?.message }}</p>
    <UButton class="mt-6" @click="handleError">Hatayı Temizle</UButton>
  </div>
  </div>
</template>

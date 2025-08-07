<template>
  <UApp>
    <ClientOnly v-if="!colorMode?.forced">
      <Navbar :is-dark="isDark" @toggle-theme="isDark = !isDark" />
      <NuxtPage />
    </ClientOnly>
  </UApp>
</template>

<script setup lang="ts">
const colorMode = useColorMode()

const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set(_isDark) {
    colorMode.preference = _isDark ? 'dark' : 'light'
  }
})
</script>



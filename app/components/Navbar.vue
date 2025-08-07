<template>
  <header class="border-b border-gray-200 top-0 z-50">
    <div class="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
      <NuxtLink :to="localePath('/')" class="text-lg font-semibold text-green-600">
        Mosstar Blog
      </NuxtLink>

      <nav class="hidden md:flex items-center gap-6">
        <NuxtLink :to="localePath('/blog')" class="text-sm font-medium text-green-700 hover:underline">
          {{ $t('blog') }}
        </NuxtLink>

        <UButton
            :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
            color="neutral"
            variant="ghost"
            @click="emit('toggle-theme')"
        />


        <select
            v-model="selectedLocale"
            @change="changeLocale(selectedLocale)"
            class="text-sm text-green-700 border border-green-200 rounded px-2 py-1"
        >
          <option value="tr">Türkçe</option>
          <option value="en">English</option>
        </select>
      </nav>

      <button
          @click="isOpen = !isOpen"
          class="md:hidden text-green-700 focus:outline-none"
          aria-label="Menüyü Aç/Kapat"
      >
        <svg
            v-if="!isOpen"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
        >
          <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>

        <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
        >
          <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18 18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <!-- Mobil menü -->
    <div v-if="isOpen" class="md:hidden px-4 pb-4">
      <nav class="flex flex-col gap-2">
        <NuxtLink :to="localePath('/blog/')" class="text-sm font-medium text-green-700 hover:underline">
          {{ $t('blog') }}
        </NuxtLink>
        <select
            v-model="selectedLocale"
            @change="changeLocale(selectedLocale)"
            class="text-sm text-green-700 border border-green-200 rounded px-2 py-1 mt-2"
        >
          <option value="tr">Türkçe</option>
          <option value="en">English</option>
        </select>
      </nav>
    </div>
  </header>
</template>


<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useLocalePath, useSwitchLocalePath } from '#i18n'

defineProps({
  isDark: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['toggle-theme'])

const localePath = useLocalePath()

const router = useRouter()
const { t, locale, locales } = useI18n()

const isOpen = ref(false)
const selectedLocale = ref(locale.value)

function changeLocale(code) {
  const switchLocalePath = useSwitchLocalePath()
  const path = switchLocalePath(code)
  if (path) {
    router.push(path)
  }
}

watch(
    () => locale.value,
    (newLocale) => {
      selectedLocale.value = newLocale
    },
    { immediate: true }
)
</script>






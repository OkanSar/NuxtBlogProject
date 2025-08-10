<template>
  <header class="border-b border-gray-200 top-0 z-50">
    <div class="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
      <NuxtLink :to="localePath('/')" class="text-lg font-semibold text-green-600">
        Mosstar Blog
      </NuxtLink>

      <nav class="hidden md:flex items-center gap-6">
        <NuxtLink :to="localePath('/blog')" class="text-sm font-medium text-green-700 hover:underline">
          {{ ('Blog') }}
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
        <template v-if="user">
          <UDropdownMenu
              :items="dropdownItems"
          >
            <UButton variant="ghost" color="primary">
              {{ user.user_metadata?.name || user.email }}
            </UButton>
          </UDropdownMenu>
        </template>

        <template v-else>
          <UButton :to="localePath('/login')" color="primary">
            Giriş Yap
          </UButton>
        </template>
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
          {{ ('Blog') }}
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
            class="text-sm text-green-700 border border-green-200 rounded px-2 py-1 mt-2"
        >
          <option value="tr">Türkçe</option>
          <option value="en">English</option>
        </select>
        <template v-if="user">
          <div class="flex justify-center items-center text-center">
            <UDropdownMenu :items="dropdownItems">
              <UButton variant="ghost" color="primary">
                {{ user.user_metadata?.name || user.email }}
              </UButton>
            </UDropdownMenu>
          </div>
        </template>

        <template v-else>
            <UButton :to="localePath('/login')" color="primary" class="mt-2">
              Giriş Yap
            </UButton>
        </template>

      </nav>
    </div>
  </header>
</template>


<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useLocalePath, useSwitchLocalePath } from '#i18n'
import { useSupabaseClient, useSupabaseUser } from '#imports'
import type { Comment } from '~~/types/database.types.js'
import {defineNuxtRouteMiddleware, navigateTo} from "#app";


  const emit = defineEmits(['toggle-theme'])

  const localePath = useLocalePath()
  const router = useRouter()
  const {locale} = useI18n()

  const isOpen = ref(false)
  const selectedLocale = ref(locale.value)

  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const role = ref('')

  function changeLocale(code) {
    const switchLocalePath = useSwitchLocalePath()
    const path = switchLocalePath(code)
    if (path) router.push(path)
  }

  async function signOut() {
    await supabase.auth.signOut()
    router.push(localePath('/login'))
  }

const dropdownItems = computed(() => {
  const items = [
    { label: 'Çıkış Yap', icon: 'i-lucide-log-out', onSelect: signOut }
  ]

  if (role.value === 'admin') {
    items.unshift({
      label: 'Admin Panel',
      icon: 'i-lucide-settings',
      onSelect: () => router.push(localePath('/admin'))
    })
  }

  return [items]
})

  watch(async () => {
    if (user.value?.id) {
      const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.value.id)
          .single()
      if (!error && data) {
        role.value = data.role
      }
    }
  })
  watch(
      () => locale.value,
      (newLocale) => {
        selectedLocale.value = newLocale
      },
      {immediate: true}
  )
</script>






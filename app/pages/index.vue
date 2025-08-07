<script setup lang="ts">
import type { Collections } from '@nuxt/content'
import { withLeadingSlash } from 'ufo'
import {useLocalePath} from "#i18n";
import {useI18n} from "vue-i18n";
const localePath = useLocalePath()
const route = useRoute()
const router = useRouter()
const {locale, locales, localeProperties } = useI18n()

const { data: page } = await useAsyncData(`${locale.value}/`, async () => {
  const collectionName = `home_${locale.value}` as keyof Collections
  const content = await queryCollection(collectionName).first()
  return content
})
</script>


<template>
  <ContentRenderer
      v-if="page"
      :value="page"
  />
  <div v-else>
    sayfa bulunamadı
  </div>
</template>


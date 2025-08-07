<script setup lang="ts">
import type { Collections } from '@nuxt/content'
import { withLeadingSlash } from 'ufo'
import { useLocalePath } from "#i18n"
import { useI18n } from "vue-i18n"



const localePath = useLocalePath()
const route = useRoute()
const router = useRouter()
const { locale } = useI18n()

const slug = computed(() => String(route.params.slug))
const fullPath = computed(() => `/blog/${slug.value}`)

const { data: page } = await useAsyncData('blog-' + fullPath.value, async () => {
  const collection = ('content_' + locale.value) as keyof Collections
  const content = await queryCollection(collection).path(fullPath.value).first()
  if (!content) {
    return await queryCollection(collection).where('changeSlug','=',slug.value).first()
  }
  return content
}, {
  watch: [locale, slug],
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

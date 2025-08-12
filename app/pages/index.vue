<script setup lang="ts">
import type { Collections } from '@nuxt/content'
import { withLeadingSlash } from 'ufo'
import {useLocalePath} from "#i18n";
import {useI18n} from "vue-i18n";
definePageMeta({
  ssr: true
})
const localePath = useLocalePath()
const route = useRoute()
const router = useRouter()
const {locale, locales, localeProperties } = useI18n()


const { data: page } = await useAsyncData(`${locale.value}/`, async () => {
  const collectionName = `home_${locale.value}` as keyof Collections
  const content = await queryCollection(collectionName).first()
  return content
})
useSeoMeta({
  title: 'Mosstar Blog - Anasayfa',
  ogTitle: 'Mosstar Blog - Anasayfa',
  description: 'Günümüz dünyasında bilgiye ulaşmak kolaylaştı ama gerçekten anlamlı, nitelikli ve güvenilir bilgiye ulaşmak bir o kadar zorlaştı..',
  ogDescription: 'Günümüz dünyasında bilgiye ulaşmak kolaylaştı ama gerçekten anlamlı, nitelikli ve güvenilir bilgiye ulaşmak bir o kadar zorlaştı..',
  ogImage: 'https://blog.okansarioglu.me/images/blog-image-4.png'
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


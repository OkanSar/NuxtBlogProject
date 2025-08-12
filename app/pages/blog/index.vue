<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useLocalePath, useSwitchLocalePath } from '#i18n'
import {useColorMode} from "@vueuse/core";
import type { Comment } from '~~/types/database.types.js'
import {computed} from "vue";
const baslik = ref("Blog Yazıları")
const localePath = useLocalePath()
const route = useRoute()
const router = useRouter()
const {t,locale, locales, localeProperties } = useI18n()
const selectedTag = ref(route.query.category || 'All')

useSeoMeta({
  title: 'Mosstar Blog - Bloglar',
  ogTitle:  'Mosstar Blog - Bloglar',
  description:'Sizin için en uygun blogları listeledil ve kategorize ettik...',
  ogDescription: 'Sizin için en uygun blogları listeledil ve kategorize ettik...',
  ogImage: 'https://blog.okansarioglu.me/images/blog-image-4.png'
})
useHead({
  link: [
    { rel: 'icon', type: 'image/png', href: '/images/blog-image-4.png' }
  ]
})

const { data: allPosts } = await useAsyncData('blog-tags', async () => {
  if(locale.value==='tr'){
    let query = queryCollection('content_tr').where('status', '=', 'published')
    if (selectedTag.value !== 'All') {
      query = query.where('category', '=', selectedTag.value)
    }
    return query.all()
  }
  else{
    let query = queryCollection('content_en').where('status', '=', 'published')
    if (selectedTag.value !== 'All') {
      query = query.where('category', '=', selectedTag.value)
    }
    return query.all()
  }
},{
  watch:[selectedTag,locale]
})


const categorySet = new Set<string>()

const categories = computed(() => {
  allPosts.value?.forEach(post => {
    if (post.category) {
      categorySet.add(post.category)
    }
  })
  return ['All', ...Array.from(categorySet)]
})

const updateTag = (tag: string) => {
  selectedTag.value = tag
  router.replace({ query: { ...route.query, category: tag === 'All' ? undefined : tag } })
}
if (locale.value === "en"){
  baslik.value = "Blog Posts"
}
</script>


<template>
  <div class="min-h-screen">
    <UContainer class="py-8 px-4 blg-container font-serif">
      <h1 class="text-3xl font-semibold mb-6 text-center text-black dark:text-white">
        {{ baslik }}
      </h1>

      <ul class="flex flex-wrap gap-4 justify-center mb-8 text-sm text-gray-400 ">
        <li
            v-for="category in categories"
            :key="category"
            class="cursor-pointer hover:text-green-600 hover:underline"
            :class="{ 'text-green-600': selectedTag === category }"
            @click="updateTag(category)"
        >
          {{ category }}
        </li>
      </ul>

      <div class="flex flex-col gap-6">
        <div
            v-for="post in allPosts"
            :key="post.id"
            class="w-full rounded-lg overflow-hidden shadow hover:scale-[1.01] transition-transform flex flex-col sm:flex-row-reverse bg-blue-950"
        >
          <div class="w-full sm:w-40 aspect-[4/3] sm:aspect-auto sm:h-auto ">
            <img
                v-if="post.image"
                :src="post.image"
                :alt="post.title"
                class="w-full h-full object-cover"
            />
          </div>

          <div class="flex-1 p-3 flex flex-col justify-between">
            <div>
              <h2 class="text-lg sm:text-lg font-semibold mb-1 text-white">{{ post.title }}</h2>
              <p class="text-sm sm:text-sm text-white dark:text-gray-200 line-clamp-2">
                {{ post.description || 'Bu yazı için açıklama bulunmuyor.' }}
              </p>
            </div>
            <div class="mt-3">
              <ul class="flex flex-wrap gap-3 text-xs text-gray-200">
                <li>
                  {{
                    new Date(post.date).toLocaleDateString('tr-TR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  }}
                </li>
              </ul>
              <router-link :to="localePath(post.path)" class="inline-block mt-1">
                <UButton size="sm">
                  <div class="text-black dark:text-black">
                    Yazıyı Oku
                  </div>
                </UButton>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<style scoped>
.blg-container {
  max-width: 95%;
  margin-left: auto;
  margin-right: auto;
}
@media (min-width: 1024px) {
  .blg-container {
    max-width: 60%;
  }
}
</style>


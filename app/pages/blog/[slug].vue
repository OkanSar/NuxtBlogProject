<script setup lang="ts">
import type { Collections } from '@nuxt/content'
// import { useSupabaseClient, useSupabaseUser } from '#imports'
import type { Comment, Blogs } from '~~/types/database.types'
import { useI18n } from "vue-i18n"
import {computed} from "vue";

const supabase = useSupabaseClient<Comment>()
const likesupabase = useSupabaseClient<Blogs>()
const user = useSupabaseUser()

const route = useRoute()
const { locale } = useI18n()

const isLiked = ref(false)
const comments = ref<Comment[]>([])
const newComment = ref('')
const loading = ref(false)
const successMsg = ref('')
const errorMsg = ref('')
const blogLikeCount = ref<number>(0)

const slug = computed(() => String(route.params.slug))
const fullPath = computed(() => `/blog/${slug.value}`)

const { data: page } = await useAsyncData('blog-' + fullPath.value, async () => {
  const collection = ('content_' + locale.value) as keyof Collections
  const content = await queryCollection(collection).path(fullPath.value).first()
  if (!content) {
    return await queryCollection(collection).where('changeSlug', '=', slug.value).first()
  }
  return content
}, {
  watch: [locale, slug],
})

const blogId = computed(() => page.value?.blogId)
async function loadLikes() {
  if (!blogId.value) return;

  const { count, error } = await likesupabase
      .from('Likes')
      .select('*', { count: 'exact', head: true })
      .eq('blogId', blogId.value)

  if (error) {
    console.error('Likes yüklenirken hata:', error.message);
    blogLikeCount.value = 0;
    return;
  }
  blogLikeCount.value = count ?? 0;
}
async function loadComments() {
  if (!blogId.value) return;

  const { data: commentsData, error: commentsError } = await supabase
      .from('Comments')
      .select(`
        *,
        profile:UserId (email)
      `)
      .eq('BlogId', blogId.value)
      .eq('Status', 'Published')
      .order('Date', { ascending: true });

  if (commentsError) {
    console.error('Yorumlar yüklenirken hata:', commentsError.message);
    comments.value = [];
    return;
  }
  comments.value = commentsData;
}
async function addComment() {
  if (!user.value) {
    errorMsg.value = 'Yorum yapmak için giriş yapmalısınız.'
    return
  }
  if (!newComment.value.trim()) {
    errorMsg.value = 'Yorum boş olamaz.'
    return
  }

  loading.value = true
  errorMsg.value = ''
  successMsg.value = ''

  const {data, error } = await supabase
      .from('Comments')
      .insert([{
        BlogId: blogId.value!,
        Comment: newComment.value,
        UserId: user.value.id,
        Date: new Date().toISOString(),
        Status: 'Pending'
      }])

  loading.value = false

  if (error) {
    errorMsg.value = 'Yorum eklenirken hata oluştu: ' + error.message
  } else {
    successMsg.value = 'Yorumunuz onay bekliyor.'
    newComment.value = ''
    await loadComments()
  }
}
async function checkUserLike() {
  if (!blogId.value || !user.value) return;

  const { data, error } = await likesupabase
      .from('Likes')
      .select('id')
      .eq('blogId', blogId.value)
      .eq('userId', user.value.id)
      .maybeSingle()

  isLiked.value = !!data && !error
}
async function addLike() {
  if (!user.value) {
    errorMsg.value = 'Beğenmek için giriş yapmalısınız.'
    return;
  }
  if (!blogId.value) return;
  if (isLiked.value) {
    return;
  }
  const { error: insertError } = await likesupabase
      .from('Likes')
      .insert([{ blogId: blogId.value, userId: user.value.id }])

  if (insertError) {
    console.error('Like eklenirken hata:', insertError.message)
    return;
  }
  isLiked.value = true;
  const { count, error: countError } = await likesupabase
      .from('Likes')
      .select('*', { count: 'exact', head: true })
      .eq('blogId', blogId.value)

  if (countError) {
    console.error('Like sayısı alınırken hata:', countError.message)
    return;
  }
  blogLikeCount.value = count ?? 0;
}
async function removeLike() {
  if (!user.value || !blogId.value) return;

  const { error: deleteError } = await likesupabase
      .from('Likes')
      .delete()
      .eq('blogId', blogId.value)
      .eq('userId', user.value.id)

  if (deleteError) {
    console.error('Like kaldırılırken hata:', deleteError.message)
    return;
  }

  isLiked.value = false;

  const { count, error: countError } = await likesupabase
      .from('Likes')
      .select('*', { count: 'exact', head: true })
      .eq('blogId', blogId.value)

  if (countError) {
    console.error('Like sayısı alınırken hata:', countError.message)
    return;
  }
  blogLikeCount.value = count ?? 0;
}
loadComments()
function formatDate(date: string) {
  return new Date(date).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

const commentCountFromMd = computed(() => 0)
const liveCommentCount = computed(() => comments.value.length)

const displayedCommentCount = computed(() => {
  return liveCommentCount.value > commentCountFromMd.value
      ? liveCommentCount.value
      : commentCountFromMd.value
})
const likeCounFromMd = computed(() => 0)
const liveLikeCount = computed(() => blogLikeCount.value ?? 0)
const displayedlikeCount = computed(() => {
  return liveLikeCount.value > likeCounFromMd.value
      ? liveLikeCount.value
      : liveLikeCount.value
})
provide('comments', comments)
provide('displayedCommentCount', displayedCommentCount)
provide('blogLikeCount', blogLikeCount)
provide('displayedlikeCount', displayedlikeCount)
provide('isLiked', isLiked)
provide('addLike', addLike)
provide('removeLike', removeLike)
provide(' checkUserLike',  checkUserLike())
onMounted(() => {
  loadLikes()
  checkUserLike()
  loadComments()
})
useSeoMeta({
  title: ()=> `Mosstar Blog | ${page.value?.title}`,
  ogTitle: ()=> `Mosstar Blog | ${page.value?.title}`,
  description: ()=> `Mosstar Blog | ${ (page.value?.description || '')
      .slice(0, 100) }`,
  ogDescription: ()=> `Mosstar Blog | ${ (page.value?.description || '' )
        .slice(0, 100) }`,
  ogImage: ()=> `https:/${page.value?.image}`,
})
  useHead({
    link: [
      { rel: 'icon', type: 'image/png', href: `${page.value?.image}?v=${Date.now()}` }
    ]
  })
</script>

<template>
  <ContentRenderer v-if="page" :value="page"/>
  <div v-else>
    sayfa bulunamadı
  </div>
  <section class="comments-section mt-8 max-w-3xl mx-auto px-4 mb-8">
    <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
      💬 Yorumlar <span class="text-gray-500 text-lg">({{ displayedCommentCount }})</span>
    </h2>

    <div v-if="comments.length === 0" class="text-gray-600 dark:text-gray-300 mb-6 text-center">
      Henüz yorum yok. İlk yorumu sen yaz!
    </div>

    <ul class="space-y-4 mb-8">
      <li
          v-for="comment in comments"
          :key="comment.Id"
          class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4 transition hover:shadow-md"
      >
        <div class="flex items-center justify-between mb-2">
        <span class="text-sm text-gray-500 dark:text-gray-400">
          {{ comment.profile?.email || 'Bilinmeyen Kullanıcı' }}
        </span>
          <span class="text-xs text-gray-400">{{ formatDate(comment.Date) }}</span>
        </div>
        <p class="text-gray-800 dark:text-gray-100 whitespace-pre-line">
          {{ comment.Comment }}
        </p>
      </li>
    </ul>

    <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6">
      <h3 class="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Yorum Yap</h3>
      <textarea
          v-model="newComment"
          placeholder="Yorumunuzu buraya yazın..."
          class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-y focus:ring-2 focus:ring-green-500 dark:bg-gray-900 dark:text-white transition"
          rows="4"
          :disabled="loading"
      ></textarea>

      <div class="mt-3 flex flex-col sm:flex-row sm:items-center gap-3">
        <button
            @click="addComment"
            :disabled="loading"
            class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
        >
          {{ loading ? 'Gönderiliyor...' : 'Gönder' }}
        </button>

        <p v-if="successMsg" class="text-green-600">{{ successMsg }}</p>
        <p v-if="errorMsg" class="text-red-600">{{ errorMsg }}</p>
      </div>
    </div>
  </section>
</template>

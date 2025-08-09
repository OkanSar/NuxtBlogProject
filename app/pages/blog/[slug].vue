<script setup lang="ts">
import type { Collections } from '@nuxt/content'
import { useSupabaseClient, useSupabaseUser } from '#imports'
import type { Comment } from '~~/types/database.types'
import { useLocalePath } from "#i18n"
import { useI18n } from "vue-i18n"
import {computed} from "vue";
import {newLine} from "@vue/language-core/lib/codegen/utils";

const supabase = useSupabaseClient<Comment>()
const user = useSupabaseUser()

const route = useRoute()
const { locale } = useI18n()

const comments = ref<Comment[]>([])
const newComment = ref('')
const loading = ref(false)
const successMsg = ref('')
const errorMsg = ref('')

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
provide('comments', comments)
provide('displayedCommentCount', displayedCommentCount)
</script>

<template>
  <ContentRenderer v-if="page" :value="page"/>
  <div v-else>
    sayfa bulunamadı
  </div>
  <section class="comments-section mt-8 max-w-3xl mx-auto px-4 mb-8">
    <!-- Başlık -->
    <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
      💬 Yorumlar <span class="text-gray-500 text-lg">({{ displayedCommentCount }})</span>
    </h2>

    <!-- Yorum yok mesajı -->
    <div v-if="comments.length === 0" class="text-gray-600 dark:text-gray-300 mb-6 text-center">
      Henüz yorum yok. İlk yorumu sen yaz! 😄
    </div>

    <!-- Yorum listesi -->
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

    <!-- Yorum formu -->
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

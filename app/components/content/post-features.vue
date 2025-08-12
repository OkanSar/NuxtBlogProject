<script setup lang="ts">
import {computed} from "vue";

const comments = inject('comments')
const displayedCommentCount = inject('displayedCommentCount')
const displayedlikeCount = inject('displayedlikeCount')
const blogLikeCount = inject('blogLikeCount')
const isLiked = inject<Ref<boolean>>('isLiked', ref(false))
const addLike = inject<() => Promise<void>>('addLike', async () => {})
const removeLike = inject<() => Promise<void>>('removeLike', async () => {})
const checkUserLike = inject<() => Promise<void>>('checkUserLike', async () => {})

if (!isLiked || !addLike || !removeLike || !checkUserLike) {
  throw new Error('Beklenen provide değerleri bulunamadı.')
}

const props = defineProps<{
  date: string
  likeCount?: number
  commentCount?: number
}>()

const dateFormatted = computed(() => {
  return new Date(props.date).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})
onMounted(() => {
  checkUserLike()
})
</script>

<template>
  <ul class="flex flex-wrap items-center justify-center gap-6 text-gray-600 dark:text-gray-300 text-sm mt-10 mb-10">
    <li class="flex items-center gap-2">
      <Icon name="i-lucide-calendar" class="text-gray-400" />
      <span>{{ dateFormatted }}</span>
    </li>
    <li class="flex items-center gap-3">
      <span class="text-base font-semibold select-none">{{ displayedlikeCount }}</span>
      <UButton
          @click="isLiked ? removeLike() : addLike()"
          color="primary"
          variant="outline"
          class="flex items-center gap-2 px-4 py-2 rounded-lg transition hover:bg-primary-600 hover:text-white"
      >
        {{ isLiked ? 'Beğenmekten Vazgeç' : '❤️ Beğen' }}
      </UButton>
    </li>
    <li class="flex items-center gap-2">
      <Icon name="i-lucide-mail" class="text-gray-400" />
      <span>{{ displayedCommentCount }}</span>
    </li>
  </ul>
</template>



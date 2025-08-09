<script setup lang="ts">
import { useSupabaseClient, useSupabaseUser } from '#imports'
import {computed} from "vue";
import type { Comment } from '~~/types/database.types.js'

const comments = inject('comments')
const displayedCommentCount = inject('displayedCommentCount')

const { date, likeCount = 0, commentCount = 0 } = defineProps({
  date: String | Date,
  likeCount: Number,
  commentCount: Number,
})

const dateFormatted = computed(() => {
  return new Date(date).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})
</script>

<template>
  <ul class="flex flex-wrap gap-4 text-xs text-gray-500 justify-center mt-10 mb-10">
    <li>{{ dateFormatted }}</li>
    <li><p> {{ likeCount }} <Icon name="i-lucide-heart"/></p></li>
    <li>{{ displayedCommentCount }} <Icon name="i-lucide-mail"/></li>
  </ul>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSupabaseClient } from '#imports'
import type { Comment } from '~~/types/database.types'
import adminMiddleware from '~~/middleware/admin'

const router = useRouter()
const supabase = useSupabaseClient<Comment>()
const user = useSupabaseUser()
const comments = ref<Comment[]>([])

async function fetchComments() {
  const { data, error } = await supabase
      .from('Comments')
      .select(`
      *,
      profile:UserId (email)
    `)

  if (error) {
    console.error('Yorumlar çekilirken hata:', error.message)
  } else {
    // Pending olanlar önce gelsin diye sıralıyoruz
    comments.value = (data ?? []).sort((a, b) => {
      if (a.Status === b.Status) return 0
      if (a.Status === 'Pending') return -1
      if (b.Status === 'Pending') return 1
      return 0
    })
  }
}

async function approveComment(id: number) {
  const { data, error } = await supabase
      .from('Comments')
      .update({ Status: 'Published' })
      .eq('Id', id)

  if (error) {
    console.error('Yorum onaylama hatası:', error.message)
  } else {
    fetchComments()
  }
}

async function deleteComment(id: number) {
  const { data, error } = await supabase
      .from('Comments')
      .delete()
      .eq('Id', id)

  if (error) {
    console.error('Yorum silme hatası:', error.message)
  } else {
    fetchComments()
  }
}

onMounted(() => {
  fetchComments()
})

async function fetchUserRole() {
  if (!user.value) return null

  const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.value.id)
      .single()

  if (error) {
    console.error('Profil çekilirken hata:', error.message)
    return null
  }
  return data?.role
}
definePageMeta({
  middleware: adminMiddleware
})
</script>

<template>
  <section class="max-w-4xl mx-auto p-6 bg-gray-300 dark:bg-gray-900 rounded-lg shadow-md min-h-screen">
    <h2 class="text-3xl font-semibold mb-6 text-gray-900 dark:text-white border-b pb-3">
      Admin Paneli - Yorumlar
    </h2>
    <ul>
      <li
          v-for="c in comments"
          :key="c.Id"
          :class="[
          'flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 dark:border-gray-700 rounded-md mb-3 transition-shadow hover:shadow-lg p-5',,
          c.Status === 'Pending' ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-white dark:bg-gray-800',
          'rounded-md mb-3',
          'transition-shadow hover:shadow-lg'
        ]"
      >
        <div class="flex flex-col gap-1 max-w-full md:max-w-[70%]">
          <p class="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {{ c.profile?.email || 'Bilinmeyen Kullanıcı' }} - {{c.Status}}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            {{ new Date(c.Date).toLocaleString() }}
          </p>
          <p
              class="text-gray-800 dark:text-gray-200 truncate"
              :title="c.Comment"
          >
            {{ c.Comment }}
          </p>
        </div>
        <div class="flex gap-3 mt-3 md:mt-0">
          <button
              class="bg-green-500 text-white px-4 py-2 rounded-md text-sm hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
              @click="approveComment(c.Id)"
              :disabled="c.Status === 'Published'"
          >
            Onayla
          </button>
          <button
              class="bg-red-500 text-white px-4 py-2 rounded-md text-sm hover:bg-red-600 transition"
              @click="deleteComment(c.Id)"
          >
            Sil
          </button>
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped>
ul::-webkit-scrollbar {
  height: 6px;
}
ul::-webkit-scrollbar-thumb {
  background-color: rgba(100, 100, 100, 0.3);
  border-radius: 10px;
}
</style>

<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import type { Collections } from '@nuxt/content'

const { share = "Paylaş" } = defineProps({
  share: String
})

const items = ref<DropdownMenuItem[]>([
  {
    label: 'İnstagram',
    icon: 'lucide-instagram'
  },
  {
    label: 'Youtube',
    icon: 'lucide-youtube'
  }
])

const route = useRoute()
const { locale } = useI18n()

const slug = computed(() => String(route.params.slug))

const { data: page } = await useAsyncData(`page-${locale.value}-${slug.value}`, async () => {
  const collection = `content_${locale.value}` as keyof Collections

  let content = await queryCollection(collection).path(`/blog/${slug.value}`).first()

  if (!content && locale.value !== 'en') {
    content = await queryCollection('content_en').path(`/blog/${slug.value}`).first()
  }

  return content
})
</script>

<template>
  <div class="flex justify-end">
    <UDropdownMenu
        :items="items"
        :content="{ align: 'start', side: 'bottom', sideOffset: 8 }"
        :ui="{ content: 'w-48' }"
    >
      <UButton
          :label="locale === 'tr' ? 'Paylaş' : 'Share'"
          icon="i-lucide-share"
          color="success"
          variant="soft"
          class="mb-10"
      />
    </UDropdownMenu>
  </div>
</template>

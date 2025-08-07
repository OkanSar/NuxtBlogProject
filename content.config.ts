import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
    collections: {
        content_tr: defineCollection({
            type: 'page',
            source: {
                include: 'tr/blog/**',
                prefix: 'blog',
            },
            schema: z.object({
                title: z.string(),
                description: z.string(),
                image: z.string(),
                date: z.string(),
                category: z.string(),
                tags: z.array(z.string()),
                status: z.string(),
                changeSlug: z.string(),
            })
        }),
        content_en: defineCollection({
            type: 'page',
            source: {
                include: 'en/blog/**',
                prefix: 'blog',
            },
            schema: z.object({
                title: z.string(),
                description: z.string(),
                image: z.string(),
                date: z.string(),
                category: z.string(),
                tags: z.array(z.string()),
                status: z.string(),
                changeSlug: z.string(),
            })
        }),
        home_tr: defineCollection({
            type: 'page',
            source: {
                include: 'tr/index.md',
                prefix: '',
            },
            schema: z.object({
                title: z.string(),
                description: z.string(),
                image: z.string(),
                date: z.string(),
                category: z.string(),
                tags: z.array(z.string()),
                status: z.string(),
                changeSlug: z.string(),
            })
        }),
        home_en: defineCollection({
            type: 'page',
            source: {
                include: 'en/index.md',
                prefix: '',
            },
            schema: z.object({
                title: z.string(),
                description: z.string(),
                image: z.string(),
                date: z.string(),
                category: z.string(),
                tags: z.array(z.string()),
                status: z.string(),
                changeSlug: z.string(),
            })
        })
    }
})

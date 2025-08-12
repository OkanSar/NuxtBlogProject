import {useHead} from "nuxt/app";

export function useDefaultSeo(overrides?: {
    title?: string
    description?: string
    image?: string
}) {
    const defaultTitle = 'Mosstar Blog'
    const defaultDescription = 'Günümüz dünyasında bilgiye ulaşmak kolaylaştı ama gerçekten anlamlı, nitelikli ve güvenilir bilgiye ulaşmak zorlaştı.'
    const defaultImage = 'https://blog.okansarioglu.me/images/blog-image-6.jpg'

    useHead({
        title: overrides?.title || defaultTitle,
        meta: [
            { name: 'description', content: overrides?.description || defaultDescription },
            { property: 'og:title', content: overrides?.title || defaultTitle },
            { property: 'og:description', content: overrides?.description || defaultDescription },
            { property: 'og:image', content: overrides?.image || defaultImage },
            { property: 'og:type', content: 'website' },
            { name: 'twitter:card', content: 'summary_large_image' }
        ],
        link: [
            { rel: 'icon', type: 'image/png', href: '/blog-icon.png' }
        ]
    })
}

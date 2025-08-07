import vuetify from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  compatibilityDate: '2025-08-01',
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },
  devServer: {
    port: 3000
  },
  modules: ['@nuxt/content','@nuxt/ui','@nuxtjs/i18n'],
  components: true,
  i18n: {
    locales: [
      { code: 'tr', name: 'Turhish', language: 'tr-TR', dir: 'ltr' },
      { code: 'en', name: 'English', language: 'en-US', dir: 'ltr' }
    ],
    strategy: 'prefix_except_default',
    defaultLocale: 'tr',
  }
})

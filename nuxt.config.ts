import vuetify from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  compatibilityDate: '2025-08-01',
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },
  devServer: {
    port: 3000
  },
  modules: ['@nuxt/content','@nuxt/ui','@nuxtjs/i18n','@nuxtjs/supabase'],
  components: true,
  runtimeConfig: {
    public: {
      supabase: {
        url: 'https://fwqehgvycuuumexyohfs.supabase.co',
        key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3cWVoZ3Z5Y3V1dW1leHlvaGZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2NDAwMTEsImV4cCI6MjA3MDIxNjAxMX0.jfsFwVjVI_XyE7SN9A1t_5gKulbeBat7aQrbj4tbLkM'
      }
    }
  },
  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/',
      exclude: ['/register','/blog'],
    }
  },
  i18n: {
    locales: [
      { code: 'tr', name: 'Turhish', language: 'tr-TR', dir: 'ltr' },
      { code: 'en', name: 'English', language: 'en-US', dir: 'ltr' }
    ],
    strategy: 'prefix_except_default',
    defaultLocale: 'tr',
  }
})

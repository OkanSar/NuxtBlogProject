<template>
  <UContainer class="min-h-screen flex items-center justify-center px-4">
    <UCard class="max-w-sm w-full p-6">
      <template #header>
        <h2 class="text-2xl font-bold text-center">
          {{ isLogin ? 'Giriş Yap' : 'Kayıt Ol' }}
        </h2>
      </template>

      <UForm @submit="onSubmit" :state="form" class="space-y-4">
        <UFormGroup label="E-Posta" name="email">
          <UInput
              v-model="form.email"
              type="email"
              placeholder="E-posta adresiniz"
              class="w-full mb-3"
              required
          />
        </UFormGroup>

        <UFormGroup label="Şifre" name="password">
          <UInput
              v-model="form.password"
              type="password"
              placeholder="Şifreniz"
              class="w-full mb-10"
              required
          />
        </UFormGroup>

        <UButton
            type="submit"
            color="primary"
            block
            :loading="loading"
        >
          {{ isLogin ? 'Giriş Yap' : 'Kayıt Ol' }}
        </UButton>
      </UForm>

      <template #footer>
        <p class="text-center text-sm mt-4">
          {{ isLogin ? 'Hesabınız yok mu?' : 'Zaten hesabınız var mı?' }}
          <UButton
              variant="link"
              class="p-0 ml-1"
              @click="isLogin = !isLogin"
          >
            {{ isLogin ? 'Kayıt Ol' : 'Giriş Yap' }}
          </UButton>
        </p>
        <div class="mt-6 space-y-2">
          <UButton
              color="neutral"
              variant="outline"
              block
              @click="signInWithGoogle"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
              <path fill="#4285F4" d="M24 9.5c3.54 0 6.27 1.52 7.72 2.8l5.7-5.7C33.02 4.84 28.88 3 24 3 14.84 3 7.28 8.98 4.62 16.9l6.62 5.15C12.33 16.6 17.62 9.5 24 9.5z"/>
              <path fill="#34A853" d="M46.5 24c0-1.59-.15-2.8-.46-4.02H24v7.62h12.73c-.25 1.55-1.6 4.33-5.27 6.55l-.05.34 7.66 5.94.53.05c4.87-4.49 7.8-11.1 7.8-20.48z"/>
              <path fill="#FBBC05" d="M10.24 29.9a14.96 14.96 0 0 1 0-11.81v-.35L3.62 13.4a24 24 0 0 0 0 21.2l6.62-5.14z"/>
              <path fill="#EA4335" d="M24 46.5c6.5 0 11.94-2.14 15.9-5.82l-7.56-5.86c-2.1 1.38-4.83 2.3-8.33 2.3-6.42 0-11.9-4.33-13.85-10.15L4.62 34.6c3.06 6.1 9.79 10.8 19.38 10.8z"/>
              <path fill="none" d="M0 0h48v48H0z"/>
            </svg>
            Google ile Giriş
          </UButton>

          <UButton
              color="neutral"
              variant="outline"
              block
              @click="signInWithGitHub"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.415-4.033-1.415-.546-1.386-1.333-1.755-1.333-1.755-1.09-.745.083-.73.083-.73 1.205.085 1.838 1.237 1.838 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.774.418-1.304.76-1.604-2.665-.305-5.467-1.334-5.467-5.933 0-1.31.467-2.38 1.235-3.22-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.52 11.52 0 0 1 3-.404c1.02.005 2.047.138 3 .404 2.29-1.552 3.297-1.23 3.297-1.23.654 1.653.243 2.873.12 3.176.77.84 1.234 1.91 1.234 3.22 0 4.61-2.807 5.625-5.48 5.922.43.372.823 1.102.823 2.222v3.293c0 .32.218.694.825.576C20.565 21.796 24 17.298 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            GitHub ile Giriş
          </UButton>
        </div>

        <p v-if="errorMsg" class="text-red-500 text-sm text-center mt-2">{{ errorMsg }}</p>
        <p v-if="successMsg" class="text-green-500 text-sm text-center mt-2">{{ successMsg }}</p>
      </template>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useSupabaseClient, useSupabaseUser } from '#imports'

useSeoMeta({
  title: 'Mosstar Blog - Giriş Yap / Kayıt Ol',
  ogTitle: 'Mosstar Blog - Giriş Yap / Kayıt Ol',
  description: 'Hemen şimdi giriş yaparak yorumlarda kendi fikrini belirtebilirsin...',
  ogDescription: 'Hemen şimdi giriş yaparak yorumlarda kendi fikrini belirtebilirsin...',
  ogImage: 'https://blog.okansarioglu.me/images/blog-image-4.png'
})

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const isLogin = ref(true)
const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

const form = ref({
  email: '',
  password: ''
})

watchEffect(() => {
  if (user.value) {
    navigateTo('/')
  }
})

async function onSubmit() {
  errorMsg.value = ''
  successMsg.value = ''
  loading.value = true

  const { email, password } = form.value

  try {
    if (isLogin.value) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      successMsg.value = 'Kayıt başarılı! Lütfen e-postanızı doğrulayın.'
    }
  } catch (err: any) {
    errorMsg.value = err.message || 'Bir hata oluştu.'
  } finally {
    loading.value = false
  }
}
async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin
    }
  })
  if (error) errorMsg.value = error.message
}

async function signInWithGitHub() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: window.location.origin
    }
  })
  if (error) errorMsg.value = error.message
}

</script>

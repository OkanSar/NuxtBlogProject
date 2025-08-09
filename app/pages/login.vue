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

        <p v-if="errorMsg" class="text-red-500 text-sm text-center mt-2">{{ errorMsg }}</p>
        <p v-if="successMsg" class="text-green-500 text-sm text-center mt-2">{{ successMsg }}</p>
      </template>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useSupabaseClient, useSupabaseUser } from '#imports'

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
</script>

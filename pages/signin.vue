<template>
  <UContainer class="min-h-dvh flex items-center justify-center">
    <UForm
      :validate="validate"
      :state="state"
      :validate-on="['input']"
      class="space-y-4 w-2/3 md:w-1/4"
      @submit="signIn">
      <h1 class="text-2xl font-semibold text-center">Sing in to Huntro</h1>
      <UFormField label="Email" name="email" required>
        <UInput v-model="state.email" class="w-full" />
      </UFormField>
      <UFormField label="Password" name="password" required>
        <UInput v-model="state.password" type="password" class="w-full" />
      </UFormField>

      err
      <UButton type="submit" size="lg" class="w-full justify-center" loading-auto>
        Sign in
      </UButton>
    </UForm>
  </UContainer>
</template>

<script setup lang="ts">
  import type { FormError, FormSubmitEvent } from '@nuxt/ui'

  const supabase = useSupabaseClient()
  const toast = useToast()

  const state = reactive({
    email: undefined,
    password: undefined,
  })

  const validate = (state: any): FormError[] => {
    const errors = []
    if (!state.email) errors.push({ name: 'email', message: 'Required' })
    if (!state.password) errors.push({ name: 'password', message: 'Required' })
    return errors
  }

  onMounted(async () => {
    const { data, error } = await supabase.auth.getSession()
    console.log('Manual session:', data)
  })
  const signIn = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: String(state.email),
      password: String(state.password),
    })
    
    if (error) {
      console.error('Error signing up:', error.message)
      toast.add({
        title: 'Error signing in',
        description: error.message,
        color: 'error'
      })
      return
    }

    if (data?.session) {
      toast.add({
        title: 'Signed in successfully!',
        description: 'Welcome back to your Job Board.',
        color: 'success'
      })
      navigateTo('/jobs')
    }
  }
</script>
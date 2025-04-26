<template>
  <UContainer class="min-h-dvh flex items-center justify-center">
    <UForm
      :validate="validate"
      :state="state"
      :validate-on="['input']"
      class="space-y-4  w-2/3 md:w-1/4"
      @submit="signUp">
      <h1 class="text-2xl font-semibold text-center">Sign up to Huntro</h1>
      <UFormField label="Email" name="email" required>
        <UInput v-model="state.email" class="w-full" />
      </UFormField>

      <UFormField label="Password" name="password" required>
        <UInput v-model="state.password" type="password" class="w-full" />
      </UFormField>

      <UFormField label="Password Confirmation" name="passwordConfirmation" required>
        <UInput v-model="state.passwordConfirmation" type="password" class="w-full" />
      </UFormField>
      <span class="text-red-500">{{ error }}</span>
      <UButton type="submit" size="lg" class="w-full justify-center cursor-pointer" loading-auto>
        Sign up
      </UButton>
    </UForm>
  </UContainer>
</template>

<script setup lang="ts">
  import type { FormError, FormSubmitEvent } from '@nuxt/ui'

  const supabase = useSupabaseClient()
  const toast = useToast()
  const error = ref('')
  const state = reactive({
    email: undefined,
    password: undefined,
    passwordConfirmation: undefined,
  })

  const validate = (state: any): FormError[] => {
    const errors = []

    if (!state.email) errors.push({ name: 'email', message: 'Required' })
    if (!state.password) {
      errors.push({ name: 'password', message: 'Required' })
    } else {
      if (state.password.length < 8) {
        errors.push({ name: 'password', message: 'Password must be at least 8 characters long' })
      }
      if (!/[A-Z]/.test(state.password)) {
        errors.push({ name: 'password', message: 'Password must include at least one uppercase letter' })
      }
      if (!/\d/.test(state.password)) {
        errors.push({ name: 'password', message: 'Password must include at least one number' })
      }
      if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(state.password)) {
        errors.push({ name: 'password', message: 'Password must include at least one special character' })
      }
    }

    if (!state.passwordConfirmation) {
      errors.push({ name: 'passwordConfirmation', message: 'Required' })
    } else if (state.password !== state.passwordConfirmation) {
      errors.push({ name: 'passwordConfirmation', message: 'Passwords do not match' })
    }

    return errors
  }


  const signUp = async () => {
    const { data, error } = await supabase.auth.signUp({
      email: String(state.email),
      password: String(state.password),
    })
    
    if (error) {
      console.error('Error signing up:', error.message)
      toast.add({
        title: 'Error signing up',
        description: error.message,
        color: 'error'
      })
      return
    }

    if (data?.session) {
      toast.add({
        title: 'Account created!',
        description: 'Welcome to your Job Board.',
        color: 'success'
      })
      navigateTo('/jobs')
    }
  }

</script>
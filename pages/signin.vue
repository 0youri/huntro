<template>
  <UContainer class="min-h-dvh flex items-center justify-center ">
    <UForm
      :validate="validate"
      :state="state"
      :validate-on="['input']"
      class="space-y-4  w-1/4"
      @submit="onSubmit">
      <h1 class="text-2xl font-semibold text-center">Sing in to Huntro</h1>
      <UFormField label="Email" name="email" required>
        <UInput v-model="state.email" class="w-full" />
      </UFormField>

      <UFormField label="Password" name="password" required>
        <UInput v-model="state.password" type="password" class="w-full" />
      </UFormField>
      <UButton type="submit" size="lg" class="w-full justify-center" loading-auto>
        Sign in
      </UButton>
    </UForm>
  </UContainer>
</template>

<script setup lang="ts">
  import type { FormError, FormSubmitEvent } from '@nuxt/ui'

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

  const toast = useToast()
  async function onSubmit(event: FormSubmitEvent<any>) {
    toast.add({
      title: 'Account created!',
      description: 'Check your mail for confirmation.',
      color: 'success'
    })
    console.log(event.data)
  }
</script>
<template>
  <div class="relative">
    <div class="absolute rounded-full bg-slate-900 dark:bg-slate-400 blur-[300px] size-60 sm:size-80 transform -translate-x-1/2 left-1/2 -translate-y-80"></div>
    <UContainer class="flex flex-col items-center justify-center min-h-dvh gap-5">
      <h1 class="text-7xl font-semibold">Job Application Tracker</h1>
      <p class="text-lg font-medium text-center">
        Huntro is a simple and efficient Job Board to help you track your job applications in one place.

        You can easily save, manage, and monitor the progress of your job hunt. Built with Nuxt 3, Supabase, and Groq AI, Huntro provides a clean and fast experience for organizing your job search.
      </p>
      <UContainer class="flex items-center justify-center gap-5">
        <UButton
          @click="navigateTo('/jobs')"
          trailing-icon="i-lucide-arrow-right"
          color="neutral"
          variant="soft"
          size="xl"
          class="cursor-pointer"
        >
          Try it
        </UButton>
        <UButton
          @click="navigateTo('https://github.com/0youri/huntro', {
            external: true,
            open: {target: '_blank' }
          })"
          icon="i-lucide-github"
          size="xl"
          color="neutral"
          variant="outline"
          class="cursor-pointer"
        >
          GitHub
        </UButton>
      </UContainer>

    </UContainer>

  </div>
  
</template>

<script setup lang="ts">
  
</script>
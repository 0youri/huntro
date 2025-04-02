<template>
  <header class="pt-5 pb-3 border-b dark:border-gray-800">
    <UContainer class="flex items-center justify-between">
      <div class="flex-1"></div>
      <NuxtLink to="/" class="text-2xl font-semibold text-center flex-1">Huntro</NuxtLink>
      <nav class="flex items-center space-x-4 flex-1 justify-end">
        <ClientOnly v-if="!colorMode.forced">
          <UButton
            :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
            color="neutral"
            variant="ghost"
            @click="isDark = !isDark"
            class="cursor-pointer "
          />
        </ClientOnly>
        <NuxtLink to="/signin" class="text-gray-700 font-medium dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100">Sign in</NuxtLink>
        <NuxtLink to="/signup"
          class="font-semibold rounded-lg px-2 py-1
          border border-gray-700 dark:border-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800
          text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100"
        >
          Sign up
        </NuxtLink>
      </nav>
    </UContainer>
  </header>
</template>

<script lang="ts" setup>
  const colorMode = useColorMode()

  const isDark = computed({
    get() {
      return colorMode.value === 'dark'
    },
    set() {
      colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
    }
  })
</script>
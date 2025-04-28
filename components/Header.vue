<template>
  <header class="
    pt-5 pb-3 top-0 sticky border-b-2 backdrop-blur-xs z-10 xl:px-52
    bg-white/25 dark:bg-slate-900/25 border-slate-200 dark:border-slate-800
  ">
    <div class="flex items-center justify-between px-5">
      <div class="flex-0 md:flex-1"></div>
      <NuxtLink to="/" class="text-2xl font-semibold md:text-center flex-1">Huntro</NuxtLink>
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
        <span v-if="!session" class="flex items-center space-x-4">
          <NuxtLink to="/signin" class="text-gray-700 font-medium dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100">Sign in</NuxtLink>
          <NuxtLink to="/signup"
            class="font-semibold rounded-lg px-2 py-1
            border border-gray-700 dark:border-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800
            text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100"
          >
            Sign up
          </NuxtLink>
        </span>
        <span v-else>
          <UButton
            color="neutral"
            variant="outline"
            @click="signOut"
            class="cursor-pointer"
          >
            Sign out
          </UButton>
        </span>
      </nav>
    </div>
  </header>
</template>

<script lang="ts" setup>
  const colorMode = useColorMode()
  const supabase = useSupabaseClient()
  const session = useSupabaseSession()


  const isDark = computed({
    get() {
      return colorMode.value === 'dark'
    },
    set() {
      colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
    }
  })


  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error.message)
    } else {
      navigateTo('/')
    }
  }
</script>
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-04-03',
  devtools: { enabled: true },
  ssr: false,
  css: ['~/assets/css/main.css'],

  modules: [
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxt/ui',
    '@pinia/nuxt',
    '@nuxtjs/supabase'
  ],

  supabase: {  
    useSsrCookies: true,
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    },
    redirectOptions: {
      login: '/signin',
      callback: '/confirm',
      include: ['/jobs', '/jobs/**'],
      exclude: ['/', '/signup', '/signin'],
      saveRedirectToCookie: true,
    },
  }
})
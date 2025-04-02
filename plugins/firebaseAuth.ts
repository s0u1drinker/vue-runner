import { defineNuxtPlugin } from '#app'
import { getAuth } from 'firebase/auth'

export default defineNuxtPlugin((nuxtApp) => {
  const auth = getAuth()
  
  // Добавляем Auth в контекст Nuxt
  nuxtApp.provide('auth', auth)
})
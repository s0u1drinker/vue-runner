// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  experimental: {
    defaults: {
      nuxtLink: {
        activeClass: 'navigation__link_active'
      }
    }
  },
  compatibilityDate: '2024-11-01',
  css: [
    '@/assets/css/main.css',
  ],
  modules: ['@nuxt/icon', '@nuxtjs/google-fonts', '@pinia/nuxt'],
  icon: {
    mode: 'svg',
    size: '16px'
  },
  googleFonts: {
    families: {
      'Open Sans': true
    }
  },
  postcss: {
    plugins: {
      'postcss-nested': {},
      'postcss-custom-media': {},
      autoprefixer: {},
    }
  },
  plugins: [
    { src: '@/plugins/firebase.ts', mode: 'client' },
    { src: '@/plugins/firebaseAuth.ts', mode: 'client' },
  ],
  runtimeConfig: {
    public: {
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
      FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
      FIREBASE_LOGIN: process.env.FIREBASE_LOGIN,
      FIREBASE_PASSWORD: process.env.FIREBASE_PASSWORD,
    }
  },
  devtools: { enabled: false }
})
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
  modules: [
    '@nuxt/icon',
    '@nuxtjs/google-fonts',
    '@pinia/nuxt',
    'nuxt-vuefire'
  ],
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
    { src: '@/plugins/loadData.ts' },
  ],
  vuefire: {
    config: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      appId: process.env.FIREBASE_APP_ID,
    }
  },
  devtools: { enabled: false }
})
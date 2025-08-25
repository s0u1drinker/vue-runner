// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  css: [
    '@/assets/css/main.css',
  ],
  devtools: { enabled: false },
  experimental: {
    defaults: {
      nuxtLink: {
        activeClass: 'navigation__link_active'
      }
    }
  },
  googleFonts: {
    families: {
      'Open Sans': true
    }
  },
  icon: {
    mode: 'svg',
    size: '16px',
    customCollections: [
      {
        prefix: 'custom-icons',
        dir: './assets/custom-icons'
      },
    ],
  },
  modules: [
    '@nuxt/icon',
    '@nuxtjs/google-fonts',
    '@pinia/nuxt',
    'nuxt-vuefire'
  ],
  plugins: [
    { src: '@/plugins/loadData.ts' },
  ],
  postcss: {
    plugins: {
      'postcss-nested': {},
      'postcss-custom-media': {},
      autoprefixer: {},
    }
  },
  vuefire: {
    config: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      appId: process.env.FIREBASE_APP_ID,
    }
  },
  runtimeConfig: {
    weatherApiKey: process.env.NUXT_WEATHER_API_KEY,
    public: {
      weatherApiUrl: process.env.NUXT_PUBLIC_WEATHER_API_URL,
    }
  },
})
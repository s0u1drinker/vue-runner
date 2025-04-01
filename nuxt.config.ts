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
    '@nuxtjs/google-fonts'
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
  devtools: { enabled: false }
})
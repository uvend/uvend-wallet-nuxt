// https://nuxt.com/docs/api/configuration/nuxt-config
const pagesDir = process.env.APP_ENV != '' 
  ? `pages/${process.env.APP_ENV}` 
  : 'pages'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', 'shadcn-nuxt', '@nuxt/icon','@pinia/nuxt'],
  build: {
    transpile: ['vue3-apexcharts']
  },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  },
  css: ['@/assets/css/tailwind.css'],
  vite: {
    define: {
      API_URL: JSON.stringify(process.env.API_URL || ''),
      VEND_URL: JSON.stringify(process.env.VEND_URL || ''),
      WALLET_API_URL : JSON.stringify(process.env.WALLET_API_URL || ''),
      STATEMENT_API: JSON.stringify(process.env.STATEMENT_API || ''),
      JSREPORT_URL: JSON.stringify(process.env.JSREPORT_URL || ''),
      MPESA_URL: JSON.stringify(process.env.MPESA_URL || ''),
      ADMIN_AUTH: JSON.stringify(process.env.ADMIN_AUTH || ''),
      VEND_TerminalID: JSON.stringify(process.env.VEND_TerminalID || ''),
      VEND_OperatorID: JSON.stringify(process.env.VEND_OperatorID || ''),
      APP_LOGO: JSON.stringify(process.env.APP_LOGO || ''),
      APP_BG_1: JSON.stringify(process.env.APP_BG_1 || ''),
      APP_BG_2: JSON.stringify(process.env.APP_BG_2 || ''),
      APP_BG_3: JSON.stringify(process.env.APP_BG_3 || ''),
      APP_FONT_COLOR_1: JSON.stringify(process.env.APP_FONT_COLOR_1 || ''),
      APP_FONT_COLOR_2: JSON.stringify(process.env.APP_FONT_COLOR_2 || ''),
      APP_FONT_COLOR_3: JSON.stringify(process.env.APP_FONT_COLOR_3 || ''),
      APP_ENV: JSON.stringify(process.env.NUXT_PUBLIC_APP_ENV || process.env.APP_ENV || ''),
      CUSTOMER_API: JSON.stringify(process.env.CUSTOMER_API || ''),
    }
  },
  ssr: false,// Not required in Tailwind 3+, but useful for older versions
  plugins: [
    '~/plugins/toast',
    '~/plugins/pinia',
    '~/plugins/apexcharts.client',
  ],
  dir: {
    pages: pagesDir
  },
  app: {
    head: {
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
        }
      ]
    }
  },
  runtimeConfig: {
    // Private keys are only available on the server
    // apiSecret: '123'

    // Public keys that are exposed to the client (runtime-configurable)
    public: {
      APP_ENV: process.env.NUXT_PUBLIC_APP_ENV || process.env.APP_ENV || 'default',
      API_URL: process.env.NUXT_PUBLIC_API_URL || process.env.API_URL || '',
      VEND_URL: process.env.NUXT_PUBLIC_VEND_URL || process.env.VEND_URL || '',
      WALLET_API_URL: process.env.NUXT_PUBLIC_WALLET_API_URL || process.env.WALLET_API_URL || '',
      STATEMENT_API: process.env.NUXT_PUBLIC_STATEMENT_API || process.env.STATEMENT_API || '',
      JSREPORT_URL: process.env.NUXT_PUBLIC_JSREPORT_URL || process.env.JSREPORT_URL || '',
      MPESA_URL: process.env.NUXT_PUBLIC_MPESA_URL || process.env.MPESA_URL || '',
      ADMIN_AUTH: process.env.NUXT_PUBLIC_ADMIN_AUTH || process.env.ADMIN_AUTH || '',
      VEND_TerminalID: process.env.NUXT_PUBLIC_VEND_TerminalID || process.env.VEND_TerminalID || '',
      VEND_OperatorID: process.env.NUXT_PUBLIC_VEND_OperatorID || process.env.VEND_OperatorID || '',
      APP_LOGO: process.env.NUXT_PUBLIC_APP_LOGO || process.env.APP_LOGO || '',
      APP_BG_1: process.env.NUXT_PUBLIC_APP_BG_1 || process.env.APP_BG_1 || '',
      APP_BG_2: process.env.NUXT_PUBLIC_APP_BG_2 || process.env.APP_BG_2 || '',
      APP_BG_3: process.env.NUXT_PUBLIC_APP_BG_3 || process.env.APP_BG_3 || '',
      APP_FONT_COLOR_1: process.env.NUXT_PUBLIC_APP_FONT_COLOR_1 || process.env.APP_FONT_COLOR_1 || '',
      APP_FONT_COLOR_2: process.env.NUXT_PUBLIC_APP_FONT_COLOR_2 || process.env.APP_FONT_COLOR_2 || '',
      APP_FONT_COLOR_3: process.env.NUXT_PUBLIC_APP_FONT_COLOR_3 || process.env.APP_FONT_COLOR_3 || '',
      CUSTOMER_API: process.env.NUXT_PUBLIC_CUSTOMER_API || process.env.CUSTOMER_API || ''
    }
  },
  routeRules: {
    '/registration/**': { 
      headers: {
        'x-middleware-cache': 'no-cache'
      }
    }
  },
  router: {
    options: {
      sensitive: false // Make routes case-insensitive
    }
  },
  experimental: {
    payloadExtraction: false
  }
})
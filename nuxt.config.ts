// https://nuxt.com/docs/api/configuration/nuxt-config
const pagesDir = 'pages/wallet'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', 'shadcn-nuxt', '@nuxt/icon','@pinia/nuxt','@vite-pwa/nuxt'],
  
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
      APP_BG_1: JSON.stringify(process.env.APP_BG_1 || ''),
      APP_BG_2: JSON.stringify(process.env.APP_BG_2 || ''),
      APP_BG_3: JSON.stringify(process.env.APP_BG_3 || ''),
      APP_FONT_COLOR_1: JSON.stringify(process.env.APP_FONT_COLOR_1 || ''),
      APP_FONT_COLOR_2: JSON.stringify(process.env.APP_FONT_COLOR_2 || ''),
      APP_FONT_COLOR_3: JSON.stringify(process.env.APP_FONT_COLOR_3 || ''),
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
// @ts-ignore
vitePWA: {
  injectRegister: 'auto',       // ensures manifest link is injected
  registerType: 'autoUpdate',
  includeAssets: ['favicon.ico', 'robots.txt', 'icons/*','screenshots/*'], // force real static assets
  devOptions: { enabled: true },
  manifest: {
    start_url:'/',
    scope:'/',
    display:'standalone',
    name: 'Uvend Wallet',
    short_name: 'Uvend Wallet',
    description: 'Uvend Wallet',
    display: 'standalone',
    theme_color: '#000000',
    background_color: '#000000',
    screenshots:[
      {
        src:'/screenshots/desktop.png',
        sizes:'1200x800',
        type:'image/png',
        form_factor:'wide'

      },
      {
        src:'/screenshots/mobile.png',
        sizes:'390x844',
        type:'image/png'

      }
    ],
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: "/icons/icon-144.png", sizes: '144x144', "type": "image/png" }

    ]
  },
  workbox: {
    navigateFallback: null,
    runtimeCaching: [],
    cleanupOutdatedCaches: true,
    clientsClaim: true,
    skipWaiting: true
  }
},

  app: {
    head: {
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
        }
      ],
      link: [
        {rel:'manifest', href:'/manifest.webmanifest'}
      ]
    }
    
  },
  runtimeConfig: {
    // Private keys are only available on the server
    // Public keys that are exposed to the client (runtime-configurable)
    public: {
      walletApiUrl: process.env.NUXT_PUBLIC_WALLET_API_URL || '',
    }
    
  },
  routeRules: {
    '/registration/**': { 
      headers: {
        'x-middleware-cache': 'no-cache',
        'Cache-Control': 'no-cache, no-store, must-revalidate'

      }
    },
    '/wallet/**': {
      headers: {
        'x-middleware-cache': 'no-cache',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
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
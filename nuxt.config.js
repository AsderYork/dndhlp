export default {

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'dndhlp',
    htmlAttrs: {
      lang: 'en'
    },
    bodyAttrs: {
      class: 'darktheme-pur'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
      { src: '/js/bootstrap.bundle.min.js' },
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    {src: '~/assets/css/main.css'},
    '@/assets/scss/main.scss'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/vuedraggable.js',
    { src: "~/plugins/vue-js-modal", mode: "client" },
    '~/plugins/tooltip.js',
    '~/plugins/formatDate.js',
    { src: '~/plugins/qrcode.js', mode: "client" },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxtjs/fontawesome',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    'bootstrap-vue/nuxt',
    '@nuxtjs/style-resources',
    'nuxt-socket-io',
    'nuxt-vue-select',
    '~/modules/socket',
    '@nuxtjs/auth-next',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: '/',
  },

  serverMiddleware: [
    { path: "/api", handler: "~/server-middleware/api.js" },
    { path: "/api/auth", handler: "~/server-middleware/auth.js" },
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },
  fontawesome: {
    icons: {
      solid: true,
    }
  },
  bootstrapVue: {
    bootstrapCSS: false,
    bootstrapVueCSS: false
  },
  styleResources: {
    scss: '@/assets/scss/_variables.scss'
  },
  io: {
    server: false,
    sockets: [ // Required
      { name: 'main',
      }
    ]
  },
  auth: {
    strategies: {
      local: {
        token: {
          property: 'token.accessToken',
          required: true,
          type: 'Bearer'
        },
        user: {
          property: false, // here should be `false`, as you defined in user endpoint `propertyName`
          autoFetch: false,
        },
        // `propertyName` in endpoint was depreacted
        endpoints: {
          login: { url: 'api/auth/login', method: 'post' },
          logout: { url: 'api/auth/logout', method: 'get' },
        }
      },
    },
    plugins: [ {src:'~/plugins/nuxt-auth.js', mode: 'server'} ]
  },
  router: {
    middleware: ['auth']
  }
}


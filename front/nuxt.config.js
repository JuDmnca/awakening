export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Awakening',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/pixi', mode: 'client' }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: [
    '~/components/',
    {
      path: '~/components/Forms/',
      prefix: 'Forms'
    },
    {
      path: '~/components/UI/',
      prefix: 'UI-'
    }
  ],

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
    '@nuxtjs/eslint-module'
  ],

  tailwindcss: {
    cssPath: '~/assets/style/tailwind.css',
    configPath: 'tailwind.config.js'
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    [
      '@nuxtjs/firebase',
      {
        config: {
          apiKey: 'AIzaSyCZCKxvIEkCNEYl0kDX2yzqedG-MVBm_G8',
          authDomain: 'awakening-55bb0.firebaseapp.com',
          databaseURL: 'https://awakening-55bb0-default-rtdb.firebaseio.com',
          projectId: 'awakening-55bb0',
          storageBucket: 'awakening-55bb0.appspot.com',
          messagingSenderId: '502680403739',
          appId: '1:502680403739:web:a6140bb864f5c0b5da9dbe',
          measurementId: 'G-PX3DCLFETZ'
        },
        services: {
          database: true,
          firestore: true,
          storage: true
        }
      }
    ]
  ],
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    vendor: ['pixi.js'],
    transpile: ['three/examples/jsm/controls/OrbitControls', 'three/examples/jsm/loaders/GLTFLoader', 'three/examples/jsm/postprocessing/EffectComposer.js', 'three/examples/jsm/postprocessing/RenderPass.js', 'three/examples/jsm/postprocessing/UnrealBloomPass.js', 'three/examples/jsm/loaders/DRACOLoader.js'],
    extend (config, ctx) {
      if (config.module) {
        config.module.rules.push({ test: /\.(vert|frag)$/i, use: ['raw-loader'] })
        config.module.rules.push({ test: /\.(glb|gltf)$/, use: ['file-loader'] })
        config.module.rules.push({ test: /\.(fbx|obj)$/, use: ['file-loader'] })
        config.module.rules.push({ test: /\.(ogg|mp3|wav|mpe?g)$/i, use: ['file-loader'] })
      }
      config.node = {
        fs: 'empty'
      }
    }
  }
}

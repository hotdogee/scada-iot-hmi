// Configuration for your app
// https://quasar.dev/quasar-cli/quasar-conf-js
require('dotenv').config()
const fs = require('fs')
const isWsl = require('is-wsl')
const path = require('path')
const _ = require('lodash')
const gitRevisionPlugin = new (require('git-revision-webpack-plugin'))()
// const Terser = require('terser-webpack-plugin')
const AddAssetPlugin = require('add-asset-webpack-plugin')
const env = {
  API_URL: JSON.stringify(process.env.API_URL),
  API_PATH: JSON.stringify(process.env.API_PATH),
  RECAPTCHA_SITE_KEY: JSON.stringify(process.env.RECAPTCHA_SITE_KEY),
  DEBUG: JSON.stringify(process.env.DEBUG),
  VERSION: JSON.stringify(gitRevisionPlugin.version()),
  COMMITHASH: JSON.stringify(gitRevisionPlugin.commithash()),
  VAPID_PUBLIC: JSON.stringify(process.env.VAPID_PUBLIC)
}

// use for devServer.open
let chromeName = ''
// let firefoxName = ''
// let chromeWslName = ''
// let firefoxWslName = ''
if (process.platform === 'darwin') {
  chromeName = 'google chrome canary'
  // firefoxName = 'firefox'
} else if (process.platform === 'win32' || isWsl) {
  chromeName = 'Chrome'
  // firefoxName = 'C:\\Program Files\\Mozilla Firefox\\firefox.exe'
  // chromeWslName = '/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe'
  // firefoxWslName = '/mnt/c/Program Files/Mozilla Firefox/firefox.exe'
} else if (process.platform === 'linux') {
  chromeName = 'google-chrome'
  // firefoxName = 'firefox'
}

module.exports = function (ctx) {
  const swPath = path.resolve('./src-pwa/custom-service-worker.js')
  return {
    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    boot: [
      'logger',
      'i18n',
      'font-size',
      'axios',
      'analytics',
      'feathers',
      'guards',
      'vuelidate',
      'vue-components',
      // 'vuera'
      'workbox'
    ],

    css: ['app.styl'],

    extras: [
      'ionicons-v4',
      // 'mdi-v3',
      'fontawesome-v5',
      // 'eva-icons',
      // 'themify',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!
      'roboto-font', // optional, you are not bound to it
      'material-icons' // optional, you are not bound to it
    ],

    framework: {
      // iconSet: 'ionicons-v4',
      // lang: 'de', // Quasar language

      // all: true, // --- includes everything; for dev only!

      components: [
        'QLayout',
        'QHeader',
        'QFooter',
        'QDrawer',
        'QPageContainer',
        'QPage',
        'QToolbar',
        'QToolbarTitle',
        'QBtn',
        'QIcon',
        'QList',
        'QItem',
        'QItemSection',
        'QItemLabel',
        'QSeparator',
        'QTabs',
        'QTab',
        'QRouteTab',
        'QCard',
        'QCardSection',
        'QCardActions',
        'QField',
        'QInput',
        'QTime',
        'QDate',
        'QMenu',
        'QDialog',
        'QPopupProxy'
      ],

      directives: ['Ripple', 'ClosePopup'],

      // Quasar plugins
      plugins: ['Notify'],
      lang: 'zh-hant' // Quasar language
    },

    supportIE: true,

    build: {
      scopeHoisting: true,
      vueRouterMode: 'history',
      devtool: 'source-map',
      // vueCompiler: true,
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      extendWebpack (cfg) {
        cfg.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /node_modules/,
          options: {
            formatter: require('eslint').CLIEngine.getFormatter('stylish')
          }
        })
        // cfg.plugins.push(new GitRevisionPlugin())
        if (ctx.mode.pwa) {
          let sw = fs.readFileSync(swPath, 'utf-8')
          _.forEach(Object.entries(env), ([k, v]) => {
            sw = sw.replace(new RegExp(`process.env.${k}`, 'g'), v)
          })
          cfg.plugins.unshift(
            new AddAssetPlugin(
              swPath,
              sw
              // fs.readFileSync('./src-pwa/custom-service-worker.js', 'utf-8')
              // 'console.log(`SW: ${process.env.VERSION}`)'
              // sw
            )
          )
        }
        // cfg.optimization.minimizer = cfg.optimization.minimizer || []
        // cfg.optimization.minimizer.push(new Terser({
        //   // Ensure .mjs files get included.
        //   test: /\.m?js$/
        // }))
        // cfg.node.__filename = true
      },
      env
    },

    devServer: {
      // https: true, // chrome://flags/#allow-insecure-localhost
      public: process.env.DEV_SERVER_PUBLIC || '',
      port: process.env.DEV_SERVER_PORT || 8082,
      open: chromeName // opens browser window automatically
    },

    animations: 'all', // --- includes all animations
    // animations: [],

    ssr: {
      pwa: false
    },

    pwa: {
      // workboxPluginMode: 'GenerateSW',
      workboxPluginMode: 'InjectManifest',
      workboxOptions: {
        // skipWaiting: true,
        // clientsClaim: true
        // importWorkboxFrom: 'local'
        exclude: [swPath]
      },
      manifest: {
        name: '地熱發電監控系統',
        short_name: '\u5730\u71b1\u767c\u96fb',
        // description: 'SCADA/IoT Human Machine Interface',
        start_url: '/',
        theme_color: '#4caf50',
        background_color: '#4caf50',
        display: 'standalone',
        icons: [
          {
            src: 'statics/icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png'
          },
          {
            src: 'statics/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'statics/icons/icon-256x256.png',
            sizes: '256x256',
            type: 'image/png'
          },
          {
            src: 'statics/icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png'
          },
          {
            src: 'statics/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    },

    cordova: {
      // id: 'in.hanl.scada',
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
      iosStatusBarPadding: false, // add the dynamic top padding on iOS mobile devices
      backButtonExit: true // Quasar handles app exit on mobile phone back button
    },

    electron: {
      // bundler: 'builder', // or 'packager'

      extendWebpack (cfg) {
        // do something with Electron main process Webpack cfg
        // chainWebpack also available besides this extendWebpack
      },

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options
        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',
        // Windows only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration
        // appId: 'scada-iot-hmi'
      }
    }
  }
}

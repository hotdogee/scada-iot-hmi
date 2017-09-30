// === DEFAULT / CUSTOM STYLE ===
// WARNING! always comment out ONE of the two require() calls below.
// 1. use next line to activate CUSTOM STYLE (./src/themes)
require(`./themes/app.${__THEME}.styl`)
// 2. or, use next line to activate DEFAULT QUASAR STYLE
// require(`quasar/dist/quasar.${__THEME}.css`)
// ==============================

// Uncomment the following lines if you need IE11/Edge support
// require(`quasar/dist/quasar.ie`)
// require(`quasar/dist/quasar.ie.${__THEME}.css`)

import Vue from 'vue'
import Quasar from 'quasar'
import Trend from 'vuetrend'
import * as api from './api'
import store from './store'
import router from './router'

Vue.config.productionTip = false
Vue.use(Quasar) // Install Quasar Framework
Vue.use(Trend)

if (__THEME === 'mat') {
  require('quasar-extras/roboto-font')
}
import 'quasar-extras/material-icons'
// import 'quasar-extras/ionicons'
// import 'quasar-extras/fontawesome'
// import 'quasar-extras/animate'

api.socket.on('connect', function () {
  // console.log('connected')
  api.logs.removeAllListeners('created')
  store.dispatch('findLogs')
  store.dispatch('getLogsTotal')
})
api.socket.on('disconnect', function () {
  // console.log('disconnected')
})

/* eslint-disable no-new */
new Vue({
  el: '#q-app',
  store,
  router,
  render: h => h(require('./App'))
})

global.store = store

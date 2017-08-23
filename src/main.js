import Vue from 'vue'
import Vuetify from 'vuetify'
import Trend from 'vuetrend'
import App from './App'
import store from './store'
import router from './router'

Vue.use(Vuetify)
Vue.use(Trend)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App),
  created: function () {
    store.dispatch('findLogs')
  }
})

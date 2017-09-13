import Vue from 'vue'
import Vuetify from 'vuetify'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import Trend from 'vuetrend'
import App from './App'
import { socket } from './api'
import store from './store'
import router from './router'

socket.on('connect', function(){
  // console.log('connected')
  store.dispatch('findLogs')
});
socket.on('disconnect', function(){
  // console.log('disconnected')
});

Vue.use(Vuetify)
Vue.use(Trend)
Vue.use(ElementUI)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App),
  created: function () {
  }
})

global.store = store

import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

function load (component) {
  // '@' is aliased to src/components
  return () => import(`@/${component}.vue`)
}

export default new VueRouter({
  /*
   * NOTE! VueRouter "history" mode DOESN'T works for Cordova builds,
   * it is only to be used only for websites.
   *
   * If you decide to go with "history" mode, please also open /config/index.js
   * and set "build.publicPath" to something other than an empty string.
   * Example: '/' instead of current ''
   *
   * If switching back to default "hash" mode, don't forget to set the
   * build publicPath back to '' so Cordova builds work again.
   */
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Index',
      redirect: { name: 'PlcCard' },
      component: load('Index'),
      children: [
        {
          path: 'text',
          name: 'PlcText',
          component: load('PlcText')
        },
        {
          path: 'card',
          name: 'PlcCard',
          component: load('PlcCard')
        },
        {
          path: 'chart',
          name: 'PlcChart',
          component: load('PlcChart')
        },
        {
          path: 'cam',
          name: 'PlcCam',
          component: load('PlcCam')
        },
        {
          path: 'dcs',
          name: 'PlcDcs',
          component: load('PlcCard')
        }
      ]
    },
    {
      path: '*',
      component: load('Error404')
    } // Not found
  ]
})

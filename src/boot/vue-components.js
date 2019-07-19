// import VirtualCollection from 'vue-virtual-collection'
import Trend from 'vuetrend'
import Bars from 'vuebars'

export default ({ app, router, Vue }) => {
  // Vue.use(VirtualCollection)
  Vue.use(Trend)
  Vue.use(Bars)
}

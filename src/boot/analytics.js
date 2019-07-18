import VueAnalytics from 'vue-analytics'

const isProd = process.env.NODE_ENV === 'production'
export default ({ app, store, router, Vue }) => {
  Vue.use(VueAnalytics, {
    id: 'UA-108822113-1',
    router,
    autoTracking: {
      exception: true
    },
    debug: {
      enabled: !isProd,
      sendHitTask: isProd
    }
  })
}

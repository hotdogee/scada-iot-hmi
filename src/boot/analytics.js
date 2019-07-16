import VueAnalytics from 'vue-analytics'

const isProd = process.env.NODE_ENV === 'production'

export default ({ app, store, router, Vue }) => {
  Vue.use(VueAnalytics, {
    id: 'UA-133313320-2',
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

import { defineBoot } from '#q-app/wrappers'
import { configure } from 'vue-gtag'

export default defineBoot(({ router }) => {
  configure({
    tagId: process.env.GA_MEASUREMENT_ID || '',
    pageTracker: {
      router,
    },
  })
})

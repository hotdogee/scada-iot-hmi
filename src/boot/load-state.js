import store from 'src/store'
import { getState } from 'src/store/storage'

export default ({ app, router, Vue }) => {
  router.beforeEach((to, from, next) => {
    if (store.initialized) {
      return Promise.resolve()
    }
    return getState().then(state => store.commit('loadFromCache', state))
  })
}

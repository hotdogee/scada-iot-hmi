import Vue from 'vue'
import Vuex from 'vuex'
import localforage from 'localforage'
import VuexPersist from 'vuex-persist'

import user from './user'
import system from './system'
import notifications from './notifications'
import localSettings from './local-settings'

Vue.use(Vuex)

const ignore = new Set([
  'setPending'
  // 'system/setVersion',
  // 'system/setStatus'
])
const vuexPersist = new VuexPersist({
  key: 'infans-persist',
  storage: localforage,
  asyncStorage: true,
  strictMode: true,
  // don't persist pending
  filter: mutation => {
    // logger.info(mutation)
    // {
    //   payload: {sw: "v0.0.1-10-g3b7f4761", ui: "v0.0.1-10-g3b7f4761"}
    //   type: "system/setVersion"
    // }
    // logger.info(mutation.type, !ignore.has(mutation.type))
    return !ignore.has(mutation.type)
  },
  reducer: state => {
    const s = Object.assign({}, state)
    delete s.system
    return s
  }
})

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      user,
      system,
      notifications,
      localSettings
    },
    plugins: [vuexPersist.plugin],

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  })

  return Store
}

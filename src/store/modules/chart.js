import * as api from '../../api'
import * as types from '../mutation-types'

// initial state
const state = {
}

// getters
const getters = {
}

// actions
const actions = {
  getLogsCountInRange ({ state, commit, rootState }, payload) {
    // getChartData({start: start, end: end})
    // console.log('store.dispatch - findLogs')
    const params = {
      query: {
        $limit: 0,
        logTime: {
          $gt: new Date(payload.start).toISOString(),
          $lt: new Date(payload.end).toISOString()
        }
      }
    }
    api.logs.find(params).then(results => {
      console.log('logs.find:', results)
      // api.logs.removeAllListeners('created')
      // commit(types.SET_LOGS, {
      //   logs: results.data
      // })
      // api.logs.on('created', log => {
      //   commit(types.ADD_LOG, {
      //     log
      //   })
      // })
    }).catch(err => {
      console.log('logs.find:', err)
    })
  }
}

// mutations
const mutations = {
  // [types.RECEIVE_PRODUCTS] (state, { products }) {
  //   state.all = products
  // },

  // [types.ADD_TO_CART] (state, { id }) {
  //   state.all.find(p => p.id === id).inventory--
  // }
}

export default {
  state,
  getters,
  actions,
  mutations
}

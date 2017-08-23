import * as api from '../api'
import * as types from './mutation-types'

export const findLogs = ({ commit }) => {
  const params = {
    query: {
      $limit: 100,
      $sort: {
        logTime: -1
      }
    }
  }
  api.logs.find(params).then(results => {
    api.logs.removeAllListeners('created')
    commit(types.SET_LOGS, {
      logs: results.data
    })
    api.logs.on('created', log => {
      commit(types.ADD_LOG, {
        log
      })
    })
  }).catch(err => {
    console.log('logs.find:', err)
  })
}

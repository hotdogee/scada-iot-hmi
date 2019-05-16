import * as api from '../api'
import * as types from './mutation-types'

export const getLogsTotal = ({ state, commit }, payload) => {
  // getChartData({from: from, to: to})
  // console.log('store.dispatch - findLogs')
  const paramses = [{
    query: {
      $limit: 1,
      $sort: {
        logTime: 1
      }
    }
  },
  {
    query: {
      $limit: 1,
      $sort: {
        logTime: -1
      }
    }
  }]
  const promises = paramses.map(params => api.logs.find(params))
  commit(types.SET_LOGS_TOTAL, {
    total: -1
  })
  commit(types.SET_LOGS_START, {
    start: -1
  })
  commit(types.SET_LOGS_END, {
    end: -1
  })
  Promise.all(promises).then(results => {
    // console.log('logs.find:', results)
    // api.logs.removeAllListeners('created')
    commit(types.SET_LOGS_TOTAL, {
      total: results[0].total
    })
    commit(types.SET_LOGS_START, {
      start: results[0].data[0].logTime
    })
    commit(types.SET_LOGS_END, {
      end: results[1].data[0].logTime
    })
    api.logs.on('created', log => {
      commit(types.ADD_LOGS_TOTAL, {
        total: 1
      })
      commit(types.SET_LOGS_END, {
        end: log.logTime
      })
    })
  }).catch(err => {
    console.log('logs.find:', err)
  })
}

export const findLogs = ({ commit }) => {
  // console.log('store.dispatch - findLogs')
  const params = {
    query: {
      $limit: 200,
      $sort: {
        logTime: -1
      }
    }
  }
  api.logs.find(params).then(results => {
    console.log('logs.find:', results)
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
    findLogs({ commit })
  })
}

export const getLogs = ({ commit }, payload) => {
  // getChartData({start: start, end: end})
  // console.log('store.dispatch - findLogs')
  const params = {
    query: {
      $limit: 10000,
      $sort: {
        logTime: -1
      },
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

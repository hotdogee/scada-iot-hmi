/*
export async function someAction (
  { commit, dispatch, state, getters, rootState, rootGetters },
  payload
) {
}
*/
import Logger from 'assets/logger'
const logger = new Logger('logs.actions')

// export async function skipWaiting (
//   { commit, dispatch, state, getters, rootState, rootGetters },
//   payload = { type: 'SKIP_WAITING' }
// ) {
//   try {
//     // Send a message telling the service worker to skip waiting.
//     // This will trigger the `controlling` event handler
//     const wb = new Workbox(process.env.SERVICE_WORKER_FILE)
//     await wb.register()
//     wb.messageSW(payload)
//   } catch (error) {
//     logger.error('skipWaiting:', error)
//   }
// }
export async function setupRealtimeUpdates (
  { commit, dispatch, state, getters, rootState, rootGetters },
  payload
) {
  const params = {
    query: {
      $limit: 200,
      $sort: {
        logTime: -1
      }
    }
  }
  try {
    // document.getElementById('q-app').__vue__.$feathers.api.service('logs').find(params)
    const service = this.$feathers.api.service('logs')
    const results = await service.find(params)
    commit('setLogs', {
      logs: results.data
    })
    commit('setTotal', {
      total: results.total
    })
    service.on('created', log => {
      commit('addLog', {
        log
      })
      commit('addTotal', {
        total: 1
      })
    })
  } catch (error) {
    logger.error('setupRealtimeUpdates:', error)
  }
}

export async function findStartDateTime (
  { commit, dispatch, state, getters, rootState, rootGetters },
  payload
) {
  const params = {
    query: {
      $limit: 1,
      $sort: {
        logTime: 1
      }
    }
  }
  try {
    // document.getElementById('q-app').__vue__.$feathers.api.service('logs').find(params)
    const service = this.$feathers.api.service('logs')
    const results = await service.find(params)
    commit('setStart', {
      start: results.data[0].logTime
    })
  } catch (error) {
    logger.error('findStart:', error)
  }
}

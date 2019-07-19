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
    const service = this.$feathers.api.service('logs')
    const results = service.find(params)
    commit('setLogs', {
      logs: results.data
    })
    service.on('created', log => {
      commit('addLog', {
        log
      })
    })
  } catch (error) {
    logger.error('setupRealtimeUpdates:', error)
  }
}

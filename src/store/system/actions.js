/*
export async function someAction (
  { commit, dispatch, state, getters, rootState, rootGetters },
  payload
) {
}
*/
import { Workbox } from 'workbox-window'
import Logger from 'assets/logger'
const logger = new Logger('system.actions')

export async function skipWaiting (
  { commit, dispatch, state, getters, rootState, rootGetters },
  payload = { type: 'SKIP_WAITING' }
) {
  try {
    // Send a message telling the service worker to skip waiting.
    // This will trigger the `controlling` event handler
    const wb = new Workbox(process.env.SERVICE_WORKER_FILE)
    await wb.register()
    wb.messageSW(payload)
  } catch (error) {
    logger.error('skipWaiting:', error)
  }
}

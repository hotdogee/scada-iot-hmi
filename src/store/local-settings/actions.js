/*
export function someAction ({ commit, dispatch, state, getters, rootState, rootGetters }, payload) {
}
*/
import Logger from 'assets/logger'
const logger = new Logger('settings.actions')

export async function detectLocale (
  { commit, dispatch, state, getters, rootState, rootGetters },
  payload
) {
  try {
  } catch (error) {
    logger.error('refreshToken:', error)
    // TypeError: Cannot read property 'publicKey' of null
    // {name: "NotAuthenticated", message: "Strategy ecdsa is not permitted", code: 401, className: "not-authenticated", errors: {…}}
  }
}

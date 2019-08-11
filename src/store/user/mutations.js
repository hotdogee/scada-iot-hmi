import Vue from 'vue'
// import { isEqual } from 'lodash'
import serializeError from 'serialize-error'
import initialState from './state'
// import { Quasar } from 'quasar'
import Logger from 'assets/logger'
const logger = new Logger('user.mutations')
/*
export function someMutation (state, payload) {
}
*/

export function setUser (state, { user }) {
  state.user = user
}

export const setField = (state, { field, val }) => {
  state.user.hasOwnProperty(field) ? (state.user[field] = val) : Vue.set(state.user, field, val)
}

export function setLocale (state, { locale }) {
  state.user.locale = locale
}

export function setKey (state, { key, publicKey }) {
  state.key = key
  state.publicKey = publicKey
}

export function setAccessToken (state, { accessToken }) {
  state.accessToken = accessToken
}

export function setPayload (state, { payload }) {
  state.payload = payload
}

export function signOut (state) {
  // reset user store state back to guest state
  Object.assign(state, initialState())
}
// export function setErrors (state, { errors }) {
//   if (!isEqual(state.errors, errors)) {
//     state.errors = errors
//   }
// }

export function setErrors (state, { errors }) {
  logger.log(`error ${errors}`)
  state.errors = Object.assign({}, serializeError(errors))
}

export function setPending (state, { pending, from }) {
  logger.log('user pending', pending, from)
  state.pending = pending
}

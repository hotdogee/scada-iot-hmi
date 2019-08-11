/*
export function someGetter (state, getters, rootState, rootGetters) {
}
*/

export function locale (state, getters, rootState, rootGetters) {
  if (!state.locale || state.locale === 'default') {
    return 'en-us'
  } else {
    return state.locale
  }
}

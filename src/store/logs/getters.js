// import _ from 'lodash'
// import Logger from 'assets/logger'
// const logger = new Logger('logs.getters')
/*
export function someGetter (state) {
}
*/
export function currentLogTime (state, getters) {
  if (!state.end) return 'loading...'
  return new Date(state.end).toLocaleString()
}

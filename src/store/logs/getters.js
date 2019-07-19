// import _ from 'lodash'
// import Logger from 'assets/logger'
// const logger = new Logger('system.getters')
/*
export function someGetter (state) {
}
*/
export function currentLogTime (state, getters) {
  if (!state.logs.length) return 'loading...'
  return new Date(state.logs[0].logTime).toLocaleString()
}

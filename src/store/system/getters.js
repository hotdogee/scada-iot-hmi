// import _ from 'lodash'
// import Logger from 'assets/logger'
// const logger = new Logger('system.getters')
/*
export function someGetter (state) {
}
*/
export function versions (state) {
  return Object.entries(state.version).map(([k, v]) => {
    return {
      name: k,
      version: v
    }
  })
}

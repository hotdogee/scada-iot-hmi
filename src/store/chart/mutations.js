// import initialState from './state'
// import Logger from 'assets/logger'
// const logger = new Logger('chart.mutations')
/*
export function someMutation (state, payload) {
}
*/

export function setBucket (state, { bucket }) {
  state.bucket = bucket
}

export function setTotal (state, { total }) {
  state.total = total
}

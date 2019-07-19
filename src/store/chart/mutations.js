// import initialState from './state'
import Vue from 'vue'
import _ from 'lodash'
// import Logger from 'assets/logger'
// const logger = new Logger('chart.mutations')
/*
export function someMutation (state, payload) {
}
*/

export function setVersion (state, payload) {
  _.forEach(Object.entries(payload), ([k, v]) => {
    Vue.set(state.version, k, v)
  })
}

export function setStatus (state, payload) {
  _.forEach(Object.entries(payload), ([k, v]) => {
    Vue.set(state.status, k, v)
  })
}

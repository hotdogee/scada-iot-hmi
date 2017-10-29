import _ from 'lodash'
// import util from 'util'
import * as api from '../../api'
import * as types from '../mutation-types'

// initial state
const state = {
  total: null,
  bucket: null,
  logsLength: 0
}

// Leave logs out of state, the browser crashes if state.logs has over 20k items,
// and starts to feel slow when it has over 1k items
// let logs = []
let rtuRegs = {}

// getters
const getters = {
  // chartLogs (state, getters, rootState, rootGetters) {
  //   // clear computed cache when logsLength changes
  //   state.logsLength // eslint-disable-line no-unused-expressions
  //   return logs
  // },
  chartRtuRegs (state, getters, rootState, rootGetters) {
    // clear computed cache when logsLength changes
    state.logsLength // eslint-disable-line no-unused-expressions
    return rtuRegs
  }
}

// actions
const actions = {
  getLogsCountInRange ({ state, commit, rootState }, payload) {
    // getChartData({from: from, to: to})
    // console.log('store.dispatch - findLogs')
    const params = {
      query: {
        $limit: 0,
        logTime: {
          $gt: new Date(payload.from).toISOString(),
          $lt: new Date(payload.to).toISOString()
        }
      }
    }
    commit(types.SET_CHART_TOTAL, {
      total: -1
    })
    api.logs.find(params).then(results => {
      // console.log('logs.find:', results)
      // api.logs.removeAllListeners('created')
      commit(types.SET_CHART_TOTAL, {
        total: results.total
      })
      // api.logs.on('created', log => {
      //   commit(types.ADD_LOG, {
      //     log
      //   })
      // })
    }).catch(err => {
      console.log('logs.find:', err)
    })
  },
  async getChartLogsInRange ({ state, commit, rootState }, payload) {
    let url = `${api.url}/logs?$client[chart]=true`
    if (payload.from) {
      const from = new Date(payload.from).toISOString()
      url += `&logTime[$gt]=${from}`
    }
    if (payload.to) {
      const to = new Date(payload.to).toISOString()
      url += `&logTime[$lt]=${to}`
    }
    const chartLogs = await (await fetch(url)).json()
    // console.log(`bucket: ${chartLogs.bucket}`)
    commit(types.SET_CHART_BUCKET, {
      bucket: chartLogs.bucket
    })
    payload.done(chartLogs)
  },
  async getLogsInRange ({ state, commit, rootState }, payload) {
    // getChartData({from: from, to: to})
    // console.log('store.dispatch - findLogs')
    const t0 = performance.now()
    const itemsPerPage = 1000
    const fromString = new Date(payload.from).toISOString()
    const toString = new Date(payload.to).toISOString()
    const totalParams = {
      query: {
        $limit: 0,
        logTime: {
          $gt: new Date(payload.from).toISOString(),
          $lt: new Date(payload.to).toISOString()
        }
      }
    }
    const total = await api.logs.find(totalParams).then(results => {
      // console.log('logs.find total:', results)
      // api.logs.removeAllListeners('created')
      return results.total
      // api.logs.on('created', log => {
      //   commit(types.ADD_LOG, {
      //     log
      //   })
      // })
    }).catch(err => {
      console.log('logs.find total:', err)
    })
    // build params list
    const urls = _.range(0, total, itemsPerPage).map((start) => {
      // /logs?$limit=itemsPerPage&$skip=start&logTime[$gt]=fromString&logTime[$lt]=toString
      return `${api.url}/logs?$limit=${itemsPerPage}&$skip=${start}&logTime[$gt]=${fromString}&logTime[$lt]=${toString}`
    })
    const logPromises = urls.map(async url => {
      const response = await fetch(url)
      // console.log('logs.find:', response)
      console.log('time:', ((performance.now() - t0) / 1000).toFixed(2), url)
      // logs.find: Response {type: "cors", redirected: false, status: 200, ok: true,}
      // time: 50640.835 (3x speed up compared to sequential ws)
      return response.json()
    })
    commit(types.SET_CHART_LOGS_LENGTH, {
      logsLength: 0
    })
    // logs = new Array(total)
    rtuRegs = {}
    let i = 0
    let x = new Array(total)
    for (let results of logPromises) {
      const newLogs = (await results).data
      // console.log('logs.find results:', newLogs)
      // logs = logs.concat(newLogs)
      // build rtuRegs = ['rtuRegTitle': {x: [], y: [], rtuName, regName, addr, unit}, ...]
      _.forEach(newLogs, (log) => { // oldest log first
        // logs[i] = log
        let addrs = new Set()
        x[i] = new Date(log.logTime).getTime()
        _.forEach(log.reads, (rtu) => {
          if (!addrs.has(rtu.addr)) {
            addrs.add(rtu.addr)
            _.forEach(rtu.reads, (reg) => {
              // 'M1-九號井口-溫度(°C)'
              const header = `M${rtu.addr}-${rtu.name}-${reg.name}${reg.unit ? '(' + reg.unit + ')' : ''}`
              if (!rtuRegs[header]) {
                rtuRegs[header] = {
                  x: x,
                  y: new Array(total),
                  rtu: rtu.name,
                  addr: rtu.addr,
                  reg: reg.name,
                  unit: reg.unit,
                  header: header
                }
              }
              // rtuRegs[header].x[i] = logTime
              rtuRegs[header].y[i] = reg.value
            })
          }
        })
        i++
      })
      commit(types.SET_CHART_LOGS_LENGTH, {
        logsLength: i
      })
    }
    payload.done()
    // This will timeout
    // let logPromises = _.range(0, total, itemsPerPage).map((start) => {
    //   const params = {
    //     query: {
    //       $limit: itemsPerPage,
    //       $skip: start,
    //       logTime: {
    //         $gt: new Date(payload.from).toISOString(),
    //         $lt: new Date(payload.to).toISOString()
    //       }
    //     }
    //   }
    //   return api.logs.find(params).then(results => {
    //     console.log('logs.find:', results)
    //     console.log('time:', performance.now() - t0)
    //     return results.total
    //   })
    // })
    // for (let results of logPromises) {
    //   console.log('logs.find results:', await results)
    // }

    // This takes too long
    // let paramsList = _.range(0, total, itemsPerPage).map((start) => {
    //   return {
    //     query: {
    //       $limit: itemsPerPage,
    //       $skip: start,
    //       logTime: {
    //         $gt: new Date(payload.from).toISOString(),
    //         $lt: new Date(payload.to).toISOString()
    //       }
    //     }
    //   }
    // })
    // for (let params of paramsList) {
    //   const results = await api.logs.find(params).then(results => {
    //     console.log('logs.find:', results)
    //     console.log('time:', performance.now() - t0)
    //     // logs.find: {total: 64922, limit: 1000, skip: 64000, data: Array(922)}
    //     // time: 182238.67500000002
    //     return results
    //   })
    //   console.log('logs.find results:', results)
    // }
  }
}

// mutations
const mutations = {
  [types.SET_CHART_TOTAL] (state, { total }) {
    state.total = total
  },
  // [types.SET_CHART_LOGS] (state, { logs }) {
  //   state.logs = logs
  // },
  // [types.CONCAT_CHART_LOGS] (state, { logs }) {
  //   // state.logs = state.logs.concat(logs)
  //   state.logs.push(...logs)
  // },
  [types.SET_CHART_LOGS_LENGTH] (state, { logsLength }) {
    // state.logs = state.logs.concat(logs)
    state.logsLength = logsLength
  },
  [types.SET_CHART_BUCKET] (state, { bucket }) {
    // state.logs = state.logs.concat(logs)
    state.bucket = bucket
  }
  // [types.ADD_TO_CART] (state, { id }) {
  //   state.all.find(p => p.id === id).inventory--
  // }
}

export default {
  state,
  getters,
  actions,
  mutations
}

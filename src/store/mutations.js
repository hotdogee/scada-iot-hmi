import _ from 'lodash'
import util from 'util'
import * as types from './mutation-types'

export default {
  [types.SET_LOGS] (state, { logs }) {
    setLogs(state, logs)
  },
  [types.ADD_LOG] (state, { log }) {
    addLog(state, log)
  },
  [types.SET_LOGS_TOTAL] (state, { total }) {
    state.logsTotal = total
  },
  [types.ADD_LOGS_TOTAL] (state, { total }) {
    state.logsTotal += total
  },
  [types.SET_LOGS_START] (state, { start }) {
    state.logsStart = start
  },
  [types.SET_LOGS_END] (state, { end }) {
    state.logsEnd = end
  }
}

function setLogs (state, logs) {
  state.logs = logs
  let regList = {}
  let chartData = {}
  _.forEachRight(logs, (log) => { // oldest log first
    _.forEach(log.reads, (rtu) => {
      _.forEach(rtu.reads, (reg) => {
        if (!regList[rtu.name]) {
          regList[rtu.name] = {}
        }
        if (!regList[rtu.name][reg.name]) {
          regList[rtu.name][reg.name] = []
        }
        regList[rtu.name][reg.name].push(reg)
        // 'M1-九號井口-溫度(°C)'
        let header = util.format('M%s-%s-%s(%s)', rtu.addr, rtu.name, reg.name, reg.unit)
        if (!chartData[header]) {
          chartData[header] = []
        }
        chartData[header].push(reg)
      })
    })
  })
  state.regList = regList
  state.chartData = chartData
}

function addLog (state, log) {
  state.logs.unshift(log)
  state.logs.pop()
  _.forEach(log.reads, (rtu) => {
    _.forEach(rtu.reads, (reg) => {
      if (!state.regList[rtu.name]) {
        state.regList[rtu.name] = {}
      }
      if (!state.regList[rtu.name][reg.name]) {
        state.regList[rtu.name][reg.name] = []
      }
      state.regList[rtu.name][reg.name].push(reg)
      state.regList[rtu.name][reg.name].shift()
      // 'M1-九號井口-溫度(°C)'
      let header = util.format('M%s-%s-%s(%s)', rtu.addr, rtu.name, reg.name, reg.unit)
      if (!state.chartData[header]) {
        state.chartData[header] = []
      }
      state.chartData[header].push(reg)
      state.chartData[header].shift()
    })
  })
}

/*
{
  "name": "Geo9",
  "logTime": "2017-08-06T07:16:56.741Z",
  "reads": [
    {
    "name": "九號井口",
    "addr": 1,
    "reads": [
      {
      "name": "溫度",
      "unit": "°C",
      "value": 175.1509246826172
      }
    ]
    },
  ]
}
*/

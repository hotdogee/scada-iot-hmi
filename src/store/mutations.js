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
const limit = 100

function setLogs (state, logs) {
  state.logs = logs
  const regList = {}
  const chartData = {}
  const cardData = {}
  _.forEachRight(logs, (log) => { // oldest log first
    _.forEach(log.reads, (rtu) => {
      _.forEach(rtu.reads, (reg) => {
        if (Array.isArray(reg.value)) return
        // 'M1-九號井口'
        const addrName = util.format('M%s-%s', rtu.addr, rtu.name)
        if (!regList[addrName]) {
          regList[addrName] = {}
        }
        if (!regList[addrName][reg.name]) {
          regList[addrName][reg.name] = []
        }
        regList[addrName][reg.name].push(reg)
        if (regList[addrName][reg.name].length > limit) {
          regList[addrName][reg.name].shift()
        }
        // cardData
        if (!cardData[addrName]) {
          cardData[addrName] = {}
        }
        if (!cardData[addrName][reg.name]) {
          cardData[addrName][reg.name] = {
            trend: []
          }
        }
        cardData[addrName][reg.name].current = reg
        cardData[addrName][reg.name].trend.push(Math.round(reg.value * 10000) / 100)
        if (cardData[addrName][reg.name].trend.length > limit) {
          cardData[addrName][reg.name].trend.shift()
        }
        // 'M1-九號井口-溫度(°C)'
        const header = util.format('M%s-%s-%s(%s)', rtu.addr, rtu.name, reg.name, reg.unit)
        if (!chartData[header]) {
          chartData[header] = []
        }
        chartData[header].push(reg)
        if (chartData[header].length > limit) {
          chartData[header].shift()
        }
      })
    })
  })
  state.regList = regList
  state.cardData = cardData
  state.chartData = chartData
}

function addLog (state, log) {
  state.logs.unshift(log)
  while (state.logs.length > limit) {
    state.logs.pop()
  }
  _.forEach(log.reads, (rtu) => {
    _.forEach(rtu.reads, (reg) => {
      if (Array.isArray(reg.value)) return
      // 'M1-九號井口'
      const addrName = util.format('M%s-%s', rtu.addr, rtu.name)
      if (!state.regList[addrName]) {
        state.regList[addrName] = {}
      }
      if (!state.regList[addrName][reg.name]) {
        state.regList[addrName][reg.name] = []
      }
      state.regList[addrName][reg.name].push(reg)
      while (state.regList[addrName][reg.name].length > limit) {
        state.regList[addrName][reg.name].shift()
      }
      // cardData
      if (!state.cardData[addrName]) {
        state.cardData[addrName] = {}
      }
      if (!state.cardData[addrName][reg.name]) {
        state.cardData[addrName][reg.name] = {
          trend: []
        }
      }
      state.cardData[addrName][reg.name].current = reg
      state.cardData[addrName][reg.name].trend.push(Math.round(reg.value * 10000) / 100)
      while (state.cardData[addrName][reg.name].trend.length > limit) {
        state.cardData[addrName][reg.name].trend.shift()
      }
      // 'M1-九號井口-溫度(°C)'
      const header = util.format('M%s-%s-%s(%s)', rtu.addr, rtu.name, reg.name, reg.unit)
      if (!state.chartData[header]) {
        state.chartData[header] = []
      }
      state.chartData[header].push(reg)
      while (state.chartData[header].length > limit) {
        state.chartData[header].shift()
      }
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

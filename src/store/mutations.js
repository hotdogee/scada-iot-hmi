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
const prefixExp = {
  'k': 3,
  'M': 6,
  'G': 9,
  'T': 12,
  'P': 15
}
const expPrefix = Object.keys(prefixExp).reduce((o, p) => {
  o[prefixExp[p]] = p
  return o
}, {})

function setLogs (state, logs) {
  state.logs = logs
  const chartData = {}
  const cardData = {}
  _.forEachRight(logs, (log) => { // oldest log first
    _.forEach(log.reads, (rtu) => {
      _.forEach(rtu.reads, (reg) => {
        const addrName = util.format('M%s-%s', rtu.addr, rtu.name)
        // cardData init
        if (!cardData[addrName]) {
          cardData[addrName] = {}
        }
        // THD
        if (Array.isArray(reg.value)) {
          const name = reg.name.replace('諧波比', '總諧波失真')
          if (!cardData[addrName][name]) {
            cardData[addrName][name] = {}
          }
          const thd = Math.sqrt(reg.value.reduce((a, v) => {
            a += v * v
            return a
          }, 0))
          cardData[addrName][name].value = thd.toFixed(2)
          cardData[addrName][name].unit = reg.unit
          cardData[addrName][name].bars = reg.value
          return
        }
        // cardData
        if (!cardData[addrName][reg.name]) {
          cardData[addrName][reg.name] = {
            trend: []
          }
        }
        const unit = prefixExp[reg.unit[0]] ? reg.unit.slice(1) : reg.unit
        let exp = prefixExp[reg.unit[0]] || 0
        let value = reg.value
        while (value > 10000) {
          value /= 1000
          exp += 3
        }
        const prefix = expPrefix[exp] || ''

        cardData[addrName][reg.name].value = value.toFixed(2)
        cardData[addrName][reg.name].unit = prefix + unit
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
      const addrName = util.format('M%s-%s', rtu.addr, rtu.name)
      // cardData init
      if (!state.cardData[addrName]) {
        state.cardData[addrName] = {}
      }
      // THD
      if (Array.isArray(reg.value)) {
        const name = reg.name.replace('諧波比', '總諧波失真')
        if (!state.cardData[addrName][name]) {
          state.cardData[addrName][name] = {}
        }
        const thd = Math.sqrt(reg.value.reduce((a, v) => {
          a += v * v
          return a
        }, 0))
        state.cardData[addrName][name].value = thd.toFixed(2)
        state.cardData[addrName][name].unit = reg.unit
        state.cardData[addrName][name].bars = reg.value
        return
      }
      // cardData
      if (!state.cardData[addrName][reg.name]) {
        state.cardData[addrName][reg.name] = {
          trend: []
        }
      }
      if (!state.cardData[addrName]) {
        state.cardData[addrName] = {}
      }
      if (!state.cardData[addrName][reg.name]) {
        state.cardData[addrName][reg.name] = {
          trend: []
        }
      }
      const unit = prefixExp[reg.unit[0]] ? reg.unit.slice(1) : reg.unit
      let exp = prefixExp[reg.unit[0]] || 0
      let value = reg.value
      while (value > 10000) {
        value /= 1000
        exp += 3
      }
      const prefix = expPrefix[exp] || ''
      state.cardData[addrName][reg.name].value = value.toFixed(2)
      state.cardData[addrName][reg.name].unit = prefix + unit
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

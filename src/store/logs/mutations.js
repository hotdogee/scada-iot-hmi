// import initialState from './state'
import _ from 'lodash'
import util from 'util'
// eslint-disable-next-line camelcase
import { IAPWS97_EoS } from '@neutrium/thermo.eos.iapws97'
// import Logger from 'assets/logger'
// const logger = new Logger('logs.mutations')
/*
export function someMutation (state, payload) {
}
*/

export function setTotal (state, { total }) {
  state.total = total
}

export function addTotal (state, { total }) {
  state.total += total
}

export function setStart (state, { start }) {
  state.start = start
}

export function setLogs (state, { logs }) {
  // state.logs = []
  state.cardData = {}
  state.chartData = {}
  _.forEachRight(logs, log => {
    // oldest log first
    addLog(state, { log })
  })
}

const limit = 100
const prefixExp = {
  k: 3,
  M: 6,
  G: 9,
  T: 12,
  P: 15
}
const expPrefix = Object.keys(prefixExp).reduce((o, p) => {
  o[prefixExp[p]] = p
  return o
}, {})

export function addLog (state, { log }) {
  // state.logs.unshift(log)
  // while (state.logs.length > limit) {
  //   state.logs.pop()
  // }
  state.end = log.logTime
  _.forEach(log.reads, rtu => {
    _.forEach(rtu.reads, reg => {
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
        const thd = Math.sqrt(
          reg.value.reduce((a, v) => {
            a += v * v
            return a
          }, 0)
        )
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
      const unit = prefixExp[reg.unit[0]] ? reg.unit.slice(1) : reg.unit
      let exp = prefixExp[reg.unit[0]] || 0
      let value = reg.value
      while (value > 10000 || value < 10000) {
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
  // computed
  let addrName = 'M200-計算'
  if (!state.cardData[addrName]) {
    state.cardData[addrName] = {}
  }
  // calculate extra series
  const m73W = state.chartData['M73-發電機300kVA-有功功率(W)']
  const m73VA = state.chartData['M73-發電機300kVA-視在功率(VA)']
  const m72W = state.chartData['M72-併接點-有功功率(W)']
  // const m13bar = state.chartData['M13-渦輪1前-壓力(bar)']
  // const m14bar = state.chartData['M14-渦輪1後-壓力(bar)']
  const m25tph = state.chartData['M25-主排水管-質量流率(t/h)']
  const m1bar = state.chartData['M1-九號井口-壓力(bar)']
  const m1c = state.chartData['M1-九號井口-溫度(℃)']
  const m5bar = state.chartData['M5-渦輪2前-壓力(bar)']
  const m5c = state.chartData['M5-渦輪2前-溫度(℃)']
  const m6bar = state.chartData['M6-渦輪2後-壓力(bar)']
  const m6c = state.chartData['M6-渦輪2後-溫度(℃)']
  let m1e = null
  if (m1bar && m1c) {
    try {
      m1e = new IAPWS97_EoS().solve({
        p: m1bar.slice(-1)[0].value * 100000,
        t: 273.15 + m1c.slice(-1)[0].value
      })
    } catch (error) {}
  }
  let m5e = null
  if (m5bar && m5c) {
    try {
      m5e = new IAPWS97_EoS().solve({
        p: m5bar.slice(-1)[0].value * 100000,
        t: 273.15 + m5c.slice(-1)[0].value
      })
    } catch (error) {}
  }
  let m6e = null
  if (m6bar && m6c) {
    try {
      m6e = new IAPWS97_EoS().solve({
        p: m6bar.slice(-1)[0].value * 100000,
        t: 273.15 + m6c.slice(-1)[0].value
      })
    } catch (error) {}
  }
  // const m25tph = state.chartData['M26-排水管2-流量(m3/h)']
  // const m64hz = state.chartData['M64-發電機1-頻率(Hz)']
  const m71hz = state.chartData['M71-發電機300kVA-頻率(Hz)']
  const turbineRadius = 0.215 // m
  const nozzleAngle = (30 / 180) * Math.PI // radians
  const formulas = {
    出噴嘴速度: {
      unit: 'm/s',
      value: () => {
        if (
          m73VA &&
          m25tph &&
          m71hz &&
          m73VA.slice(-1)[0].value > 0 &&
          m25tph.slice(-1)[0].value > 0 &&
          m71hz.slice(-1)[0].value > 0
        ) {
          const omega = 2 * Math.PI * m71hz.slice(-1)[0].value
          const torque = m73VA.slice(-1)[0].value / omega
          const force = torque / turbineRadius
          const kgs = m25tph.slice(-1)[0].value / 3.6
          const turbineSpeed = turbineRadius * omega
          const v2 = (force / (2 * kgs) + turbineSpeed) / Math.cos(nozzleAngle)
          // const v2 = ((m63kW[stat] * 1000) / (m71hz * m25tph[stat] * 2 * Math.PI * 0.215 * 2  * 1000 / 3600) + 0.215 * 2 * Math.PI * m71hz) / Math.cos(30 / 180 * Math.PI)
          // m63kW[stat] / (m71hz * m25tph[stat]) + m71hz
          return v2
        } else return -1
      }
    },
    井口質量焓: {
      unit: 'kJ/kg',
      value: () => {
        if (m1e) {
          return m1e.h
        } else return -1
      }
    },
    入口質量焓: {
      unit: 'kJ/kg',
      value: () => {
        if (m5e) {
          return m5e.h
        } else return -1
      }
    },
    出口質量焓: {
      unit: 'kJ/kg',
      value: () => {
        if (m6e) {
          return m6e.h
        } else return -1
      }
    },
    '熱效率(入)': {
      unit: '%',
      value: () => {
        if (m5e && m25tph && m73VA) {
          const kva = m73VA.slice(-1)[0].value / 1000
          const kgs = m25tph.slice(-1)[0].value / 3.6
          const hi = m5e.h
          return (kva / kgs / hi) * 100
        } else return -1
      }
    },
    '熱效率(入-出)': {
      unit: '%',
      value: () => {
        if (m5e && m6e && m25tph && m73VA) {
          const kva = m73VA.slice(-1)[0].value / 1000
          const kgs = m25tph.slice(-1)[0].value / 3.6
          const hi = m5e.h
          const ho = m6e.h
          return (kva / kgs / (hi - ho)) * 100
        } else return -1
      }
    },
    常數: {
      unit: '', // kW/bar2
      value: () => {
        if (m73VA && m5bar && m6bar && m5bar.slice(-1)[0].value - m6bar.slice(-1)[0].value > 0) {
          // console.log(m73VA, m5bar, m6bar)
          const c =
            m73VA.slice(-1)[0].value /
            1000 /
            Math.pow(m5bar.slice(-1)[0].value - m6bar.slice(-1)[0].value, 2)
          return c
        } else return -1
      }
    },
    併網效率: {
      unit: '%',
      value: () => {
        if (m73W && m72W && m72W.slice(-1)[0].value > 0 && m73W.slice(-1)[0].value > 0) {
          // console.log(m72W.slice(-1)[0].value, m73W.slice(-1)[0].value)
          const eff = (m72W.slice(-1)[0].value + 3000) / m73W.slice(-1)[0].value
          return eff > 1 ? 100 : eff * 100
        } else return -1
      }
    }
  }
  _.forEach(Object.entries(formulas), ([regName, reg]) => {
    if (!state.cardData[addrName][regName]) {
      state.cardData[addrName][regName] = {
        trend: []
      }
    }
    const unit = prefixExp[reg.unit[0]] ? reg.unit.slice(1) : reg.unit
    let exp = prefixExp[reg.unit[0]] || 0
    const originalValue = reg.value()
    let value = originalValue
    while (value > 10000) {
      value /= 1000
      exp += 3
    }
    const prefix = expPrefix[exp] || ''
    state.cardData[addrName][regName].value = value.toFixed(2)
    state.cardData[addrName][regName].unit = prefix + unit
    state.cardData[addrName][regName].trend.push(Math.round(originalValue * 10000) / 100)
    while (state.cardData[addrName][regName].trend.length > limit) {
      state.cardData[addrName][regName].trend.shift()
    }
    // 'M1-九號井口-溫度(°C)'
    const header = util.format('%s-%s(%s)', addrName, regName, reg.unit)
    if (!state.chartData[header]) {
      state.chartData[header] = []
    }
    state.chartData[header].push({
      value: originalValue,
      unit
    })
    while (state.chartData[header].length > limit) {
      state.chartData[header].shift()
    }
  })
}

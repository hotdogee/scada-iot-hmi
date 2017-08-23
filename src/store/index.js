import _ from 'lodash'
import util from 'util'
import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import mutations from './mutations'

Vue.use(Vuex)

const state = {
  logs: [
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
  ],
  regList: {}
}

// const options = {
//   year: 'numeric',
//   month: 'numeric',
//   day: 'numeric',
//   hour: 'numeric',
//   minute: 'numeric',
//   second: 'numeric'
// }

const getters = {
  logText: (state, getters) => {
    if (!state.logs.length) return 'loading...'
    var data = flattenMessage(state.logs[0])
    var reply = ''
    // reply += util.format('%s：%s\n', '時間', new Intl.DateTimeFormat('zh-TW', options).format(new Date(data.Time)))
    reply += util.format('%s：%s\n', '時間', new Date(data.Time).toLocaleString())
    delete data.Time
    Object.keys(data).forEach(k => {
      reply += util.format('%s：%s\n', k, Math.round(data[k] * 100) / 100)
    })
    return reply
  },
  currentLog: (state, getters) => {
    if (!state.logs.length) return {}
    return state.logs[0]
  },
  currentLogTime: (state, getters) => {
    if (!state.logs.length) return 'loading...'
    return new Date(state.logs[0].logTime).toLocaleString()
  },
  regList: (state, getters) => (rtuName, regName) => {
    if (_.isEmpty(state.regList)) return []
    let rl = state.regList[rtuName][regName]
    let min = _.minBy(rl, (reg) => reg.value).value
    let max = _.maxBy(rl, (reg) => reg.value).value
    return _.map(state.regList[rtuName][regName], (reg) => {
      return Math.round((reg.value - min) / (max - min) * 10000) / 100
    })
  }
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})

function flattenMessage (message) {
  let data = _.fromPairs(_.flatMap(message.reads, (rtu, index) => {
    return rtu.reads.map((reg, i) => {
      // 'M1-九號井口-溫度(°C)'
      let header = util.format('M%s-%s-%s(%s)', rtu.addr, rtu.name, reg.name, reg.unit)
      return [header, reg.value]
    })
  }))
  return Object.assign({
    Time: message.logTime
  }, data)
}

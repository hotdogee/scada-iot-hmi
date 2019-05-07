import _ from 'lodash'
import util from 'util'
import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import mutations from './mutations'
import chart from './modules/chart'

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
  logsTotal: -1,
  logsStart: -1,
  logsEnd: -1,
  regList: {},
  chartData: {},
  cardData: {}
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
    var reply = ''
    // reply += util.format('%s：%s\n', '時間', new Intl.DateTimeFormat('zh-TW', options).format(new Date(data.Time)))
    reply += util.format(
      '%s：%s\n',
      '時間',
      new Date(state.logs[0].logTime).toLocaleString()
    )
    Object.keys(state.chartData).sort((a, b) => {
      const aid = parseInt(a.match(/^M(\d+)-/)[1])
      const bid = parseInt(b.match(/^M(\d+)-/)[1])
      return aid - bid
    }).forEach(k => {
      if (Array.isArray(state.chartData[k][state.chartData[k].length - 1].value)) return
      reply += util.format(
        '%s：%s\n',
        k,
        Math.round(
          state.chartData[k][state.chartData[k].length - 1].value * 100
        ) / 100
      )
    })
    return reply
  },
  currentLog: (state, getters) => {
    if (!state.logs.length) return {reads: []}
    // console.log(state.logs[0].reads.map((x) => x.addr))
    let defaultOrder = [63, 64, 62, 26, 50, 51, 52, 22, 1, 2, 5, 6, 7, 10, 11, 13, 14, 21, 9, 60, 61, 25]
    state.logs[0].reads = _.sortBy(state.logs[0].reads, [function (o) {
      let i = defaultOrder.indexOf(o.addr)
      if (i < 0) { return 999 }
      else { return i }
    }])
    return state.logs[0]
  },
  currentLogTime: (state, getters) => {
    if (!state.logs.length) return 'loading...'
    return new Date(state.logs[0].logTime).toLocaleString()
  },
  regList: (state, getters) => (rtuName, regName) => {
    if (_.isEmpty(state.regList)) return []
    // let rl = state.regList[rtuName][regName]
    // let min = _.minBy(rl, (reg) => reg.value).value
    // let max = _.maxBy(rl, (reg) => reg.value).value
    return _.map(state.regList[rtuName][regName], (reg) => {
      return Math.round(reg.value * 10000) / 100
    })
  },
  chartData: (state, getters) => (rtuName, regName) => {
    if (_.isEmpty(state.regList)) return []
    // let rl = state.regList[rtuName][regName]
    // let min = _.minBy(rl, (reg) => reg.value).value
    // let max = _.maxBy(rl, (reg) => reg.value).value
    return _.map(state.regList[rtuName][regName], (reg) => {
      return [ reg.time, Math.round(reg.value * 10000) / 100 ]
    })
  },
  chartInit: (state, getters) => {
    let option = {
      title: {
        text: '歷史數據'
      },
      legend: {
        orient: 'vertical',
        left: 10,
        top: 30,
        bottom: 20,
        data: []
      },
      grid: {
        left: 250,
        right: '4%',
        bottom: 50,
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          restore: {},
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'time',
        name: '時間'
      },
      yAxis: {
        type: 'value'
      },
      dataZoom: [
        {
          type: 'inside',
          xAxisIndex: [0]
        },
        {
          type: 'slider',
          xAxisIndex: [0]
        }
      ],
      series: [
      ],
      animationDuration: 1000
    }
    if (_.isEmpty(state.chartData)) return option
    option.legend.data = Object.keys(state.chartData)
    option.series = option.legend.data.map(k => {
      return {
        name: k,
        type: 'line',
        showSymbol: false,
        hoverAnimation: false,
        // lineStyle: {
        //     normal: {
        //         width: 1,
        //     }
        // },
        data: []
      }
    })
    // console.log(option)
    return option
  },
  chartUpdate: (state, getters) => {
    let option = {
      series: []
    }
    if (_.isEmpty(getters.chartInit.series)) return {}
    option.series = Object.keys(state.chartData).map(k => {
      return {
        name: k,
        data: state.chartData[k].map(reg => [reg.time, reg.value])
      }
    })
    // console.log(option)
    return option
  }
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  modules: {
    chart
  }
})

// function flattenMessage (message) {
//   let data = _.fromPairs(_.flatMap(message.reads, (rtu, index) => {
//     return rtu.reads.map((reg, i) => {
//       // 'M1-九號井口-溫度(°C)'
//       let header = util.format('M%s-%s-%s(%s)', rtu.addr, rtu.name, reg.name, reg.unit)
//       return [header, reg.value]
//     })
//   }))
//   return Object.assign({
//     Time: message.logTime
//   }, data)
// }

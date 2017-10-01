<template>
  <div class="row wrap container">
    <div class="col-xs-12">
      <q-card class="bg-white">
        <q-card-title>
          <div class="title">目前顯示{{ animatedLogsLength | totalFormat }}資料</div>
        </q-card-title>
        <q-card-main>
          <q-list>
            <q-list-header>資料庫</q-list-header>
            <q-item>
              <q-item-side icon="timeline" />
              <q-item-main>
                <q-item-tile label>總資料時間點數</q-item-tile>
                <q-item-tile sublabel>{{ logsTotal | totalFormat }}</q-item-tile>
              </q-item-main>
            </q-item>
            <q-item>
              <q-item-side icon="bubble_chart" />
              <q-item-main>
                <q-item-tile label>總資料點數</q-item-tile>
                <q-item-tile sublabel>{{ logsTotal * 26 | totalFormat }}</q-item-tile>
              </q-item-main>
            </q-item>
            <q-item>
              <q-item-side icon="skip_previous" />
              <q-item-main>
                <q-item-tile label>總資料起始時間</q-item-tile>
                <q-item-tile sublabel>{{ logsStart | dateFormat }}</q-item-tile>
              </q-item-main>
            </q-item>
            <q-item>
              <q-item-side icon="skip_next" />
              <q-item-main>
                <q-item-tile label>總資料最後時間</q-item-tile>
                <q-item-tile sublabel>{{ logsEnd | dateFormat }}</q-item-tile>
              </q-item-main>
            </q-item>
            <q-item-separator />
            <q-list-header>修改圖表時間範圍</q-list-header>
            <q-item>
              <q-item-main>
                <q-field
                  icon="date_range"
                  label="圖表時間"
                  :error="chartRangeHasError"
                  error-label="所選時間範圍查無資料"
                  :label-width="2"
                >
                  <q-datetime-range class="no-margin" v-model="chartRange" type="datetime" @change="chartRangeChange" />
                </q-field>
              </q-item-main>
            </q-item>
          </q-list>
        </q-card-main>
        <q-card-actions>
          <q-field
            :error="total > 100000" class="full-width"
            error-label="注意：繪製超過 100,000 筆資料可能會很慢"
          >
            <q-btn color="primary" class="full-width"
              @click="getChartData"
              :percentage="getChartDataProgress" loader
              :disabled="chartRangeHasError">
              <span v-if="loadingLogsTotal" class="row flex-center"><q-spinner class="on-left"/>取得資料筆數</span>
              <span v-else class="row flex-center"><q-icon name="update" class="on-left"/>繪製{{ total | totalFormat }}資料</span>
              <div slot="loading" class="row flex-center">
                <q-spinner-audio class="on-left" />
                正在準備{{ total | totalFormat }}資料，已獲得{{ animatedLogsLength | totalFormat }}
              </div>
            </q-btn>
          </q-field>
        </q-card-actions>
      </q-card>
    </div>
    <div class="col-xs-12" v-for="(fig, index) in figs" :key="index" v-show="showChart">
      <q-card class="bg-white">
        <q-card-main>
          <div ref="gd"><!-- Plotly chart will be drawn inside this DIV --></div>
        </q-card-main>
      </q-card>
    </div>
  </div>
</template>

<script>
/*
getLegendData -> chartOptions
getSeriesData -> chartUpdate
*/
import _ from 'lodash'
import TWEEN from '@tweenjs/tween.js'

// import Highcharts from 'highcharts/highstock'

import Plotly from 'plotly.js/lib/core'
// Load in the trace types for scattergl
Plotly.register([
  require('plotly.js/lib/scattergl')
])
Plotly.register([
  require('plotly.js/lib/aggregate'),
  require('plotly.js/lib/filter'),
  require('plotly.js/lib/groupby'),
  require('plotly.js/lib/sort')
])

import ECharts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/chart/line'
// import 'echarts/lib/chart/bar'
// import 'echarts/lib/chart/pie'
// import 'echarts/lib/chart/scatter'
// import 'echarts/lib/chart/radar'

// import 'echarts/lib/chart/map'
// import 'echarts/lib/chart/treemap'
// import 'echarts/lib/chart/graph'
// import 'echarts/lib/chart/gauge'
// import 'echarts/lib/chart/funnel'
// import 'echarts/lib/chart/parallel'
// import 'echarts/lib/chart/sankey'
// import 'echarts/lib/chart/boxplot'
// import 'echarts/lib/chart/candlestick'
// import 'echarts/lib/chart/effectScatter'
// import 'echarts/lib/chart/lines'
// import 'echarts/lib/chart/heatmap'

import 'echarts/lib/component/graphic'
import 'echarts/lib/component/grid'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/polar'
import 'echarts/lib/component/geo'
import 'echarts/lib/component/parallel'
import 'echarts/lib/component/singleAxis'
import 'echarts/lib/component/brush'

import 'echarts/lib/component/title'

import 'echarts/lib/component/dataZoom'
import 'echarts/lib/component/visualMap'

import 'echarts/lib/component/markPoint'
import 'echarts/lib/component/markLine'
import 'echarts/lib/component/markArea'

import 'echarts/lib/component/timeline'
import 'echarts/lib/component/toolbox'

import 'zrender/lib/vml/vml'
import { mapState, mapGetters, mapActions } from 'vuex'

import {
  QIcon,
  QCard,
  QCardTitle,
  QCardMain,
  QCardActions,
  QCardSeparator,
  QList,
  QListHeader,
  QItem,
  QItemSide,
  QItemMain,
  QItemTile,
  QItemSeparator,
  QBtn,
  QField,
  QDatetimeRange,
  QInnerLoading,
  QSpinner,
  QSpinnerAudio,
  date
} from 'quasar'

export default {
  name: 'plc-chart',
  components: {
    QIcon,
    QCard,
    QCardTitle,
    QCardMain,
    QCardActions,
    QCardSeparator,
    QList,
    QListHeader,
    QItem,
    QItemSide,
    QItemMain,
    QItemTile,
    QItemSeparator,
    QBtn,
    QField,
    QDatetimeRange,
    QInnerLoading,
    QSpinner,
    QSpinnerAudio,
    chart: ECharts
  },
  data () {
    let data = []

    for (let i = 0; i <= 360; i++) {
      let t = i / 180 * Math.PI
      let r = Math.sin(2 * t) * Math.cos(2 * t)
      data.push([r, i])
    }

    return {
      // startDate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString().substr(0, 10),
      // endDate: new Date().toISOString().substr(0, 10),
      chartRangeHasError: false,
      chartRange: {
        // from: date.subtractFromDate(new Date(), {days: 5}),
        from: date.subtractFromDate(new Date(), {hours: 1}),
        to: new Date()
      },
      showChart: false,
      animatedLogsLength: 0,
      traceTemplates: {
        timeSeriesTrace: {
          type: 'scattergl',
          mode: 'lines',
          // connectgaps: true,
          name: '',
          x: [],
          y: []
        },
        timeSeriesTrace2: {
          type: 'line',
          name: '',
          data: [],
          dataGrouping: {
            enabled: true
          }
        }
      },
      figTemplates: {
        timeSeriesFig: {
          data: [],
          layout: {
            title: '',
            autosize: true,
            legend: {},
            xaxis: {
              // autorange: true,
              // range: ['2015-02-17', '2017-02-16'],
              type: 'date',
              title: '時間',
              rangeslider: {
                visible: true
              },
              rangeselector: {
                buttons: [
                  {
                    count: 5,
                    step: 'minute',
                    label: '5m',
                    stepmode: 'backward'
                  },
                  {
                    count: 1,
                    step: 'hour',
                    label: '1h',
                    stepmode: 'backward'
                  },
                  {
                    count: 6,
                    step: 'hour',
                    label: '6d',
                    stepmode: 'backward'
                  },
                  {
                    count: 1,
                    step: 'day',
                    label: '1d',
                    stepmode: 'backward'
                  },
                  {
                    count: 3,
                    step: 'day',
                    label: '3d',
                    stepmode: 'backward'
                  },
                  // {
                  //   count: 7,
                  //   step: 'day',
                  //   label: '7d',
                  //   stepmode: 'backward'
                  // },
                  // {
                  //   count: 14,
                  //   step: 'day',
                  //   label: '14d',
                  //   stepmode: 'backward'
                  // },
                  // {
                  //   count: 1,
                  //   step: 'month',
                  //   label: '1m',
                  //   stepmode: 'backward'
                  // },
                  // {
                  //   count: 3,
                  //   step: 'month',
                  //   label: '3m',
                  //   stepmode: 'backward'
                  // },
                  // {
                  //   count: 6,
                  //   step: 'month',
                  //   label: '6m',
                  //   stepmode: 'backward'
                  // },
                  // {
                  //   count: 1,
                  //   step: 'year',
                  //   label: '6y',
                  //   stepmode: 'backward'
                  // },
                  {step: 'all'}
                ]
              }
            },
            yaxis: {
              type: 'linear',
              title: ''
            }
          },
          config: {},
          frames: []
        },
        timeSeriesFig2: {
          series: [],
          chart: {
            type: 'line',
            zoomType: 'x'
          },
          navigator: {
            adaptToUpdatedData: true,
            series: {
              data: []
            }
          },
          scrollbar: {
            liveRedraw: false
          },
          title: {
            text: ''
          },
          rangeSelector: {
            buttons: [
              {
                count: 5,
                type: 'minute',
                text: '5m'
              },
              {
                count: 1,
                type: 'hour',
                text: '1h'
              },
              {
                count: 6,
                type: 'hour',
                text: '6d'
              },
              {
                count: 1,
                type: 'day',
                text: '1d'
              },
              {
                count: 3,
                type: 'day',
                text: '3d'
              },
              // {
              //   count: 7,
              //   step: 'day',
              //   label: '7d',
              //   stepmode: 'backward'
              // },
              // {
              //   count: 14,
              //   step: 'day',
              //   label: '14d',
              //   stepmode: 'backward'
              // },
              // {
              //   count: 1,
              //   step: 'month',
              //   label: '1m',
              //   stepmode: 'backward'
              // },
              // {
              //   count: 3,
              //   step: 'month',
              //   label: '3m',
              //   stepmode: 'backward'
              // },
              // {
              //   count: 6,
              //   step: 'month',
              //   label: '6m',
              //   stepmode: 'backward'
              // },
              // {
              //   count: 1,
              //   step: 'year',
              //   label: '6y',
              //   stepmode: 'backward'
              // },
              {type: 'all'}
            ]
          },
          xAxis: {
          },
          yAxis: {
          }
        },
        emptyFig: {
        }
      },
      figs: [
        {
          fig: 'timeSeriesFig',
          trace: 'timeSeriesTrace',
          regs: ['溫度'],
          plotTitle: '溫度',
          yaxisTitle: '溫度(℃)'
        },
        {
          fig: 'timeSeriesFig',
          trace: 'timeSeriesTrace',
          regs: ['壓力'],
          plotTitle: '壓力',
          yaxisTitle: '壓力(bar)'
        },
        {
          fig: 'timeSeriesFig',
          trace: 'timeSeriesTrace',
          regs: ['頻率'],
          plotTitle: '頻率',
          yaxisTitle: '頻率(Hz)'
        },
        {
          fig: 'timeSeriesFig',
          trace: 'timeSeriesTrace',
          regs: ['三相功率'],
          plotTitle: '三相功率',
          yaxisTitle: '三相功率(kW)'
        }
      ],
      option: {
        title: {
          text: '歷史數據'
        },
        legend: {
          data: []
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
    }
  },
  computed: {
    ...mapState({
      total: state => state.chart.total,
      logsLength: state => state.chart.logsLength
    }),
    ...mapState([
      'logsTotal',
      'logsStart',
      'logsEnd'
    ]),
    ...mapGetters([
      'chartInit',
      'chartUpdate'
    ]),
    start () {
      return new Date().getTime() - 60 * 60 * 1000
    },
    end () {
      return new Date().getTime()
    },
    getChartDataProgress () {
      return this.logsLength / this.total * 100
    },
    loadingLogsTotal () {
      return this.total === -1
    }
  },
  methods: {
    ...mapActions([
      'getLogs', // map `this.getChartData(payloads)` to `this.$store.dispatch('getChartData', payloads)`
      'getLogsCountInRange',
      'getLogsInRange'
    ]),
    ...mapGetters([
      // 'chartLogs',
      'chartRtuRegs'
    ]),
    getChartData (event, done) {
      // console.log(this.chartRange.from, this.chartRange.to)
      // this.getLogsCountInRange(this.chartRange)
      this.showChart = false
      // clear charts
      // this.figs.forEach((fig, i) => {
      //   // console.log(i, fig)
      //   Plotly.newPlot(this.$refs.gd[i], [])
      // })
      const newDone = () => {
        this.showChart = true
        this.$nextTick(function () {
          // draw charts
          const rtuRegs = this.chartRtuRegs()
          // console.log('rtuRegs: ', rtuRegs)
          // const rtuRegKeys = Object.keys(rtuRegs)
          // console.log('Trace Names: ', rtuRegKeys)
          this.figs.forEach((fig, i) => {
            // console.log(i, fig)
            // build data = [trace, ...]
            const matchedRtuRegs = _.filter(rtuRegs, (rtuReg, header) => {
              return _.some(fig.regs, reg => reg === rtuReg.reg)
            })
            const data = _.map(matchedRtuRegs, (rtuReg) => {
              const trace = JSON.parse(JSON.stringify(this.traceTemplates[fig.trace]))
              trace.name = rtuReg.header
              trace.x = rtuReg.x
              trace.y = rtuReg.y
              return trace
            })
            // build layout = {}
            const layout = JSON.parse(JSON.stringify(this.figTemplates[fig.fig])).layout
            layout.title = fig.plotTitle
            layout.yaxis.title = fig.yaxisTitle
            Plotly.newPlot(this.$refs.gd[i], data, layout)
          })
          done()
        })
      }
      this.getLogsInRange({
        from: this.chartRange.from,
        to: this.chartRange.to,
        done: newDone
      })
    },
    chartRangeChange (newVal) {
      this.getLogsCountInRange(this.chartRange)
    }
  },
  filters: {
    totalFormat (value) {
      if (!value) value = 0
      return ' ' + value.toLocaleString() + ' 筆'
    },
    dateFormat (value) {
      if (!value) return ''
      return new Date(value).toLocaleString()
    }
  },
  watch: {
    chartUpdate (val, oldVal) {
      // console.log(this.$refs.chart.computedOptions.legend[0].data)
      // if (_.isEmpty(this.$refs.chart.computedOptions.legend[0].data)) return
      // this.$refs.chart.mergeOptions(val)
      // console.log(this.$refs.chart)
    },
    total (val, oldVal) {
      if (!val) {
        this.chartRangeHasError = true
      }
      else {
        this.chartRangeHasError = false
      }
    },
    logsLength (val, oldVal) {
      // const chartLogsLength = this.chartLogs().length
      // // console.log('chartLogs: ', this.chartLogs())
      // // console.log('this.chartLogs().length: ', chartLogsLength)

      // // update charts
      // const rtuRegs = this.chartRtuRegs()
      // // console.log('rtuRegs: ', rtuRegs)
      // // const rtuRegKeys = Object.keys(rtuRegs)
      // // console.log('Trace Names: ', rtuRegKeys)
      // this.figs.forEach((fig, i) => {
      //   // console.log(i, fig)
      //   // build data = [trace, ...]
      //   const matchedRtuRegs = _.filter(rtuRegs, (rtuReg, header) => {
      //     return _.some(fig.regs, reg => reg === rtuReg.reg)
      //   })
      //   // console.log('matchedRtuRegs', matchedRtuRegs)
      //   if (chartLogsLength <= 1000) {
      //     const data = _.map(matchedRtuRegs, (rtuReg) => {
      //       const trace = JSON.parse(JSON.stringify(this.traceTemplates[fig.trace]))
      //       trace.name = rtuReg.header
      //       trace.x = rtuReg.x
      //       trace.y = rtuReg.y
      //       return trace
      //     })
      //     // build layout = {}
      //     const layout = JSON.parse(JSON.stringify(this.figTemplates[fig.fig])).layout
      //     layout.title = fig.plotTitle
      //     layout.yaxis.title = fig.yaxisTitle
      //     Plotly.newPlot(this.$refs.gd[i], data, layout)
      //   }
      //   else {
      //     // const update = {
      //     //   x: _.map(matchedRtuRegs, rtuReg => rtuReg.x),
      //     //   y: _.map(matchedRtuRegs, rtuReg => rtuReg.y)
      //     // }
      //     const data = _.map(matchedRtuRegs, (rtuReg) => {
      //       const trace = JSON.parse(JSON.stringify(this.traceTemplates[fig.trace]))
      //       trace.name = rtuReg.header
      //       trace.x = rtuReg.x
      //       trace.y = rtuReg.y
      //       return trace
      //     })
      //     // build layout = {}
      //     Plotly.update(this.$refs.gd[i], data)
      //     // console.log(this.$refs.gd[i], data)
      //   }
      // })

      // tween animatedLogsLength
      var vm = this
      function animate () {
        if (TWEEN.update()) {
          requestAnimationFrame(animate)
        }
      }
      new TWEEN.Tween({ val: oldVal })
        .easing(TWEEN.Easing.Quadratic.Out)
        .to({ val: val }, 1000)
        .onUpdate(function (obj) {
          vm.animatedLogsLength = obj.val.toFixed(0)
        })
        .start()
      animate()
    }
  },
  mounted () {
    this.getLogsCountInRange(this.chartRange)
    // let TESTER = document.getElementById('tester')

    // Plotly.plot(TESTER, [{
    //   x: [1, 2, 3, 4, 5],
    //   y: [1, 2, 4, 8, 16]
    // }], {
    //   margin: { t: 0 }
    // })
    // var data = [
    //   {
    //     x: ['2013-10-04 22:23:00', '2013-11-04 22:23:00', '2013-12-04 22:23:00', '2013-12-06 22:23:00', '2013-12-09 22:23:00'],
    //     y: [1, 3, null, 6, 4],
    //     type: 'scattergl'
    //   }
    // ]
    // window.gd = this.$refs.gd
    this.figs.forEach((fig, i) => {
      // console.log(i, fig)
      // Plotly.newPlot(this.$refs.gd[i], [])
      // Highcharts.chart(this.$refs.gd[i], {
      //   chart: {
      //     type: 'bar'
      //   },
      //   credits: {
      //     enabled: false
      //   },
      //   title: {
      //     text: 'Fruit Consumption'
      //   },
      //   xAxis: {
      //     categories: ['Apples', 'Bananas', 'Oranges']
      //   },
      //   yAxis: {
      //     title: {
      //       text: 'Fruit eaten'
      //     }
      //   },
      //   series: [{
      //     name: 'Jane',
      //     data: [1, 0, 4]
      //   }, {
      //     name: 'John',
      //     data: [5, 7, 3]
      //   }]
      // })
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.echarts {
  width: 100%;
  height: 700px;
}
</style>

<style lang="stylus" scoped>
</style>

// currentLog =
// {
//   "_id": "5997b0a66280a1595505357e",
//   "name": "Geo9",
//   "logTime": "2017-08-19T02:25:31.487Z",
//   "reads": [
//     {
//       "name": "九號井口",
//       "addr": 1,
//       "reads": [
//         {
//           "name": "溫度",
//           "unit": "℃",
//           "value": 176.74302673339844,
//           "time": "2017-08-19T02:25:29.297Z"
//         }
//       ]
//     },
//     {
//       "name": "手動閘閥前",
//       "addr": 2,
//       "reads": [
//         {
//           "name": "壓力",
//           "unit": "bar",
//           "value": 4.784983158111572,
//           "time": "2017-08-19T02:25:29.393Z"
//         },
//         {
//           "name": "溫度",
//           "unit": "℃",
//           "value": 146.62693786621094,
//           "time": "2017-08-19T02:25:29.393Z"
//         }
//       ]
//     },
//     {
//       "name": "上貨櫃前",
//       "addr": 10,
//       "reads": [
//         {
//           "name": "壓力",
//           "unit": "bar",
//           "value": 2.999483585357666,
//           "time": "2017-08-19T02:25:29.488Z"
//         },
//         {
//           "name": "溫度",
//           "unit": "℃",
//           "value": 130.76573181152344,
//           "time": "2017-08-19T02:25:29.489Z"
//         }
//       ]
//     },
//     {
//       "name": "三桶前",
//       "addr": 11,
//       "reads": [
//         {
//           "name": "壓力",
//           "unit": "bar",
//           "value": 2.832108497619629,
//           "time": "2017-08-19T02:25:29.584Z"
//         },
//         {
//           "name": "溫度",
//           "unit": "℃",
//           "value": 127.93977355957031,
//           "time": "2017-08-19T02:25:29.584Z"
//         }
//       ]
//     },
//     {
//       "name": "渦輪1前",
//       "addr": 13,
//       "reads": [
//         {
//           "name": "壓力",
//           "unit": "bar",
//           "value": 2.418936014175415,
//           "time": "2017-08-19T02:25:29.680Z"
//         },
//         {
//           "name": "溫度",
//           "unit": "℃",
//           "value": 123.49695587158203,
//           "time": "2017-08-19T02:25:29.680Z"
//         }
//       ]
//     },
//     {
//       "name": "渦輪1後",
//       "addr": 14,
//       "reads": [
//         {
//           "name": "壓力",
//           "unit": "bar",
//           "value": 0.9582558870315552,
//           "time": "2017-08-19T02:25:29.777Z"
//         },
//         {
//           "name": "溫度",
//           "unit": "℃",
//           "value": 97.18785095214844,
//           "time": "2017-08-19T02:25:29.777Z"
//         }
//       ]
//     },
//     {
//       "name": "渦輪1後",
//       "addr": 14,
//       "reads": [
//         {
//           "name": "壓力",
//           "unit": "bar",
//           "value": 0.9582558870315552,
//           "time": "2017-08-19T02:25:29.873Z"
//         },
//         {
//           "name": "溫度",
//           "unit": "℃",
//           "value": 97.18785095214844,
//           "time": "2017-08-19T02:25:29.873Z"
//         }
//       ]
//     },
//     {
//       "name": "尾水箱",
//       "addr": 21,
//       "reads": [
//         {
//           "name": "壓力",
//           "unit": "bar",
//           "value": 0.9754805564880371,
//           "time": "2017-08-19T02:25:29.968Z"
//         },
//         {
//           "name": "溫度",
//           "unit": "℃",
//           "value": 91.98686218261719,
//           "time": "2017-08-19T02:25:29.968Z"
//         }
//       ]
//     },
//     {
//       "name": "發電機1",
//       "addr": 63,
//       "reads": [
//         {
//           "name": "三相功率",
//           "unit": "kW",
//           "value": 6.8004150390625,
//           "time": "2017-08-19T02:25:30.064Z"
//         },
//         {
//           "name": "三相功因",
//           "unit": "",
//           "value": 0.8634490966796875,
//           "time": "2017-08-19T02:25:30.160Z"
//         },
//         {
//           "name": "發電量",
//           "unit": "kWh",
//           "value": 5196.25,
//           "time": "2017-08-19T02:25:30.255Z"
//         },
//         {
//           "name": "A相電壓",
//           "unit": "V",
//           "value": 98.162109375,
//           "time": "2017-08-19T02:25:30.480Z"
//         },
//         {
//           "name": "A相電流",
//           "unit": "A",
//           "value": 40.0048828125,
//           "time": "2017-08-19T02:25:30.559Z"
//         },
//         {
//           "name": "B相電壓",
//           "unit": "V",
//           "value": 98.212890625,
//           "time": "2017-08-19T02:25:30.655Z"
//         },
//         {
//           "name": "B相電流",
//           "unit": "A",
//           "value": 40.248046875,
//           "time": "2017-08-19T02:25:30.735Z"
//         },
//         {
//           "name": "C相電壓",
//           "unit": "V",
//           "value": 98.380859375,
//           "time": "2017-08-19T02:25:30.975Z"
//         },
//         {
//           "name": "C相電流",
//           "unit": "A",
//           "value": 40.3740234375,
//           "time": "2017-08-19T02:25:31.071Z"
//         }
//       ]
//     },
//     {
//       "name": "發電機1",
//       "addr": 64,
//       "reads": [
//         {
//           "name": "頻率",
//           "unit": "Hz",
//           "value": 33.19,
//           "time": "2017-08-19T02:25:31.151Z"
//         }
//       ]
//     },
//     {
//       "name": "軸心1",
//       "addr": 62,
//       "reads": [
//         {
//           "name": "轉速",
//           "unit": "Hz",
//           "value": 40.37,
//           "time": "2017-08-19T02:25:31.247Z"
//         }
//       ]
//     },
//     {
//       "name": "軸心1",
//       "addr": 60,
//       "reads": [
//         {
//           "name": "入水測溫度",
//           "unit": "℃",
//           "value": 56.90028762817383,
//           "time": "2017-08-19T02:25:31.327Z"
//         }
//       ]
//     },
//     {
//       "name": "軸心1",
//       "addr": 61,
//       "reads": [
//         {
//           "name": "發電機測溫度",
//           "unit": "℃",
//           "value": 56.64824295043945,
//           "time": "2017-08-19T02:25:31.406Z"
//         }
//       ]
//     },
//     {
//       "name": "主排水管",
//       "addr": 22,
//       "reads": [
//         {
//           "name": "流量",
//           "unit": "m3/h",
//           "value": 18.579999923706055,
//           "time": "2017-08-19T02:25:31.486Z"
//         }
//       ]
//     }
//   ]
// }

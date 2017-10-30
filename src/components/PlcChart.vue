<template>
  <div class="row wrap container">
    <div class="col-xs-12">
      <q-card class="bg-white">
        <q-card-title class="pad-b-8">
          <div class="title">圖表顯示{{ animatedTotal | totalFormat }}時間點資料 <span v-show="bucket">(統計區間：{{ bucket | bucketFormat }})</span></div>
        </q-card-title>
        <q-card-main class="">
          <q-list>
            <q-list-header class="lh-normal pad-t-8">資料庫</q-list-header>
            <div class="pad-8 row wrap">
              <q-item class="col-xs-12 col-sm-6 col-md-3">
                <q-item-side icon="timeline" />
                <q-item-main>
                  <q-item-tile label>總資料時間點數</q-item-tile>
                  <q-item-tile sublabel>{{ logsTotal | totalFormat }}</q-item-tile>
                </q-item-main>
              </q-item>
              <q-item class="col-xs-12 col-sm-6 col-md-3">
                <q-item-side icon="bubble_chart" />
                <q-item-main>
                  <q-item-tile label>總資料點數</q-item-tile>
                  <q-item-tile sublabel>{{ logsTotal * 26 | totalFormat }}</q-item-tile>
                </q-item-main>
              </q-item>
              <q-item class="col-xs-12 col-sm-6 col-md-3">
                <q-item-side icon="skip_previous" />
                <q-item-main>
                  <q-item-tile label>總資料起始時間</q-item-tile>
                  <q-item-tile sublabel>{{ logsStart | dateFormat }}</q-item-tile>
                </q-item-main>
              </q-item>
              <q-item class="col-xs-12 col-sm-6 col-md-3">
                <q-item-side icon="skip_next" />
                <q-item-main>
                  <q-item-tile label>總資料最後時間</q-item-tile>
                  <q-item-tile sublabel>{{ logsEnd | dateFormat }}</q-item-tile>
                </q-item-main>
              </q-item>
            </div>
            <q-item-separator />
            <q-list-header class="lh-normal pad-t-16">自訂圖表</q-list-header>
            <q-item>
              <q-item-main>
                <q-field
                  icon="date_range"
                  label="圖表時間"
                  :error="chartRangeHasError"
                  error-label="所選時間範圍查無資料"
                  :label-width="2"
                >
                  <q-datetime-range class="no-margin" v-model="chartRange" type="datetime" />
                </q-field>
              </q-item-main>
            </q-item>
          </q-list>
        </q-card-main>
        <!-- <q-card-actions>
          <q-field
            :error="total > 100000" class="full-width margin-0 pad-8"
            error-label="注意：繪製超過 100,000 筆資料可能會很慢"
          >
            <q-btn color="primary" class="full-width"
              @click="getChartData"
              :percentage="getChartDataProgress" loader
              :disabled="chartRangeHasError">
              <span v-if="loadingLogsTotal" class="row flex-center"><q-spinner class="on-left"/>取得資料筆數</span>
              <span v-else class="row flex-center"><q-icon name="insert_chart" class="on-left"/>繪製{{ total | totalFormat }}資料</span>
              <div slot="loading" class="row flex-center">
                <q-spinner-audio class="on-left" />
                正在準備{{ total | totalFormat }}資料，已獲得{{ animatedLogsLength | totalFormat }}
              </div>
            </q-btn>
          </q-field>
        </q-card-actions> -->
      </q-card>
    </div>
    <div class="col-xs-12" v-for="(fig, index) in figs" :key="index" v-show="showChart">
      <q-card class="bg-white">
        <q-card-main>
          <div ref="chartDiv" class="margin-8"></div>
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

import Highcharts from 'highcharts/highstock'
import Exporting from 'highcharts/modules/exporting'
import ExportData from 'highcharts/modules/export-data'
import OfflineExporting from 'highcharts/modules/offline-exporting'
import Boost from 'highcharts/modules/boost'
import BoostCanvas from 'highcharts/modules/boost-canvas'

Exporting(Highcharts)
ExportData(Highcharts)
OfflineExporting(Highcharts)
Boost(Highcharts)
BoostCanvas(Highcharts)
Highcharts.setOptions({
  global: {
    useUTC: false
  },
  lang: {
    contextButtonTitle: '匯出選項'
  }
})

// Custom navigator handles
Highcharts.SVGRenderer.prototype.symbols['navigator-handle-left'] = function (x, y, w, h, options) {
  const height = options.height
  const width = options.width
  const halfWidth = options.width / 2
  const markerPosition = Math.round(halfWidth / 3) + 0.5

	return [
		'M',
		-width - 1, 0.5,
		'L',
		0, 0.5,
		'L',
		0, height + 0.5,
		'L',
		-width - 1, height + 0.5,
		'L',
		-width - 1, 0.5,
		'M',
		-markerPosition - halfWidth, 4,
		'L',
		-markerPosition - halfWidth, height - 3,
		'M',
		markerPosition - halfWidth - 1, 4,
		'L',
		markerPosition - halfWidth - 1, height - 3
	]
}

Highcharts.SVGRenderer.prototype.symbols['navigator-handle-right'] = function (x, y, w, h, options) {
  const height = options.height
  const width = options.width
  const halfWidth = options.width / 2
  const markerPosition = Math.round(halfWidth / 3) + 0.5

	return [
		'M',
		-1, 0.5,
		'L',
		width, 0.5,
		'L',
		width, height + 0.5,
		'L',
		-1, height + 0.5,
		'L',
		-1, 0.5,
		'M',
		halfWidth - markerPosition, 4,
		'L',
		halfWidth - markerPosition, height - 3,
		'M',
		halfWidth + markerPosition - 1, 4,
		'L',
		halfWidth + markerPosition - 1, height - 3
	]
}

if (Highcharts.VMLRenderer) {
    Highcharts.VMLRenderer.prototype.symbols['navigator-handle-left'] = Highcharts.SVGRenderer.prototype.symbol['navigator-handle-left']
    Highcharts.VMLRenderer.prototype.symbols['navigator-handle-right'] = Highcharts.SVGRenderer.prototype.symbol['navigator-handle-right']
}
global.Highcharts = Highcharts

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

const chartColors = [{
    color: "#3366CC",
    lighter: "#45AFE2"
}, {
    color: "#DC3912",
    lighter: "#FF3300"
}, {
    color: "#FF9900",
    lighter: "#FFCC00"
}, {
    color: "#109618",
    lighter: "#14C21D"
}, {
    color: "#990099",
    lighter: "#DF51FD"
}, {
    color: "#0099C6",
    lighter: "#15CBFF"
}, {
    color: "#DD4477",
    lighter: "#FF97D2"
}, {
    color: "#66AA00",
    lighter: "#97FB00"
}, {
    color: "#B82E2E",
    lighter: "#DB6651"
}, {
    color: "#316395",
    lighter: "#518BC6"
}, {
    color: "#994499",
    lighter: "#BD6CBD"
}, {
    color: "#22AA99",
    lighter: "#35D7C2"
}, {
    color: "#AAAA11",
    lighter: "#E9E91F"
}, {
    color: "#6633CC",
    lighter: "#9877DD"
}, {
    color: "#E67300",
    lighter: "#FF8F20"
}, {
    color: "#8B0707",
    lighter: "#D20B0B"
}, {
    color: "#651067",
    lighter: "#B61DBA"
}, {
    color: "#329262",
    lighter: "#40BD7E"
}, {
    color: "#5574A6",
    lighter: "#6AA7C4"
}, {
    color: "#3B3EAC",
    lighter: "#6D70CD"
}, {
    color: "#B77322",
    lighter: "#DA9136"
}, {
    color: "#16D620",
    lighter: "#2DEA36"
}, {
    color: "#B91383",
    lighter: "#E81EA6"
}, {
    color: "#F4359E",
    lighter: "#F558AE"
}, {
    color: "#9C5935",
    lighter: "#C07145"
}, {
    color: "#A9C413",
    lighter: "#D7EE53"
}, {
    color: "#2A778D",
    lighter: "#3EA7C6"
}, {
    color: "#668D1C",
    lighter: "#97D129"
}, {
    color: "#BEA413",
    lighter: "#E9CA1D"
}, {
    color: "#0C5922",
    lighter: "#149638"
}, {
    color: "#743411",
    lighter: "#C5571D"
}]

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
    QSpinnerAudio
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
        from: date.subtractFromDate(new Date(), { hours: 1 }),
        to: new Date()
      },
      showChart: false,
      animatedLogsLength: 0,
      animatedTotal: 0,
      traceTemplates: {
        timeSeriesTrace: { // Plotly
          type: 'scatter',
          mode: 'lines',
          // connectgaps: true,
          name: '',
          x: [],
          y: []
        },
        highStockLine () {
          return {
            type: 'line',
            name: '',
            data: [],
            dataGrouping: {
              enabled: false
            },
            showInNavigator: true,
            connectNulls: false,
            turboThreshold: 0,
            gapSize: 10
          }
        }
      },
      figTemplates: {
        highStockChart () {
          return {
            chart: {
              zoomType: 'x',
              height: 600
            },
            colors: _.map(chartColors, 'color'),
            navigator: {
              adaptToUpdatedData: false,
              xAxis: {},
              handles: {
                  symbols: ['navigator-handle-left', 'navigator-handle-right']
              }
            },
            scrollbar: {
              liveRedraw: false
            },
            title: {
              text: '',
              style: {
                fontSize: '18px'
              }
            },
            subtitle: {
              text: ''
            },
            rangeSelector: {
              buttons: [{
                count: 15,
                type: 'minute',
                text: '15m',
              }, {
                type: 'hour',
                count: 1,
                text: '1h'
              }, {
                type: 'hour',
                count: 3,
                text: '3h'
              }, {
                type: 'hour',
                count: 6,
                text: '6h'
              }, {
                type: 'hour',
                count: 12,
                text: '12h'
              }, {
                count: 1,
                type: 'day',
                text: '1d'
              }, {
                count: 1,
                type: 'week',
                text: '1w'
              }, {
                type: 'month',
                count: 1,
                text: '1m'
              }, {
                type: 'year',
                count: 1,
                text: '1y'
              }, {
                type: 'all',
                text: 'All'
              }],
              inputEnabled: false, // it supports only days
              selected: -1 // all
            },
            xAxis: {
              events: {},
              minRange: 60 * 1000, // one minute
              ordinal: false
            },
            yAxis: {
              title: {
                text: '',
                style: {
                  fontSize: '14px'
                }
              },
              opposite: false
            },
            series: [],
            credits: {
              enabled: false
            },
            legend:{
              enabled: true
            },
            tooltip: {
              valueDecimals: 2,
              shared: true,
              split: false
            }
          }
        },
        timeSeriesFig: { // Plotly
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
                    count: 10,
                    step: 'minute',
                    label: '10m',
                    stepmode: 'backward'
                  },
                  {
                    count: 30,
                    step: 'minute',
                    label: '30m',
                    stepmode: 'backward'
                  },
                  {
                    count: 1,
                    step: 'hour',
                    label: '1h',
                    stepmode: 'backward'
                  },
                  {
                    count: 3,
                    step: 'hour',
                    label: '3h',
                    stepmode: 'backward'
                  },
                  {
                    count: 6,
                    step: 'hour',
                    label: '6h',
                    stepmode: 'backward'
                  },
                  {
                    count: 12,
                    step: 'hour',
                    label: '12h',
                    stepmode: 'backward'
                  },
                  {
                    count: 1,
                    step: 'day',
                    label: '1d',
                    stepmode: 'backward'
                  },
                  // {
                  //   count: 3,
                  //   step: 'day',
                  //   label: '3d',
                  //   stepmode: 'backward'
                  // },
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
        emptyFig: {
        }
      },
      figs: [
        {
          fig: 'highStockChart',
          trace: 'highStockLine',
          regs: ['溫度'],
          plotTitle: '管線溫度',
          yaxisTitle: '溫度(℃)'
        },
        {
          fig: 'highStockChart',
          trace: 'highStockLine',
          regs: ['壓力'],
          plotTitle: '管線壓力',
          yaxisTitle: '壓力(bar)'
        },
        {
          fig: 'highStockChart',
          trace: 'highStockLine',
          regs: ['質量流率'],
          plotTitle: '質量流率',
          yaxisTitle: '質量流率(t/h)'
        },
        {
          fig: 'highStockChart',
          trace: 'highStockLine',
          regs: ['三相功率'],
          plotTitle: '三相功率',
          yaxisTitle: '三相功率(kW)'
        },
        {
          fig: 'highStockChart',
          trace: 'highStockLine',
          regs: ['頻率'],
          plotTitle: '頻率',
          yaxisTitle: '頻率(Hz)'
        },
        {
          fig: 'highStockChart',
          trace: 'highStockLine',
          regs: ['A相電壓', 'B相電壓', 'C相電壓'],
          plotTitle: '三相電壓',
          yaxisTitle: '三相電壓(V)'
        },
        {
          fig: 'highStockChart',
          trace: 'highStockLine',
          regs: ['A相電流', 'B相電流', 'C相電流'],
          plotTitle: '三相電流',
          yaxisTitle: '三相電流(A)'
        },
        {
          fig: 'highStockChart',
          trace: 'highStockLine',
          regs: ['入水測溫度', '發電機測溫度'],
          plotTitle: '軸心溫度',
          yaxisTitle: '溫度(℃)'
        }
      ],
      options: {
        title: {
          text: 'Monthly Average Temperature',
          x: -20 //center
        },
        subtitle: {
          text: 'Source: WorldClimate.com',
          x: -20
        },
        xAxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
          ]
        },
        yAxis: {
          title: {
            text: 'Temperature (°C)'
          },
          plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
          }]
        },
        tooltip: {
          valueSuffix: '°C'
        },
        legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle',
          borderWidth: 0
        },
        series: [{
          name: 'Tokyo',
          data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
        }, {
          name: 'New York',
          data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
        }, {
          name: 'Berlin',
          data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
        }, {
          name: 'London',
          data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
        }]
      },
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
      logsLength: state => state.chart.logsLength,
      bucket: state => state.chart.bucket
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
      'getLogsInRange',
      'getChartLogsInRange'
    ]),
    ...mapGetters([
      // 'chartLogs',
      'chartRtuRegs'
    ]),
    // getChartData (event, done) {
    //   // console.log(this.chartRange.from, this.chartRange.to)
    //   // this.getLogsCountInRange(this.chartRange)
    //   this.showChart = false
    //   // clear charts
    //   // this.figs.forEach((fig, i) => {
    //   //   // console.log(i, fig)
    //   //   Plotly.newPlot(this.$refs.gd[i], [])
    //   // })
    //   const newDone = () => {
    //     this.showChart = true
    //     this.$nextTick(function () {
    //       // draw charts
    //       const rtuRegs = this.chartRtuRegs()
    //       // console.log('rtuRegs: ', rtuRegs)
    //       // const rtuRegKeys = Object.keys(rtuRegs)
    //       // console.log('Trace Names: ', rtuRegKeys)
    //       this.figs.forEach((fig, i) => {
    //         // console.log(i, fig)
    //         // build data = [trace, ...]
    //         const matchedRtuRegs = _.filter(rtuRegs, (rtuReg, header) => {
    //           return _.some(fig.regs, reg => reg === rtuReg.reg)
    //         })
    //         const data = _.map(matchedRtuRegs, (rtuReg) => {
    //           const trace = JSON.parse(JSON.stringify(this.traceTemplates[fig.trace]))
    //           trace.name = rtuReg.header
    //           trace.x = rtuReg.x
    //           trace.y = rtuReg.y
    //           return trace
    //         })
    //         // build layout = {}
    //         const layout = JSON.parse(JSON.stringify(this.figTemplates[fig.fig])).layout
    //         layout.title = fig.plotTitle
    //         layout.yaxis.title = fig.yaxisTitle
    //         Plotly.newPlot(this.$refs.gd[i], data, layout)
    //       })
    //       done()
    //     })
    //   }
    //   this.getLogsInRange({
    //     from: this.chartRange.from,
    //     to: this.chartRange.to,
    //     done: newDone
    //   })
    // },
    afterSetExtremes (event) {
      // console.log('afterSetExtremes', event.min, event.max, this.chartRange.from.getTime(), this.chartRange.to.getTime())
      // set chartRange
      let chartRange = {
        from: this.chartRange.from,
        to: this.chartRange.to
      }
      let changed = false
      if (event.min !== this.chartRange.from.getTime()) {
        changed = true
        chartRange.from = new Date(event.min)
      }
      if (event.max !== this.chartRange.to.getTime()) {
        changed = true
        chartRange.to = new Date(event.max)
      }
      if (changed) {
        this.chartRange = chartRange
      }
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
    },
    bucketFormat (value) {
      if (!value) return ''
      if (value === 'all') return '無'
      return value
    }
  },
  watch: {
    // chartUpdate (val, oldVal) {
    //   // console.log(this.$refs.chart.computedOptions.legend[0].data)
    //   // if (_.isEmpty(this.$refs.chart.computedOptions.legend[0].data)) return
    //   // this.$refs.chart.mergeOptions(val)
    //   // console.log(this.$refs.chart)
    // },
    total (val, oldVal) {
      if (!val) {
        this.chartRangeHasError = true
      }
      else {
        this.chartRangeHasError = false

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
            vm.animatedTotal = parseInt(obj.val.toFixed(0))
          })
          .start()
        animate()
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
  beforeDestroy () {
    _.forEach(Highcharts.charts, (chart, i) => {
      chart.destroy()
    })
  },
  mounted () {
    const headerRe = /^M(\d+)-([^-]+)-([^-]+)\(([^\(\)]+)\)$/
    const initCharts = (chartLogs) => {
      this.showChart = true
      // set chartRange
      this.chartRange = {
        from: new Date(chartLogs.start),
        to: new Date(chartLogs.end)
      }
      this.getLogsCountInRange(this.chartRange)
      this.$nextTick(() => {
        // draw charts
        this.figs.forEach((fig, i) => {
          // console.log(i, fig)
          const series = _.transform(chartLogs.data, (traces, data, header) => {
            const parsed = headerRe.exec(header)
            if (parsed) {
              const regName = parsed[3]
              if (_.some(fig.regs, reg => reg === regName)) {
                const trace = this.traceTemplates[fig.trace]()
                trace.name = header
                trace.data = data
                traces.push(trace)
              }
            }
          }, [])
          // build options
          const options = this.figTemplates[fig.fig]()
          options.title.text = fig.plotTitle
          options.yAxis.title.text = fig.yaxisTitle
          options.xAxis.min = new Date(chartLogs.start).getTime()
          options.xAxis.max = new Date(chartLogs.end).getTime()
          options.navigator.xAxis.min = new Date(chartLogs.start).getTime()
          options.navigator.xAxis.max = new Date(chartLogs.end).getTime()
          options.xAxis.events.afterSetExtremes = this.afterSetExtremes
          options.series = series
          // console.log(this.$refs.chartDiv[i])
          this.$refs.chartDiv[i].chart = Highcharts.stockChart(this.$refs.chartDiv[i], options)
        })
        this.$nextTick(() => {
          this.$refs.chartDiv[0].chart.reflow()
        })
        // watch chartRange
        this.$watch('chartRange', function (val, oldVal) {
          // console.log('chartRange', val.from.getTime(), val.to.getTime(), oldVal.from.getTime(), oldVal.to.getTime())
          this.getLogsCountInRange(val)
          // set navigator
          // console.log(Highcharts.charts)
          _.forEach(this.$refs.chartDiv, (chartDiv, i) => {
            chartDiv.chart.xAxis[0].setExtremes(new Date(val.from).getTime(), new Date(val.to).getTime())
            // chart.xAxis[1].setExtremes(new Date(val.from).getTime(), new Date(val.to).getTime())
          })

          const updateCharts = (chartLogs) => {
            _.forEach(this.$refs.chartDiv, (chartDiv, i) => {
              _.forEach(chartDiv.chart.series, (series, j) => {
                if (!series.hasOwnProperty('baseSeries')) {
                  series.setData(chartLogs.data[series.name] || [])
                }
              })
              chartDiv.chart.hideLoading()
            })
          }
          _.forEach(this.$refs.chartDiv, (chartDiv, i) => {
            chartDiv.chart.showLoading('讀取資料中...')
          })
          this.getChartLogsInRange({
            from: val.from.getTime(),
            to: val.to.getTime(),
            done: updateCharts
          })
        },{
          deep: true
        })
      })
    }
    this.getChartLogsInRange({
      done: initCharts
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.charts {
  width: 100%;
  height: 700px;
}
.q-item {
  padding: 8px;
}
.pad-8 {
  padding: 8px;
}
.pad-v-8 {
  padding-top: 8px;
  padding-bottom: 8px;
}
.pad-b-8 {
  padding-bottom: 8px;
}
.pad-b-0 {
  padding-bottom: 0px;
}
.margin-0 {
  margin: 0px;
}
.margin-8 {
  margin: 8px;
}
.lh-normal {
  line-height: normal;
}
.pad-t-8 {
  padding-top: 8px;
}
.pad-t-16 {
  padding-top: 16px;
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

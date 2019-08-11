<template>
  <q-page class="row wrap content-start q-pa-xs">
    <div class="col-xs-12">
      <q-card class="bg-white q-ma-xs">
        <q-card-section class="pad-b-8">
          <div class="title">
            圖表顯示{{ animatedTotal | totalFormat }}時間點資料
            <span v-show="bucket">(統計區間：{{ bucket | bucketFormat }})</span>
          </div>
        </q-card-section>
        <q-card-section class="">
          <q-list
            bordered
            separator
          >
            <q-item-label
              header
              class="q-pb-none"
            >
              資料庫
            </q-item-label>
            <q-item>
              <div class="full-width row wrap">
                <q-item class="col-xs-12 col-sm-6 col-md-3">
                  <q-item-section side>
                    <q-icon name="timeline" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>
                      總資料時間點數
                    </q-item-label>
                    <q-item-label caption>
                      {{ logsTotal | totalFormat }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
                <q-item class="col-xs-12 col-sm-6 col-md-3">
                  <q-item-section side>
                    <q-icon name="bubble_chart" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>
                      總資料點數
                    </q-item-label>
                    <q-item-label caption>
                      {{ (logsTotal * 26) | totalFormat }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
                <q-item class="col-xs-12 col-sm-6 col-md-3">
                  <q-item-section side>
                    <q-icon name="skip_previous" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>
                      總資料起始時間
                    </q-item-label>
                    <q-item-label caption>
                      {{ logsStart | dateFormat }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
                <q-item class="col-xs-12 col-sm-6 col-md-3">
                  <q-item-section side>
                    <q-icon name="skip_next" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>
                      總資料最後時間
                    </q-item-label>
                    <q-item-label caption>
                      {{ logsEnd | dateFormat }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </div>
            </q-item>
            <q-separator />
            <q-item-label
              header
              class="q-pb-none"
            >
              自訂圖表
            </q-item-label>
            <q-item>
              <div class="full-width row wrap">
                <q-item class="col-xs-12 col-sm-6 col-md-3">
                  <q-input
                    v-model="fromModel"
                    class="full-width"
                    label="起始時間"
                    error-message="所選時間範圍查無資料"
                    :error="chartRangeHasError"
                    mask="datetime"
                    filled
                    hide-bottom-space
                  >
                    <template v-slot:prepend>
                      <q-icon
                        name="event"
                        class="cursor-pointer"
                      >
                        <q-popup-proxy
                          transition-show="scale"
                          transition-hide="scale"
                          anchor="bottom left"
                          self="top left"
                          :cover="false"
                          :offset="[12, 14]"
                        >
                          <q-date
                            v-model="fromModel"
                            mask="YYYY/MM/DD HH:mm"
                          />
                        </q-popup-proxy>
                      </q-icon>
                      <q-icon
                        name="access_time"
                        class="cursor-pointer"
                      >
                        <q-popup-proxy
                          transition-show="scale"
                          transition-hide="scale"
                          anchor="bottom left"
                          self="top left"
                          :cover="false"
                          :offset="[38, 14]"
                        >
                          <q-time
                            v-model="fromModel"
                            mask="YYYY/MM/DD HH:mm"
                            format24h
                          />
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </q-item>
                <q-item class="col-xs-12 col-sm-6 col-md-3">
                  <q-input
                    v-model="toModel"
                    class="full-width"
                    label="結束時間"
                    error-message="所選時間範圍查無資料"
                    :error="chartRangeHasError"
                    mask="datetime"
                    filled
                    hide-bottom-space
                  >
                    <template v-slot:prepend>
                      <q-icon
                        name="event"
                        class="cursor-pointer"
                      >
                        <q-popup-proxy
                          transition-show="scale"
                          transition-hide="scale"
                          anchor="bottom left"
                          self="top left"
                          :cover="false"
                          :offset="[12, 14]"
                        >
                          <q-date
                            v-model="toModel"
                            mask="YYYY/MM/DD HH:mm"
                          />
                        </q-popup-proxy>
                      </q-icon>
                      <q-icon
                        name="access_time"
                        class="cursor-pointer"
                      >
                        <q-popup-proxy
                          transition-show="scale"
                          transition-hide="scale"
                          anchor="bottom left"
                          self="top left"
                          :cover="false"
                          :offset="[38, 14]"
                        >
                          <q-time
                            v-model="toModel"
                            mask="YYYY/MM/DD HH:mm"
                            format24h
                          />
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </q-item>
              </div>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>
    <div
      v-show="!showChart"
      class="col-xs-12"
    >
      <q-card class="bg-white q-ma-xs">
        <q-card-section>
          <div class="title text-center">
            圖表資料載入中...
          </div>
        </q-card-section>
      </q-card>
    </div>
    <div
      v-for="(fig, index) in figs"
      v-show="showChart"
      :key="index"
      class="col-xs-12"
    >
      <q-card class="bg-white q-ma-xs">
        <q-card-section>
          <div
            ref="chartDiv"
            class="margin-8"
          ></div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { mapState, mapGetters, mapActions } from 'vuex'
import { date } from 'quasar'
import _ from 'lodash'
import TWEEN from '@tweenjs/tween.js'

import Highcharts from 'highcharts/highstock'
import HighchartsMore from 'highcharts/highcharts-more'
import Exporting from 'highcharts/modules/exporting'
import ExportData from 'highcharts/modules/export-data'
import OfflineExporting from 'highcharts/modules/offline-exporting'
import Boost from 'highcharts/modules/boost'
import BoostCanvas from 'highcharts/modules/boost-canvas'
global.Highcharts = Highcharts

HighchartsMore(Highcharts)
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
    contextButtonTitle: '匯出選項',
    downloadCSV: '下載 CSV 檔',
    downloadJPEG: '下載 JPG 檔',
    downloadPDF: '下載 PDF 檔',
    downloadPNG: '下載 PNG 檔',
    downloadSVG: '下載 SVG 檔',
    downloadXLS: '下載 XLS 檔',
    loading: '載入中',
    months: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ],
    printChart: '列印',
    resetZoom: '重設縮放',
    shortMonths: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ],
    viewData: '顯示資料表格',
    weekdays: ['週日', '週一', '週二', '週三', '週四', '週五', '週六'],
    rangeSelectorZoom: '縮放',
    viewFullscreen: '全螢幕'
  }
})

// fix pdf export
Highcharts.wrap(Highcharts.Chart.prototype, 'exportChartLocal', function (proceed, options) {
  if (options && options.type === 'application/pdf') {
    this.exportChart(options)
  } else {
    proceed.call(this, options)
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
    -width - 1,
    0.5,
    'L',
    0,
    0.5,
    'L',
    0,
    height + 0.5,
    'L',
    -width - 1,
    height + 0.5,
    'L',
    -width - 1,
    0.5,
    'M',
    -markerPosition - halfWidth,
    4,
    'L',
    -markerPosition - halfWidth,
    height - 3,
    'M',
    markerPosition - halfWidth - 1,
    4,
    'L',
    markerPosition - halfWidth - 1,
    height - 3
  ]
}

Highcharts.SVGRenderer.prototype.symbols['navigator-handle-right'] = function (x, y, w, h, options) {
  const height = options.height
  const width = options.width
  const halfWidth = options.width / 2
  const markerPosition = Math.round(halfWidth / 3) + 0.5

  return [
    'M',
    -1,
    0.5,
    'L',
    width,
    0.5,
    'L',
    width,
    height + 0.5,
    'L',
    -1,
    height + 0.5,
    'L',
    -1,
    0.5,
    'M',
    halfWidth - markerPosition,
    4,
    'L',
    halfWidth - markerPosition,
    height - 3,
    'M',
    halfWidth + markerPosition - 1,
    4,
    'L',
    halfWidth + markerPosition - 1,
    height - 3
  ]
}

if (Highcharts.VMLRenderer) {
  Highcharts.VMLRenderer.prototype.symbols['navigator-handle-left'] =
    Highcharts.SVGRenderer.prototype.symbol['navigator-handle-left']
  Highcharts.VMLRenderer.prototype.symbols['navigator-handle-right'] =
    Highcharts.SVGRenderer.prototype.symbol['navigator-handle-right']
}

const chartColors = [
  {
    color: '#3366CC',
    lighter: '#45AFE2'
  },
  {
    color: '#DC3912',
    lighter: '#FF3300'
  },
  {
    color: '#FF9900',
    lighter: '#FFCC00'
  },
  {
    color: '#109618',
    lighter: '#14C21D'
  },
  {
    color: '#990099',
    lighter: '#DF51FD'
  },
  {
    color: '#0099C6',
    lighter: '#15CBFF'
  },
  {
    color: '#DD4477',
    lighter: '#FF97D2'
  },
  {
    color: '#66AA00',
    lighter: '#97FB00'
  },
  {
    color: '#B82E2E',
    lighter: '#DB6651'
  },
  {
    color: '#316395',
    lighter: '#518BC6'
  },
  {
    color: '#994499',
    lighter: '#BD6CBD'
  },
  {
    color: '#22AA99',
    lighter: '#35D7C2'
  },
  {
    color: '#AAAA11',
    lighter: '#E9E91F'
  },
  {
    color: '#6633CC',
    lighter: '#9877DD'
  },
  {
    color: '#E67300',
    lighter: '#FF8F20'
  },
  {
    color: '#8B0707',
    lighter: '#D20B0B'
  },
  {
    color: '#651067',
    lighter: '#B61DBA'
  },
  {
    color: '#329262',
    lighter: '#40BD7E'
  },
  {
    color: '#5574A6',
    lighter: '#6AA7C4'
  },
  {
    color: '#3B3EAC',
    lighter: '#6D70CD'
  },
  {
    color: '#B77322',
    lighter: '#DA9136'
  },
  {
    color: '#16D620',
    lighter: '#2DEA36'
  },
  {
    color: '#B91383',
    lighter: '#E81EA6'
  },
  {
    color: '#F4359E',
    lighter: '#F558AE'
  },
  {
    color: '#9C5935',
    lighter: '#C07145'
  },
  {
    color: '#A9C413',
    lighter: '#D7EE53'
  },
  {
    color: '#2A778D',
    lighter: '#3EA7C6'
  },
  {
    color: '#668D1C',
    lighter: '#97D129'
  },
  {
    color: '#BEA413',
    lighter: '#E9CA1D'
  },
  {
    color: '#0C5922',
    lighter: '#149638'
  },
  {
    color: '#743411',
    lighter: '#C5571D'
  },
  {
    color: '#3366CC',
    lighter: '#45AFE2'
  },
  {
    color: '#DC3912',
    lighter: '#FF3300'
  },
  {
    color: '#FF9900',
    lighter: '#FFCC00'
  },
  {
    color: '#109618',
    lighter: '#14C21D'
  },
  {
    color: '#990099',
    lighter: '#DF51FD'
  },
  {
    color: '#0099C6',
    lighter: '#15CBFF'
  },
  {
    color: '#DD4477',
    lighter: '#FF97D2'
  },
  {
    color: '#66AA00',
    lighter: '#97FB00'
  },
  {
    color: '#B82E2E',
    lighter: '#DB6651'
  },
  {
    color: '#316395',
    lighter: '#518BC6'
  },
  {
    color: '#994499',
    lighter: '#BD6CBD'
  },
  {
    color: '#22AA99',
    lighter: '#35D7C2'
  },
  {
    color: '#AAAA11',
    lighter: '#E9E91F'
  },
  {
    color: '#6633CC',
    lighter: '#9877DD'
  },
  {
    color: '#E67300',
    lighter: '#FF8F20'
  },
  {
    color: '#8B0707',
    lighter: '#D20B0B'
  },
  {
    color: '#651067',
    lighter: '#B61DBA'
  },
  {
    color: '#329262',
    lighter: '#40BD7E'
  },
  {
    color: '#5574A6',
    lighter: '#6AA7C4'
  },
  {
    color: '#3B3EAC',
    lighter: '#6D70CD'
  },
  {
    color: '#B77322',
    lighter: '#DA9136'
  },
  {
    color: '#16D620',
    lighter: '#2DEA36'
  },
  {
    color: '#B91383',
    lighter: '#E81EA6'
  },
  {
    color: '#F4359E',
    lighter: '#F558AE'
  },
  {
    color: '#9C5935',
    lighter: '#C07145'
  },
  {
    color: '#A9C413',
    lighter: '#D7EE53'
  },
  {
    color: '#2A778D',
    lighter: '#3EA7C6'
  },
  {
    color: '#668D1C',
    lighter: '#97D129'
  },
  {
    color: '#BEA413',
    lighter: '#E9CA1D'
  },
  {
    color: '#0C5922',
    lighter: '#149638'
  },
  {
    color: '#743411',
    lighter: '#C5571D'
  }
]

export default {
  name: 'pages.Chart',
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
      if (value === '1ms') return '無'
      return value
    }
  },
  data () {
    let data = []

    for (let i = 0; i <= 360; i++) {
      let t = (i / 180) * Math.PI
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
      animatedTotal: 0,
      traceTemplates: {
        timeSeriesTrace: {
          // Plotly
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
            description: '',
            data: [],
            dataGrouping: {
              enabled: false
            },
            showInNavigator: true,
            connectNulls: false,
            turboThreshold: 0,
            gapSize: 10,
            zindex: 1,
            tooltip: {
              valueSuffix: undefined
            }
          }
        },
        highStockLineRange () {
          return {
            type: 'arearange',
            name: '',
            description: '',
            data: [],
            dataGrouping: {
              enabled: false
            },
            includeInCSVExport: false,
            // includeInDataExport: false, // 7.1.0
            showInNavigator: false,
            connectNulls: false,
            turboThreshold: 0,
            gapSize: 10,
            marker: {
              enabled: false
            },
            zindex: 0,
            fillOpacity: 0.2,
            linkedTo: ':previous',
            lineWidth: 0,
            tooltip: {
              valueSuffix: undefined
            }
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
              series: {
                includeInCSVExport: false
                // includeInDataExport: false, // 7.1.0
              },
              xAxis: {
                dateTimeLabelFormats: {
                  millisecond: '%H:%M:%S.%L',
                  second: '%H:%M:%S',
                  minute: '%H:%M',
                  hour: '%H:%M',
                  day: '%m/%d',
                  week: '%m/%d',
                  month: '%Y/%m',
                  year: '%Y'
                }
              },
              handles: {
                symbols: ['navigator-handle-left', 'navigator-handle-right']
              }
            },
            exporting: {
              sourceWidth: 1400, // works with css height: 700px
              chartOptions: {
                navigator: {
                  enabled: false
                },
                scrollbar: {
                  enabled: false
                },
                rangeSelector: {
                  enabled: false
                }
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
              buttons: [
                {
                  count: 15,
                  type: 'minute',
                  text: '15m'
                },
                {
                  type: 'hour',
                  count: 1,
                  text: '1h'
                },
                {
                  type: 'hour',
                  count: 3,
                  text: '3h'
                },
                {
                  type: 'hour',
                  count: 6,
                  text: '6h'
                },
                {
                  type: 'hour',
                  count: 12,
                  text: '12h'
                },
                {
                  count: 1,
                  type: 'day',
                  text: '1d'
                },
                {
                  count: 1,
                  type: 'week',
                  text: '1w'
                },
                {
                  type: 'month',
                  count: 1,
                  text: '1m'
                },
                {
                  type: 'year',
                  count: 1,
                  text: '1y'
                },
                {
                  type: 'all',
                  text: 'All'
                }
              ],
              inputEnabled: false, // it supports only days
              selected: -1 // all
            },
            xAxis: {
              events: {},
              minRange: 60 * 1000, // one minute
              ordinal: false,
              title: {
                text: '時間'
              },
              dateTimeLabelFormats: {
                millisecond: '%H:%M:%S.%L',
                second: '%H:%M:%S',
                minute: '%H:%M',
                hour: '%H:%M',
                day: '%m/%d',
                week: '%m/%d',
                month: '%Y/%m',
                year: '%Y'
              }
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
              text: `© ${new Date().getFullYear()} 蘭陽地熱`
            },
            legend: {
              enabled: true
            },
            tooltip: {
              valueDecimals: 2,
              shared: true,
              split: false,
              dateTimeLabelFormats: {
                millisecond: '%Y/%m/%d %A %k:%M:%S.%L',
                second: '%Y/%m/%d %A %k:%M:%S',
                minute: '%Y/%m/%d %A %k:%M',
                hour: '%Y/%m/%d %A %k時',
                day: '%Y/%m/%d %A',
                week: '%Y/%m/%d',
                month: '%Y/%m',
                year: '%Y'
              }
            }
          }
        },
        timeSeriesFig: {
          // Plotly
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
                  { step: 'all' }
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
        emptyFig: {}
      },
      figs: [
        {
          figTemplate: 'highStockChart',
          traceTemplates: ['highStockLine', 'highStockLineRange'],
          regs: ['三相功率', '有功功率'],
          plotTitle: '有功功率',
          yaxisTitle: '有功功率(kW)'
        },
        {
          figTemplate: 'highStockChart',
          traceTemplates: ['highStockLine', 'highStockLineRange'],
          regs: ['無功功率'],
          plotTitle: '無功功率',
          yaxisTitle: '無功功率(kvar)'
        },
        {
          figTemplate: 'highStockChart',
          traceTemplates: ['highStockLine', 'highStockLineRange'],
          regs: ['視在功率'],
          plotTitle: '視在功率',
          yaxisTitle: '視在功率(kVA)'
        },
        {
          figTemplate: 'highStockChart',
          traceTemplates: ['highStockLine', 'highStockLineRange'],
          regs: ['頻率'],
          plotTitle: '頻率',
          yaxisTitle: '頻率(Hz)'
        },
        {
          figTemplate: 'highStockChart',
          traceTemplates: ['highStockLine', 'highStockLineRange'],
          regs: ['A相電壓', 'B相電壓', 'C相電壓', 'AB線電壓', 'BC線電壓', 'CA線電壓'],
          plotTitle: '三相電壓',
          yaxisTitle: '電壓(V)'
        },
        {
          figTemplate: 'highStockChart',
          traceTemplates: ['highStockLine', 'highStockLineRange'],
          regs: ['A相電流', 'B相電流', 'C相電流'],
          plotTitle: '三相電流',
          yaxisTitle: '電流(A)'
        },
        // {
        //   figTemplate: 'highStockChart',
        //   traceTemplates: ['highStockLine', 'highStockLineRange'],
        //   regs: ['有功電量', '無功電量', '視在電量'],
        //   plotTitle: '發電量',
        //   yaxisTitle: '發電量(kWh/kvarh/kVAh)'
        // },
        {
          figTemplate: 'highStockChart',
          traceTemplates: ['highStockLine', 'highStockLineRange'],
          regs: ['溫度'],
          plotTitle: '管線溫度',
          yaxisTitle: '溫度(℃)'
        },
        {
          figTemplate: 'highStockChart',
          traceTemplates: ['highStockLine', 'highStockLineRange'],
          regs: ['壓力'],
          plotTitle: '管線壓力',
          yaxisTitle: '壓力(bar)'
        },
        {
          figTemplate: 'highStockChart',
          traceTemplates: ['highStockLine', 'highStockLineRange'],
          regs: ['質量流率'],
          plotTitle: '質量流率-科氏力流量計',
          yaxisTitle: '質量流率(t/h)'
        },
        {
          figTemplate: 'highStockChart',
          traceTemplates: ['highStockLine', 'highStockLineRange'],
          regs: ['流量'],
          plotTitle: '體積流率-電磁流量計',
          yaxisTitle: '體積流率(m3/h)'
        },
        // {
        //   figTemplate: 'highStockChart',
        //   traceTemplates: ['highStockLine', 'highStockLineRange'],
        //   regs: ['計算'],
        //   plotTitle: '計算',
        //   yaxisTitle: '計算'
        // },
        {
          figTemplate: 'highStockChart',
          traceTemplates: ['highStockLine', 'highStockLineRange'],
          regs: ['入水測溫度', '發電機測溫度'],
          plotTitle: '軸心溫度',
          yaxisTitle: '溫度(℃)'
        }
      ],
      options: {
        title: {
          text: 'Monthly Average Temperature',
          x: -20 // center
        },
        subtitle: {
          text: 'Source: WorldClimate.com',
          x: -20
        },
        xAxis: {
          categories: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
          ]
        },
        yAxis: {
          title: {
            text: 'Temperature (°C)'
          },
          plotLines: [
            {
              value: 0,
              width: 1,
              color: '#808080'
            }
          ]
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
        series: [
          {
            name: 'Tokyo',
            data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
          },
          {
            name: 'New York',
            data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
          },
          {
            name: 'Berlin',
            data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
          },
          {
            name: 'London',
            data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
          }
        ]
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
        series: [],
        animationDuration: 1000
      }
    }
  },
  computed: {
    ...mapState('chart', ['total', 'bucket']),
    ...mapState('logs', { logsTotal: 'total', logsStart: 'start', logsEnd: 'end' }),
    fromModel: {
      get () {
        return date.formatDate(this.chartRange.from, 'YYYY/MM/DD HH:mm')
      },
      set (v) {
        this.$debug(v)
        const d = new Date(`${v}`)
        this.$debug(d)
        this.chartRange.from = date.adjustDate(this.chartRange.from, {
          year: d.getFullYear(),
          month: d.getMonth() + 1,
          date: d.getDate(),
          hours: d.getHours(),
          minutes: d.getMinutes(),
          seconds: 0,
          milliseconds: 0
        })
      }
    },
    toModel: {
      get () {
        return date.formatDate(this.chartRange.to, 'YYYY/MM/DD HH:mm')
      },
      set (v) {
        // this.$debug(v)
        const d = new Date(`${v}`)
        this.chartRange.to = date.adjustDate(this.chartRange.to, {
          year: d.getFullYear(),
          month: d.getMonth() + 1,
          date: d.getDate(),
          hours: d.getHours(),
          minutes: d.getMinutes(),
          seconds: 0,
          milliseconds: 0
        })
      }
    }
  },
  watch: {
    total (val, oldVal) {
      if (!val) {
        this.chartRangeHasError = true
      } else {
        this.chartRangeHasError = false

        var vm = this
        const animate = () => {
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
    }
  },
  beforeDestroy () {
    _.forEach(this.$refs.chartDiv, (chartDiv, i) => {
      chartDiv.chart.destroy()
    })
  },
  mounted () {
    const headerRe = /^M(\d+)-([^-]+)-([^-]+)\(([^()]+)\)$/
    const initCharts = chartLogs => {
      this.showChart = true
      // set chartRange
      this.chartRange = {
        from: new Date(chartLogs.start),
        to: new Date(chartLogs.end)
      }
      // this.getLogsCountInRange(this.chartRange)
      this.$nextTick(() => {
        // const t0 = performance.now()
        // draw charts
        // map traces with the same name to the same color
        const traceToColorId = {}
        let colorId = 0
        let i = 0
        const initFig = () => {
          const fig = this.figs[i]
          // console.log(i, fig)
          // build traces
          const series = _.transform(
            chartLogs.data,
            (traces, data, header) => {
              // (accumulator, value, key, object)
              const parsed = headerRe.exec(header)
              if (parsed) {
                const rtuAddr = parsed[1]
                const rtuName = parsed[2]
                const regName = parsed[3]
                const unit = parsed[4]
                let regNameRest = `${regName}(${unit})`.replace(fig.yaxisTitle, '')
                if (regNameRest.length > 0) {
                  regNameRest = '-' + regNameRest
                }
                if (_.some(fig.regs, reg => reg === regName)) {
                  _.forEach(fig.traceTemplates, (traceTemplate, i) => {
                    const trace = this.traceTemplates[traceTemplate]()
                    // trace.name = header
                    trace.description = header
                    trace.name = `M${rtuAddr}-${rtuName}${regNameRest}`
                    if (!traceToColorId.hasOwnProperty(trace.name)) {
                      traceToColorId[trace.name] = colorId++
                    }
                    trace.data = data
                    trace.tooltip.valueSuffix = unit
                    if (i === 0) {
                      trace.tooltip.pointFormat =
                        '<span style="color:{series.color}">●</span> {series.name}: <b>{point.y}</b> '
                      trace.color = chartColors[traceToColorId[trace.name]].color
                    } else {
                      trace.tooltip.pointFormat = '(<b>{point.low}</b> - <b>{point.high}</b>)<br/>'
                      trace.color = chartColors[traceToColorId[trace.name]].lighter
                    }
                    traces.push(trace)
                  })
                }
              }
            },
            []
          )
          // console.log('transform time:', ((performance.now() - t0) / 1000).toFixed(2))
          // build figure
          const options = this.figTemplates[fig.figTemplate]()
          options.title.text = fig.plotTitle
          options.yAxis.title.text = fig.yaxisTitle
          options.xAxis.min = new Date(chartLogs.start).getTime()
          options.xAxis.max = new Date(chartLogs.end).getTime()
          options.navigator.xAxis.min = new Date(chartLogs.start).getTime()
          options.navigator.xAxis.max = new Date(chartLogs.end).getTime()
          options.xAxis.events.afterSetExtremes = this.afterSetExtremes
          options.series = series
          // console.log(this.$refs.chartDiv[i])
          this.$refs.chartDiv[i].chart = Highcharts.stockChart(
            this.$refs.chartDiv[i],
            options,
            () => {
              // this.$refs.chartDiv[i].chart.reflow()
              i += 1
              if (i < this.figs.length) {
                setTimeout(() => {
                  this.$refs.chartDiv[i - 1].chart.reflow()
                  initFig()
                  // console.log('draw time:', ((performance.now() - t0) / 1000).toFixed(2))
                }, 10)
              }
            }
          )
        }
        initFig()
        // console.log('draw time:', ((performance.now() - t0) / 1000).toFixed(2))
        // watch chartRange
        this.$watch(
          'chartRange',
          function (val, oldVal) {
            // const t0 = performance.now()
            // console.log('chartRange', val.from.getTime(), val.to.getTime(), oldVal.from.getTime(), oldVal.to.getTime())
            // this.getLogsCountInRange(val)
            const updateCharts = chartLogs => {
              // console.log(`updateCharts start: ${performance.now() - t0}ms`)
              _.forEach(this.$refs.chartDiv, (chartDiv, i) => {
                // set navigator
                chartDiv.chart.xAxis[0].setExtremes(
                  new Date(val.from).getTime(),
                  new Date(val.to).getTime(),
                  false
                )
                _.forEach(chartDiv.chart.series, (series, j) => {
                  if (!series.hasOwnProperty('baseSeries')) {
                    series.setData(chartLogs.data[series.userOptions.description] || [], false)
                  }
                })
                // console.log(`+++setData done: ${performance.now() - t0}ms`)
                chartDiv.chart.redraw(false)
                // console.log(`***redraw done: ${performance.now() - t0}ms`)
                chartDiv.chart.hideLoading()
              })
              // console.log(`--updateCharts done: ${performance.now() - t0}ms`)
            }
            _.forEach(this.$refs.chartDiv, (chartDiv, i) => {
              chartDiv.chart.showLoading('讀取資料中...')
            })
            this.findLogsInRange({
              from: val.from.getTime(),
              to: val.to.getTime(),
              done: updateCharts
            })
            // console.log(`chartRange done: ${performance.now() - t0}ms`)
          },
          {
            deep: true
          }
        )
      })
    }
    this.findLogsInRange({
      done: initCharts
    })
  },
  methods: {
    ...mapActions('chart', ['findLogsInRange']),
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
  }
}
</script>

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
<style>
.highcharts-data-table {
  height: 500px;
  overflow: scroll;
}
.highcharts-data-table table {
  border-collapse: collapse;
  border-spacing: 0;
  background: white;
  min-width: 100%;
  margin-top: 10px;
  font-family: sans-serif;
  font-size: 0.9em;
}
.highcharts-data-table td,
.highcharts-data-table th,
.highcharts-data-table caption {
  border: 1px solid silver;
  padding: 0.5em;
}
.highcharts-data-table td:nth-child(1) {
  width: 140px;
}
.highcharts-data-table tr:nth-child(even),
.highcharts-data-table thead tr {
  background: #f8f8f8;
}
.highcharts-data-table tr:hover {
  background: #eff;
}
.highcharts-data-table caption {
  border-bottom: none;
  font-size: 1.1em;
  font-weight: bold;
}
</style>

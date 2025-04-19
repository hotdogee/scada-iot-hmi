<template>
  <q-page class="row wrap q-pa-xs content-start">
    <div class="col-12">
      <q-card class="q-ma-xs bg-white">
        <q-card-section class="q-pb-sm">
          <div class="text-h6">
            圖表顯示 {{ totalFormat(animatedTotal) }} 時間點資料
            <span v-show="chartStore.bucket"
              >(統計區間：{{ bucketFormat(chartStore.bucket) }})</span
            >
          </div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-list bordered separator>
            <q-item-label header class="q-pb-none"> 資料庫 </q-item-label>
            <q-item class="full-width row">
              <q-item-section class="top q-gutter-sm">
                <div class="row">
                  <q-item class="col-xs-12 col-sm-6 col-md-3">
                    <q-item-section avatar>
                      <q-icon name="timeline" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label> 總資料時間點數 </q-item-label>
                      <q-item-label caption>
                        {{ totalFormat(logsStore.total) }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item class="col-xs-12 col-sm-6 col-md-3">
                    <q-item-section avatar>
                      <q-icon name="bubble_chart" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label> 總資料點數 </q-item-label>
                      <q-item-label caption>
                        {{ totalFormat((logsStore.total ?? 0) * 26) }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item class="col-xs-12 col-sm-6 col-md-3">
                    <q-item-section avatar>
                      <q-icon name="skip_previous" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label> 總資料起始時間 </q-item-label>
                      <q-item-label caption>
                        {{ dateFormat(logsStore.start) }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item class="col-xs-12 col-sm-6 col-md-3">
                    <q-item-section avatar>
                      <q-icon name="skip_next" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label> 總資料最後時間 </q-item-label>
                      <q-item-label caption>
                        {{ dateFormat(logsStore.end) }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </div>
              </q-item-section>
            </q-item>
            <q-separator />
            <q-item-label header class="q-pb-none"> 自訂圖表 </q-item-label>
            <q-item class="full-width row">
              <q-item-section class="top">
                <div class="row">
                  <q-item class="col-xs-12 col-sm-6 col-md-3">
                    <q-input
                      v-model="fromModel"
                      class="full-width"
                      label="起始時間"
                      error-message="所選時間範圍查無資料"
                      :error="chartRangeHasError"
                      mask="####/##/## ##:##"
                      filled
                      hide-bottom-space
                      stack-label
                    >
                      <template #prepend>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy
                            transition-show="scale"
                            transition-hide="scale"
                            anchor="bottom left"
                            self="top left"
                            :offset="[0, 8]"
                          >
                            <q-date v-model="fromModel" mask="YYYY/MM/DD HH:mm" />
                          </q-popup-proxy>
                        </q-icon>
                        <q-icon name="access_time" class="cursor-pointer">
                          <q-popup-proxy
                            transition-show="scale"
                            transition-hide="scale"
                            anchor="bottom left"
                            self="top left"
                            :offset="[0, 8]"
                          >
                            <q-time v-model="fromModel" mask="YYYY/MM/DD HH:mm" format24h />
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
                      mask="####/##/## ##:##"
                      filled
                      hide-bottom-space
                      stack-label
                    >
                      <template #prepend>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy
                            transition-show="scale"
                            transition-hide="scale"
                            anchor="bottom left"
                            self="top left"
                            :offset="[0, 8]"
                          >
                            <q-date v-model="toModel" mask="YYYY/MM/DD HH:mm" />
                          </q-popup-proxy>
                        </q-icon>
                        <q-icon name="access_time" class="cursor-pointer">
                          <q-popup-proxy
                            transition-show="scale"
                            transition-hide="scale"
                            anchor="bottom left"
                            self="top left"
                            :offset="[0, 8]"
                          >
                            <q-time v-model="toModel" mask="YYYY/MM/DD HH:mm" format24h />
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </q-item>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>
    <div v-show="!showChart" class="col-12">
      <q-card class="q-ma-xs bg-white">
        <q-card-section>
          <div class="text-h6 text-center">圖表資料載入中...</div>
        </q-card-section>
      </q-card>
    </div>
    <div v-for="(fig, index) in figs" v-show="showChart" :key="index" class="col-12">
      <q-card class="q-ma-xs bg-white">
        <q-card-section>
          <div
            :ref="
              (el) => {
                if (el) chartDivRefs[index] = el as HTMLDivElement
              }
            "
            class="margin-8"
          ></div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { Easing, Tween } from '@tweenjs/tween.js'
import * as Highcharts from 'highcharts/highstock' // this needs to be imported before the modules
import 'highcharts/highcharts-more'
// import 'highcharts/modules/boost'
// import 'highcharts/modules/boost-canvas'
import 'highcharts/modules/export-data'
import 'highcharts/modules/exporting'
import 'highcharts/modules/offline-exporting'
import _ from 'lodash'
import { storeToRefs } from 'pinia'
import { date } from 'quasar'
import { useChartStore, type ChartLogs } from 'stores/chart'
import { useLogsStore } from 'stores/logs'
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'

// Define component options if necessary (e.g., name)
// defineOptions({ name: 'ChartPage' });

// --- Pinia Stores ---
const chartStore = useChartStore()
const logsStore = useLogsStore()
// Use storeToRefs for reactive access to state properties in the template
const { total: chartTotal } = storeToRefs(chartStore)

// --- Highcharts Setup ---
globalThis.Highcharts = Highcharts

Highcharts.setOptions({
  // boost: {
  //   enabled: true,
  //   seriesThreshold: 1
  // },
  time: {
    timezone: 'undefined' // Set timezone to undefined to use local time
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
  },
  exporting: {
    buttons: {
      contextButton: {
        menuItems: [
          'downloadPNG',
          'downloadJPEG',
          'downloadPDF',
          'downloadSVG',
          'downloadCSV',
          'downloadXLS',
          'viewData'
        ]
      }
    }
  }
})

// fix pdf export - Check if Highcharts.wrap still works as expected in v10+
Highcharts.wrap(
  Highcharts.Chart.prototype,
  'exportChartLocal',
  function (this: Highcharts.Chart, proceed, exportingOptions, chartOptions) {
    if (exportingOptions && exportingOptions.type === 'application/pdf') {
      this.exportChart(exportingOptions, chartOptions)
    } else {
      proceed.call(this, exportingOptions, chartOptions)
    }
  }
)

// Custom navigator handles
// Ensure SVGRenderer and symbols are available and work as expected
if (Highcharts.SVGRenderer) {
  Highcharts.SVGRenderer.prototype.symbols['navigator-handle-left'] = (
    _x: number,
    _y: number,
    _w: number,
    _h: number,
    options: { height: number; width: number }
  ) => {
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
  Highcharts.SVGRenderer.prototype.symbols['navigator-handle-right'] = (
    _x: number,
    _y: number,
    _w: number,
    _h: number,
    options: { height: number; width: number }
  ) => {
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
}

// VML Renderer might be deprecated or removed in newer Highcharts versions
// if (Highcharts.VMLRenderer) {
//   Highcharts.VMLRenderer.prototype.symbols['navigator-handle-left'] =
//     Highcharts.SVGRenderer.prototype.symbols['navigator-handle-left'];
//   Highcharts.VMLRenderer.prototype.symbols['navigator-handle-right'] =
//     Highcharts.SVGRenderer.prototype.symbols['navigator-handle-right'];
// }

// --- Types ---
interface ChartRange {
  from: Date
  to: Date
}

interface FigConfig {
  figTemplate: string
  traceTemplates: string[]
  regs: string[]
  plotTitle: string
  yaxisTitle: string
}

// Define types for Highcharts options and series more specifically if needed
type HighchartsOptions = Highcharts.Options
type HighchartsSeriesOptions = Highcharts.SeriesOptionsType

// --- Reactive State ---
const chartRangeHasError = ref(false)
const chartRange = reactive<ChartRange>({
  from: date.subtractFromDate(new Date(), { hours: 1 }),
  to: new Date()
})
const showChart = ref(false)
const chartsLoaded = ref(false)
const delayedChartUpdate = ref<ChartRange | null>(null) // Use null instead of false
const animatedTotal = ref(0)
const chartDivRefs = ref<HTMLDivElement[]>([])
const highchartsInstances = ref<Highcharts.Chart[]>([])
const isUpdating = ref(false)

// --- Formatting Helpers (Replaces Filters) ---
const totalFormat = (value: number | null | undefined): string => {
  const num = value ?? 0
  return ` ${num.toLocaleString()} 筆`
}

const dateFormat = (value: string | null | undefined): string => {
  if (!value) return ''
  return new Date(value).toLocaleString()
}

const bucketFormat = (value: string | null): string => {
  if (!value) return ''
  if (value === '1ms') return '無'
  return value
}

// --- Computed Properties ---
const fromModel = computed({
  get: () => date.formatDate(chartRange.from, 'YYYY/MM/DD HH:mm'),
  set: (v: string) => {
    try {
      const d = date.extractDate(v, 'YYYY/MM/DD HH:mm')
      chartRange.from = date.adjustDate(chartRange.from, {
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        date: d.getDate(),
        hours: d.getHours(),
        minutes: d.getMinutes(),
        seconds: 0,
        milliseconds: 0
      })
    } catch (e) {
      console.error('Error parsing date:', e)
    }
  }
})

const toModel = computed({
  get: () => date.formatDate(chartRange.to, 'YYYY/MM/DD HH:mm'),
  set: (v: string) => {
    try {
      const d = date.extractDate(v, 'YYYY/MM/DD HH:mm')
      chartRange.to = date.adjustDate(chartRange.to, {
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        date: d.getDate(),
        hours: d.getHours(),
        minutes: d.getMinutes(),
        seconds: 0,
        milliseconds: 0
      })
    } catch (e) {
      console.error('Error parsing date:', e)
    }
  }
})

// --- Chart Configuration Data ---
const chartColors = [
  { color: '#3366CC', lighter: '#45AFE2' },
  { color: '#DC3912', lighter: '#FF3300' },
  { color: '#FF9900', lighter: '#FFCC00' },
  { color: '#109618', lighter: '#14C21D' },
  { color: '#990099', lighter: '#DF51FD' },
  { color: '#0099C6', lighter: '#15CBFF' },
  { color: '#DD4477', lighter: '#FF97D2' },
  { color: '#66AA00', lighter: '#97FB00' },
  { color: '#B82E2E', lighter: '#DB6651' },
  { color: '#316395', lighter: '#518BC6' },
  { color: '#994499', lighter: '#BD6CBD' },
  { color: '#22AA99', lighter: '#35D7C2' },
  { color: '#AAAA11', lighter: '#E9E91F' },
  { color: '#6633CC', lighter: '#9877DD' },
  { color: '#E67300', lighter: '#FF8F20' },
  { color: '#8B0707', lighter: '#D20B0B' },
  { color: '#651067', lighter: '#B61DBA' },
  { color: '#329262', lighter: '#40BD7E' },
  { color: '#5574A6', lighter: '#6AA7C4' },
  { color: '#3B3EAC', lighter: '#6D70CD' },
  { color: '#B77322', lighter: '#DA9136' },
  { color: '#16D620', lighter: '#2DEA36' },
  { color: '#B91383', lighter: '#E81EA6' },
  { color: '#F4359E', lighter: '#F558AE' },
  { color: '#9C5935', lighter: '#C07145' },
  { color: '#A9C413', lighter: '#D7EE53' },
  { color: '#2A778D', lighter: '#3EA7C6' },
  { color: '#668D1C', lighter: '#97D129' },
  { color: '#BEA413', lighter: '#E9CA1D' },
  { color: '#0C5922', lighter: '#149638' },
  { color: '#743411', lighter: '#C5571D' }
]

// Define trace templates as functions returning Highcharts series options
const traceTemplates: Record<string, () => Partial<HighchartsSeriesOptions>> = {
  highStockLine: () => ({
    type: 'line',
    name: '',
    description: '',
    data: [],
    dataGrouping: { enabled: false },
    showInNavigator: true,
    connectNulls: false,
    turboThreshold: 0,
    gapSize: 10,
    zIndex: 1,
    tooltip: { valueSuffix: 'undefined' }
  }),
  highStockLineRange: () => ({
    type: 'arearange',
    name: '',
    description: '',
    data: [],
    dataGrouping: { enabled: false },
    // includeInCSVExport: false, // Property might be deprecated, check Highcharts docs
    showInNavigator: false,
    connectNulls: false,
    turboThreshold: 0,
    gapSize: 10,
    marker: { enabled: false },
    zIndex: 0,
    fillOpacity: 0.2,
    linkedTo: ':previous',
    lineWidth: 0,
    tooltip: { valueSuffix: 'undefined' }
  })
}

const figTemplates: Record<string, () => HighchartsOptions> = {
  highStockChart: () => ({
    chart: {
      zoomType: 'x',
      height: 600,
      zooming: {
        mouseWheel: {
          enabled: false
        }
      }
    },
    colors: _.map(chartColors, 'color'),
    navigator: {
      adaptToUpdatedData: false,
      series: {
        // includeInCSVExport: false // Property might be deprecated
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
      sourceWidth: 1400,
      chartOptions: {
        navigator: { enabled: false },
        scrollbar: { enabled: false },
        rangeSelector: { enabled: false }
      }
    },
    scrollbar: {
      liveRedraw: false
    },
    title: {
      text: '',
      style: { fontSize: '18px' }
    },
    subtitle: { text: '' },
    rangeSelector: {
      floating: true,
      y: -35,
      buttons: [
        { count: 15, type: 'minute', text: '15m' },
        { count: 1, type: 'hour', text: '1h' },
        { count: 3, type: 'hour', text: '3h' },
        { count: 6, type: 'hour', text: '6h' },
        { count: 12, type: 'hour', text: '12h' },
        { count: 1, type: 'day', text: '1d' },
        { count: 1, type: 'week', text: '1w' },
        { count: 1, type: 'month', text: '1m' },
        { count: 1, type: 'year', text: '1y' },
        { type: 'all', text: 'All' }
      ],
      inputEnabled: false,
      selected: -1
    },
    xAxis: {
      events: {},
      minRange: 60 * 1000, // one minute
      ordinal: false,
      title: { text: '時間' },
      type: 'datetime', // Ensure xAxis type is datetime for stockChart
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
      title: { text: '', style: { fontSize: '14px' } },
      opposite: false
    },
    series: [],
    credits: { text: `© ${new Date().getFullYear()} Han Lin` },
    legend: { enabled: true },
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
  })
}

const figs: FigConfig[] = [
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
]

// --- Methods / Functions ---

// Regex to parse header strings like M1-RTUName-RegName(Unit)
const headerRe = /^M(\d+)-([^-]+)-([^-]+)\(([^()]+)\)$/

const initCharts = (chartLogs: ChartLogs) => {
  showChart.value = true
  // set chartRange based on loaded data
  chartRange.from = new Date(chartLogs.start)
  chartRange.to = new Date(chartLogs.end)

  void nextTick(() => {
    const traceToColorId: Record<string, number> = {}
    let colorId = 0
    let chartIndex = 0

    const initFig = () => {
      if (chartIndex >= figs.length) {
        chartsLoaded.value = true
        console.debug('chartsLoaded')
        if (delayedChartUpdate.value) {
          console.debug('Applying delayed chartRange update', delayedChartUpdate.value)
          // Ensure the update happens after charts are fully loaded and rendered
          void nextTick(() => {
            if (delayedChartUpdate.value) {
              chartRange.from = delayedChartUpdate.value.from
              chartRange.to = delayedChartUpdate.value.to
              delayedChartUpdate.value = null // Clear after applying
            }
          })
        }
        return // Exit recursion
      }

      const figConfig = figs[chartIndex]
      // Add check for figConfig
      if (!figConfig) {
        console.error(`Figure configuration not found for index ${chartIndex}`)
        chartIndex++
        initFig() // Continue with the next chart
        return
      }
      const chartDiv = chartDivRefs.value[chartIndex]
      if (!chartDiv) {
        console.error(`Chart container element not found for index ${chartIndex}`)
        chartIndex++
        initFig() // Continue with the next chart
        return
      }

      // Build series
      const series: HighchartsSeriesOptions[] = []
      _.forEach(chartLogs.data, (data, header) => {
        const parsed = headerRe.exec(header)
        if (parsed) {
          const [, rtuAddr, rtuName, regName, unit] = parsed
          const yaxisTitle = figConfig?.yaxisTitle || ''
          let regNameRest = `${regName}(${unit})`.replace(yaxisTitle, '')
          if (regNameRest.length > 0) {
            regNameRest = '-' + regNameRest
          }

          if (_.some(figConfig?.regs, (reg) => reg === regName)) {
            _.forEach(figConfig?.traceTemplates, (templateName, traceIndex) => {
              const traceGenerator = traceTemplates[templateName]
              if (traceGenerator) {
                const trace = traceGenerator() as
                  | Highcharts.SeriesLineOptions
                  | Highcharts.SeriesArearangeOptions // Type assertion
                trace.id = `chart-${chartIndex}-series-${header}-${templateName}`
                trace.description = header
                const seriesName = `M${rtuAddr}-${rtuName}${regNameRest}`
                trace.name = seriesName

                if (!Object.prototype.hasOwnProperty.call(traceToColorId, seriesName)) {
                  traceToColorId[seriesName] = colorId++
                }
                const currentTraceColorId = (traceToColorId[seriesName] ?? 0) % chartColors.length // Cycle through colors

                trace.data = data
                if (trace.tooltip) trace.tooltip.valueSuffix = ` ${unit}`

                if (traceIndex === 0) {
                  // First trace is line
                  trace.tooltip = {
                    ...(trace.tooltip ?? {}),
                    pointFormat:
                      '<span style="color:{series.color}">●</span> {series.name}: <b>{point.y}</b> '
                  }
                  trace.color = chartColors[currentTraceColorId]?.color ?? '#000000' // Default to black if undefined
                } else {
                  // Subsequent traces (like range)
                  trace.tooltip = {
                    ...(trace.tooltip ?? {}),
                    pointFormat: '(<b>{point.low}</b> - <b>{point.high}</b>)<br/>'
                  }
                  trace.color = chartColors[currentTraceColorId]?.lighter ?? '#CCCCCC' // Default to light gray if undefined
                }
                series.push(trace as HighchartsSeriesOptions) // Add to series array
              }
            })
          }
        }
      })

      // Build figure options
      const optionsGenerator = figTemplates[figConfig.figTemplate]
      if (!optionsGenerator) {
        console.error(`Figure template ${figConfig?.figTemplate} not found.`)
        chartIndex++
        initFig()
        return
      }
      const options = optionsGenerator()
      if (options.title) options.title.text = figConfig?.plotTitle
      if (options.yAxis && !Array.isArray(options.yAxis))
        options.yAxis.title = { text: figConfig?.yaxisTitle } // Ensure yAxis is object
      const startTime = new Date(chartLogs.start).getTime()
      const endTime = new Date(chartLogs.end).getTime()
      if (options.xAxis && !Array.isArray(options.xAxis)) {
        // Ensure xAxis is object
        options.xAxis.min = startTime
        options.xAxis.max = endTime
        // Attach event listener
        options.xAxis.events = { ...options.xAxis.events, afterSetExtremes: afterSetExtremes }
      }
      // Ensure navigator.xAxis is a single object before setting min/max
      if (options.navigator?.xAxis && !Array.isArray(options.navigator.xAxis)) {
        options.navigator.xAxis.min = startTime
        options.navigator.xAxis.max = endTime
      }

      options.series = series

      // Create chart instance
      try {
        Highcharts.stockChart(chartDiv, options, (_chart) => {
          // Chart callback - might be useful for post-render actions
          // Ensure xAxis exists and has at least one axis
          if (_chart.xAxis && _chart.xAxis.length > 0 && _chart.xAxis[0]) {
            const axis = _chart.xAxis[0]
            // Bind the original function to the axis instance
            const originalSetExtremes = axis.setExtremes.bind(axis)
            // Override setExtremes on the specific axis instance
            axis.setExtremes = function (
              newMin?: number,
              newMax?: number,
              redraw: boolean = true,
              animation: boolean | Highcharts.AnimationOptionsObject = true,
              eventArguments?
            ) {
              // Custom setExtremes logic
              if (isUpdating.value && redraw && animation) {
                console.debug('Ignoring setExtremes during update')
                return // <-- Exit if charts are updating
              }
              // Call the bound original method directly
              originalSetExtremes(newMin, newMax, redraw, animation, eventArguments)
            }
          }
          // console.log(`Chart ${chartIndex} rendered`);
          highchartsInstances.value[chartIndex] = _chart // Store instance

          // Proceed to the next chart initialization after a short delay
          chartIndex++
          setTimeout(() => {
            // Reflow to fix right side of chart being cut off
            const prevChartInstance = highchartsInstances.value[chartIndex - 1]
            if (chartIndex > 0 && prevChartInstance) {
              prevChartInstance.reflow()
            }
            initFig()
          }, 10) // Small delay to allow UI updates
        })
      } catch (error) {
        console.error(`Error creating chart ${chartIndex}:`, error)
        // Optionally try to continue with the next chart
        chartIndex++
        initFig()
      }
    }

    // Start the recursive initialization
    initFig()
  })
}

const afterSetExtremes = (event: Highcharts.AxisSetExtremesEventObject) => {
  if (isUpdating.value) {
    console.debug('Ignoring afterSetExtremes during update')
    return // <-- Exit if charts are updating
  }
  const newFromTime = event.min
  const newToTime = event.max

  // Check if the range actually changed to avoid unnecessary updates
  const fromChanged = Math.abs(newFromTime - chartRange.from.getTime()) > 1000 // Tolerance for minor differences
  const toChanged = Math.abs(newToTime - chartRange.to.getTime()) > 1000

  if (fromChanged || toChanged) {
    const newRange: ChartRange = {
      from: new Date(newFromTime),
      to: new Date(newToTime)
    }

    if (!chartsLoaded.value) {
      console.debug('Delaying chart update until charts are loaded', newRange)
      delayedChartUpdate.value = newRange
      return
    }

    console.debug('Chart range changed by navigator/zoom:', newRange)
    // Update reactive chartRange - this will trigger the watcher
    chartRange.from = newRange.from
    chartRange.to = newRange.to
  }
}
// Helper function for delay
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const updateCharts = async (chartLogs: ChartLogs) => {
  isUpdating.value = true
  const newFromTime = new Date(chartLogs.start).getTime()
  const newToTime = new Date(chartLogs.end).getTime()
  const STAGGER_DELAY_MS = 100 // Delay in milliseconds between starting each chart update
  // Disable range selector buttons visually
  highchartsInstances.value.forEach((chartInstance) => {
    if (chartInstance?.options?.rangeSelector) {
      chartInstance.options.rangeSelector.enabled = false
    }
    // Optionally disable navigator handles visually if needed (more complex)
  })

  const jobs = highchartsInstances.value.map(async (chartInstance, index) => {
    // stagger the updatess to avoid overwhelming the browser
    await sleep(STAGGER_DELAY_MS * index)
    // console.debug(`Updating chart ${index} with new data`)
    if (chartInstance) {
      // Update series data
      // // This takes 25 secs
      // const seriesUpdates: Highcharts.SeriesOptionsType[] = []
      // // Define types locally for clarity
      // type SeriesWithOptions = Highcharts.Series & { userOptions?: Highcharts.SeriesOptionsType }
      // type SeriesOptionsTypeWithDescription = Highcharts.SeriesOptionsType & {
      //   description?: string
      // }

      // chartInstance.series.forEach((series: SeriesWithOptions) => {
      //   const description = (series.userOptions as SeriesOptionsTypeWithDescription)?.description
      //   // Check if it's a data series (not navigator base series) and if new data exists for it
      //   // eslint-disable-next-line no-prototype-builtins
      //   if (!series.hasOwnProperty('baseSeries') && description && chartLogs.data[description]) {
      //     // Ensure series has an ID (should have been set in initCharts)
      //     if (series.options.id) {
      //       seriesUpdates.push({
      //         id: series.options.id, // Target series by ID
      //         // Provide data in the expected format
      //         data: chartLogs.data[description] as Highcharts.PointOptionsType[]
      //         // Ensure boost is active for updated series if necessary
      //         // boostThreshold: 1, // Uncomment if boost needs explicit enabling on update
      //       } as Highcharts.SeriesOptionsType)
      //     } else {
      //       // This case should ideally not happen if initCharts assigns IDs correctly
      //       console.warn(
      //         `Series with description "${description}" in chart ${index} is missing an ID. Cannot update via chart.update.`
      //       )
      //     }
      //   }
      // })

      // // Prepare axis update options
      // const xAxisUpdate: Highcharts.XAxisOptions = {
      //   min: newFromTime,
      //   max: newToTime
      // }

      // // Perform the single batch update call per chart
      // try {
      //   chartInstance.update(
      //     {
      //       xAxis: [xAxisUpdate], // Update the first X axis extremes
      //       series: seriesUpdates // Update only the series that have new data
      //     },
      //     false, // redraw = false (we'll redraw manually after)
      //     false, // oneToOne = false (match series by ID, not index)
      //     false // animation = false
      //   )
      // } catch (error) {
      //   console.error(`Error updating chart ${index}:`, error)
      // } finally {
      //   // Redraw the chart once after all updates are processed by Highcharts
      //   chartInstance.redraw(false) // animation = false
      //   chartInstance.hideLoading()
      // }
      // Update series data
      // // This takes 15 secs
      // type SeriesWithOptions = Highcharts.Series & { userOptions?: SeriesWithOptions }
      // type SeriesOptionsTypeWithDescription = Highcharts.SeriesOptionsType & {
      //   description?: string
      // }
      // // Batch update all series data
      // chartInstance.update(
      //   {
      //     series: chartInstance.series.map((series: SeriesWithOptions) => {
      //       const desc = (series.userOptions as unknown as SeriesOptionsTypeWithDescription)
      //         ?.description
      //       if (
      //         // eslint-disable-next-line no-prototype-builtins
      //         !series.hasOwnProperty('baseSeries') &&
      //         desc &&
      //         chartLogs.data[desc]
      //       ) {
      //         return {
      //           data: chartLogs.data[desc],
      //           boostThreshold: 1, // Always enable boost
      //           animation: false
      //         }
      //       }
      //       return {}
      //     }) as Highcharts.SeriesOptionsType[],
      //     xAxis: [{ min: newFromTime, max: newToTime }]
      //   },
      //   false // Do not redraw yet
      // )
      // Update series data
      // This takes 5 secs
      // type SeriesWithOptions = Highcharts.Series & { userOptions?: SeriesWithOptions }
      type SeriesOptionsTypeWithDescription = Highcharts.SeriesOptionsType & {
        description?: string
      }
      // _.forEach(chartInstance.series, (series: SeriesWithOptions) => {
      //   const description = (series.userOptions as unknown as SeriesOptionsTypeWithDescription)
      //     ?.description
      //   // don't set data on 'baseSeries' so we don't clear the navigator
      //   // eslint-disable-next-line no-prototype-builtins
      //   if (!series.hasOwnProperty('baseSeries') && description && chartLogs.data[description]) {
      //     // Only update series linked to the incoming data
      //     // Provide type hint for setData
      //     series.setData(
      //       chartLogs.data[description] as Highcharts.PointOptionsType[],
      //       false,
      //       false,
      //       false
      //     ) // Use SeriesDataOptions[]
      //   }
      // })
      // Update series data, parallelized updates
      // This takes 3 secs
      const BATCH_SIZE = 50
      // eslint-disable-next-line no-prototype-builtins
      const series = chartInstance.series.filter((s) => !s.hasOwnProperty('baseSeries'))

      for (let i = 0; i < series.length; i += BATCH_SIZE) {
        const batch = series.slice(i, i + BATCH_SIZE)

        await Promise.all(
          batch.map(async (series: Highcharts.Series) => {
            const description = (series.userOptions as unknown as SeriesOptionsTypeWithDescription)
              ?.description
            if (description && chartLogs.data[description]) {
              return new Promise<void>((resolve) => {
                requestAnimationFrame(() => {
                  series.setData(
                    chartLogs.data[description] as Highcharts.PointOptionsType[],
                    false, // redraw
                    false, // animation
                    false // updatePoints
                  )
                  resolve()
                })
              })
            }
          })
        )
      }
      // Update axis extremes without triggering afterSetExtremes again
      if (chartInstance.xAxis && chartInstance.xAxis[0]) {
        chartInstance.xAxis[0].setExtremes(newFromTime, newToTime, false, false)
      }
      // await new Promise<void>((resolve) => {
      //   requestAnimationFrame(() => {
      //     chartInstance.redraw(false)
      //     resolve()
      //   })
      // })
      chartInstance.redraw(true)
      chartInstance.hideLoading()
      console.debug(`Chart ${index} ${chartInstance.options.title?.text} updated`)
    }
  })
  // // jobs one by one
  // for (const job of jobs) {
  //   // await nextTick(async () => {
  //   await job
  //   // })
  // }
  await Promise.all(jobs)
  try {
    await Promise.all(jobs)
    console.debug('All charts updated')
  } finally {
    // Re-enable range selector buttons
    highchartsInstances.value.forEach((chartInstance) => {
      if (chartInstance?.options?.rangeSelector) {
        chartInstance.options.rangeSelector.enabled = true
      }
      // Re-enable navigator handles if they were disabled
      // chartInstance.reflow()
    })
    isUpdating.value = false // <-- Set flag back to false
  }
}

const fetchAndLoadChartData = async (from: Date | null = null, to: Date | null = null) => {
  // Show loading indicators on charts
  highchartsInstances.value.forEach((chart) => chart?.showLoading('讀取資料中...'))

  try {
    await chartStore.findLogsInRange(from, to)
  } catch (error) {
    console.error('Error fetching chart data:', error)
    chartRangeHasError.value = true
    highchartsInstances.value.forEach((chart) => chart?.hideLoading())
  }
}

// --- Watchers ---
chartStore.$subscribe((mutation, state) => {
  if (chartsLoaded.value) {
    console.log('Chart data updated, reloading charts')
    void updateCharts(state)
  } else {
    initCharts(state)
  }
  // chartStore.setBucket(...); // Set bucket if applicable
  chartRangeHasError.value = Object.keys(state.data).length === 0
})

watch(chartTotal, (newTotal, oldTotal) => {
  console.log('chartTotal watcher triggered', newTotal, oldTotal)
  const currentVal = oldTotal ?? 0
  const targetVal = newTotal ?? 0
  if (targetVal === currentVal) return
  chartRangeHasError.value = !newTotal || newTotal <= 0
  const tweenData = { val: currentVal }
  const tween = new Tween(tweenData)
    .to({ val: targetVal }, 1000)
    .easing(Easing.Quadratic.Out)
    .onUpdate((obj) => {
      animatedTotal.value = parseInt(obj.val.toFixed(0))
    })
    .start()
  // Setup the animation loop
  const animate = (time?: number) => {
    if (tween.update(time)) {
      requestAnimationFrame(animate)
    }
  }
  requestAnimationFrame(animate)
})

// Watch for changes in the date range picker
watch(
  chartRange,
  (newRange) => {
    console.debug('chartRange watcher triggered', newRange)
    if (!chartsLoaded.value) {
      console.debug('Charts not loaded, delaying fetch')
      // Store the desired range to fetch once charts are ready
      // This might be redundant if afterSetExtremes handles it, but safer.
      delayedChartUpdate.value = { from: newRange.from, to: newRange.to }
      return
    }
    void fetchAndLoadChartData(newRange.from, newRange.to)
  },
  { deep: true }
)

// --- Lifecycle Hooks ---
onMounted(() => {
  // Initial data fetch
  void fetchAndLoadChartData()
})

onBeforeUnmount(() => {
  // Destroy Highcharts instances
  // highchartsInstances.value.forEach((chart) => {
  //   if (chart) {
  //     chart.destroy()
  //   }
  // })
  highchartsInstances.value = []
  // Cancel TWEEN animations if any are running
  // TWEEN.removeAll()
})
</script>

<style scoped>
/* Scoped styles remain largely the same */
.charts {
  width: 100%;
  height: 700px; /* Consider using responsive units or CSS variables */
}
.pad-8 {
  padding: 8px;
} /* q-pa-sm */
.pad-v-8 {
  padding-top: 8px;
  padding-bottom: 8px;
} /* q-py-sm */
.pad-b-8 {
  padding-bottom: 8px;
} /* q-pb-sm */
.pad-b-0 {
  padding-bottom: 0px;
}
.margin-0 {
  margin: 0px;
}
.margin-8 {
  margin: 8px;
} /* q-ma-sm */
.lh-normal {
  line-height: normal;
}
.pad-t-8 {
  padding-top: 8px;
} /* q-pt-sm */
.pad-t-16 {
  padding-top: 16px;
} /* q-pt-md */
</style>

<style>
/* Global styles for Highcharts data table remain the same */
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
  width: 140px; /* Consider relative units */
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
.highcharts-credits {
  padding: none; /* Hide credits if not needed */
}
</style>

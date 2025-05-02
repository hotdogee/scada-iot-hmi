<template>
  <q-page class="row wrap q-pa-xs content-start">
    <div class="col-12">
      <q-card class="q-ma-xs bg-white">
        <q-card-section class="q-py-md">
          <i18n-t keypath="statsHeader" tag="div" class="text-xl">
            <template v-slot:total>
              {{ totalFormat(animatedTotal) }}
            </template>
            <template v-slot:bucket>
              <span v-show="chartStore.bucket">
                {{ t('bucketHeader', { bucket: bucketFormat(chartStore.bucket) }) }}
              </span>
            </template>
          </i18n-t>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-list bordered separator>
            <q-item-label header class="q-pb-none"> {{ t('databaseHeader') }} </q-item-label>
            <q-item class="full-width row">
              <q-item-section class="top q-gutter-sm">
                <div class="row">
                  <q-item class="col-xs-12 col-sm-6 col-md-3">
                    <q-item-section avatar>
                      <q-icon name="timeline" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label> {{ t('numberTimestamps') }} </q-item-label>
                      <q-item-label caption>
                        {{ totalFormat(chartStore.navigatorData.total) }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item class="col-xs-12 col-sm-6 col-md-3">
                    <q-item-section avatar>
                      <q-icon name="bubble_chart" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label> {{ t('numberReadings') }} </q-item-label>
                      <q-item-label caption>
                        {{ totalFormat((chartStore.navigatorData.total ?? 0) * 26) }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item class="col-xs-12 col-sm-6 col-md-3">
                    <q-item-section avatar>
                      <q-icon name="skip_previous" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label> {{ t('databaseStartTime') }} </q-item-label>
                      <q-item-label caption>
                        {{ dateFormat(chartStore.navigatorData.start) }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item class="col-xs-12 col-sm-6 col-md-3">
                    <q-item-section avatar>
                      <q-icon name="skip_next" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label> {{ t('databaseEndTime') }} </q-item-label>
                      <q-item-label caption>
                        {{ dateFormat(chartStore.navigatorData.end) }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </div>
              </q-item-section>
            </q-item>
            <q-separator />
            <q-item-label header class="q-pb-none"> {{ t('chartSettings') }} </q-item-label>
            <q-item class="full-width row">
              <q-item-section class="top">
                <div class="row">
                  <q-item class="col-xs-12 col-sm-6 col-md-3">
                    <q-input
                      v-model="fromModel"
                      class="full-width"
                      :label="t('startTime')"
                      :error-message="t('noDataInRange')"
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
                      :label="t('endTime')"
                      :error-message="t('noDataInRange')"
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
// import { useLogsStore } from 'stores/logs'
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()

// Define component options if necessary (e.g., name)
// defineOptions({ name: 'ChartPage' });

// --- Pinia Stores ---
const chartStore = useChartStore()
// const logsStore = useLogsStore()
// Use storeToRefs for reactive access to state properties in the template
const { total: chartTotal } = storeToRefs(chartStore)

// --- Highcharts Setup ---
globalThis.Highcharts = Highcharts

function getHighchartOptions() {
  return {
    // boost: {
    //   enabled: true,
    //   seriesThreshold: 1
    // },
    time: {
      timezone: 'undefined' // Set timezone to undefined to use local time
    },
    lang: {
      contextButtonTitle: t('contextButtonTitle'),
      downloadCSV: t('downloadCSV'),
      downloadJPEG: t('downloadJPEG'),
      downloadPDF: t('downloadPDF'),
      downloadPNG: t('downloadPNG'),
      downloadSVG: t('downloadSVG'),
      downloadXLS: t('downloadXLS'),
      loading: t('loading'),
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
      printChart: t('printChart'),
      resetZoom: t('resetZoom'),
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
      viewData: t('viewData'),
      weekdays: [t('Sun'), t('Mon'), t('Tue'), t('Wed'), t('Thu'), t('Fri'), t('Sat')],
      rangeSelectorZoom: t('rangeSelectorZoom'),
      viewFullscreen: t('viewFullscreen')
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
  }
}

Highcharts.setOptions(getHighchartOptions())

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

// --- Types ---
interface ChartRange {
  from: Date
  to: Date
}

// Define a type for series user options that might include 'group' or 'description'
type SeriesUserOptionsWithExtras = Highcharts.SeriesOptionsType & {
  group?: string
  description?: string
}

// interface FigConfig {
//   figTemplate: string
//   traceTemplates: string[]
//   regs: string[]
//   plotTitle: string
//   yaxisTitle: string
// }

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
  return `${num.toLocaleString()}`
}

const dateFormat = (value: string | null | undefined): string => {
  if (!value) return ''
  return new Date(value).toLocaleString()
}

const bucketFormat = (value: string | null): string => {
  if (!value) return ''
  if (value === '1ms') return t('none')
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
      y: -15,
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
      title: { text: t('Time') },
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

const getFigs = () => {
  return [
    {
      figTemplate: 'highStockChart',
      traceTemplates: ['highStockLine', 'highStockLineRange'],
      regs: ['A相電流', 'B相電流', 'C相電流'],
      plotTitle: t('plotTitleCurrent'),
      yaxisTitle: t('yaxisTitleCurrentA')
    },
    // {
    //   figTemplate: 'highStockChart',
    //   traceTemplates: ['highStockLine', 'highStockLineRange'],
    //   regs: ['有功電量', '無功電量', '視在電量'],
    //   plotTitle: t('plotTitleEnergy'),
    //   yaxisTitle: t('yaxisTitleEnergyUnits')
    // },
    {
      figTemplate: 'highStockChart',
      traceTemplates: ['highStockLine', 'highStockLineRange'],
      regs: ['溫度'],
      plotTitle: t('plotTitlePipeTemp'),
      yaxisTitle: t('yaxisTitleTempC')
    },
    {
      figTemplate: 'highStockChart',
      traceTemplates: ['highStockLine', 'highStockLineRange'],
      regs: ['壓力'],
      plotTitle: t('plotTitlePipePressure'),
      yaxisTitle: t('yaxisTitlePressureBar')
    },
    {
      figTemplate: 'highStockChart',
      traceTemplates: ['highStockLine', 'highStockLineRange'],
      regs: ['質量流率'],
      plotTitle: t('plotTitleMassFlow'),
      yaxisTitle: t('yaxisTitleMassFlowRate')
    },
    {
      figTemplate: 'highStockChart',
      traceTemplates: ['highStockLine', 'highStockLineRange'],
      regs: ['三相功率', '有功功率'],
      plotTitle: t('plotTitleActivePower'),
      yaxisTitle: t('yaxisTitleActivePowerKW')
    },
    {
      figTemplate: 'highStockChart',
      traceTemplates: ['highStockLine', 'highStockLineRange'],
      regs: ['無功功率'],
      plotTitle: t('plotTitleReactivePower'),
      yaxisTitle: t('yaxisTitleReactivePowerKvar')
    },
    {
      figTemplate: 'highStockChart',
      traceTemplates: ['highStockLine', 'highStockLineRange'],
      regs: ['視在功率'],
      plotTitle: t('plotTitleApparentPower'),
      yaxisTitle: t('yaxisTitleApparentPowerKVA')
    },
    {
      figTemplate: 'highStockChart',
      traceTemplates: ['highStockLine', 'highStockLineRange'],
      regs: ['頻率'],
      plotTitle: t('plotTitleFrequency'),
      yaxisTitle: t('yaxisTitleFrequencyHz')
    },
    {
      figTemplate: 'highStockChart',
      traceTemplates: ['highStockLine', 'highStockLineRange'],
      regs: ['A相電壓', 'B相電壓', 'C相電壓', 'AB線電壓', 'BC線電壓', 'CA線電壓'],
      plotTitle: t('plotTitleVoltage'),
      yaxisTitle: t('yaxisTitleVoltageV')
    },
    {
      figTemplate: 'highStockChart',
      traceTemplates: ['highStockLine', 'highStockLineRange'],
      regs: ['流量'],
      plotTitle: t('plotTitleVolumeFlow'),
      yaxisTitle: t('yaxisTitleVolumeFlowRate')
    },
    // {
    //   figTemplate: 'highStockChart',
    //   traceTemplates: ['highStockLine', 'highStockLineRange'],
    //   regs: ['計算'],
    //   plotTitle: t('plotTitleCalculation'),
    //   yaxisTitle: t('yaxisTitleCalculation')
    // },
    {
      figTemplate: 'highStockChart',
      traceTemplates: ['highStockLine', 'highStockLineRange'],
      regs: ['入水測溫度', '發電機測溫度'],
      plotTitle: t('plotTitleBearingTemp'),
      yaxisTitle: t('yaxisTitleTempC') // Re-use existing key
    }
  ]
}
let figs = getFigs()

const addrToHide = new Set([10, 11, 13, 14, 21, 60, 63, 64])
// _.forEach(chartStore.data, (data, header) => {
//   console.log(`'${header}': '${header}',`)
// })
// const oldSet = new Set(
//   Object.entries(chartStore.data).map(([header]) => {
//     return header
//   })
// )
// console.log('oldSet', oldSet)
// _.forEach(chartStore.navigatorData.data, (data, header) => {
//   if (oldSet.has(header)) {
//     return
//   }
//   console.log(`'${header}': '${header}',`)
// })
// console.log(chartStore.data)
// --- Methods / Functions ---

// Regex to parse header strings like M1-RTUName-RegName(Unit)
const headerRe = /^M(\d+)-([^-]+)-([^-]+)\(([^()]+)\)$/

const initCharts = (chartLogs: ChartLogs) => {
  if (!showChart.value) {
    showChart.value = true
    // set chartRange based on loaded data
    chartRange.from = new Date(chartLogs.start)
    chartRange.to = new Date(chartLogs.end)
  }
  figs = getFigs()

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
      _.forEach(chartLogs.navigatorData.data, (_, header) => {
        const data = chartLogs.data[header] || []
        const parsed = headerRe.exec(header)
        if (parsed) {
          const [, rtuAddr, , regName, unit] = parsed
          const yaxisTitle = figConfig?.yaxisTitle || ''
          let regNameRest = `${regName}(${unit})`.replace(yaxisTitle, '')
          if (regNameRest.length > 0) {
            regNameRest = '-' + regNameRest
          }

          if (figConfig?.regs.some((reg) => reg === regName)) {
            figConfig?.traceTemplates.forEach((templateName, traceIndex) => {
              const traceGenerator = traceTemplates[templateName]
              if (traceGenerator) {
                const trace = traceGenerator() as
                  | Highcharts.SeriesLineOptions
                  | Highcharts.SeriesArearangeOptions // Type assertion
                trace.id = `chart-${chartIndex}-series-${header}-${templateName}`
                trace.description = header
                const seriesName = t(header)
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
                if (addrToHide.has(Number(rtuAddr))) {
                  trace.visible = false // Hide series for specific addresses
                }
                series.push(trace as HighchartsSeriesOptions) // Add to series array
              }
            })
          }
        }
      })

      // Build navigator series
      const navSeries: HighchartsSeriesOptions[] = []
      _.forEach(chartLogs.navigatorData.data, (data, header) => {
        const parsed = headerRe.exec(header)
        if (parsed) {
          const [, , , regName, unit] = parsed
          const yaxisTitle = figConfig?.yaxisTitle || ''
          let regNameRest = `${regName}(${unit})`.replace(yaxisTitle, '')
          if (regNameRest.length > 0) {
            regNameRest = '-' + regNameRest
          }

          if (figConfig?.regs.some((reg) => reg === regName)) {
            const templateName = figConfig?.traceTemplates[0]
            // Ensure templateName is a valid string before using it as an index
            if (templateName) {
              const traceGenerator = traceTemplates[templateName]
              if (traceGenerator) {
                const trace = traceGenerator() as Highcharts.SeriesLineOptions // Cast to specific type with data
                trace.id = `chart-${chartIndex}-series-${header}-${templateName}-nav`
                trace.description = header
                const seriesName = t(header)
                trace.name = seriesName
                if (!Object.prototype.hasOwnProperty.call(traceToColorId, seriesName)) {
                  traceToColorId[seriesName] = colorId++
                }
                // Ensure data format matches line series expectations ([x, y] or {x, y})
                // ignore typescript error
                // @ts-expect-error test
                trace.data = data
                navSeries.push(trace as HighchartsSeriesOptions) // Push with the broader type if needed
              }
            }
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
        options.navigator.xAxis.min = new Date(chartLogs.navigatorData.start).getTime()
        options.navigator.xAxis.max = new Date(chartLogs.navigatorData.end).getTime()
      }
      // @ts-expect-error test
      options.navigator.series = navSeries
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
    // stagger the updates to avoid overwhelming the browser
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
      // type SeriesOptionsTypeWithDescription = Highcharts.SeriesOptionsType & {
      //   description?: string
      // }
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
      // This takes 3 secs
      const BATCH_SIZE = 50
      // don't clear the navigator
      const series = chartInstance.series.filter(
        (s) => !((s.userOptions as SeriesUserOptionsWithExtras)?.group === 'nav')
      )
      // console.log(
      //   `chart ${index}`,
      //   chartInstance.series.map((s) => s.userOptions)
      // )
      for (let i = 0; i < series.length; i += BATCH_SIZE) {
        const batch = series.slice(i, i + BATCH_SIZE)
        await Promise.all(
          batch.map(async (series: Highcharts.Series) => {
            const description = (series.userOptions as SeriesUserOptionsWithExtras)?.description
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
onMounted(async () => {
  // Initial data fetch
  // await fetchAndLoadChartData()
  await fetchAndLoadChartData(new Date('2025-01-16T14:10:00Z'), new Date('2025-02-03T07:35:00Z'))
})

watch(locale, (newLocale) => {
  if (newLocale) {
    Highcharts.setOptions(getHighchartOptions())
    initCharts(chartStore)
  }
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

<i18n>
{
  "en": {
    'statsHeader': 'Visualizing {total} time points {bucket}',
    'bucketHeader': '({bucket} Buckets)',
    'none': 'No',
    'databaseHeader': 'Database Stats',
    'numberTimestamps': 'Number of Timestamps',
    'numberReadings': 'Number of Sensor Readings',
    'databaseStartTime': 'Database Start Time',
    'databaseEndTime': 'Database End Time',
    'chartSettings': 'Chart Settings',
    'startTime': 'Start Time',
    'endTime': 'End Time',
    'noDataInRange': 'No data in selected range',
    'loadingChartData': 'Loading data...',
    'contextButtonTitle': 'Export Options',
    'downloadCSV': 'Download CSV',
    'downloadJPEG': 'Download JPG',
    'downloadPDF': 'Download PDF',
    'downloadPNG': 'Download PNG',
    'downloadSVG': 'Download SVG',
    'downloadXLS': 'Download XLS',
    'loading': 'Loading',
    'printChart': 'Print',
    'resetZoom': 'Reset Zoom',
    'viewData': 'Show Data Table',
    'rangeSelectorZoom': 'Zoom',
    'viewFullscreen': 'Fullscreen',
    'Sun': 'Sun',
    'Mon': 'Mon',
    'Tue': 'Tue',
    'Wed': 'Wed',
    'Thu': 'Thu',
    'Fri': 'Fri',
    'Sat': 'Sat',
    'Time': 'Time',
    'plotTitleCurrent': 'Phase Current',
    'yaxisTitleCurrentA': 'Current (A)',
    'plotTitleEnergy': 'Energy Generation',
    'yaxisTitleEnergyUnits': 'Energy (kWh/kvarh/kVAh)',
    'plotTitlePipeTemp': 'Pipe Temperature',
    'yaxisTitleTempC': 'Temperature (°C)',
    'plotTitlePipePressure': 'Pipe Pressure',
    'yaxisTitlePressureBar': 'Pressure (bar)',
    'plotTitleMassFlow': 'Mass Flow Rate - Coriolis',
    'yaxisTitleMassFlowRate': 'Mass Flow Rate (t/h)',
    'plotTitleActivePower': 'Active Power',
    'yaxisTitleActivePowerKW': 'Active Power (kW)',
    'plotTitleReactivePower': 'Reactive Power',
    'yaxisTitleReactivePowerKvar': 'Reactive Power (kvar)',
    'plotTitleApparentPower': 'Apparent Power',
    'yaxisTitleApparentPowerKVA': 'Apparent Power (kVA)',
    'plotTitleFrequency': 'Generator Frequency',
    'yaxisTitleFrequencyHz': 'Frequency (Hz)',
    'plotTitleVoltage': 'Phase Voltage',
    'yaxisTitleVoltageV': 'Voltage (V)',
    'plotTitleVolumeFlow': 'Volume Flow Rate - Electromagnetic',
    'yaxisTitleVolumeFlowRate': 'Volume Flow Rate (m3/h)',
    'plotTitleCalculation': 'Calculation',
    'yaxisTitleCalculation': 'Calculation',
    'plotTitleBearingTemp': 'Bearing Temperature',
    'M1-九號井口-壓力(bar)': 'M1 - Wellhead',
    'M1-九號井口-溫度(℃)': 'M1 - Wellhead',
    'M2-手動閘閥前-壓力(bar)': 'M2 - Pre Valve',
    'M2-手動閘閥前-溫度(℃)': 'M2 - Pre Valve',
    'M5-渦輪2前-壓力(bar)': 'M5 - Pre Turbine',
    'M5-渦輪2前-溫度(℃)': 'M5 - Pre Turbine',
    'M6-渦輪2後-壓力(bar)': 'M6 - Post Turbine',
    'M6-渦輪2後-溫度(℃)': 'M6 - Post Turbine',
    'M7-大穩壓桶1-壓力(bar)': 'M7 - Surge Tank',
    'M7-大穩壓桶1-溫度(℃)': 'M7 - Surge Tank',
    'M13-渦輪1前-壓力(bar)': 'M13 - Pre Turbine',
    'M13-渦輪1前-溫度(℃)': 'M13 - Pre Turbine',
    'M14-渦輪1後-壓力(bar)': 'M14 - Post Turbine',
    'M14-渦輪1後-溫度(℃)': 'M14 - Post Turbine',
    'M21-尾水箱-壓力(bar)': 'M21 - Drain Tank',
    'M25-主排水管-密度(g/cm3)': 'M25 - Drain',
    'M25-主排水管-溫度(℃)': 'M25 - Drain',
    'M25-主排水管-質量流率(t/h)': 'M25 - Drain',
    'M26-排水管2-流量(m3/h)': 'M26 - Drain Pipe 2',
    'M50-軸心2-入水測溫度(℃)': 'M50 - Shaft - Water Inlet',
    'M51-軸心2-發電機測溫度(℃)': 'M51 - Shaft - Generator',
    'M52-變速齒輪箱2-溫度(℃)': 'M52 - Gearbox',
    'M61-軸心1-發電機測溫度(℃)': 'M61 - Shaft - Generator',
    'M63-發電機1-A相電壓(V)': 'M63 - Generator 1 - Phase A',
    'M63-發電機1-A相電流(A)': 'M63 - Generator 1 - Phase A',
    'M63-發電機1-B相電壓(V)': 'M63 - Generator 1 - Phase B',
    'M63-發電機1-B相電流(A)': 'M63 - Generator 1 - Phase B',
    'M63-發電機1-C相電壓(V)': 'M63 - Generator 1 - Phase C',
    'M63-發電機1-C相電流(A)': 'M63 - Generator 1 - Phase C',
    'M63-發電機1-三相功率(kW)': 'M63 - Generator 1',
    'M63-發電機1-發電量(kWh)': 'M63 - Generator 1',
    'M64-發電機1-頻率(Hz)': 'M64 - Generator 1',
    'M71-發電機300kVA-頻率(Hz)': 'M71 - Generator',
    'M72-併接點-AB線電壓(V)': 'M72 - Grid Connection - AB Line',
    'M72-併接點-A相電流(A)': 'M72 - Grid Connection - Phase A',
    'M72-併接點-BC線電壓(V)': 'M72 - Grid Connection - BC Line',
    'M72-併接點-B相電流(A)': 'M72 - Grid Connection - Phase B',
    'M72-併接點-CA線電壓(V)': 'M72 - Grid Connection - CA Line',
    'M72-併接點-C相電流(A)': 'M72 - Grid Connection - Phase C',
    'M72-併接點-功率因數(%)': 'M72 - Grid Connection',
    'M72-併接點-有功功率(kW)': 'M72 - Grid Connection',
    'M72-併接點-有功電量(kWh)': 'M72 - Grid Connection',
    'M72-併接點-正有功電量(kWh)': 'M72 - Grid Connection',
    'M72-併接點-正無功電量(kvarh)': 'M72 - Grid Connection',
    'M72-併接點-無功功率(kvar)': 'M72 - Grid Connection',
    'M72-併接點-無功電量(kvarh)': 'M72 - Grid Connection',
    'M72-併接點-視在功率(kVA)': 'M72 - Grid Connection',
    'M72-併接點-視在電量(kVAh)': 'M72 - Grid Connection',
    'M72-併接點-負有功電量(kWh)': 'M72 - Grid Connection',
    'M72-併接點-負無功電量(kvarh)': 'M72 - Grid Connection',
    'M72-併接點-頻率(Hz)': 'M72 - Grid Connection',
    'M73-發電機300kVA-AB線電壓(V)': 'M73 - Generator - AB Line',
    'M73-發電機300kVA-A相電流(A)': 'M73 - Generator - Phase A',
    'M73-發電機300kVA-BC線電壓(V)': 'M73 - Generator - BC Line',
    'M73-發電機300kVA-B相電流(A)': 'M73 - Generator - Phase B',
    'M73-發電機300kVA-CA線電壓(V)': 'M73 - Generator - CA Line',
    'M73-發電機300kVA-C相電流(A)': 'M73 - Generator - Phase C',
    'M73-發電機300kVA-功率因數(%)': 'M73 - Generator',
    'M73-發電機300kVA-有功功率(kW)': 'M73 - Generator',
    'M73-發電機300kVA-有功電量(kWh)': 'M73 - Generator',
    'M73-發電機300kVA-正有功電量(kWh)': 'M73 - Generator',
    'M73-發電機300kVA-正無功電量(kvarh)': 'M73 - Generator',
    'M73-發電機300kVA-無功功率(kvar)': 'M73 - Generator',
    'M73-發電機300kVA-無功電量(kvarh)': 'M73 - Generator',
    'M73-發電機300kVA-視在功率(kVA)': 'M73 - Generator',
    'M73-發電機300kVA-視在電量(kVAh)': 'M73 - Generator',
    'M73-發電機300kVA-負有功電量(kWh)': 'M73 - Generator',
    'M73-發電機300kVA-負無功電量(kvarh)': 'M73 - Generator',
    'M101-功率/壓力平方-計算(kW/bar2)': 'M101 - Computed - Power/Pressure^2',
    'M103-流量/壓力根-計算(tph/bar0.5)': 'M103 - Computed - Flow/sqrt(Pressure)',
    'M104-出噴嘴速度-計算(m/s)': 'M104 - Computed - Exit Velocity',
    'M105-速度壓力根-計算(ms/bar0.5)': 'M105 - Computed - Velocity*sqrt(Pressure)',
    'M10-上貨櫃前-壓力(bar)': 'M10 - Pre Container',
    'M10-上貨櫃前-溫度(℃)': 'M10 - Pre Container',
    'M11-三桶前-壓力(bar)': 'M11 - Pre Tank',
    'M11-三桶前-溫度(℃)': 'M11 - Pre Tank',
    'M21-尾水箱-溫度(℃)': 'M21 - Drain Tank',
    'M22-主排水管-流量(m3/h)': 'M22 - Main Drain',
    'M25-大桶後-密度(g/cm3)': 'M25 - Post Tank',
    'M25-大桶後-溫度()': 'M25 - Post Tank',
    'M25-大桶後-累積質量(kg)': 'M25 - Post Tank',
    'M25-大桶後-累積體積(m3)': 'M25 - Post Tank',
    'M60-軸心1-入水測溫度(℃)': 'M60 - Shaft 1 - Inlet',
    'M62-軸心1-轉速(Hz)': 'M62 - Shaft 1',
    'M63-發電機1-三相功因()': 'M63 - Generator 1',
  },
  "tw": {
    'statsHeader': '圖表顯示 {total} 筆時間點資料{bucket}',
    'bucketHeader': '（統計區間：{bucket}）',
    'none': '無',
    'databaseHeader': '資料庫',
    'numberTimestamps': '總資料時間點數',
    'numberReadings': '總資料點數',
    'databaseStartTime': '總資料起始時間',
    'databaseEndTime': '總資料最後時間',
    'chartSettings': '自訂圖表',
    'startTime': '起始時間',
    'endTime': '結束時間',
    'noDataInRange': '所選時間範圍查無資料',
    'loadingChartData': '圖表資料載入中...',
    'contextButtonTitle': '匯出選項',
    'downloadCSV': '下載 CSV 檔',
    'downloadJPEG': '下載 JPG 檔',
    'downloadPDF': '下載 PDF 檔',
    'downloadPNG': '下載 PNG 檔',
    'downloadSVG': '下載 SVG 檔',
    'downloadXLS': '下載 XLS 檔',
    'loading': '載入中',
    'printChart': '列印',
    'resetZoom': '重設縮放',
    'viewData': '顯示資料表格',
    'rangeSelectorZoom': '縮放',
    'viewFullscreen': '全螢幕',
    'Sun': '週日',
    'Mon': '週一',
    'Tue': '週二',
    'Wed': '週三',
    'Thu': '週四',
    'Fri': '週五',
    'Sat': '週六',
    'Time': '時間',
    'plotTitleCurrent': '三相電流',
    'yaxisTitleCurrentA': '電流(A)',
    'plotTitleEnergy': '發電量',
    'yaxisTitleEnergyUnits': '發電量(kWh/kvarh/kVAh)',
    'plotTitlePipeTemp': '管線溫度',
    'yaxisTitleTempC': '溫度(℃)',
    'plotTitlePipePressure': '管線壓力',
    'yaxisTitlePressureBar': '壓力(bar)',
    'plotTitleMassFlow': '質量流率-科氏力流量計',
    'yaxisTitleMassFlowRate': '質量流率(t/h)',
    'plotTitleActivePower': '有功功率',
    'yaxisTitleActivePowerKW': '有功功率(kW)',
    'plotTitleReactivePower': '無功功率',
    'yaxisTitleReactivePowerKvar': '無功功率(kvar)',
    'plotTitleApparentPower': '視在功率',
    'yaxisTitleApparentPowerKVA': '視在功率(kVA)',
    'plotTitleFrequency': '頻率',
    'yaxisTitleFrequencyHz': '頻率(Hz)',
    'plotTitleVoltage': '三相電壓',
    'yaxisTitleVoltageV': '電壓(V)',
    'plotTitleVolumeFlow': '體積流率-電磁流量計',
    'yaxisTitleVolumeFlowRate': '體積流率(m3/h)',
    'plotTitleCalculation': '計算',
    'yaxisTitleCalculation': '計算',
    'plotTitleBearingTemp': '軸心溫度',
    'M1-九號井口-壓力(bar)': 'M1-九號井口',
    'M1-九號井口-溫度(℃)': 'M1-九號井口',
    'M2-手動閘閥前-壓力(bar)': 'M2-手動閘閥前',
    'M2-手動閘閥前-溫度(℃)': 'M2-手動閘閥前',
    'M5-渦輪2前-壓力(bar)': 'M5-渦輪2前',
    'M5-渦輪2前-溫度(℃)': 'M5-渦輪2前',
    'M6-渦輪2後-壓力(bar)': 'M6-渦輪2後',
    'M6-渦輪2後-溫度(℃)': 'M6-渦輪2後',
    'M7-大穩壓桶1-壓力(bar)': 'M7-大穩壓桶1',
    'M7-大穩壓桶1-溫度(℃)': 'M7-大穩壓桶1',
    'M13-渦輪1前-壓力(bar)': 'M13-渦輪1前',
    'M13-渦輪1前-溫度(℃)': 'M13-渦輪1前',
    'M14-渦輪1後-壓力(bar)': 'M14-渦輪1後',
    'M14-渦輪1後-溫度(℃)': 'M14-渦輪1後',
    'M21-尾水箱-壓力(bar)': 'M21-尾水箱',
    'M25-主排水管-密度(g/cm3)': 'M25-主排水管',
    'M25-主排水管-溫度(℃)': 'M25-主排水管',
    'M25-主排水管-質量流率(t/h)': 'M25-主排水管',
    'M26-排水管2-流量(m3/h)': 'M26-排水管2',
    'M50-軸心2-入水測溫度(℃)': 'M50-軸心2-入水測',
    'M51-軸心2-發電機測溫度(℃)': 'M51-軸心2-發電機測',
    'M52-變速齒輪箱2-溫度(℃)': 'M52-變速齒輪箱2',
    'M61-軸心1-發電機測溫度(℃)': 'M61-軸心1-發電機測',
    'M63-發電機1-A相電壓(V)': 'M63-發電機1-A相',
    'M63-發電機1-A相電流(A)': 'M63-發電機1-A相',
    'M63-發電機1-B相電壓(V)': 'M63-發電機1-B相',
    'M63-發電機1-B相電流(A)': 'M63-發電機1-B相',
    'M63-發電機1-C相電壓(V)': 'M63-發電機1-C相',
    'M63-發電機1-C相電流(A)': 'M63-發電機1-C相',
    'M63-發電機1-三相功率(kW)': 'M63-發電機1',
    'M63-發電機1-發電量(kWh)': 'M63-發電機1',
    'M64-發電機1-頻率(Hz)': 'M64-發電機1',
    'M71-發電機300kVA-頻率(Hz)': 'M71-發電機300kVA',
    'M72-併接點-AB線電壓(V)': 'M72-併接點-AB線',
    'M72-併接點-A相電流(A)': 'M72-併接點-A相',
    'M72-併接點-BC線電壓(V)': 'M72-併接點-BC線',
    'M72-併接點-B相電流(A)': 'M72-併接點-B相',
    'M72-併接點-CA線電壓(V)': 'M72-併接點-CA線',
    'M72-併接點-C相電流(A)': 'M72-併接點-C相',
    'M72-併接點-功率因數(%)': 'M72-併接點',
    'M72-併接點-有功功率(kW)': 'M72-併接點',
    'M72-併接點-有功電量(kWh)': 'M72-併接點',
    'M72-併接點-正有功電量(kWh)': 'M72-併接點',
    'M72-併接點-正無功電量(kvarh)': 'M72-併接點',
    'M72-併接點-無功功率(kvar)': 'M72-併接點',
    'M72-併接點-無功電量(kvarh)': 'M72-併接點',
    'M72-併接點-視在功率(kVA)': 'M72-併接點',
    'M72-併接點-視在電量(kVAh)': 'M72-併接點',
    'M72-併接點-負有功電量(kWh)': 'M72-併接點',
    'M72-併接點-負無功電量(kvarh)': 'M72-併接點',
    'M72-併接點-頻率(Hz)': 'M72-併接點',
    'M73-發電機300kVA-AB線電壓(V)': 'M73-發電機300kVA-AB線',
    'M73-發電機300kVA-A相電流(A)': 'M73-發電機300kVA-A相',
    'M73-發電機300kVA-BC線電壓(V)': 'M73-發電機300kVA-BC線',
    'M73-發電機300kVA-B相電流(A)': 'M73-發電機300kVA-B相',
    'M73-發電機300kVA-CA線電壓(V)': 'M73-發電機300kVA-CA線',
    'M73-發電機300kVA-C相電流(A)': 'M73-發電機300kVA-C相',
    'M73-發電機300kVA-功率因數(%)': 'M73-發電機300kVA',
    'M73-發電機300kVA-有功功率(kW)': 'M73-發電機300kVA',
    'M73-發電機300kVA-有功電量(kWh)': 'M73-發電機300kVA',
    'M73-發電機300kVA-正有功電量(kWh)': 'M73-發電機300kVA',
    'M73-發電機300kVA-正無功電量(kvarh)': 'M73-發電機300kVA',
    'M73-發電機300kVA-無功功率(kvar)': 'M73-發電機300kVA',
    'M73-發電機300kVA-無功電量(kvarh)': 'M73-發電機300kVA',
    'M73-發電機300kVA-視在功率(kVA)': 'M73-發電機300kVA',
    'M73-發電機300kVA-視在電量(kVAh)': 'M73-發電機300kVA',
    'M73-發電機300kVA-負有功電量(kWh)': 'M73-發電機300kVA',
    'M73-發電機300kVA-負無功電量(kvarh)': 'M73-發電機300kVA',
    'M101-功率/壓力平方-計算(kW/bar2)': 'M101-功率/壓力平方-計算',
    'M103-流量/壓力根-計算(tph/bar0.5)': 'M103-流量/壓力根-計算',
    'M104-出噴嘴速度-計算(m/s)': 'M104-出噴嘴速度-計算',
    'M105-速度壓力根-計算(ms/bar0.5)': 'M105-速度壓力根-計算',
    'M10-上貨櫃前-壓力(bar)': 'M10-上貨櫃前',
    'M10-上貨櫃前-溫度(℃)': 'M10-上貨櫃前',
    'M11-三桶前-壓力(bar)': 'M11-三桶前',
    'M11-三桶前-溫度(℃)': 'M11-三桶前',
    'M21-尾水箱-溫度(℃)': 'M21-尾水箱',
    'M22-主排水管-流量(m3/h)': 'M22-主排水管',
    'M25-大桶後-密度(g/cm3)': 'M25-大桶後',
    'M25-大桶後-溫度()': 'M25-大桶後',
    'M25-大桶後-累積質量(kg)': 'M25-大桶後',
    'M25-大桶後-累積體積(m3)': 'M25-大桶後',
    'M60-軸心1-入水測溫度(℃)': 'M60-軸心1-入水測',
    'M62-軸心1-轉速(Hz)': 'M62-軸心1',
    'M63-發電機1-三相功因()': 'M63-發電機1',
  }
}
</i18n>

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

<style scoped>
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

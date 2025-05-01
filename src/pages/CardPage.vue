<template>
  <q-page class="row q-pa-xs">
    <div class="col-xs-12">
      <q-card class="bg-white">
        <q-card-section>
          <div class="time text-center">
            {{ currentLogTime }}
          </div>
        </q-card-section>
      </q-card>
    </div>
    <div class="col-xs-12">
      <isotope :list="rtus" class="grid" itemSelector="grid-item" :options="isotopeOption">
        <div
          v-for="[rtuName, rtu] in rtus"
          :key="rtuName"
          class="col-xs-12 col-sm-6 col-md-4 col-lg-3 col-xl-2"
        >
          <q-card class="bg-white">
            <div class="title leading-[0.7]">
              {{ t(rtuName) }}
            </div>
            <div class="row wrap reg-list">
              <div
                v-for="[regName] in regs(rtuName)"
                :key="rtuName + regName"
                class="col-xs-6 top-12"
              >
                <q-card flat class="reg-card">
                  <div class="q-pa-sm fit absolute">
                    <span class="caption reg-name text-grey">{{ t(regName) }}</span
                    ><br />
                    <span class="headline reg-value"
                      ><strong>{{ rtu[regName]?.value ?? 'N/A' }} </strong></span
                    >
                    <span class="subheading reg-unit">{{ rtu[regName]?.unit ?? 'N/A' }}</span>
                  </div>
                  <div class="q-pa-sm fit absolute">
                    <span class="caption reg-avg text-grey"
                      >AVG {{ getStat(rtuName, regName).avg }}</span
                    ><br />
                    <span class="caption reg-sd text-grey"
                      >SD {{ getStat(rtuName, regName).sd }}</span
                    ><br />
                    <span class="caption reg-max text-grey">{{
                      getStat(rtuName, regName).max
                    }}</span
                    ><br />
                    <br /><br />
                    <span class="caption reg-min text-grey">{{
                      getStat(rtuName, regName).min
                    }}</span>
                  </div>
                  <div class="q-pa-sm fit">
                    <VueTrend
                      v-if="rtu[regName]?.trend"
                      :data="rtu[regName].trend"
                      :gradient="['#6fa8dc', '#42b983', '#2c3e50']"
                      class="reg-trend"
                    >
                    </VueTrend>
                    <VueBars
                      v-if="rtu[regName]?.bars"
                      :key="currentLogTime"
                      :data="rtu[regName].bars"
                      :gradient="['#6fa8dc', '#42b983', '#2c3e50']"
                      :growDuration="0.01"
                      :padding="16"
                      class="reg-trend"
                    >
                    </VueBars>
                  </div>
                </q-card>
              </div>
            </div>
          </q-card>
        </div>
      </isotope>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import VueTrend from '@hotdogee/vue3-trend'
import _ from 'lodash'
import { computed } from 'vue'
import VueBars from 'vue3-bars'
import isotope from 'vue3-isotope'
// import { useLogsStore } from '../stores/logs'
import { useLogsDemoStore } from '../stores/logs-demo'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

// Initialize Pinia store
// const logsStore = useLogsStore()
const logsStore = useLogsDemoStore()

// Define interfaces for stat results
interface StatResult {
  avg: string
  sd: string
  max: string
  min: string
  fac: number
  digits: number
}

// Default order configuration for RTU display
const defaultOrder = [
  { sid: 71, regOrder: [] },
  {
    sid: 73,
    regOrder: [
      { name: '有功功率', show: true },
      { name: '無功功率', show: true },
      { name: '視在功率', show: true },
      { name: '功率因數', show: true },
      { name: 'AB線電壓', show: true },
      { name: 'A相電流', show: true },
      { name: 'BC線電壓', show: true },
      { name: 'B相電流', show: true },
      { name: 'CA線電壓', show: true },
      { name: 'C相電流', show: true },
      { name: 'A相電壓總諧波失真', show: true },
      { name: 'A相電流總諧波失真', show: true },
      { name: 'B相電壓總諧波失真', show: true },
      { name: 'B相電流總諧波失真', show: true },
      { name: 'C相電壓總諧波失真', show: true },
      { name: 'C相電流總諧波失真', show: true },
      { name: '正有功電量', show: true },
      { name: '負有功電量', show: true },
      { name: '正無功電量', show: true },
      { name: '負無功電量', show: true },
      { name: '有功電量', show: false },
      { name: '無功電量', show: false },
      { name: '視在電量', show: true }
    ]
  },
  {
    sid: 72,
    regOrder: [
      { name: '有功功率', show: true },
      { name: '無功功率', show: true },
      { name: '視在功率', show: true },
      { name: '功率因數', show: true },
      { name: 'AB線電壓', show: true },
      { name: 'A相電流', show: true },
      { name: 'BC線電壓', show: true },
      { name: 'B相電流', show: true },
      { name: 'CA線電壓', show: true },
      { name: 'C相電流', show: true },
      { name: 'A相電壓總諧波失真', show: true },
      { name: 'A相電流總諧波失真', show: true },
      { name: 'B相電壓總諧波失真', show: true },
      { name: 'B相電流總諧波失真', show: true },
      { name: 'C相電壓總諧波失真', show: true },
      { name: 'C相電流總諧波失真', show: true },
      { name: '正有功電量', show: true },
      { name: '負有功電量', show: true },
      { name: '正無功電量', show: true },
      { name: '負無功電量', show: true },
      { name: '有功電量', show: false },
      { name: '無功電量', show: false },
      { name: '視在電量', show: true },
      { name: '頻率', show: true }
    ]
  },
  { sid: 1, regOrder: [] },
  { sid: 2, regOrder: [] },
  { sid: 5, regOrder: [] },
  { sid: 6, regOrder: [] },
  { sid: 25, regOrder: [] },
  // { sid: 26, regOrder: [] },
  { sid: 200, regOrder: [] },
  { sid: 50, regOrder: [] },
  { sid: 51, regOrder: [] },
  { sid: 52, regOrder: [] },
  { sid: 22, regOrder: [] },
  { sid: 7, regOrder: [] },
  { sid: 10, regOrder: [] },
  { sid: 11, regOrder: [] },
  { sid: 13, regOrder: [] },
  { sid: 14, regOrder: [] },
  { sid: 21, regOrder: [] },
  { sid: 9, regOrder: [] },
  { sid: 60, regOrder: [] },
  { sid: 61, regOrder: [] },
  {
    sid: 63,
    regOrder: [
      { name: '三相功率', show: true },
      { name: '三相功因', show: false },
      { name: '發電量', show: true },
      { name: 'A相電壓', show: true },
      { name: 'A相電流', show: true },
      { name: 'B相電壓', show: true },
      { name: 'B相電流', show: true },
      { name: 'C相電壓', show: true },
      { name: 'C相電流', show: true }
    ]
  },
  { sid: 64, regOrder: [] },
  { sid: 62, regOrder: [] }
]

// Isotope layout options
const isotopeOption = {
  itemSelector: '.grid-item',
  percentPosition: true,
  masonry: {
    gutter: 0
  }
}

// Get current time from store
const currentLogTime = computed(() => logsStore.currentLogTime)

// Sort RTUs based on defaultOrder
const rtus = computed(() => {
  return _.sortBy(Object.entries(logsStore.cardData), [
    ([k]) => {
      const match = k.match(/^M(\d+)-/)
      if (!match) return 999

      const sid = parseInt(match[1] ?? '0')
      const i = defaultOrder.findIndex((o) => o.sid === sid)
      return i < 0 ? 999 : i
    }
  ])
})
// console.log(
//   'rtus',
//   // flatten into a Set
//   _.flatten(rtus.value.map(([k, v]) => Object.entries(v).map(([regName]) => regName))).reduce(
//     (acc, regName) => {
//       acc.add(regName)
//       return acc
//     },
//     new Set<string>()
//   )
// )
// console.log(
//   'rtus',
//   rtus.value.map(([k]) => k)
// )

// Sort registers for each RTU based on defaultOrder
const regs = (rtuName: string) => {
  const match = rtuName.match(/^M(\d+)-/)
  if (!match) return []

  const sid = parseInt(match[1] ?? '0')
  const orderItem = defaultOrder.find((o) => o.sid === sid)
  const regEntries = Object.entries(logsStore.cardData[rtuName] || {})

  if (orderItem && Array.isArray(orderItem.regOrder) && orderItem.regOrder.length > 0) {
    const regOrder = orderItem.regOrder
    const sorted = _.sortBy(regEntries, [
      ([regName]) => {
        const i = regOrder.findIndex((o) => o.name === regName)
        return i < 0 ? 999 : i
      }
    ])

    return _.filter(sorted, ([regName]) => {
      const regOrderItem = regOrder.find((o) => o.name === regName)
      if (regOrderItem) return regOrderItem.show !== false
      return true // default show
    })
  } else {
    return regEntries
  }
}

// Calculate statistics for register values
const getStat = (rtuName: string, regName: string): StatResult => {
  const reg: { trend?: number[]; bars?: number[] } = logsStore.cardData[rtuName]?.[regName] ?? {}
  const data = reg.trend || reg.bars || [0]

  if (!data.length) {
    return { avg: 'N/A', sd: 'N/A', max: 'N/A', min: 'N/A', fac: 1, digits: 2 }
  }

  const sum = data.reduce((acc, v) => acc + v, 0)
  let fac = reg.trend ? 100 : 1
  let avg = sum / data.length / fac

  while (avg > 10000 || avg < -10000) {
    avg /= 1000
    fac *= 1000
  }

  // max string length 5: '999.99', '9999.9', '-99.99', '-999.9', '-9999'
  const digits = avg >= 0 ? (avg < 1000 ? 2 : 1) : avg > -100 ? 2 : avg > -1000 ? 1 : 0
  const avgFormatted = avg.toFixed(digits)
  const min = (Math.min(...data) / fac).toFixed(digits)
  const max = (Math.max(...data) / fac).toFixed(digits)
  const sd = Math.sqrt(
    data.reduce((acc, v) => acc + (v / fac - avg) * (v / fac - avg), 0) / data.length
  ).toFixed(digits)

  return { avg: avgFormatted, sd, max, min, fac, digits }
}
</script>

<i18n>
{
  "en": {
    'M1-九號井口': 'M1 - Wellhead',
    'M2-手動閘閥前': 'M2 - Pre Valve',
    'M5-渦輪2前': 'M5 - Pre Turbine',
    'M6-渦輪2後': 'M6 - Post Turbine',
    'M7-大穩壓桶1': 'M7 - Surge Tank',
    'M13-渦輪1前': 'M13 - Pre Turbine',
    'M14-渦輪1後': 'M14 - Post Turbine',
    'M25-主排水管': 'M25 - Drain',
    'M50-軸心2': 'M50 - Shaft',
    'M51-軸心2': 'M51 - Shaft',
    'M52-變速齒輪箱2': 'M52 - Gearbox',
    'M61-軸心1': 'M61 - Shaft',
    'M71-發電機300kVA': 'M71 - Generator',
    'M73-發電機300kVA': 'M73 - Generator',
    'M72-併接點': 'M72 - Grid Connection',
    'M200-計算': 'M200 - Computed',
    "頻率": "Frequency",
    "AB線電壓": "AB Line Voltage",
    "BC線電壓": "BC Line Voltage",
    "CA線電壓": "CA Line Voltage",
    "A相電流": "Phase A Current",
    "B相電流": "Phase B Current",
    "C相電流": "Phase C Current",
    "有功功率": "Active Power",
    "無功功率": "Reactive Power",
    "視在功率": "Apparent Power",
    "功率因數": "Power Factor",
    "正有功電量": "+Active Energy",
    "負有功電量": "-Active Energy",
    "正無功電量": "+Reactive Energy",
    "負無功電量": "-Reactive Energy",
    "有功電量": "Active Energy",
    "無功電量": "Reactive Energy",
    "視在電量": "Apparent Energy",
    "A相電流總諧波失真": "Current A THD",
    "B相電流總諧波失真": "Current B THD",
    "C相電流總諧波失真": "Current C THD",
    "A相電壓總諧波失真": "Voltage A THD",
    "B相電壓總諧波失真": "Voltage B THD",
    "C相電壓總諧波失真": "Voltage C THD",
    "壓力": "Pressure",
    "溫度": "Temperature",
    "質量流率": "Mass Flow Rate",
    "密度": "Density",
    "出噴嘴速度": "Exit Velocity",
    "井口質量焓": "Wellhead Enthalpy",
    "入口質量焓": "Inlet Enthalpy",
    "出口質量焓": "Outlet Enthalpy",
    "熱效率(入)": "Thermal Eff. (In)",
    "熱效率(入-出)": "Thermal Eff. (Diff)",
    "常數": "Constant",
    "併網效率": "Grid Efficiency",
    "M1過壓": "M1 Overpressure",
    "M1過壓比": "M1 OP Ratio",
    "M5過壓": "M5 Overpressure",
    "M5過壓比": "M5 OP Ratio",
    "扭力": "Torque",
    "入水測溫度": "Water Inlet Temp",
    "發電機測溫度": "Generator Temp",
  },
  "tw": {
    'M1-九號井口': 'M1-九號井口',
    'M2-手動閘閥前': 'M2-手動閘閥前',
    'M5-渦輪2前': 'M5-渦輪2前',
    'M6-渦輪2後': 'M6-渦輪2後',
    'M7-大穩壓桶1': 'M7-大穩壓桶1',
    'M13-渦輪1前': 'M13-渦輪1前',
    'M14-渦輪1後': 'M14-渦輪1後',
    'M25-主排水管': 'M25-主排水管',
    'M50-軸心2': 'M50-軸心2',
    'M51-軸心2': 'M51-軸心2',
    'M52-變速齒輪箱2': 'M52-變速齒輪箱2',
    'M61-軸心1': 'M61-軸心1',
    'M71-發電機300kVA': 'M71-發電機300kVA',
    'M73-發電機300kVA': 'M73-發電機300kVA',
    'M72-併接點': 'M72-併接點',
    'M200-計算': 'M200-計算',
    "頻率": "頻率",
    "AB線電壓": "AB線電壓",
    "BC線電壓": "BC線電壓",
    "CA線電壓": "CA線電壓",
    "A相電流": "A相電流",
    "B相電流": "B相電流",
    "C相電流": "C相電流",
    "有功功率": "有功功率",
    "無功功率": "無功功率",
    "視在功率": "視在功率",
    "功率因數": "功率因數",
    "正有功電量": "正有功電量",
    "負有功電量": "負有功電量",
    "正無功電量": "正無功電量",
    "負無功電量": "負無功電量",
    "有功電量": "有功電量",
    "無功電量": "無功電量",
    "視在電量": "視在電量",
    "A相電流總諧波失真": "A相電流總諧波失真",
    "B相電流總諧波失真": "B相電流總諧波失真",
    "C相電流總諧波失真": "C相電流總諧波失真",
    "A相電壓總諧波失真": "A相電壓總諧波失真",
    "B相電壓總諧波失真": "B相電壓總諧波失真",
    "C相電壓總諧波失真": "C相電壓總諧波失真",
    "壓力": "壓力",
    "溫度": "溫度",
    "質量流率": "質量流率",
    "密度": "密度",
    "出噴嘴速度": "出噴嘴速度",
    "井口質量焓": "井口質量焓",
    "入口質量焓": "入口質量焓",
    "出口質量焓": "出口質量焓",
    "熱效率(入)": "熱效率(入)",
    "熱效率(入-出)": "熱效率(入-出)",
    "常數": "常數",
    "併網效率": "併網效率",
    "M1過壓": "M1過壓",
    "M1過壓比": "M1過壓比",
    "M5過壓": "M5過壓",
    "M5過壓比": "M5過壓比",
    "扭力": "扭力",
    "入水測溫度": "入水測溫度",
    "發電機測溫度": "發電機測溫度",
  }
}
</i18n>

<style>
.reg-card {
  height: 110px;
}
.reg-trend {
  height: 100%;
  top: 18px;
  position: relative;
}
.reg-name {
  /* top: -6px; */
  position: relative;
}
.reg-value {
  top: -6px;
  position: relative;
}
.reg-unit {
  top: -6px;
  position: relative;
}
.reg-avg {
  top: 2px;
  right: 0px;
  position: relative;
  float: right;
}
.reg-sd {
  top: 2px;
  right: 0px;
  position: relative;
  float: right;
}
.reg-max {
  top: 2px;
  right: 0px;
  position: relative;
  float: right;
}
.reg-min {
  bottom: 4px;
  right: 0px;
  position: relative;
  float: right;
}
.top-left-6 {
  top: -4px;
  right: 0px;
  position: relative;
  float: left;
}
.absolute {
  position: absolute;
}
/* .grid-item {
  padding: 4px;
} */
.q-card {
  margin: 4px;
  line-height: normal;
}
.reg-list {
  padding: 0 4px;
}
div.row.wrap.container {
  padding: 4px;
}
div.time {
  font-size: 20px;
}
div.title {
  font-size: 20px;
  padding: 16px 12px 0px 12px;
}
span.caption {
  font-size: 12px !important;
  font-weight: 400 !important;
}
span.headline {
  font-size: 24px !important;
  font-weight: 400 !important;
  line-height: 32px !important;
  letter-spacing: normal !important;
}
span.subheading {
  font-size: 16px !important;
  font-weight: 400 !important;
}
</style>

<style lang="scss">
.grid {
  @each $size, $width in $sizes {
    @media all and (min-width: $width) {
      @for $n from 1 through $flex-cols {
        .grid-item.col-#{$size}-#{$n} {
          width: calc($n / $flex-cols * 100%);
        }
      }
    }
  }
}
</style>

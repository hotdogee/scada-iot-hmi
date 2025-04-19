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
            <div class="title">
              {{ rtuName }}
            </div>
            <div class="row wrap reg-list">
              <div
                v-for="[regName] in regs(rtuName)"
                :key="rtuName + regName"
                class="col-xs-6 top-12"
              >
                <q-card flat class="reg-card">
                  <div class="q-pa-sm fit absolute">
                    <span class="caption reg-name text-grey">{{ regName }}</span
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
                      :key="String(rtu[regName].time || '')"
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
import { useLogsStore } from '../stores/logs'

// Initialize Pinia store
const logsStore = useLogsStore()

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
  padding: 4px;
}
div.row.wrap.container {
  padding: 4px;
}
div.time {
  font-size: 20px;
}
div.title {
  font-size: 20px;
  padding: 8px 12px 0px 12px;
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

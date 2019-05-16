<template>
  <div class="row wrap container">
    <div class="col-xs-12">
      <q-card class="bg-white">
        <q-card-title>
          <div class="title text-center">{{ currentLogTime }}</div>
        </q-card-title>
      </q-card>
    </div>
    <div class="col-xs-12">
      <isotope :list="rtus" class="grid" itemSelector="grid-item" :options='option' >
        <div v-for="[rtuName, rtu] in rtus" :key="rtuName" class="col-xs-12 col-sm-6 col-md-4 col-lg-3 col-xl-2">
          <q-card class="bg-white">
            <q-card-title>
              <div class="title">{{ rtuName }}</div>
            </q-card-title>
            <div class="row wrap">
              <div class="col-xs-6 top-12" v-for="[regName, reg] in regs(rtuName)" :key="rtuName + regName">
                <q-card light>
                  <q-card-main class="absolute fit">
                    <span class="caption top-6 text-grey">{{ regName }}</span><br>
                    <span class="headline top-12"><strong>{{ rtu[regName].value }} </strong></span>
                    <span class="subheading top-12">{{ rtu[regName].unit }}</span>
                  </q-card-main>
                  <q-card-main class="absolute fit">
                    <span class="caption top-right-6 text-grey">AVG {{ avg(rtuName, regName)[0] }}</span><br>
                    <span class="caption top-right-6 text-grey">SD {{ sd(rtuName, regName) }}</span><br>
                    <span class="caption max-text text-grey">{{ avg(rtuName, regName)[3] }}</span><br>
                    <br><br>
                    <span class="caption min-text text-grey">{{ avg(rtuName, regName)[2] }}</span>
                  </q-card-main>
                  <br><br><br>
                  <trend
                    v-if="rtu[regName].trend"
                    :data="rtu[regName].trend"
                    :gradient="['#6fa8dc', '#42b983', '#2c3e50']"
                  >
                  </trend>
                  <bars
                    v-if="rtu[regName].bars"
                    :data="rtu[regName].bars"
                    :key="JSON.stringify(rtu[regName].bars)"
                    :gradient="['#6fa8dc', '#42b983', '#2c3e50']"
                    :growDuration="0.01"
                    :padding="16"
                  >
                  </bars>
                </q-card>
              </div>
            </div>
          </q-card>
        </div>
      </isotope>
    </div>
  </div>
</template>

<script>
import {
  QCard,
  QCardMain,
  QCardTitle
} from 'quasar'
import isotope from 'vueisotope'
import { mapGetters, mapState } from 'vuex'
import _ from 'lodash'

export default {
  name: 'plc-card',
  data: function () {
    return {
      defaultOrder: [
        { sid: 71, regOrder: [] },
        { sid: 73, regOrder: [
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
        ] },
        { sid: 72, regOrder: [
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
        ] },
        { sid: 1, regOrder: [] },
        { sid: 2, regOrder: [] },
        { sid: 5, regOrder: [] },
        { sid: 6, regOrder: [] },
        { sid: 25, regOrder: [] },
        { sid: 26, regOrder: [] },
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
        { sid: 63, regOrder: [
          { name: '三相功率', show: true },
          { name: '三相功因', show: false },
          { name: '發電量', show: true },
          { name: 'A相電壓', show: true },
          { name: 'A相電流', show: true },
          { name: 'B相電壓', show: true },
          { name: 'B相電流', show: true },
          { name: 'C相電壓', show: true },
          { name: 'C相電流', show: true }
        ] },
        { sid: 64, regOrder: [] },
        { sid: 62, regOrder: [] }
      ],
      option: {
        itemSelector: '.grid-item',
        percentPosition: true,
        masonry: {
          gutter: 0
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      // map this.logs to store.state.logs
      'currentLog',
      'currentLogTime'
    ]),
    ...mapState([
      'cardData'
    ]),
    rtus () {
      return _.sortBy(Object.entries(this.cardData), [([k, v]) => {
        const sid = parseInt(k.match(/^M(\d+)-/)[1])
        let i = this.defaultOrder.map(o => o.sid).indexOf(sid)
        if (i < 0) { return 999 }
        else { return i }
      }])
    },
    regs () {
      return (rtuName) => {
        const sid = parseInt(rtuName.match(/^M(\d+)-/)[1])
        const orderItem = _.find(this.defaultOrder, { sid })
        const regEntries = Object.entries(this.cardData[rtuName])
        if (orderItem && Array.isArray(orderItem.regOrder)) {
          const regOrder = orderItem.regOrder
          const sorted = _.sortBy(regEntries, [([regName, v]) => {
            let i = regOrder.map(o => o.name).indexOf(regName)
            if (i < 0) { return 999 }
            else { return i }
          }])
          return _.filter(sorted, ([regName, v]) => {
            const regOrderItem = _.find(regOrder, { name: regName })
            if (regOrderItem) return regOrderItem.show !== false
            else return true // default show
          })
        } else {
          return regEntries
        }
      }
    },
    avg () {
      return (rtuName, regName) => {
        const reg = this.cardData[rtuName][regName]
        const data = reg.trend || reg.bars || [0]
        if (!data.length) {
          // console.log(rtuName, regName, reg, data)
          return ['N/A', 1, 'N/A', 'N/A']
        }
        const sum = data.reduce((acc, v) => acc + v, 0)
        let fac = reg.trend ? 100 : 1
        let avg = (sum / data.length / fac)
        while (avg > 10000) {
          avg /= 1000
          fac *= 1000
        }
        const min = Math.min(...data) / fac
        const max = Math.max(...data) / fac
        return [avg.toFixed(2), fac, min.toFixed(2), max.toFixed(2)]
      }
    },
    sd () {
      return (rtuName, regName) => {
        const reg = this.cardData[rtuName][regName]
        const data = reg.trend || reg.bars || [0]
        if (!data.length) return 'N/A'
        const [avg, fac, min, max] = this.avg(rtuName, regName)
        return Math.sqrt(data.reduce((acc, v) => acc + (v / fac - avg) * (v / fac - avg), 0) / data.length).toFixed(2)
      }
    }
  },
  components: {
    isotope,
    QCard,
    QCardMain,
    QCardTitle
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.top-6 {
  top: -6px;
  position: relative;
}
.top-right-6 {
  top: -4px;
  right: 0px;
  position: relative;
  float: right;
}
.max-text {
  top: 0px;
  right: 0px;
  position: relative;
  float: right;
}
.min-text {
  top: -8px;
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
.top-12 {
  top: -12px;
  position: relative;
}
.absolute {
  position: absolute;
}
/* .grid-item {
  padding: 4px;
} */
.q-card {
  margin: 4px;
}
div.row.wrap.container {
  padding: 4px;
}
div.title {
  font-size: 20px;
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
<style lang="stylus" scoped>
@import '~variables'

.grid
  for size, width in $sizes
    @media all and (min-width: width)
      for n in (1..$flex-cols)
        .grid-item.col-{size}-{n}
          width: (n / $flex-cols * 100)%
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

<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-card light>
        <v-card-title primary-title>
          <div class="headline">{{ this.$store.state.logs.length }}筆資料</div>
        </v-card-title>
        <v-card-text class="pt-0">
          <v-layout row wrap>
            <v-flex xs12 sm6>
              <v-layout row wrap>
                <v-flex xs6>
                  <v-menu
                    lazy
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    full-width
                    :nudge-left="40"
                    max-width="290px"
                  >
                    <v-text-field
                      slot="activator"
                      label="起始日期"
                      v-model="startDate"
                      prepend-icon="event"
                      readonly light
                    ></v-text-field>
                    <v-date-picker v-model="startDate" locale="zh-TW" dark>
                    </v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs6>
                  <v-menu
                    lazy
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    full-width
                    :nudge-left="40"
                    max-width="290px"
                  >
                    <v-text-field
                      slot="activator"
                      label="起始時間"
                      v-model="startTime"
                      prepend-icon="access_time"
                      readonly light
                    ></v-text-field>
                    <v-time-picker v-model="startTime" locale="zh-TW" dark>
                    </v-time-picker>
                  </v-menu>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs12 sm6>
              <v-layout row wrap>
                <v-flex xs6>
                  <v-menu
                    lazy
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    full-width
                    :nudge-left="40"
                    max-width="290px"
                  >
                    <v-text-field
                      slot="activator"
                      label="結束日期"
                      v-model="endDate"
                      prepend-icon="event"
                      readonly light
                    ></v-text-field>
                    <v-date-picker v-model="endDate" locale="zh-TW" dark>
                    </v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs6>
                  <v-menu
                    lazy
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    full-width
                    :nudge-left="40"
                    max-width="290px"
                  >
                    <v-text-field
                      slot="activator"
                      label="結束時間"
                      v-model="endTime"
                      prepend-icon="access_time"
                      readonly light
                    ></v-text-field>
                    <v-time-picker v-model="endTime" locale="zh-TW" dark>
                    </v-time-picker>
                  </v-menu>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs12>
              <v-btn block primary dark @click.native="getChartData()">確定</v-btn>
            </v-flex>
            <v-flex xs12>
              <el-date-picker
                v-model="value3"
                type="datetimerange"
                size="mini"
                placeholder="Select time range">
              </el-date-picker>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-flex xs12>
      <v-card light>
        <v-card-text>
          <chart :options="chartInit" ref="chart"></chart>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import _ from 'lodash'
import ECharts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/chart/line';
// import 'echarts/lib/chart/bar';
// import 'echarts/lib/chart/pie';
// import 'echarts/lib/chart/scatter';
// import 'echarts/lib/chart/radar';

// import 'echarts/lib/chart/map';
// import 'echarts/lib/chart/treemap';
// import 'echarts/lib/chart/graph';
// import 'echarts/lib/chart/gauge';
// import 'echarts/lib/chart/funnel';
// import 'echarts/lib/chart/parallel';
// import 'echarts/lib/chart/sankey';
// import 'echarts/lib/chart/boxplot';
// import 'echarts/lib/chart/candlestick';
// import 'echarts/lib/chart/effectScatter';
// import 'echarts/lib/chart/lines';
// import 'echarts/lib/chart/heatmap';

import 'echarts/lib/component/graphic';
import 'echarts/lib/component/grid';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/polar';
import 'echarts/lib/component/geo';
import 'echarts/lib/component/parallel';
import 'echarts/lib/component/singleAxis';
import 'echarts/lib/component/brush';

import 'echarts/lib/component/title';

import 'echarts/lib/component/dataZoom';
import 'echarts/lib/component/visualMap';

import 'echarts/lib/component/markPoint';
import 'echarts/lib/component/markLine';
import 'echarts/lib/component/markArea';

import 'echarts/lib/component/timeline';
import 'echarts/lib/component/toolbox';

import 'zrender/lib/vml/vml';
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'plc-card',
  data: function () {
    let data = []

    for (let i = 0; i <= 360; i++) {
        let t = i / 180 * Math.PI
        let r = Math.sin(2 * t) * Math.cos(2 * t)
        data.push([r, i])
    }

    return {
      startDate: new Date(Date.now() - 1000*60*60*24).toISOString().substr(0, 10),
      startTime: null,
      endDate: new Date().toISOString().substr(0, 10),
      endTime: null,
      menu: false,
      modal: false,
      value3: [],
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
    ...mapGetters([
      // map this.logs to store.state.logs
      'chartInit',
      'chartUpdate'
    ]),
    start: function () {
      return new Date().getTime() - 60*60*1000
    },
    end: function () {
      return new Date().getTime()
    }
  },
  methods: {
    ...mapActions([
      'getLogs' // map `this.getChartData(payloads)` to `this.$store.dispatch('getChartData', payloads)`
    ]),
    getChartData: function () {
      console.log(this.startDate, this.startTime, this.endDate, this.endTime)
    }
  },
  watch: {
    chartUpdate: function (val, oldVal) {
      //console.log(this.$refs.chart.computedOptions.legend[0].data)
      if (_.isEmpty(this.$refs.chart.computedOptions.legend[0].data)) return
      this.$refs.chart.mergeOptions(val)
      //console.log(this.$refs.chart)
    }
  },
  components: {
    chart: ECharts
  },
  mounted: function () {
    this.endDate = new Date('2017-08-08')
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

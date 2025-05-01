import Logger from 'assets/logger'
import { acceptHMRUpdate, defineStore } from 'pinia'
const logger = new Logger('chart-store')

// result = {
//   total: 21704645,
//   limit: 1,
//   skip: 0,
//   data: [
//     {
//       _id: '5988df026280a15955031386',
//       name: 'Geo9',
//       logTime: '2017-08-07T20:39:30.088Z',
//       reads: []
//     }
//   ],
// }
// chartResult = {
//   bucket: '1d',
//   start: '2017-08-07T20:39:30.088Z',
//   end: '2019-08-12T11:55:39.281Z',
//   total: 21726035,
//   data: {
//     'M1-九號井口-溫度(℃)': [
//       { x: 1502150400000, y: 163.66, low: 130.97, high: 178.09 },
//     ]
//   }
// }

// http://localhost:8086/logs?$chart
// http://localhost:8086/logs?$limit=1

export interface ChartLogs {
  bucket: string
  start: string
  end: string
  total: number
  data: Record<
    string,
    Array<{
      x: number
      y: number
      low: number
      high: number
    }>
  >
  navigatorData: {
    bucket: string
    start: string
    end: string
    total: number
    data: Record<
      string,
      Array<{
        x: number
        y: number | null
        low: number | null
        high: number | null
      }>
    >
  }
}

import logsChartFull from './logs-chart-full-demo.json'

export const useChartStore = defineStore('chart', {
  state: (): ChartLogs => ({
    bucket: '',
    start: '',
    end: '',
    total: 0,
    data: {},
    navigatorData: logsChartFull
  }),
  getters: {},
  actions: {
    async findLogsInRange(from: Date | null = null, to: Date | null = null) {
      let url = `${process.env.API_URL}${process.env.API_PATH}/logs?$chart`
      if (from) {
        const fromDate = new Date(from).toISOString()
        url += `&logTime[$gt]=${fromDate}`
      }
      if (to) {
        const toDate = new Date(to).toISOString()
        url += `&logTime[$lt]=${toDate}`
      }
      try {
        logger.info('url:', url)
        const response = await fetch(url)
        logger.info('response:', response)
        const result = await response.json()
        logger.info('result:', result)
        // Chart update with $patch takes 3.5 secs
        this.$patch(result)
        // Chart update takes 3.5 secs
        // this.bucket = result.bucket
        // logger.info('1')
        // this.start = result.start
        // logger.info('2')
        // this.end = result.end
        // logger.info('3')
        // this.total = result.total
        // logger.info('4')
        // this.data = result.data
        logger.info('findLogsInRange result:', result)
      } catch (error) {
        logger.error('findLogsInRange error:', error)
      }
    },
    clearAll() {
      this.$reset()
    }
  },
  // Chart data typically doesn't need to be persisted
  persist: false
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useChartStore, import.meta.hot))
}

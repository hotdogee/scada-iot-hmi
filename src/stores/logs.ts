import { IAPWS97_EoS } from '@neutrium/thermo.eos.iapws97'
import Logger from 'assets/logger'
import { logs as logsService } from 'boot/feathers' // Import the logs service directly
import _ from 'lodash'
import { defineStore, type _GettersTree, type StateTree, type StoreDefinition } from 'pinia' // Import necessary types and PiniaCustomProperties

const logger = new Logger('logs.store')

// Constants moved outside store for better reusability
const LIMIT = 100
const PREFIX_EXP = {
  k: 3,
  M: 6,
  G: 9,
  T: 12,
  P: 15
} as const

const EXP_PREFIX = Object.keys(PREFIX_EXP).reduce<Record<number, string>>((o, p) => {
  o[PREFIX_EXP[p as keyof typeof PREFIX_EXP]] = p
  return o
}, {})

// Helper function for safe array access with specific return type
const getLastValue = <T>(arr?: Array<T>): T | undefined => {
  if (!arr?.length) return undefined
  return arr[arr.length - 1]
}

// Helper function to safely calculate vapor pressure
const calculateVaporPressure = (t: number | undefined): number => {
  if (t === undefined) return 0
  return (0.61121 * Math.exp((18.678 - t / 234.5) * (t / (257.14 + t)))) / 100
}

// Add helper function to safely get numeric value
const getNumericValue = (arr?: Array<{ value: number }>): number | undefined => {
  const lastItem = getLastValue(arr)
  return lastItem?.value
}

// Types
export interface Log {
  logTime: string
  reads: Array<{
    addr: string
    name: string
    reads: Array<{
      name: string
      value: number | number[]
      unit: string
      time?: string // Make time optional here as well
    }>
  }>
}

export interface CardDataItem {
  value?: string
  unit?: string
  trend?: number[]
  bars?: number[]
  time?: string | undefined
}

// Chart data type
interface ChartDataItem {
  value: number
  unit: string
  time?: string
}

interface State extends StateTree {
  // Extend StateTree
  logs: Log[]
  cardData: Record<string, Record<string, CardDataItem>>
  chartData: Record<string, Array<ChartDataItem>> // Corrected type here
  total: number | null
  start: string | null
  end: string | null
}

// Define getters type explicitly
interface Getters extends _GettersTree<State> {
  currentLogTime(state: State): string
}

// Define actions type explicitly
interface Actions {
  addTotal(total: number): void
  setLogs(logs: Log[]): void
  addLog(log: Log): void
  _updateCardDataItem(addrName: string, regName: string, value: number, unit: string): void
  _updateChartDataItem(header: string, value: number, unit: string, time?: string): void
  _processRegister(rtu: Log['reads'][number], reg: Log['reads'][number]['reads'][number]): void
  _calculateAndProcessDerivedValues(): void
  setupRealtimeUpdates(): Promise<void>
  findStartDateTime(): Promise<void>
}

// Add type for IAPWS97 solution
interface IAPWS97Solution {
  h: number // enthalpy
  // Add other properties if needed
}

export const useLogsStore: StoreDefinition<'logs', State, Getters, Actions> = defineStore('logs', {
  state: (): State => ({
    logs: [],
    cardData: {},
    chartData: {},
    total: null,
    start: null,
    end: null
  }),

  getters: {
    currentLogTime: (state): string => {
      if (!state.end) return 'loading...'
      // Ensure state.end is treated as a string for Date constructor
      return new Date(state.end).toLocaleString()
    }
  },

  actions: {
    addTotal(total: number) {
      if (this.total !== null) {
        this.total += total
      }
    },
    setLogs(logs: Log[]) {
      this.cardData = {}
      this.chartData = {}
      _.forEachRight(logs, (log) => {
        this.addLog(log) // Now correctly typed within Actions
      })
    },

    // --- Start of Refactored addLog and Helpers ---

    _updateCardDataItem(
      addrName: string,
      regName: string,
      originalValue: number,
      unitInput: string
    ) {
      if (!this.cardData[addrName]) {
        this.cardData[addrName] = {}
      }
      const cardDataAddr = this.cardData[addrName]

      if (!cardDataAddr[regName]) {
        cardDataAddr[regName] = { trend: [] }
      }
      const cardItem = cardDataAddr[regName]
      if (!cardItem) return // Should not happen due to initialization above

      const firstChar = unitInput[0] as keyof typeof PREFIX_EXP
      const unitBase = PREFIX_EXP[firstChar] ? unitInput.slice(1) : unitInput
      let exp = PREFIX_EXP[firstChar] || 0
      let value = originalValue

      while (value > 10000 || value < -10000) {
        value /= 1000
        exp += 3
      }

      const digits = value >= 0 ? (value < 1000 ? 2 : 1) : value > -100 ? 2 : value > -1000 ? 1 : 0
      const prefix = EXP_PREFIX[exp] || ''

      cardItem.value = value.toFixed(digits)
      cardItem.unit = prefix + unitBase
      if (!cardItem.trend) cardItem.trend = [] // Ensure trend exists
      cardItem.trend.push(Math.round(originalValue * 10000) / 100)

      while (cardItem.trend.length > LIMIT) {
        cardItem.trend.shift()
      }
    },

    _updateChartDataItem(header: string, value: number, unit: string, time?: string) {
      if (!this.chartData[header]) {
        this.chartData[header] = []
      }
      this.chartData[header].push({
        value,
        unit,
        ...(time && { time })
      })
      while (this.chartData[header].length > LIMIT) {
        this.chartData[header].shift()
      }
    },

    _processRegister(rtu: Log['reads'][number], reg: Log['reads'][number]['reads'][number]) {
      const addrName = `M${rtu.addr}-${rtu.name}`

      // Initialize cardData structure for the address if it doesn't exist
      if (!this.cardData[addrName]) {
        this.cardData[addrName] = {}
      }
      const cardDataAddr = this.cardData[addrName]

      // Handle THD case (array value)
      if (Array.isArray(reg.value)) {
        const thdName = reg.name.replace('諧波比', '總諧波失真')
        if (!cardDataAddr[thdName]) {
          cardDataAddr[thdName] = {}
        }
        const thdItem = cardDataAddr[thdName]
        if (!thdItem) return // Should not happen

        const thdValue = Math.sqrt(reg.value.reduce((a, v) => a + v * v, 0))

        thdItem.value = thdValue.toFixed(2)
        thdItem.unit = reg.unit
        thdItem.bars = reg.value
        thdItem.time = reg.time
        // Note: THD is not added to chartData or trend in the original code
        return
      }

      // Handle regular case (numeric value)
      const numericValue = typeof reg.value === 'number' ? reg.value : 0 // Ensure numeric
      const header = `${addrName}-${reg.name}(${reg.unit})`
      const unit = reg.unit // Use original unit for chart data

      // Update Card Data (handles formatting, prefix, trend)
      this._updateCardDataItem(addrName, reg.name, numericValue, reg.unit)

      // Update Chart Data
      this._updateChartDataItem(header, numericValue, unit, reg.time)
    },

    _calculateAndProcessDerivedValues() {
      const addrName = 'M200-計算'
      if (!this.cardData[addrName]) {
        this.cardData[addrName] = {} // Initialize if needed
      }

      // Access chart data safely
      const m73W = this.chartData['M73-發電機300kVA-有功功率(W)']
      const m73VA = this.chartData['M73-發電機300kVA-視在功率(VA)']
      const m72W = this.chartData['M72-併接點-有功功率(W)']
      const m25tph = this.chartData['M25-主排水管-質量流率(t/h)']
      const m1bar = this.chartData['M1-九號井口-壓力(bar)']
      const m1c = this.chartData['M1-九號井口-溫度(℃)']
      const m5bar = this.chartData['M5-渦輪2前-壓力(bar)']
      const m5c = this.chartData['M5-渦輪2前-溫度(℃)']
      const m6bar = this.chartData['M6-渦輪2後-壓力(bar)']
      const m6c = this.chartData['M6-渦輪2後-溫度(℃)']
      const m71hz = this.chartData['M71-發電機300kVA-頻率(Hz)']

      // Helper for IAPWS97 calculation
      const calculateEnthalpy = (
        pArr?: ChartDataItem[],
        tArr?: ChartDataItem[]
      ): IAPWS97Solution | null => {
        if (!pArr || !tArr) return null
        const p = getLastValue(pArr)?.value
        const t = getLastValue(tArr)?.value
        if (p === undefined || t === undefined) return null
        try {
          return new IAPWS97_EoS().solve({
            p: p * 100000,
            t: 273.15 + t
          }) as IAPWS97Solution
        } catch (error) {
          // Consider logging specific error source (e.g., M1, M5, M6)
          logger.error('Error calculating IAPWS97:', error)
          return null
        }
      }

      const m1e = calculateEnthalpy(m1bar, m1c)
      const m5e = calculateEnthalpy(m5bar, m5c)
      const m6e = calculateEnthalpy(m6bar, m6c)

      const turbineRadius = 0.215 // m
      const nozzleAngle = Math.cos((30 / 180) * Math.PI) // radians

      const formulas: Record<string, { unit: string; value: () => number }> = {
        出噴嘴速度: {
          unit: 'm/s',
          value: () => {
            const va = getNumericValue(m73VA)
            const tph = getNumericValue(m25tph)
            const hz = getNumericValue(m71hz)
            if (
              va === undefined ||
              tph === undefined ||
              hz === undefined ||
              va <= 0 ||
              tph <= 0 ||
              hz <= 0
            )
              return -1
            const omega = 2 * Math.PI * hz
            if (omega === 0) return -1
            const torque = va / omega
            const force = torque / turbineRadius
            const kgs = tph / 3.6
            if (kgs === 0) return -1
            const turbineSpeed = turbineRadius * omega
            const v2 = (force / (2 * kgs) + turbineSpeed) / nozzleAngle
            return isNaN(v2) ? -1 : v2
          }
        },
        井口質量焓: {
          unit: 'kJ/kg',
          value: () => m1e?.h ?? -1
        },
        入口質量焓: {
          unit: 'kJ/kg',
          value: () => m5e?.h ?? -1
        },
        出口質量焓: {
          unit: 'kJ/kg',
          value: () => m6e?.h ?? -1
        },
        '熱效率(入)': {
          unit: '%',
          value: () => {
            const kva = getNumericValue(m73VA)
            const kgs = getNumericValue(m25tph)
            if (m5e && kva !== undefined && kgs !== undefined && kgs !== 0) {
              return ((kva * 1000) / (kgs / 3.6) / m5e.h) * 100 // Multiply by 1000 for kW
            }
            return -1
          }
        },
        '熱效率(入-出)': {
          unit: '%',
          value: () => {
            const kva = getNumericValue(m73VA)
            const kgs = getNumericValue(m25tph)
            if (m5e && m6e && kva !== undefined && kgs !== undefined && kgs !== 0) {
              const dh = m5e.h - m6e.h
              if (dh === 0) return -1
              return ((kva * 1000) / (kgs / 3.6) / dh) * 100 // Multiply by 1000 for kW
            }
            return -1
          }
        },
        常數: {
          unit: 'kW/bar²', // Corrected unit
          value: () => {
            const va = getNumericValue(m73VA)
            const p5 = getNumericValue(m5bar)
            const p6 = getNumericValue(m6bar)
            if (va === undefined || p5 === undefined || p6 === undefined) return -1
            const pressureDiffSq = Math.pow(p5 - p6, 2)
            if (pressureDiffSq <= 0) return -1 // Avoid division by zero or negative pressure diff
            return va / 1000 / pressureDiffSq // Use kVA here directly
          }
        },
        併網效率: {
          unit: '%',
          value: () => {
            const w72 = getNumericValue(m72W)
            const w73 = getNumericValue(m73W)
            if (w72 === undefined || w73 === undefined || w72 <= 0 || w73 <= 0) return -1
            const eff = (w72 + 3000) / w73 // Assuming 3000 is a constant offset
            return eff > 1 ? 100 : eff * 100
          }
        },
        M1過壓: {
          unit: 'bar',
          value: () => {
            const p = getLastValue(m1bar)?.value
            const t = getLastValue(m1c)?.value
            if (p === undefined || t === undefined) return -1
            const vp = calculateVaporPressure(t)
            return isNaN(vp) ? -1 : p - vp
          }
        },
        M1過壓比: {
          unit: '%',
          value: () => {
            const p = getLastValue(m1bar)?.value
            const t = getLastValue(m1c)?.value
            if (p === undefined || t === undefined) return -1
            const vp = calculateVaporPressure(t)
            if (isNaN(vp) || vp === 0) return -1
            return (p / vp - 1) * 100
          }
        },
        M5過壓: {
          unit: 'bar',
          value: () => {
            const p = getLastValue(m5bar)?.value
            const t = getLastValue(m5c)?.value
            if (p === undefined || t === undefined) return -1
            const vp = calculateVaporPressure(t)
            return isNaN(vp) ? -1 : p - vp
          }
        },
        M5過壓比: {
          unit: '%',
          value: () => {
            const p = getLastValue(m5bar)?.value
            const t = getLastValue(m5c)?.value
            if (p === undefined || t === undefined) return -1
            const vp = calculateVaporPressure(t)
            if (isNaN(vp) || vp === 0) return -1
            return (p / vp - 1) * 100
          }
        },
        扭力: {
          unit: 'Nm',
          value: () => {
            const va = getNumericValue(m73VA)
            const hz = getNumericValue(m71hz)
            if (va === undefined || hz === undefined || va <= 0 || hz <= 0) return -1
            const omega = 2 * Math.PI * hz
            if (omega === 0) return -1
            const torque = va / omega
            return isNaN(torque) ? -1 : torque
          }
        }
      }

      // Process and update card/chart data for each formula
      _.forEach(formulas, (formula, regName) => {
        const value = formula.value()
        const unit = formula.unit
        const header = `${addrName}-${regName}(${unit})`

        // Update Card Data
        this._updateCardDataItem(addrName, regName, value, unit)

        // Update Chart Data
        this._updateChartDataItem(header, value, unit)
      })
    },

    addLog(log: Log) {
      this.end = log.logTime // Update latest log time

      // Process raw register readings
      _.forEach(log.reads, (rtu) => {
        _.forEach(rtu.reads, (reg) => {
          this._processRegister(rtu, reg)
        })
      })

      // Calculate and process derived values
      this._calculateAndProcessDerivedValues()
    },

    // --- End of Refactored addLog and Helpers ---

    async setupRealtimeUpdates() {
      try {
        const params = {
          query: {
            $limit: 200,
            $sort: {
              logTime: -1
            }
          }
        }
        const results = await logsService.find(params)
        // Add guards for results and results.data
        if (results && results.data && typeof results.total === 'number') {
          this.setLogs(results.data)
          this.total = results.total
        } else {
          logger.error('Invalid results received from logs service find', results)
        }

        // Type the log parameter in the event handler
        logsService.on('created', (data: unknown) => {
          // Basic validation before casting
          if (typeof data === 'object' && data !== null && 'logTime' in data && 'reads' in data) {
            const log = data as Log // Cast after basic check
            this.addLog(log)
            this.addTotal(1)
          } else {
            logger.warn('Received invalid log data structure on create event', data)
          }
        })
      } catch (error) {
        logger.error('setupRealtimeUpdates:', error)
      }
    },

    async findStartDateTime() {
      try {
        const params = {
          query: {
            $limit: 1,
            $sort: {
              logTime: 1
            }
          }
        }
        // Define expected data structure for the result item
        const results = await logsService.find(params)
        // Add guards and explicitly check the first item
        if (results?.data?.length > 0) {
          const firstLog = results.data[0]
          // Check if firstLog exists and has the logTime property
          if (firstLog && typeof firstLog.logTime === 'string') {
            this.start = firstLog.logTime
          } else {
            logger.warn('First log item missing or has invalid logTime', firstLog)
          }
        } else {
          logger.warn('Could not find start date time from logs service (no data)', results)
        }
      } catch (error) {
        logger.error('findStartDateTime:', error)
      }
    }
  }

  // Remove persist config if it was causing the error
  // persist: {
  //   key: 'logs-store',
  //   storage: localStorage, // or sessionStorage
  //   // paths: ['logs', 'cardData'] // Example: Check if this option is valid
  // }
})

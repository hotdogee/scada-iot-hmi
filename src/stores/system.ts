import _ from 'lodash'
import { defineStore } from 'pinia'

// const logger = new Logger('system-store')

interface SystemVersion {
  ui: string
  sw: string
}

interface SystemStatus {
  sw: string
  push: string
}

interface SystemState {
  version: SystemVersion
  status: SystemStatus
}

export const useSystemStore = defineStore('system', {
  state: (): SystemState => ({
    version: {
      ui: 'v0',
      sw: 'v0'
    },
    status: {
      sw: 'unsupported',
      push: 'unsupported'
    }
  }),

  getters: {
    getVersion: (state) => state.version,
    getStatus: (state) => state.status
  },

  actions: {
    setVersion(payload: Partial<SystemVersion>) {
      _.forEach(Object.entries(payload), ([k, v]) => {
        // In Vue 3/Pinia, direct assignment works for reactivity
        this.version[k as keyof SystemVersion] = v
      })
    },

    setStatus(payload: Partial<SystemStatus>) {
      _.forEach(Object.entries(payload), ([k, v]) => {
        this.status[k as keyof SystemStatus] = v
      })
    }
  },

  // System state typically doesn't need to be persisted
  persist: false
})

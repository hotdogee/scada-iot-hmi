declare module '@neutrium/thermo.eos.iapws97' {
  export class IAPWS97_EoS {
    solve(options: { p: number; t: number }): unknown
  }
}

declare module 'assets/logger' {
  export default class Logger {
    constructor(name: string)
    log(...args: unknown[]): void
    info(...args: unknown[]): void
    warn(...args: unknown[]): void
    error(...args: unknown[]): void
  }
}

// Add declaration for vueisotope if not already present
declare module 'vueisotope' {
  import type { DefineComponent } from 'vue'
  const Isotope: DefineComponent<object, object, unknown>
  export default Isotope
}

declare module 'vue3trend' {
  import type { DefineComponent } from 'vue'
  const Trend: DefineComponent<object, object, unknown>
  export default Trend
}

declare module 'vuebars' {
  import type { DefineComponent } from 'vue'
  const Bars: DefineComponent<object, object, unknown>
  export default Bars
}

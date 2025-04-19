declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined
    VUE_ROUTER_BASE: string | undefined
  }
}

declare module '@tweenjs/tween.js' {
  export interface TweenConfig {
    from?: Record<string, unknown>
    to: Record<string, unknown>
    duration?: number
    easing?: (amount: number) => number
    delay?: number
    repeat?: number
    yoyo?: boolean
    onStart?: (object: Record<string, unknown>) => void
    onStop?: (object: Record<string, unknown>) => void
    onComplete?: (object: Record<string, unknown>) => void
    onUpdate?: (object: Record<string, unknown>) => void
  }

  export class Tween {
    constructor(object: Record<string, unknown>)
    to(properties: Record<string, unknown>, duration?: number): this
    start(): this
    stop(): this
    delay(amount: number): this
    easing(easing: (amount: number) => number): this
    onStart(callback: (object: Record<string, unknown>) => void): this
    onStop(callback: (object: Record<string, unknown>) => void): this
    onComplete(callback: (object: Record<string, unknown>) => void): this
    onUpdate(callback: (object: Record<string, unknown>) => void): this
  }

  export const Easing: {
    Linear: {
      None: (amount: number) => number
    }
    Quadratic: {
      In: (amount: number) => number
      Out: (amount: number) => number
      InOut: (amount: number) => number
    }
  }

  export function update(time?: number): boolean
  export function removeAll(): void
}

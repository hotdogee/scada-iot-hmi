const GREY = `#7f8c8d`
const GREEN = `#2ecc71`
const YELLOW = `#f39c12`
const RED = `#c0392b`
const BLUE = `#3498db`
// const BLACK = `#111111`

const levelToColor = {
  debug: GREY,
  log: BLUE,
  warn: YELLOW,
  error: RED,
  info: GREEN
}

const APP_NAME = `scada`
const APP_COLOR = `#0f6a3e`

// console.log('process.env', process.env)
// API_PATH: "/api"
// API_URL: "https://scada.hanl.in"
// APP_URL: "http://localhost:8082/"
// CLIENT: true
// COMMITHASH: "678fc62b70809f8491313ec2287b8cc0e5e9a7e1"
// DEBUG: undefined
// DEV: true
// MODE: "pwa"
// NODE_ENV: "development"
// PROD: false
// RECAPTCHA_SITE_KEY: "6Ld-B5gUAAAAAHoWL_mkm6GrLYYWYRD-V2Gz0Efm"
// SERVER: false
// SERVICE_WORKER_FILE: "/service-worker.js"
// VAPID_PUBLIC: "BPe6higsMHXyoApAVpcrBWP4HWJf-c4oMg1iKJwtSazKSHqGQ7IrvWUwrVnOq5EHhYcCwOjlpWl3go8vZauMsSk"
// VERSION: "678fc62"
// VUE_ROUTER_BASE: "/"
// VUE_ROUTER_MODE: "history"

class Logger {
  constructor (prefix) {
    this.prefix = prefix
    Object.keys(levelToColor).forEach(level => {
      this[level] = (...args) => {
        if (process.env.NODE_ENV !== `development`) {
          return
        }
        this._print(
          this.prefix || args[0],
          level,
          this.prefix ? args : args.slice(1),
          levelToColor[level]
        )
      }
    })
  }
  _print (prefix, level, logArgs, levelColor) {
    const logPrefix = [
      `%c${APP_NAME}` + `%c${prefix}`,
      `background: ${APP_COLOR}; color: white; padding: 2px 0.5em; border-radius: 0.5em 0em 0em 0.5em;`,
      `background: ${levelColor}; color: white; padding: 2px 0.5em; border-radius: 0em 0.5em 0.5em 0em;`
    ]
    // eslint-disable-next-line no-console
    console[level](...logPrefix, ...logArgs)
  }
}
export default Logger

const PINK = `#fe8682`
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

const PREFIX = 'scada'

// console.log('process.env', process.env)
// API_PATH: "/socket.io"
// API_URL: "http://localhost:8681"
// APP_URL: "http://localhost:8080/"
// CLIENT: true
// DEBUG: undefined
// DEV: true
// MODE: "pwa"
// NODE_ENV: "development"
// PROD: false
// SERVER: false
// SERVICE_WORKER_FILE: "/service-worker.js"
// VUE_ROUTER_BASE: "/"
// VUE_ROUTER_MODE: "history"

class Logger {
  constructor (prefix) {
    this.prefix = prefix
    Object.keys(levelToColor).forEach(level => {
      this[level] = (...args) => {
        if (process.env.NODE_ENV === 'production' || !process.env.DEBUG) {
          return
        }
        this._print(level, args, levelToColor[level])
      }
    })
  }
  _print (level, logArgs, levelColor) {
    const logPrefix = [
      `%c${PREFIX}` + `%c${this.prefix}`,
      `background: ${PINK}; color: white; padding: 2px 0.5em; border-radius: 0.5em 0em 0em 0.5em;`,
      `background: ${levelColor}; color: white; padding: 2px 0.5em; border-radius: 0em 0.5em 0.5em 0em;`
    ]
    console[level](...logPrefix, ...logArgs)
  }
}
export default Logger

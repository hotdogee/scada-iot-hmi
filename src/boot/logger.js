import Logger from 'assets/logger'
const logger = new Logger()

const levels = ['debug', 'log', 'warn', 'error', 'info']
export default ({ app, store, router, Vue }) => {
  levels.forEach(level => {
    Vue.prototype['$' + level] = function (...msg) {
      const prefix = this.$options.__file
        ? this.$options.__file.replace(/^src\/|\.vue$/gi, '').replace(/\//gi, '.')
        : this.$options.name || this.$vnode.tag
      logger[level](prefix || 'component', ...msg)
    }
  })
}

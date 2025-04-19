import { defineBoot } from '#q-app/wrappers'
import Logger from '../assets/logger'
const logger = new Logger()
const levels = ['debug', 'log', 'warn', 'error', 'info']
export const loggers: Record<string, (...msg: unknown[]) => void> = {}
export default defineBoot(({ app }) => {
  levels.forEach((level) => {
    app.config.globalProperties['$' + level] = function (...msg: unknown[]) {
      const prefix = app._component.__file
        ? app._component.__file.replace(/^.*[\\/]/, '').replace(/\.[^/.]+$/, '')
        : app._component.__name
      logger[level as keyof typeof logger](prefix || 'component', ...msg)
    }
    loggers[level] = app.config.globalProperties['$' + level]
  })
})

// Export all loggers individually
// export const { debug, log, warn, error, info } = loggers

import { Workbox } from 'workbox-window'
import Logger from 'assets/logger'
const logger = new Logger('ServiceWorker.Client')

;(async () => {
  if ('serviceWorker' in navigator) {
    // defined in quasar/app/lib/quasar-config.js
    const wb = new Workbox(process.env.SERVICE_WORKER_FILE)

    wb.addEventListener('installed', event => {
      logger.info('installed1', event)
    })

    wb.addEventListener('waiting', event => {
      logger.info('waiting1', event)
    })

    wb.addEventListener('redundant', event => {
      logger.info('redundant1', event)
    })

    wb.addEventListener('controlling', event => {
      logger.info('controlling1', event)
    })

    wb.addEventListener('activated', event => {
      logger.info('activated1', event)
    })

    wb.addEventListener('externalinstalled', event => {
      logger.info('externalinstalled1', event)
    })

    wb.addEventListener('externalwaiting', event => {
      logger.info('externalwaiting1', event)
    })

    wb.addEventListener('externalactivated', event => {
      logger.info('externalactivated1', event)
    })

    wb.addEventListener('message', event => {
      logger.info('message1', event)
    })

    wb.register()
    const swVersion = await wb.messageSW({ type: 'GET_VERSION' })
    logger.info('Service Worker version:', swVersion)
  }
})()

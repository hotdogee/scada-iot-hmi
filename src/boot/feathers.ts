import { defineBoot } from '#q-app/wrappers'
import { feathers } from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'
import Logger from 'assets/logger'
import { io } from 'socket.io-client'
// import { useLogsStore } from '../stores/logs'
import { useLogsDemoStore } from '../stores/logs-demo'
const logger = new Logger('boot.feathers')

// Setup the Feathers client
const socket = io(process.env.API_URL, {
  path: process.env.API_PATH + '/socket.io/',
  // throw errors if the server doesn't respond in time
  ackTimeout: 5000,
  // manually connect after the connect listener is registered
  autoConnect: false
})
const client = feathers()
// Set up Socket.io client with the socket
client.configure(socketio(socket))

const logs = client.service('logs')
const images = client.service('images')

export default defineBoot(({ app, store }) => {
  app.config.globalProperties.$client = client
  app.config.globalProperties.$logs = logs
  app.config.globalProperties.$images = images
  socket.on('connect', async () => {
    const logsStore = useLogsDemoStore(store)
    logger.info(`socket connected`, logsStore)
    // await logsStore.setupRealtimeUpdates()
    logsStore.setupRealtimeUpdates()
    await logsStore.findStartDateTime()
  })
  socket.connect()
  socket.on('disconnect', () => {
    logger.info(`disconnect`)
  })
})

export { client, images, logs, socket }

import { defineBoot } from '#q-app/wrappers'
import { feathers } from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'
import { io } from 'socket.io-client'

// Setup the Feathers client
const socket = io(process.env.API_URL, {
  path: process.env.API_PATH + '/socket.io/',
  // throw errors if the server doesn't respond in time
  ackTimeout: 5000
})
const client = feathers()
// Set up Socket.io client with the socket
client.configure(socketio(socket))

const logs = client.service('logs')
const images = client.service('images')

export default defineBoot(({ app }) => {
  app.config.globalProperties.$client = client
  app.config.globalProperties.$logs = logs
  app.config.globalProperties.$images = images
})

export { client, images, logs }

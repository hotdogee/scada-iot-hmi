import io from 'socket.io-client'
import socketio from 'feathers-socketio/client'
import feathers from 'feathers/client'

// let apiUrl = 'http://localhost:8081'
let apiUrl = 'https://scada.hanl.in/api/'
let path = '/api/'
if (process.env.NODE_ENV == 'production') {
  apiUrl = 'https://scada.hanl.in/api/'
  path = '/api/'
}
export const url = apiUrl

export const socket = io(url, { path: path })

const api = feathers().configure(socketio(socket, { timeout: 10000 }))

export default api

export const logs = api.service('logs')

global.socket = socket

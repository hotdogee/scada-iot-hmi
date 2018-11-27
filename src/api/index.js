import io from 'socket.io-client'
import socketio from 'feathers-socketio/client'
import feathers from 'feathers/client'

// let apiUrl = 'http://localhost:8081'
let restUrl = 'https://scada.hanl.in/api'
let socketUrl = 'https://scada.hanl.in'
let path = '/api/socket.io'
if (process.env.NODE_ENV === 'production') {
  restUrl = 'https://scada.hanl.in/api'
  socketUrl = 'https://scada.hanl.in'
  path = '/api/socket.io'
}
export const url = restUrl

export const socket = io(socketUrl, { path: path })

const api = feathers().configure(socketio(socket, { timeout: 10000 }))

export default api

export const logs = api.service('logs')

global.socket = socket

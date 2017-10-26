import io from 'socket.io-client'
import socketio from 'feathers-socketio/client'
import feathers from 'feathers/client'

export const url = 'http://localhost:8081'

export const socket = io(url)

const api = feathers().configure(socketio(socket, { timeout: 10000 }))

export default api

export const logs = api.service('logs')

global.socket = socket

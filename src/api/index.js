import io from 'socket.io-client'
import socketio from 'feathers-socketio/client'
import feathers from 'feathers/client'

export const url = 'http://api.scada.hanl.in'

export const socket = io(url)

const api = feathers().configure(socketio(socket))

export default api

export const logs = api.service('logs')

global.socket = socket

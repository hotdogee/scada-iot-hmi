import feathers from 'feathers/client'
import socketio from 'feathers-socketio/client'
import io from 'socket.io-client'

const socket = io('http://api.scada.hanl.in')

export const supervisor = feathers()
  .configure(socketio(socket))

export const logs = supervisor.service('logs')

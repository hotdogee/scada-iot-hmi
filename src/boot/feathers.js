import io from 'socket.io-client'
// import feathers from '@feathersjs/feathers'
// import socketio from '@feathersjs/socketio-client'
import feathers from 'feathers/client'
import socketio from 'feathers-socketio/client'
// import auth, { AuthenticationClient } from '@feathersjs/authentication-client'
import Logger from 'assets/logger'
const logger = new Logger('boot.feathers')

const setupApiEvents = socket => {
  const app = feathers()
  app.on('connection', connection => {
    // 4.0
    logger.info(`connection`, app, connection)
  })
  app.on('disconnect', connection => {
    logger.error(`disconnect`, app, connection)
  })
  app.on('login', (authResult, params, context) => {
    logger.info(`login`, authResult, params, context)
  })
  app.on('logout', (authResult, params, context) => {
    logger.warn(`logout`, authResult, params, context)
  })
  app.configure(socketio(socket, { timeout: 10000 }))
  // app.configure(
  //   auth({
  //     header: 'Authorization',
  //     scheme: 'Bearer',
  //     storageKey: 'feathers-jwt',
  //     locationKey: 'access_token',
  //     locationErrorKey: 'error',
  //     jwtStrategy: 'jwt',
  //     path: '/authentication',
  //     Authentication: AuthenticationClient,
  //     storage: window.localStorage
  //   })
  // )
  return app
}
// leave the export, even if you don't use it
export default ({ app, store, router, Vue }) => {
  const socket = io(process.env.API_URL, {
    path: process.env.API_PATH + '/socket.io'
  })
  const feathersClient = {
    api: setupApiEvents(socket)
  }
  socket.on('connect', async () => {
    // 2.0
    logger.info(`connect`, app)
    await store.dispatch('logs/setupRealtimeUpdates')
    store.dispatch('logs/findStart')
  })
  socket.on('disconnect', () => {
    // 2.0
    logger.info(`disconnect`, app)
  })

  // logger.debug(`accessToken`, feathersClient.api.get('accessToken'))
  // if (feathersClient.api.get('accessToken')) {
  //   feathersClient.api.authenticate()
  // }
  // document.getElementById('q-app').__vue__.$feathers.api.get('accessToken')
  // feathersClient.api.mixins.push(function (service) {
  //   service.hooks({
  //     error: async context => {
  //       logger.debug(`context error`, context.error)
  //       // logger.debug(
  //       //   `context`,
  //       //   context
  //       // )
  //       // NotAuthenticated{type: "FeathersError", name: "NotAuthenticated", message: "No auth token", code: 401, className: "not-authenticated"}
  //       // await store.dispatch('user/refreshToken')
  //       if (store.getters['user/isSignedIn'] && context.error.name === 'NotAuthenticated') {
  //         // refresh
  //         logger.debug(`dispatch user/refreshToken`)
  //         await store.dispatch('user/refreshToken')
  //       }
  //       // context.service[context.method](...context.arguments)
  //       return context
  //     }
  //   })
  // })
  store.restored.auth = store.restored.then(async () => {
    // window.a = new errors.NotAuthenticated(`Could not find stored JWT and no authentication strategy was given`)
    // check oauth token in window.location
    let accessToken
    try {
      accessToken = await feathersClient.api.authentication.getFromLocation(window.location)
      if (window.location.href[window.location.href.length - 1] === '#' && 'pushState' in history) {
        // logger.debug(`remove hash`, window.location.hash)
        history.pushState('', document.title, window.location.pathname + window.location.search)
      }
    } catch (error) {
      logger.error(`getFromLocation`, error)
    }
    // user was signed in (has existing key pair)
    if (accessToken && !store.getters['user/isSignedIn']) {
      // CASE 1: oauth sign in
      // restore public-keys accessToken
      // register key pair using special oauth jwt
      // refreshToken
      // sync user after auth
      logger.info(`oauth sign in: `, accessToken)
      try {
        const result = await feathersClient.api.authenticate({
          strategy: 'jwt',
          accessToken
        })
        logger.info(`public-keys accessToken`, result)
        // {
        //   "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6ImFjY2VzcyJ9.eyJpYXQiOjE1NjE4MzA0MDksImV4cCI6MTU2MTgzMjIwOSwiYXVkIjoicHVibGljLWtleXMiLCJpc3MiOiJpbmZhbnMuaW8iLCJzdWIiOiI1ZDE2NmIwNmFkYTBjMzAwNGUyZjIzMTkiLCJqdGkiOiJjNWM4NDFkNi01ZTcxLTRmOWMtYjRhZi0yMDlmMzMwYmViZTAifQ.KrUS1VpS7r4pAPVjNRxR0dtLD8c73zodnXV0e8AcJsk",
        //   "authentication": {
        //     "strategy": "jwt",
        //     "payload": {
        //       "iat": 1561830409,
        //       "exp": 1561832209,
        //       "aud": "public-keys",
        //       "iss": "infans.io",
        //       "sub": "5d166b06ada0c3004e2f2319",
        //       "jti": "c5c841d6-5e71-4f9c-b4af-209f330bebe0"
        //     }
        //   },
        //   "user": {
        //     "_id": "5d166b06ada0c3004e2f2319",
        //     "accounts": [
        //       {
        //         "type": "google",
        //         "value": "108576876073520472460",
        //         "sub": "108576876073520472460",
        //         "name": "Han Lin",
        //         "given_name": "Han",
        //         "family_name": "Lin",
        //         "picture": "https://lh6.googleusercontent.com/-Gz9NEs3yqRo/AAAAAAAAAAI/AAAAAAABR-g/irmjLqHJlKU/photo.jpg",
        //         "email": "hotdogee@gmail.com",
        //         "email_verified": true,
        //         "locale": "zh-TW"
        //       }
        //     ],
        //     "accountSelected": 0,
        //     "authorizationSelected": 0,
        //     "created": "2019-06-28T19:31:18.430Z",
        //     "updated": "2019-06-29T17:46:49.687Z",
        //     "_include": [
        //       "authorizations"
        //     ],
        //     "authorizations": []
        //   }
        // }
        store.commit('user/setUser', { user: result.user })
        store.dispatch('user/oauthSignIn', { user: result.user })
      } catch (error) {
        logger.error(`public-keys accessToken`, error)
      }
    } else if (store.getters['user/isSignedIn']) {
      // CASE 2: add oauth account to existing user
      // restore api accessToken
      // sync user after auth
      // CASE 3: user was signed in (has existing key pair)
      // restore api accessToken
      // sync user after auth
      try {
        const result = await feathersClient.api.authenticate()
        store.commit('user/setUser', { user: result.user })
        logger.info(`api accessToken`, result)
      } catch (error) {
        logger.error(`api accessToken`, error)
        if (error.name === 'NotAuthenticated') {
          // refresh
          logger.debug(`dispatch user/refreshToken`)
          await store.dispatch('user/refreshToken')
        }
      }
    }
  })
  // app.mixins = app.mixins || []
  // app.mixins.push({
  //   beforeCreate () {
  //     this.$store.watch(
  //       state => {
  //         return state.user.accessToken
  //       },
  //       async (accessToken, old) => {
  //         // setup auth
  //         // feathersClient.api.set('accessToken', accessToken)
  //         if (old) return
  //         logger.debug(
  //           `watch accessToken`,
  //           accessToken,
  //           old,
  //           feathersClient.api.get('accessToken')
  //         )
  //       }
  //     )
  //   }
  // })
  store.$feathers = feathersClient
  Vue.prototype.$feathers = feathersClient
}

import { Workbox } from 'workbox-window'
import Logger from 'assets/logger'
const logger = new Logger('boot.workbox')

// function urlB64ToUint8Array (base64String) {
//   const padding = '='.repeat((4 - base64String.length % 4) % 4)
//   const base64 = (base64String + padding)
//     .replace(/\-/g, '+')
//     .replace(/_/g, '/')

//   const rawData = window.atob(base64)
//   const outputArray = new Uint8Array(rawData.length)

//   for (let i = 0; i < rawData.length; ++i) {
//     outputArray[i] = rawData.charCodeAt(i)
//   }
//   return outputArray
// }

export default async ({ app, router, store, Vue }) => {
  if ('serviceWorker' in navigator) {
    // if (!store._vm.$root.$data['vuexPersistStateRestored']) {
    //   // document.getElementById('q-app').__vue__.
    //   logger.info('vuexPersistStateRestored1')
    //   store._vm.$root.$on('vuexPersistStateRestored', () => {
    //     logger.info('vuexPersistStateRestored2')
    //   })
    // } else {
    //   logger.info('vuexPersistStateRestored3')
    // }
    // store.restored.then(() => {
    //   logger.info('vuexPersistStateRestored4')
    // })
    const wb = new Workbox(process.env.SERVICE_WORKER_FILE)

    wb.addEventListener('installed', event => {
      logger.info('installed2', event)
      store.commit('system/setStatus', { sw: event.type })
    })

    wb.addEventListener('waiting', event => {
      logger.info('waiting2', event)
      store.commit('system/setStatus', { sw: event.type })
    })

    wb.addEventListener('redundant', event => {
      logger.info('redundant2', event)
      store.commit('system/setStatus', { sw: event.type })
      window.location.reload()
    })

    wb.addEventListener('controlling', event => {
      logger.info('controlling2', event)
      store.commit('system/setStatus', { sw: event.type })
      window.location.reload()
    })

    wb.addEventListener('activated', event => {
      logger.info('activated2', event)
      store.commit('system/setStatus', { sw: event.type })
    })

    wb.addEventListener('externalinstalled', event => {
      logger.info('externalinstalled2', event)
      store.commit('system/setStatus', { sw: event.type })
    })

    wb.addEventListener('externalwaiting', event => {
      logger.info('externalwaiting2', event)
      store.commit('system/setStatus', { sw: event.type })
    })

    wb.addEventListener('externalactivated', event => {
      logger.info('externalactivated2', event)
      store.commit('system/setStatus', { sw: event.type })
    })

    wb.addEventListener('message', event => {
      logger.info('message2', event)
      store.commit('system/setStatus', { sw: event.type })
    })

    wb.messageSW({ type: 'GET_VERSION' }).then(swVersion => {
      logger.info('Version2:', swVersion)
      store.commit('system/setVersion', {
        sw: swVersion,
        ui: process.env.VERSION
      })
    })

    // if ('serviceWorker' in navigator && 'PushManager' in window)
    // const serviceWorkContainer = navigator.serviceWorker
    // const serviceWorkerRegistration = await navigator.serviceWorker.getRegistration()
    // const pushManager = (await navigator.serviceWorker.getRegistration()).pushManager
    // const subscription = await (await navigator.serviceWorker.getRegistration()).pushManager.getSubscription()
    // const permissionState = await (await navigator.serviceWorker.getRegistration()).pushManager.permissionState({userVisibleOnly:true})
    // await (await navigator.serviceWorker.getRegistration()).pushManager.subscribe({userVisibleOnly:true, applicationServerKey: urlB64ToUint8Array('BCW6JPG-T7Jx0bYKMhAbL6j3DL3VTTib7dwvBjQC_496a12auzzKFnjgFjCsys_YtWkeMLhogfSlyM0CaIktx8o')})
    // endpoint: "https://fcm.googleapis.com/fcm/send/cx1S869ZR-I:APA91bEGet_PzPs9wXBkhepJKmSxJQ9w7rS_9S6HeWIMo7mh6S27kNZmo80ZpPQ_UfhqWF7aQpMslGdz9huc6SsBfJRsVXtmZU0g5Umqw-xPJIDPs5WpcTjzsNNOG91YD8-ISRPt8g-V"
    //   expirationTime: null
    //   options: PushSubscriptionOptions
    //   applicationServerKey: ArrayBuffer(65) {}
    //   userVisibleOnly: true
    // }
    // (await (await navigator.serviceWorker.getRegistration()).pushManager.getSubscription()).toJSON()
    // {
    //   endpoint: "https://fcm.googleapis.com/fcm/send/e_rgmF1eE1c:APA91bFTiRvUF_Wd6SmArwnxI-PJl0wr09541zDKWikCfy21mISB2C2LNeaf1CV7TUxBdnulRXtnKaWTREklXaS2LzkaxqAxjEDeU8apnUr95BAjQtL_WwZnwJUb8_cBJ4ZOh75pqquL"
    //   expirationTime: null
    //   keys: {
    //     auth: "H29grnF6eMB9AUHNi6aY6Q"
    //     p256dh: "BL5NlPvgUX2VbNFHwrd1BYqCd4TQfK5D-6ex2T_DKbue3MUjs5ldufuV9JhNP98Q4YSiNcWy2Mp-fvhdiLbtb6Y"
    //   }
    // }
    const reg = await wb.register()
    wb.getSW().then(async w => {
      // installing, installed, activating, activated, or redundant.
      logger.info('State2:', w.state)
      let state = w.state
      if (reg.waiting) {
        state = 'waiting'
      }
      store.commit('system/setStatus', { sw: state })
      w.addEventListener('statechange', e => {
        logger.info('State2:', e.target.state)
      })

      // Notifications
      if ('Notification' in window) {
        const permission = Notification.permission
        logger.info('Notifications permission:', permission)
        store.commit('system/setStatus', { push: permission })
      }

      // Permissions
      if ('permissions' in navigator) {
        ;(await navigator.permissions.query({
          name: 'notifications'
        })).onchange = async function (e) {
          logger.info('Notifications permission:', this.state, e)
          store.commit('system/setStatus', { push: this.state })
          if ('PushManager' in window) {
            const subscription = await reg.pushManager.getSubscription()
            logger.info('onchange getSubscription:', subscription)
            // update server with current subscription
            store.restored.auth.then(() => {
              if (!store.getters['user/isSignedIn']) return
              store.dispatch('notifications/updateSubscription', {
                subscription
              })
            })
          }
        }
      }

      // PushManager
      if ('PushManager' in window) {
        addEventListener('pushsubscriptionchange', event => {
          console.log(event)
        })
        const subscription = await reg.pushManager.getSubscription()
        logger.info('onload getSubscription:', subscription)
        // update server with current subscription
        store.restored.auth.then(() => {
          if (!store.getters['user/isSignedIn']) return
          store.dispatch('notifications/updateSubscription', {
            subscription
          })
        })
      }
    })
    window.addEventListener('beforeunload', function (e) {
      if (store.state.system.status.sw === 'waiting') {
        wb.messageSW({ type: 'RELOAD' })
      }
    })
  }
  // app.mixins = app.mixins || []
  // app.mixins.push({
  //   beforeCreate () {
  //     // load default
  //     document.documentElement.style['font-size'] = `114%`
  //     this.$store.watch(
  //       state => {
  //         return state.localSettings.fontSize
  //       },
  //       (fontSize, old) => {
  //         logger.log(`fontSize changed: ${old} -> ${fontSize}`)
  //         logger.debug(document.documentElement)
  //         document.documentElement.style['font-size'] = `${fontSize}%`
  //       }
  //     )
  //   }
  // })
}

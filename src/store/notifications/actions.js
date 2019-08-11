/*
export async function someAction (
  { commit, dispatch, state, getters, rootState, rootGetters },
  payload
) {
}
*/
import { Workbox } from 'workbox-window'
import Logger from 'assets/logger'
const logger = new Logger('notifications.actions')

function urlB64ToUint8Array (base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export async function requestPermission (
  { commit, dispatch, state, getters, rootState, rootGetters },
  payload
) {
  try {
    if ('Notification' in window) {
      return new Promise(function (resolve, reject) {
        const permissionResult = window.Notification.requestPermission(function (result) {
          resolve(result)
        })
        if (permissionResult) {
          permissionResult.then(resolve, reject)
        }
      }).then(function (permissionResult) {
        if (permissionResult !== 'granted') {
          throw new Error("We weren't granted permission.")
        }
        dispatch('setPermission', permissionResult)
      })
    }
  } catch (error) {
    logger.error('requestPermission:', error)
  }
}

export async function updateSubscription (
  { commit, dispatch, state, getters, rootState, rootGetters },
  payload = { subscription: null, _id: null }
) {
  try {
    // if (
    //   !('serviceWorker' in navigator &&
    //   'PushManager' in window &&
    //   'Notification' in window)
    // ) {
    //   throw new Error('This device does not support the push notifcations feature')
    // }
    // if (!rootGetters['user/isSignedIn']) {
    //   throw new Error('Sign in to receive push notifcations')
    // }
    // if (!rootState.user.publicKey) {
    //   throw new Error('No public key')
    // }
    // if (!rootState.user.user._id) {
    //   throw new Error('No user id')
    // }
    // if (!process.env.SERVICE_WORKER_FILE) {
    //   // defined in quasar/app/lib/quasar-config.js
    //   throw new Error('No service-worker.js')
    // }
    let subscription = payload.subscription
    if (subscription && subscription.toJSON) {
      subscription = subscription.toJSON()
    }
    await this.restored
    commit('setSubscription', { subscription })
    // sub = PushSubscription
    // this = Store
    // logger.debug('Subscription:', sub, this)
    // get user
    // build data
    // document.getElementById('q-app').__vue__.$store.$feathers.api.service('notification-subscriptions')
    // document.getElementById('q-app').__vue__.$store.$feathers.api.service('notifications').create({})
    // const { get, create, patch } = this.$feathers.api.service('notification-subscriptions')
    const _id = payload._id || rootState.user.publicKey
    const service = this.$feathers.api.service('notification-subscriptions')
    if (!subscription) {
      try {
        const result = await service.remove(_id)
        logger.info('notification-subscriptions remove:', result)
      } catch (error) {
        logger.info('notification-subscriptions remove: nothing to remove')
      }
    } else {
      try {
        const sub = await service.get(_id)
        if (JSON.stringify(sub.subscription) === JSON.stringify(subscription)) {
          logger.info('notification-subscriptions get:', sub)
          return
        }
      } catch (error) {
        // logger.error('notification-subscriptions get', error)
        const data = {
          _id,
          userId: rootState.user.user._id,
          subscription
        }
        const result = await service.create(data)
        logger.info('notification-subscriptions create:', result)
        return
      }
      const result = await service.patch(_id, { subscription })
      logger.info('notification-subscriptions patch:', result)
    }
  } catch (error) {
    logger.error('updateSubscription', error)
    await this.restored
    commit('setSubscription', { subscription: null })
  }
}

export async function notify (
  { commit, dispatch, state, getters, rootState, rootGetters },
  payload = {}
) {
  try {
    const service = this.$feathers.api.service('notifications')
    const data = {}
    const result = await service.create(data)
    logger.info('notifications create:', result)
  } catch (error) {
    logger.error('notify', error)
  }
}

export async function subscribe (
  { commit, dispatch, state, getters, rootState, rootGetters },
  payload
) {
  try {
    if (!('serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window)) {
      throw new Error('This device does not support the push notifcations feature')
    }
    if (!rootGetters['user/isSignedIn']) {
      throw new Error('Sign in to receive push notifcations')
    }
    if (!rootState.user.publicKey) {
      throw new Error('No public key')
    }
    if (!rootState.user.user._id) {
      throw new Error('No user id')
    }
    if (!process.env.SERVICE_WORKER_FILE) {
      // defined in quasar/app/lib/quasar-config.js
      throw new Error('No service-worker.js')
    }
    const wb = new Workbox(process.env.SERVICE_WORKER_FILE)
    const reg = await wb.register()
    const subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlB64ToUint8Array(process.env.VAPID_PUBLIC)
    })
    if (!subscription) {
      throw new Error('Push subscription failed')
    }
    dispatch('updateSubscription', { subscription })
  } catch (error) {
    logger.error('subscribe', error)
    await this.restored
    commit('setSubscription', { subscription: null })
  }
}

export async function unsubscribe (
  { commit, dispatch, state, getters, rootState, rootGetters },
  payload = { _id: null }
) {
  try {
    if (!('serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window)) {
      throw new Error('This device does not support the push notifcations feature')
    }
    const wb = new Workbox(process.env.SERVICE_WORKER_FILE)
    const reg = await wb.register()
    const sub = await reg.pushManager.getSubscription()
    // logger.debug('Subscription:', sub, this)
    if (sub) {
      const successful = await sub.unsubscribe()
      logger.debug('unsubscribe:', successful, sub)
      await this.restored
      commit('setSubscription', { subscription: null })
    }
    const _id = payload._id || rootState.user.publicKey
    if (_id) {
      await dispatch('updateSubscription', { subscription: null, _id })
    }
  } catch (error) {
    logger.error('unsubscribe:', error)
  }
}

export async function signOut (
  { commit, dispatch, state, getters, rootState, rootGetters },
  payload = { auth: {} }
) {
  logger.debug('signOut:', payload)
  try {
    await dispatch('unsubscribe', { _id: payload.auth.publicKey })
  } catch (error) {
    logger.error('signOut:', error)
  }
}

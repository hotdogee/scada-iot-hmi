/* eslint-env serviceworker */
/* global workbox */
// import { precacheAndRoute } from 'workbox-precaching/precacheAndRoute.mjs'
// import { setCacheNameDetails } from 'workbox-core/setCacheNameDetails.mjs'

const SW_VERSION = process.env.VERSION

workbox.core.setCacheNameDetails({
  prefix: 'scada',
  suffix: SW_VERSION
})

// Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
workbox.routing.registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'google-fonts-stylesheets'
  })
)

// Cache the underlying font files with a cache-first strategy for 1 year.
workbox.routing.registerRoute(
  /^https:\/\/fonts\.gstatic\.com/,
  new workbox.strategies.CacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 30
      })
    ]
  })
)
// workbox.precaching.cleanupOutdatedCaches()
self.addEventListener('activate', async event => {
  console.log('Service Worker: Activating....')
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(key => {
          if (!key.endsWith(SW_VERSION)) {
            console.log('Service Worker: Removing Old Cache', key)
            return caches.delete(key)
          }
        })
      )
    })
  )
})

self.__precacheManifest = [].concat(self.__precacheManifest || [])
workbox.precaching.precacheAndRoute(self.__precacheManifest, {})

workbox.routing.registerRoute(
  /^http/,
  new workbox.strategies.NetworkFirst({
    fetchOptions: {
      credentials: 'same-origin'
    }
  }),
  'GET'
)

// console.log(`SW: ${JSON.stringify(workbox)}`)
console.log(`test1`)
console.log(`SW_VERSION: ${SW_VERSION}`)
self.addEventListener('message', async event => {
  console.log('Service Worker: message received.', event)
  if (!event.data) return
  if (event.data.type === 'GET_VERSION') {
    // https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent/ports
    event.ports[0].postMessage(SW_VERSION)
  } else if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  } else if (event.data.type === 'RELOAD') {
    console.log(`Service Worker: RELOAD`)
    if (self.clients && (await self.clients.matchAll()).length < 2) {
      console.log(`Service Worker: RELOAD: skipWaiting`)
      self.skipWaiting()
    }
  }
})

self.addEventListener('push', event => {
  console.log('Service Worker: push received.', event)
  event.waitUntil(pushSW(event))
})

async function pushSW (event) {
  // Parse the notification received as a JSON object
  const data = event.data.json()
  console.log('Service Worker: push received.', data)

  // Show the notification
  return self.registration.showNotification(data.notification.title, {
    body: data.notification.body,
    icon: '/statics/icons/icon-192x192.png',
    badge: '/statics/icons/icon-192x192.png',
    requireInteraction: true,
    color: '#333333', // doesn't work
    vibrate: [300, 100, 400],
    actions: []
  })
}

self.addEventListener('notificationclick', event => {
  const clickedNotification = event.notification
  clickedNotification.close()
  const promiseChain = clients.openWindow('https://scada.hanl.in')
  event.waitUntil(promiseChain)
})

// //Web Push Notifications//
// let click_open_url
// self.addEventListener('push', function(event) {
//   let push_message = event.data.json()
//   // push notification can send event.data.json() as well
//   click_open_url = push_message.notification.data.url
//   const options = {
//     body: push_message.notification.body,
//     icon: push_message.notification.icon,
//     image: push_message.notification.image,
//     tag: 'alert'
//   };
//   event.waitUntil(self.registration.showNotification(push_message.notification.title, options));
// });

// self.addEventListener('notificationclick', function(event) {
//   const clickedNotification = event.notification;
//   clickedNotification.close();
//   if ( click_open_url ){
//     const promiseChain = clients.openWindow(click_open_url);
//     event.waitUntil(promiseChain);
//   }
// });

// Permissions API: not supported in Safari
// navigator.permissions.query({name: 'notifications'}).then(function(permission) {
//   // Initial status is available at permission.state

//   permission.onchange = function() {
//     // Whenever there's a change, updated status is available at this.state
//   };
// });
self.addEventListener('pushsubscriptionchange', event => {
  // can't get this to trigger on chrome
  console.log('Service Worker: pushsubscriptionchange received.', event)
  // event.waitUntil(swRegistration.pushManager.subscribe(event.oldSubscription.options)
  //   .then(subscription => {
  //     return fetch('register', {
  //       method: 'post',
  //       headers: {
  //         'Content-type': 'application/json'
  //       },
  //       body: JSON.stringify({
  //         endpoint: subscription.endpoint
  //       })
  //     })
  //   })
  // )
})

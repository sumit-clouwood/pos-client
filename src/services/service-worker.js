// custom service-worker.js
/* global workbox*/
/* eslint-disable no-console */

if (workbox) {
  console.log('workbox found ')
  // adjust log level for displaying workbox logs
  workbox.core.setLogLevel(workbox.core.LOG_LEVELS.debug)

  // apply precaching. In the built version, the precacheManifest will
  // be imported using importScripts (as is workbox itself) and we can
  // precache this. This is all we need for precaching
  workbox.precaching.precacheAndRoute(self.__precacheManifest)

  // Make sure to return a specific response for all navigation requests.
  // Since we have a SPA here, this should be index.html always.
  // https://stackoverflow.com/questions/49963982/vue-router-history-mode-with-pwa-in-offline-mode
  workbox.routing.registerNavigationRoute('/index.html')

  //create a quue rather
  const ordersQueue = new workbox.backgroundSync.Queue('ordersQueue')
  console.log('queue created', ordersQueue)

  self.addEventListener('fetch', event => {
    if (event.request.url.match(/SaveOrder/g)) {
      console.log('Save order called')
      console.log('fetch event called')
      console.log(event)
    }
    // Clone the request to ensure it's save to read when
    // adding to the Queue.
    const promiseChain = fetch(event.request.clone()).catch(err => {
      console.log('Pushing request to queue')
      console.log('error', err)
      return ordersQueue.addRequest(event.request, err)
    })
    console.log('wait for promise ')
    event.waitUntil(promiseChain)
    //}
  })

  self.addEventListener('sync', event => {
    console.log('sync event received', event)
  })

  workbox.routing.registerRoute(
    /\.(?:png|gif|jpg|jpeg|svg)$/,
    workbox.strategies.staleWhileRevalidate({
      cacheName: 'images',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
      ],
    })
  )

  // Setup cache strategy for Google Fonts. They consist of two parts, a static one
  // coming from fonts.gstatic.com (strategy CacheFirst) and a more ferquently updated on
  // from fonts.googleapis.com. Hence, split in two registerroutes
  workbox.routing.registerRoute(
    /^https:\/\/fonts\.googleapis\.com/,
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'google-fonts-stylesheets',
    })
  )

  workbox.routing.registerRoute(
    /^https:\/\/fonts\.gstatic\.com/,
    new workbox.strategies.CacheFirst({
      cacheName: 'google-fonts-webfonts',
      plugins: [
        new workbox.cacheableResponse.Plugin({
          statuses: [0, 200],
        }),
        new workbox.expiration.Plugin({
          maxAgeSeconds: 60 * 60 * 24 * 365,
          maxEntries: 30,
        }),
      ],
    })
  )

  workbox.routing.registerRoute(
    /^https:\/\/stackpath\.bootstrapcdn\.com/,
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'fontawesome',
    })
  )

  //background sync
  // const bgSyncPlugin = new workbox.backgroundSync.Plugin('myQueueName', {
  //   maxRetentionTime: 24 * 60, // Retry for max of 24 Hours
  // })

  // workbox.routing.registerRoute(
  //   ///\/api\/.*\/*.json/,
  //   /\/api\/auth\/order\/SaveOrder/,
  //   new workbox.strategies.NetworkOnly({
  //     plugins: [bgSyncPlugin],
  //   }),
  //   'POST'
  // )
}

// This code listens for the user's confirmation to update the app.
self.addEventListener('message', e => {
  if (!e.data) {
    return
  }

  switch (e.data) {
    case 'skipWaiting':
      self.skipWaiting()
      break
    default:
      // NOOP
      break
  }
})

// Listen to Push
self.addEventListener('push', e => {
  let data
  if (e.data) {
    data = e.data.json()
  }

  const options = {
    body: data.body,
    icon: '/img/icons/android-chrome-192x192.png',
    image: '/img/autumn-forest.png',
    vibrate: [300, 200, 300],
    badge: '/img/icons/plint-badge-96x96.png',
  }

  e.waitUntil(self.registration.showNotification(data.title, options))
})

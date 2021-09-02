// custom service-worker.js
/* global workbox */
/* eslint-disable no-console */
//---------------------------------------------------------------------------
//------------------- S E T U P - W O R K B O X  ------------
//---------------------------------------------------------------------------

// adjust log level for displaying workbox logs
//workbox.core.setLogLevel(workbox.core.LOG_LEVELS.debug)
workbox.setConfig({
  debug: true,
})

// Populate the cache to illustrate cache-only-populated-cache route
self.addEventListener('install', event => {
  console.log('service worker installed', event)
})

self.addEventListener('activate', function(event) {
  console.log('service worker activate', event)
  self.clients.claim()
})

// apply precaching. In the built version, the precacheManifest will
// be imported using importScripts (as is workbox itself) and we can
// precache this. This is all we need for precaching
workbox.precaching.precacheAndRoute(self.__precacheManifest)

// This immediately deploys the service worker w/o requiring a refresh
self.skipWaiting()

///******************************************************************************* */

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
//s3 bucket
workbox.routing.registerRoute(
  /\.amazonaws\.com/,
  new workbox.strategies.CacheFirst({
    cacheName: 'dimsphotos',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 90,
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

/******************************************************************** */
const ordersQueue = new workbox.backgroundSync.Queue('dimsOrders')

self.addEventListener('fetch', async event => {
  const request = event.request.clone()

  switch (event.request.method) {
    case 'GET':
      if (event.request.url.includes('/cached')) {
        const networkFirst = new workbox.strategies.NetworkFirst()
        event.respondWith(networkFirst.handle({ event, request }))
      } else if (event.request.url.includes('/api')) {
        const cacheFirst = new workbox.strategies.CacheFirst()
        event.respondWith(cacheFirst.handle({ event, request }))
      }
      break

    case 'POST':
      {
        const bgSyncLogic = async () => {
          try {
            // try live request
            const response = await fetch(event.request.clone())
            return response
          } catch (error) {
            //live request failed, try handler
            const clonedRequest = event.request.clone()
            const handler = await Factory.handler(clonedRequest)

            if (handler && handler.backgroundSync) {
              //if handler found handle it in your way
              return handler.backgroundSync()
            } else {
              //try changing the request and adding it to background queue
              let filteredRequest = event.request.clone()
              if (handler && handler.filterRequest) {
                filteredRequest = handler.filterRequest()
              }
              await ordersQueue.pushRequest({ request: filteredRequest })
              return error
            }
          }
        }

        event.respondWith(bgSyncLogic())
      }
      break
  }
})
/******************************************************************** */
//---------------------------------------------------------------------------
//------------------- S E T U P - A P P - L O G I C  ------------
//---------------------------------------------------------------------------
const Factory = {
  handler: async request => {
    const clonedReq = request.clone()
    const payload = await clonedReq.json()

    switch (payload.order_type) {
      case 'walk_in':
        return new Walkin(request, payload)
    }
  },
}

class Order {
  constructor(request, payload) {
    this.request = request
    this.payload = payload
  }

  filterPayload() {
    //don't modify original payload
    let payload = { ...this.payload }
    delete payload.user
    delete payload.orderTimeUTC
    payload.order_mode = 'offline'
    return payload
  }
}
class Walkin extends Order {
  filterRequest() {
    let payload = super.filterPayload()

    if (payload.referral) {
      payload.referral = ''
    }
    return new Request(this.request, {
      body: JSON.stringify(payload),
    })
  }
  response() {
    const time = +new Date()
    return Promise.resolve({
      status: 'ok',
      id: time,
      order_no: this.request.payload.real_created_datetime
        .toString()
        .replace(/[\s-:]/g, ''),
      token_number: 0,
      generate_time: time,
      flash_message: ' Order Added',
    })
  }
}

class Crm extends Order {
  //create customer and then use customer id for next request
  //make a request and push it to queue
}

// custom service-worker.js
/* global workbox */
/* eslint-disable no-console */
let syncInProcess = false
//---------------------------------------------------------------------------
//------------------- S E T U P - W O R K B O X  ------------
//---------------------------------------------------------------------------

// adjust log level for displaying workbox logs
//workbox.core.setLogLevel(workbox.core.LOG_LEVELS.debug)
workbox.setConfig({
  debug: false,
})

// Populate the cache to illustrate cache-only-populated-cache route
self.addEventListener('install', event => {
  console.log('service worker installed', event)
})

self.addEventListener('activate', function(event) {
  console.log('service worker activate', event)
  self.clients.claim()
  const promiseChain = caches.keys().then(cacheNames => {
    // Step through each cache name and delete it
    return Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)))
  })

  // Keep the service worker alive until all caches are deleted.
  event.waitUntil(promiseChain)
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
  /\.cloudfront\.net/,
  new workbox.strategies.CacheFirst({
    cacheName: 'awscontent',
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
const ordersQueue = new workbox.backgroundSync.Queue('dimsOrders', {
  onSync: async ({ queue }) => {
    if (syncInProcess) {
      console.log('sync already in process')
      return false
    }
    syncInProcess = true
    console.info('queue name: ', queue.name)

    //loop through all the entries and add failed ones to another queue
    let failedRequests = []

    let entry
    while ((entry = await queue.shiftRequest())) {
      try {
        let filteredRequest = entry.request.clone()
        const handler = await Factory.handler(filteredRequest)

        if (handler && handler.filterRequest) {
          try {
            filteredRequest = await handler.filterRequest()
          } catch (error) {
            failedRequests.push(entry)
            continue
          }
        }
        try {
          await Sync.fetchRequest(filteredRequest)
        } catch (error) {
          failedRequests.push(entry)
          continue
        }
      } catch (error) {
        console.error('Replay failed for request', entry.request, error)
        failedRequests.push(entry)
        continue
      }
    }
    console.log('Sync Done, Replay complete!')
    if (failedRequests.length) {
      console.log(failedRequests.length, ' requests failed')
      failedRequests.forEach(async entry => {
        await queue.unshiftRequest(entry)
      })
    }
    //break the cycle of sync events
    //if you manually sync each failed entry ll cause a new sync so it ll catch it in infinite loop
    //wait for failed requests to be added
    //wait for a minute so sync events for failed requests were fired
    setTimeout(() => {
      syncInProcess = false
    }, 1000 * 60)
  },
  //keep a request for 7 days
  maxRetentionTime: 60 * 24 * 7,
})

self.addEventListener('fetch', async event => {
  const request = event.request.clone()

  switch (event.request.method) {
    case 'GET':
      if (event.request.url.includes('/cached')) {
        const cacheFirst = new workbox.strategies.CacheFirst()
        event.respondWith(cacheFirst.handle({ event, request }))
      } else if (
        event.request.url.includes('/api') &&
        ![
          '/orders',
          '/reservations',
          '/customer',
          '/brand_customers',
        ].some(key => event.request.url.includes(key))
      ) {
        const networkFirst = new workbox.strategies.NetworkFirst()
        event.respondWith(networkFirst.handle({ event, request }))
      }
      break

    case 'POST':
      {
        const bgSyncLogic = async () => {
          //open database for operations
          DB.open(async () => {})
          try {
            const response = await fetch(event.request.clone())
            return response
          } catch (error) {
            console.log('adding request to queue ', event.request.clone())
            await ordersQueue.pushRequest({ request: event.request })
            let handler = await Factory.handler(event.request.clone())
            if (handler && handler.response) {
              const jsonResponse = await handler.response()
              return new Response(JSON.stringify(jsonResponse), {
                headers: { 'content-type': 'application/json' },
              })
            }
            return error
          }
        }

        event.respondWith(bgSyncLogic())
      }
      break
  }
})
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
      case 'call_center':
        return new Crm(request, payload)
    }
  },
}

class Order {
  constructor(request, payload) {
    this.request = request
    this.payload = payload
    console.log('payload ', this.payload)
  }

  filterPayload() {
    //don't modify original payload
    let payload = { ...this.payload }
    if (payload.orderTimeUTC) {
      delete payload.orderTimeUTC
    }
    payload.order_mode = 'offline'
    console.log('payload ', payload)
    return payload
  }
  filterRequest() {}
  backgroundSync() {}
  response() {
    const time = +new Date()
    return Promise.resolve({
      status: 'ok',
      id: time,
      order_no: this.payload.real_created_datetime
        .toString()
        .replace(/[\s-:]/g, ''),
      token_number: 0,
      generate_time: time,
      flash_message: ' Order Added',
    })
  }
}
class Walkin extends Order {
  async filterRequest() {
    let payload = this.filterPayload()

    if (payload.referral) {
      payload.referral = ''
    }
    return Promise.resolve(
      new Request(this.request, {
        body: JSON.stringify(payload),
      })
    )
  }
}

class Crm extends Order {
  //create customer and then use customer id for next request
  //make a request and push it to queue
  async filterRequest() {
    //either use this.request, get customer info, create customer and then use customer id to create order
    //or : use this.request, get customer info, create customer, embed customer id into request and add request to queue so it process again
    // I ll go with first for more control
    let payload = this.filterPayload()
    console.log('payload ', payload)
    if (!payload.customer) {
      //create customer
      let customerPayload = payload.user

      if (!payload.alternative_phone) customerPayload.alternative_phone = null
      if (!payload.gender) customerPayload.gender = 'undisclosed'
      if (!payload.customer_group) customerPayload.customer_group = null

      if (customerPayload.country) {
        delete customerPayload.country
      }
      if (customerPayload.city) {
        delete customerPayload.city
      }

      if (!customerPayload.building) {
        customerPayload.building = ''
      }
      if (!customerPayload.flat_number) {
        customerPayload.flat_number = ''
      }
      if (!customerPayload.nearest_landmark) {
        customerPayload.nearest_landmark = ''
      }
      if (!customerPayload.street) {
        customerPayload.street = ''
      }

      try {
        const customer = await this.createCustomer(customerPayload)
        payload.customer = customer.id
        //remember to remove user from the request as it was to serve only offline purpose
        delete payload.user

        return Promise.resolve(
          new Request(this.request, {
            body: JSON.stringify(payload),
          })
        )
      } catch (error) {
        //customer creation failed, revert request
        return Promise.reject(this.request)
      }
    } else {
      //customer was already created, they selected customer but suddenly interent goes off, so we have customer id with order
      //just return the request as it is
      //remember to remove user from the request as it was to serve only offline purpose
      delete payload.user
      return Promise.resolve(
        new Request(this.request, {
          body: JSON.stringify(payload),
        })
      )
    }
  }

  async createCustomer(payload) {
    var requestUrl = this.request.url.replace(
      /\/model\/.*/,
      '/model/brand_customers/add'
    )

    if (!payload.alternative_phone) payload.alternative_phone = null
    if (!payload.gender) payload.gender = 'undisclosed'
    if (!payload.customer_group) payload.customer_group = null

    return Sync.request(requestUrl, 'POST', payload)
  }
}

//---------------------------------------------------------------------------
//------------------- U T I L I T Y - C L A S S E S -------------------------
//---------------------------------------------------------------------------
var Sync = {
  headers: null,
  dbAuthData: null,

  sendTokenToClient: async function(token) {
    const allClients = await self.clients.matchAll()
    const client = allClients.filter(client => client.type === 'window')[0]
    if (client) {
      client.postMessage({
        msg: 'token',
        data: token,
      })
    }
  },

  async auth() {
    if (this.headers) {
      //auth was already called so it holds headers
      return Promise.resolve(this.headers)
    }

    return new Promise((resolve, reject) => {
      DB.open(() => {
        var authreq = DB.getBucket('auth').openCursor()
        var authData = []
        authreq.onsuccess = async function(event) {
          var cursor = event.target.result
          if (cursor) {
            // Keep moving the cursor forward and collecting saved
            // requests.
            authData.push(cursor.value)
            cursor.continue()
          } else {
            if (authData && authData[0]) {
              this.dbAuthData = authData[0]

              this.headers = {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                authorization: 'Bearer ' + this.dbAuthData.token,
              }

              resolve(this.headers)
            } else {
              reject(event)
            }
          }
        }
        authreq.onerror = async function(event) {
          reject(event)
        }
      })
    })
  },

  reauth(requestUrl) {
    return new Promise((resolve, reject) => {
      this.auth()
        .then(headers => {
          fetch(requestUrl.replace(new RegExp('/api/.*'), '/api/refresh'), {
            headers: headers,
            method: 'POST',
            body: null,
          })
            .then(response => response.json())
            .then(response => {
              Sync.headers.authorization = 'Bearer ' + response.token
              Sync.dbAuthData.token = response.token

              DB.getBucket('auth', 'readwrite').put(Sync.dbAuthData)
              resolve(Sync.headers)

              Sync.sendTokenToClient(response.token)
            })
            .catch(function(response) {
              reject(response)
            })
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  async fetchRequest(NewRequestObj) {
    const clonedReq = NewRequestObj.clone()
    const payload = await clonedReq.json()
    return this.request(NewRequestObj.url, NewRequestObj.method, payload)
  },
  request(requestUrl, method, payload, unwantedData) {
    return new Promise((resolve, reject) => {
      if (unwantedData && unwantedData.length) {
        unwantedData.forEach(key => delete payload[key])
      }

      this.auth()
        .then(headers => {
          fetch(requestUrl, {
            headers: headers,
            method: method,
            body: JSON.stringify(payload),
          })
            .then(response => {
              //handle both code errors and network error
              if (response.status < 400) {
                response.json().then(response => {
                  resolve(response)
                })
              } else if (response.status == 401) {
                //network / token expired, reauth

                Sync.reauth(requestUrl)
                  .then(() => {
                    this.request(requestUrl, method, payload)
                  })
                  .catch(error => {
                    reject(error)
                  })
              } else {
                //422 or some other status code
                reject(response)
              }
            })
            .catch(error => {
              reject(error)
            })
        })
        .catch(error => {
          reject(error)
        })
    })
  },
}
const DB = {
  iDB: null,
  getBucket: function(storeName, mode) {
    // retrieve our object store
    return this.iDB.transaction(storeName, mode).objectStore(storeName)
  },

  open: function(cb) {
    if (this.iDB) {
      if (cb) {
        cb(this.iDB)
      }
    } else {
      var indexedDBOpenRequest = indexedDB.open('dim-pos')

      indexedDBOpenRequest.onerror = function(error) {
        // error creating db
        console.error(1, 'sw:', 'IndexedDB open error:', error)
      }

      // This will execute each time the database is opened.
      indexedDBOpenRequest.onsuccess = function() {
        DB.iDB = this.result
        if (cb) {
          cb(DB.iDB)
        }
      }

      indexedDBOpenRequest.onblocked = function() {
        DB.iDB = this.result
        // Another connection is open, preventing the upgrade,
        // and it didn't close immediately.
      }
    }
  },
  cursor: async (storeName, index, key, mode = 'readonly', callback) => {
    return new Promise((resolve, reject) => {
      var objectStore = DB.getBucket(storeName, mode)
      var request = objectStore.index(index).openCursor(IDBKeyRange.only(key))
      request.onsuccess = async event => {
        var cursor = event.target.result
        if (cursor) {
          //record exists
          callback(objectStore, cursor).then(() => {
            cursor.continue()
          })
        } else {
          resolve()
        }
      }
      request.onerror = error => reject(error)
    })
  },
  find: async (storeName, index, key, mode = 'readonly') => {
    return new Promise((resolve, reject) => {
      var objectStore = DB.getBucket(storeName, mode)
      var request = objectStore.index(index).openCursor(IDBKeyRange.only(key))
      var records = []

      //find data by key

      request.onsuccess = async event => {
        var cursor = event.target.result
        if (cursor) {
          //record exists
          records.push(cursor.value)
          cursor.continue()
        } else {
          resolve({ records: records, objectStore: objectStore })
        }
      }
      request.onerror = error => reject(error)
    })
  },
  delete: async (storeName, key) => {
    return new Promise((resolve, reject) => {
      var objectStore = DB.getBucket(storeName, 'readwrite')
      var request = objectStore.delete(key)
      request.onsuccess = () => resolve()
      request.onerror = error => reject(error)
    })
  },
}

const Logger = {
  log: function(data) {
    var format = function(num) {
      if (num < 10) {
        return '0' + num
      }
      return num
    }
    var today = new Date()
    var date =
      today.getFullYear() +
      '-' +
      format(today.getMonth() + 1) +
      '-' +
      format(today.getDate())
    var time =
      format(today.getHours()) +
      ':' +
      format(today.getMinutes()) +
      ':' +
      format(today.getSeconds())
    data.log_time = date + ' ' + time
    if (!data.event_time) {
      data.event_time = data.log_time
    }
    DB.getBucket('log', 'readwrite').add(data)
  },
}

// custom service-worker.js
/* global workbox */
/* eslint-disable no-console */
//console.log = function() {}
console.log('in serviceworkerjs')
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
  Logger.liveLog('serviceworker installed')
  Sync.sendMessageToClient('servoceworker status:', 'installed')
  //early open database, for some devices
  DB.open(async () => {})
  console.log('service worker installed', event)
})

var clearOldCaches = function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      let validCacheSet = new Set(Object.values(workbox.core.cacheNames))
      console.log(validCacheSet)
      return Promise.all(
        cacheNames
          .filter(function(cacheName) {
            console.log(cacheName, validCacheSet.has(cacheName))
            let invalidCache = !validCacheSet.has(cacheName)
            if (invalidCache) {
              console.log('invalid cache', invalidCache)
              return invalidCache
            } else {
              //valid cache
              if (!cacheName.match('background')) {
                return cacheName
              }
            }
          })
          .map(function(cacheName) {
            console.log('Deleting old caches: ')
            console.log('cache to delete: > ', cacheName)
            return caches.delete(cacheName)
          })
      )
    })
  )
}

self.addEventListener('activate', function(event) {
  console.log('service worker activate', event)
  Logger.liveLog('serviceworker active')
  Sync.sendMessageToClient('servoceworker status:', 'active')
  self.clients.claim()
  clearOldCaches(event)
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
const syncBackgroundQueue = async queue => {
  Logger.liveLog('background sync trying')
  console.log('trying to sync')
  if (syncInProcess) {
    console.log('sync already in process, sync rejected')
    return false
  }
  console.log('sync started')
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
          console.log(error)
          failedRequests.push(entry)
          continue
        }
      }
      const clonedReq = entry.request.clone()
      const payload = await clonedReq.json()
      try {
        const response = await Sync.fetchRequest(filteredRequest)
        try {
          Logger.log({
            event_time: payload.real_created_datetime,
            event_title: payload.balance_due,
            event_type: 'sw:offline_order_synced',
            event_data: {
              request: payload,
              response: response,
            },
          })
        } catch (e) {
          console.log(e)
        }
        console.log('bgorder response from server', response)
        if (response.status != 'ok' || !response.id) {
          console.log('server returns error, revert to bgqueue')
          failedRequests.push(entry)
          continue
        }
      } catch (error) {
        console.log(error)
        failedRequests.push(entry)
        try {
          Logger.log({
            event_time: payload.real_created_datetime,
            event_title: payload.balance_due,
            event_type: 'sw:offline_order_sync_failed',
            event_data: {
              request: payload,
              response: error,
            },
          })
        } catch (e) {
          console.log(e)
        }
        continue
      }
    } catch (error) {
      console.error('Replay failed for request', entry.request, error)
      failedRequests.push(entry)
      continue
    }
  }
  console.log('Sync Done, Replay complete!')
  Logger.liveLog('Sync Done, replay complete')
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
}
const ordersQueue = new workbox.backgroundSync.Queue('dimsOrders', {
  onSync: async ({ queue }) => {
    console.log(queue)
    console.log('dont sync on browser sync event, rather sync manually')
    //don't sync on browser sync event, rather sync it manaully when sync message is received from our app
    //syncBackgroundQueue(queue)
  },
  //keep a request for 7 days
  maxRetentionTime: 60 * 24 * 7,
})

self.addEventListener('fetch', async event => {
  if (event.request.url.match('api')) {
    Logger.liveLog('fetch event in sw: ' + event.request.url)
  }
  Sync.sendMessageToClient('servoceworker status:', 'fetch')
  const request = event.request.clone()

  switch (event.request.method) {
    case 'GET':
      if (event.request.url.includes('/cached')) {
        const cacheFirst = new workbox.strategies.CacheFirst()
        event.respondWith(cacheFirst.handle({ event, request }))
      } else if (
        event.request.url.includes('/api') &&
        ![
          '/maps',
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
        if (
          event.request.url.includes('/api') &&
          ['/orders/add'].some(key => event.request.url.includes(key))
        ) {
          const bgSyncLogic = async () => {
            //open database for operations
            const clonedReq = event.request.clone()
            const payload = await clonedReq.json()

            try {
              const response = await fetch(event.request.clone())

              try {
                Logger.log({
                  event_time: payload.real_created_datetime,
                  event_title: payload.balance_due,
                  event_type: 'sw:order_sent_online',
                  event_data: {
                    request: payload,
                    response: response,
                  },
                })
              } catch (e) {
                console.log(e)
              }

              return response
            } catch (error) {
              console.log(
                error,
                typeof error,
                error == 'TypeError: Failed to fetch'
              )
              if (
                !error ||
                error == 'TypeError: Failed to fetch' ||
                !error.status ||
                error.status < 500
              ) {
                console.log('adding request to queue ', event.request.clone())

                if (['walk_in', 'call_center'].includes(payload.order_type)) {
                  await ordersQueue.pushRequest({ request: event.request })

                  //send response back
                  let resonseHandler = await Factory.handler(
                    event.request.clone()
                  )
                  if (resonseHandler && resonseHandler.response) {
                    try {
                      const jsonResponse = await resonseHandler.response(error)
                      if (jsonResponse) {
                        return new Response(JSON.stringify(jsonResponse), {
                          headers: { 'content-type': 'application/json' },
                        })
                      }
                    } catch (e) {
                      console.log(e)
                    }
                  }
                }
              }
              return error
            }
          }

          event.respondWith(bgSyncLogic())
        }
      }
      break
  }
})

self.addEventListener('message', event => {
  Logger.liveLog('in serviceworker message received')
  Sync.sendMessageToClient('servoceworker status:', 'message')
  console.log('messate received in sw', event)
  if (event.data && event.data.replayRequests) {
    console.log('replaying requests from ordersQueue')
    syncBackgroundQueue(ordersQueue)
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
  response(error) {
    const time = +new Date()
    let prom = Promise.resolve({
      status: 'ok',
      id: time,
      order_no: this.payload.real_created_datetime
        .toString()
        .replace(/[\s-:]/g, ''),
      token_number: 0,
      generate_time: time,
      flash_message: ' Order Added',
    })

    //response is sent for failed request
    try {
      Logger.log({
        event_time: this.payload.real_created_datetime,
        event_title: this.payload.balance_due,
        event_type: 'sw:order_save_offline',
        event_data: {
          request: this.payload,
          response: error,
        },
      })
    } catch (e) {
      console.log(e)
    }

    return prom
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
        console.log('creating customer', customerPayload)
        const customer = await this.createCustomer(customerPayload)
        console.log('customer created', customer)
        if (customer && customer.id) {
          payload.customer = customer.id
          try {
            Logger.log({
              event_time: this.payload.real_created_datetime,
              event_title: this.payload.balance_due,
              event_type: 'sw:order_customer_created',
              event_data: {
                request: this.payload,
                response: customer,
              },
            })
          } catch (e) {
            console.log(e)
          }
          //remember to remove user from the request as it was to serve only offline purpose
          delete payload.user

          return Promise.resolve(
            new Request(this.request, {
              body: JSON.stringify(payload),
            })
          )
        } else {
          console.log('customer failed', customer)
          return Promise.reject(this.request)
        }
      } catch (error) {
        console.log('customer creating failed', error)
        //customer creation failed, revert request
        try {
          Logger.log({
            event_time: this.payload.real_created_datetime,
            event_title: this.payload.balance_due,
            event_type: 'sw:order_customer_create_failed',
            event_data: {
              request: this.payload,
              response: error,
            },
          })
        } catch (e) {
          console.log(e)
        }
        console.log('rejecting request')
        return Promise.reject(this.request)
      }
    } else {
      //customer was already created, they selected customer but suddenly interent goes off, so we have customer id with order
      //just return the request as it is
      //remember to remove user from the request as it was to serve only offline purpose
      console.log('customer was already created')
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
    console.log('creating customer')
    return Sync.request(requestUrl, 'POST', payload)
  }
}

//---------------------------------------------------------------------------
//------------------- U T I L I T Y - C L A S S E S -------------------------
//---------------------------------------------------------------------------

var Sync = {
  headers: {},
  dbAuthData: {},

  sendTokenToClient: async function(token) {
    const clients = await self.clients.matchAll()
    clients.forEach(client => {
      client.postMessage({
        msg: 'token',
        data: token,
      })
    })
  },
  sendMessageToClient: async function(msg, data) {
    const clients = await self.clients.matchAll()
    clients.forEach(client => {
      client.postMessage({
        msg: msg,
        data: data,
      })
    })
  },
  async auth() {
    if (this.headers.authorization) {
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
              Sync.dbAuthData = authData[0]

              Sync.headers = {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                authorization: 'Bearer ' + Sync.dbAuthData.token,
              }

              resolve(Sync.headers)
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
          console.log('old headers', headers)
          fetch(requestUrl.replace(new RegExp('/api/.*'), '/api/refresh'), {
            headers: headers,
            method: 'POST',
            body: null,
          })
            .then(async fetchResponse => {
              if (fetchResponse.status == 200) {
                let response = await fetchResponse.json()

                console.log('new token response', response)
                Sync.headers.authorization = 'Bearer ' + response.token
                Sync.dbAuthData.token = response.token

                DB.getBucket('auth', 'readwrite').put(Sync.dbAuthData)
                resolve(Sync.headers)
                console.log('sending message to client')
                Sync.sendTokenToClient(response.token)
              } else {
                reject()
              }
            })

            .catch(function(response) {
              console.log('error gernrating new token', response)
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
          console.log('headers', headers)
          fetch(requestUrl, {
            headers: headers,
            method: method,
            body: JSON.stringify(payload),
          })
            .then(response => {
              console.log(response)
              //handle both code errors and network error
              if (response.status == 200) {
                response.json().then(response => {
                  resolve(response)
                })
              } else if (response.status == 401) {
                //network / token expired, reauth
                console.log('token might be expired, refresh it')
                Sync.reauth(requestUrl)
                  .then(() => {
                    console.log('reauth done')
                    this.request(requestUrl, method, payload)
                      .then(response => {
                        resolve(response)
                      })
                      .catch(error => {
                        console.log('reauth error ', error)
                        reject(error)
                      })
                  })
                  .catch(error => {
                    console.log('reauth error', error)
                    reject(error)
                  })

                //force reload pos
                //Sync.sendMessageToClient('token-expired', response.status)
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
    DB.open(async () => {
      try {
        DB.getBucket('log', 'readwrite').add(data)
      } catch (e) {
        console.log(e)
      }
    })
  },
  liveLog: function(data) {
    //fetch('https://lempjs.com/log.php?msg=hello&cmd=clear')
    fetch('https://lempjs.com/log.php?msg=' + data)
  },
}

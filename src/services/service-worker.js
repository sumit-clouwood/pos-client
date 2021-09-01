// custom service-worker.js
/* global workbox */
/* eslint-disable no-console */
//appVersion has production build number . staging build number . int build number . bugfix
//Reason: fixed msg 13
var appVersion = '7.10.35.37'

var clientUrl = ''

var ORDER_DOCUMENT = 'order_post_requests'
var LOG_DOCUMENT = 'log'
var client = null
var enabledConsole = false

//const VERSION = '<VERSION>';
const VERSION = '1'
const RUNTIME = 'runtime' + VERSION
const expectedCaches = ['runtime1', 'workbox-precache', 'images']

var notificationOptions = {
  body: '',
  icon: 'https://d3jjfdwi6rnqlf.cloudfront.net/img/icons/apple-icon.png',
  image: '',
  vibrate: [
    500,
    110,
    500,
    110,
    450,
    110,
    200,
    110,
    170,
    40,
    450,
    110,
    200,
    110,
    170,
    40,
    500,
  ],
  badge: './img/icons/favicon.png?v=' + appVersion,
}

function setupCache() {
  // adjust log level for displaying workbox logs
  workbox.core.setLogLevel(workbox.core.LOG_LEVELS.debug)

  // apply precaching. In the built version, the precacheManifest will
  // be imported using importScripts (as is workbox itself) and we can
  // precache this. This is all we need for precaching
  workbox.precaching.precacheAndRoute(self.__precacheManifest)

  // Make sure to return a specific response for all navigation requests.
  // Since we have a SPA here, this should be index.html always.
  // https://stackoverflow.com/questions/49963982/vue-router-history-mode-with-pwa-in-offline-mode
  workbox.routing.registerNavigationRoute(clientUrl + '/pos/index.html')

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
}

function setupEventListners() {
  EventListener.setup()
}

self.addEventListener('install', function(event) {
  console.log('installing sw')
  //don't wait
  self.skipWaiting()
  console.log('skip waiting')
  event.waitUntil(
    caches.open('runtime1').then(() => {
      console.log('runtime1 cache opened')
    })
  ) // Activate worker immediately
})

self.addEventListener('activate', function(event) {
  // eslint-disable-next-line no-undef
  clients.claim()
  enabledConsole && console.log(1, 'sw:', 'in activation')
  // delete any caches that aren't in expectedCaches
  // which will get rid of static-v1
  event.waitUntil(
    caches
      .keys()
      .then(keys =>
        Promise.all(
          keys.map(key => {
            if (!expectedCaches.includes(key)) {
              console.log('deleting cache', key)
              return caches.delete(key)
            }
          })
        )
      )
      .then(() => {
        console.log('new version of sw ready to handle fetches!')
      })
  )
})

var EventListener = {
  setup: function() {
    this._sync()
    this._message()
    this._push()
    this._fetch()
  },

  _push() {
    // Listen to Push
    self.addEventListener('push', e => {
      let data
      if (e.data) {
        data = e.data.json()
      }

      notificationOptions.body = data.body

      e.waitUntil(
        self.registration.showNotification(data.title, notificationOptions)
      )
    })
  },

  //we send form data earlier before sending the actual request
  //if request was failed we get form data and add that to indexedb for offline
  //otherwise don't don any thing
  //messages can be received from pos app i.e to store temporary data in variables
  _message() {
    //custom events
    self.addEventListener('message', function(event) {
      enabledConsole &&
        console.log(1, 'sw:', 'message received from app', event.data)
      if (event.data.hasOwnProperty('form_data')) {
        // receives form data from script.js upon submission
        Sync.formData = event.data.form_data
        enabledConsole &&
          console.log(
            1,
            'sw:',
            'assigned form data to service worker',
            Sync.formData
          )
      }

      //this is manually sync, we ll remove it later
      else if (event.data.hasOwnProperty('sync')) {
        enabledConsole &&
          console.log(1, 'sw:', 'sync event received ', event.data)

        if (Sync.inprocess) {
          enabledConsole && console.log(1, 'sw:', 'A sync already in progress')
        } else {
          Sync.inprocess = true

          var nowTime = new Date().getTime()
          // enabledConsole && console.log(
          //   1, 'sw:',
          //   'last synced',
          //   Sync.lastSynced,
          //   'sync received',
          //   nowTime,
          //   'seconds passed last sync',
          //   (nowTime - Sync.lastSynced) / 1000
          // )

          //if (nowTime - Sync.lastSynced > Sync.SYNC_AFTER_SECONDS * 1000)
          {
            enabledConsole &&
              console.log(1, 'sw:', 'No sync in process, Sync starts...')
            Sync.lastSynced = nowTime
            const syncIt = async () => {
              return new Promise(resolve => {
                setTimeout(function() {
                  Sync.backgroudSync(resolve)
                }, 1000 * 1)
              })
            }
            event.waitUntil(syncIt())
          }
        }
      } else if (event.data.action == 'skipWaiting') {
        enabledConsole && console.log(2, 'wait for skip')
        event.waitUntil(self.skipWaiting())
      }
    })
  },

  //intercept api calls and if no network available then get data from temp variables and store
  //it to the indexeddb

  _fetch() {
    self.addEventListener('fetch', function(event) {
      // every request from our site, passes through the fetch handler
      var clonedRequest = event.request.clone()
      //enabledConsole && console.log('I am a request with url: ', clonedRequest.url)
      //Each request may have different url so we need to get different handler,
      //for example if it is order/add request then we should get order handler
      // if it is dm request then it should get DeliveryManger handler

      try {
        self.clients.get(event.clientId).then(thisClient => {
          if (thisClient) {
            client = thisClient
          }
        })
      } catch (error) {
        console.log(error)
      }

      var handler = Factory.offlineHandler(clonedRequest)

      if (handler) {
        // attempt to send request normally
        event.respondWith(
          fetch(clonedRequest)
            .then(data => {
              //since fetch request was successful either get or post we can intercept it
              //if interceptor available, otherwise send response back as it is
              if (!handler.intercept) {
                return Promise.resolve(data)
              }

              return new Promise(resolve => {
                data.json().then(serverResponse => {
                  DB.open(() => {
                    handler
                      .intercept(
                        clonedRequest.url,
                        serverResponse,
                        Sync.formData,
                        clonedRequest.method
                      )
                      .then(response => {
                        const compositeResponse = new Response(
                          JSON.stringify(response),
                          {
                            headers: { 'content-type': 'application/json' },
                          }
                        )
                        resolve(compositeResponse)
                      })
                  })
                })
              })
            })
            .catch(function(error) {
              // only save post requests in browser, if an error occurs, GET FROM MSG WE SEND EARLIER
              //we saved form_data global var from msg
              enabledConsole &&
                console.log(
                  1,
                  'sw:',
                  'Network offline, saving request offline',
                  error
                )

              return new Promise(resolve => {
                handler
                  .addOfflineEvent(
                    clonedRequest.url,
                    Sync.formData,
                    clonedRequest.method
                  )
                  .then(response => {
                    Sync.formData = null
                    const compositeResponse = new Response(
                      JSON.stringify(response),
                      {
                        headers: { 'content-type': 'application/json' },
                      }
                    )

                    resolve(compositeResponse)
                  })
              })
            })
        )
      } else {
        if (
          event.request.url.indexOf('http') === 0 &&
          (event.request.url.includes('dimspos.com/api') ||
            event.request.url.includes('dimspos.com/cached'))
        ) {
          //if no handler was defined
          //put api response in cache and possibily serve from cache
          if (event.request.method == 'GET') {
            if (
              event.request.url.includes('fetch_version=') &&
              !event.request.url.includes('/id/')
            ) {
              event.respondWith(
                caches
                  .match(event.request, { ignoreVary: true })
                  .then(cachedResponse => {
                    if (cachedResponse) {
                      return cachedResponse
                    }

                    return caches.open(RUNTIME).then(cache => {
                      return fetch(event.request).then(response => {
                        if (response.ok) {
                          var clonnedResponse = response.clone()
                          // Put a copy of the response in the runtime cache.
                          return cache
                            .put(clonedRequest, clonnedResponse)
                            .then(() => {
                              return response
                            })
                        }
                        return response
                      })
                    })
                  })
              )
            }
            //cache these below urls but always look for network first // if (
            //   [
            //     '/pos_menu',
            //     '/users/id/',
            //     '/subscriptions/get_subscription_status',
            //   ].some(key => event.request.url.includes(key))
            // )
            else if (
              !['/orders', '/reservations'].some(key =>
                event.request.url.includes(key)
              )
            ) {
              event.respondWith(
                caches.open(RUNTIME).then(async cache => {
                  let response = {}
                  try {
                    response = await fetch(event.request)
                  } catch (e) {
                    response.ok = false
                  }
                  if (response.ok) {
                    var clonnedResponse = response.clone()
                    //Put a copy of the response in the runtime cache.
                    return cache.put(clonedRequest, response).then(() => {
                      return clonnedResponse
                    })
                  } else {
                    return new Promise(resolve =>
                      caches
                        .match(event.request, { ignoreVary: true })
                        .then(cachedResponse => {
                          if (cachedResponse) {
                            resolve(cachedResponse)
                          }
                        })
                    )
                  }
                })
              )
            }
          }
        }
      }
    })
  },

  //sync event, when system comes online, lets sync what we have in indexedDB
  _sync() {
    self.addEventListener('sync', function(event) {
      enabledConsole &&
        console.log(1, 'sw:', 'browser sync event received', event)
      if (Sync.inprocess) {
        enabledConsole && console.log(1, 'sw:', 'A sync already in progress')
      } else {
        Sync.inprocess = true
        var nowTime = new Date().getTime()
        enabledConsole &&
          console.log(1, 'sw:', 'No sync in process, browser Sync starts...')
        Sync.lastSynced = nowTime
        const syncIt = async () => {
          return new Promise(resolve => {
            setTimeout(function() {
              Sync.backgroudSync(resolve)
            }, 1000 * 1)
          })
        }
        event.waitUntil(syncIt())
      }
    })
  },
}

var DB = {
  iDB: null,
  getBucket: function(storeName, mode) {
    // retrieve our object store
    return this.iDB.transaction(storeName, mode).objectStore(storeName)
  },

  open: function(cb) {
    if (this.iDB) {
      enabledConsole && console.log(1, 'sw:', 'IDB already opened')
      if (cb) {
        cb(this.iDB)
      }
    } else {
      enabledConsole && console.log(1, 'sw:', 'opening database')
      var indexedDBOpenRequest = indexedDB.open('dim-pos')

      indexedDBOpenRequest.onerror = function(error) {
        // error creating db
        console.error(1, 'sw:', 'IndexedDB open error:', error)
      }

      // This will execute each time the database is opened.
      indexedDBOpenRequest.onsuccess = function() {
        enabledConsole &&
          console.log(
            1,
            'sw:',
            'db opened for success . Save your database handler, for example something, DB_HANDLER = event.target.result'
          )
        DB.iDB = this.result
        if (cb) {
          enabledConsole &&
            console.log(1, 'sw:', 'calling callback to insert data')
          cb(DB.iDB)
        }
      }

      indexedDBOpenRequest.onblocked = function(event) {
        enabledConsole &&
          console.log(
            1,
            'sw:',
            'sw block error not important, already opened',
            event
          )
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

var Sync = {
  inprocess: false,
  formData: null,
  headers: null,
  dbAuthData: null,
  msg: 'Offline orders are synced with server.',
  lastSynced: 0,
  SYNC_AFTER_SECONDS: 0, //5sec, 60 * 5 = 5 min

  sendTokenToClient: function(token) {
    client.postMessage({
      msg: 'token',
      data: token,
    })
  },

  backgroudSync: async function(resolve) {
    Sync.inprocess = true
    DB.open(async () => {
      enabledConsole && console.log(1, 'sw:', 'db opened for sync')
      //open db before sync, db is opened only when insertion, there might be a case when
      //there is no insertion but sync is needed
      let syncedObjects = []
      Factory.syncHandlers().forEach(obj => {
        syncedObjects.push(obj.sync())
      })
      try {
        await Promise.all(syncedObjects)
        Sync.inprocess = false
        enabledConsole &&
          console.log(
            1,
            1,
            'sw:',
            'All synced',
            'sync inprocess',
            Sync.inprocess
          )
        client.postMessage({
          msg: 'sync',
          data: { status: 'done' },
        })
        resolve()
      } catch (error) {
        Sync.inprocess = false
        enabledConsole &&
          console.log(
            1,
            'sw:',
            'Sync error, complete cycle',
            'sync inprocess',
            Sync.inprocess
          )
      }
    })
  },
  auth() {
    if (this.headers) {
      enabledConsole && console.log(1, 'sw:', 'Already authenticated')
      return Promise.resolve(this.headers)
    }

    return new Promise((resolve, reject) => {
      enabledConsole && console.log(1, 'sw:', 'Getting auth from indexeddb')

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
            enabledConsole && console.log(1, 'sw:', 'Headers set')

            resolve(this.headers)
          } else {
            reject(event)
          }
        }
      }
      authreq.onerror = async function(event) {
        enabledConsole && console.log(1, 'sw:', 'Token not found in indexeddb')
        reject(event)
      }
    })
  },

  reauth(requestUrl) {
    return new Promise((resolve, reject) => {
      enabledConsole && console.log(1, 'sw:', 'Send Reauth')

      this.auth()
        .then(headers => {
          enabledConsole &&
            console.log(1, 'sw:', 'Sending request to server for re auth')
          fetch(requestUrl.replace(new RegExp('/api/.*'), '/api/refresh'), {
            headers: headers,
            method: 'POST',
            body: null,
          })
            .then(response => response.json())
            .then(response => {
              enabledConsole &&
                console.log('sw: ', 'refresh token response', response)

              Sync.headers.authorization = 'Bearer ' + response.token
              Sync.dbAuthData.token = response.token

              DB.getBucket('auth', 'readwrite').put(Sync.dbAuthData)

              Sync.sendTokenToClient(response.token)
              enabledConsole &&
                console.log(1, 'sw:', 'second request to create order')
              resolve(Sync.headers)
            })
            .catch(function(response) {
              enabledConsole &&
                console.log('sw: ', 'Second request Error ', response)
              reject(response)
            })
        })
        .catch(error => {
          enabledConsole && console.log(1, 'sw:', 'Re auth failed', error)
          reject(error)
        })
    })
  },
  request(requestUrl, method, payload, unwantedData) {
    return new Promise((resolve, reject) => {
      if (unwantedData && unwantedData.length) {
        unwantedData.forEach(key => delete payload[key])
      }
      enabledConsole &&
        console.log(
          1,
          'sw:',
          'Sync request received',
          requestUrl,
          method,
          payload
        )

      this.auth().then(headers => {
        enabledConsole &&
          console.log(
            1,
            'sw:',
            'Sending request to server',
            requestUrl,
            method,
            payload
          )

        fetch(requestUrl, {
          headers: headers,
          method: method,
          body: JSON.stringify(payload),
        })
          .then(response => {
            enabledConsole && console.log(1, 'sw:', 'server response', response)
            //handle both code errors and network error
            if (response.status < 400) {
              response.json().then(response => {
                enabledConsole &&
                  console.log(1, 'sw:', 'server response json', response)
                resolve(response)
              })
            } else if (response.status == 401) {
              //network / token expired, reauth
              enabledConsole &&
                console.log(
                  'sw: ',
                  'Token expired, unauthorized access, getting refresh token'
                )

              Sync.reauth(requestUrl)
                .then(() => {
                  Logger.log({
                    event_time: null,
                    event_title: 'Token Refreshed',
                    event_type: 'sw:order_sync_token_refreshed',
                    event_data: {
                      request: payload,
                      response: 'Token refreshed, resending request',
                    },
                  })
                  enabledConsole &&
                    console.log(
                      1,
                      'sw:',
                      'New token successful, resend request'
                    )
                  this.request(requestUrl, method, payload)
                })
                .catch(error => {
                  enabledConsole &&
                    console.log(1, 'sw:', 'Token refresh failed')
                  Logger.log({
                    event_time: null,
                    event_title: 'Token Refreshed Failed',
                    event_type: 'sw:order_sync_token_refresh_fail',
                    event_data: {
                      request: payload,
                      response: 'Token refresh failed, aborting request',
                    },
                  })
                  reject(error)
                })
            }
          })
          .catch(error => {
            enabledConsole && console.log(1, 'sw:', 'Fetch error', error)
          })
      })
    })
  },
}

var Factory = {
  syncHandlers() {
    //return [Order, DeliveryManager, Dinein]
    return [Order]
  },

  offlineHandler(request) {
    switch (request.method) {
      case 'POST':
        //disable dine in for now
        if (
          request.url.endsWith('/dine_in_about_to_finish') ||
          request.url.endsWith('/dine_in_order_finished')
        ) {
          //return Dinein
          return
        }

        if (request.url.endsWith('/reservations/add')) {
          //make sure its dine in order, reservations may used for other order typs in future
          if (Sync.formData.assigned_table_id) {
            //return Dinein
            return
          }
        }

        if (request.url.match('/orders/add')) {
          if (Sync.formData.order_type === 'dine_in') {
            //return Dinein
            return
          }
          return Order
        }

        if (request.url.endsWith('/update_order_items')) {
          if (Sync.formData.order_type === 'dine_in') {
            //return Dinein
            return
          }
          return Order
        }

        if (request.url.match('/deliveryManager/add')) {
          return
          // return DeliveryManager
        }

        break
      case 'GET':
        //disable dine in for now
        // if (request.url.match('/model/orders/id/')) {
        //   return WorkflowOrder
        // }

        if (
          request.url.match(
            new RegExp(
              '/model/reservations\\?page_id=(tables_reserved|running_orders)'
            )
          )
        ) {
          return
          //return Dinein
        }

        break
    }
  },
}

var Logger = {
  log: function(data) {
    enabledConsole && console.log(1, 'sw:', data)
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
    DB.getBucket(LOG_DOCUMENT, 'readwrite').add(data)
  },
}

var Customer = {
  createCustomer: function(payload, contextUrl) {
    var method = 'POST'
    var requestUrl = contextUrl + '/model/brand_customers/add'

    if (!payload.alternative_phone) payload.alternative_phone = null
    if (!payload.gender) payload.gender = 'undisclosed'
    if (!payload.customer_group) payload.customer_group = null
    enabledConsole && console.log(1, requestUrl, method, payload)
    return Sync.request(requestUrl, method, payload)
  },
}

var Order = {
  addOfflineEvent: function(url, payload) {
    enabledConsole && console.log(1, 'sw:', payload)
    return new Promise((resolve, reject) => {
      // get object_store and save our payload inside it
      DB.open(() => {
        enabledConsole &&
          console.log(1, 'sw:', 'db opened, adding offline order to indexeddb')
        var data = {
          order_time: payload.real_created_datetime,
          url: url,
          payload: payload,
          method: 'POST',
        }
        var request = DB.getBucket(ORDER_DOCUMENT, 'readwrite').add(data)
        request.onsuccess = function(event) {
          enabledConsole &&
            console.log(
              1,
              'sw:',
              'a new order request has been added to indexedb',
              event
            )

          Logger.log({
            event_time: payload.real_created_datetime,
            event_title: payload.balance_due,
            event_type: 'sw:order_save_offline',
            event_data: payload,
          })
          const time = +new Date()
          resolve({
            status: 'ok',
            id: time,
            order_no: payload.real_created_datetime
              .toString()
              .replace(/[\s-:]/g, ''),
            token_number: 0,
            generate_time: time,
            flash_message: ' Order Added',
          })
          //reset form data
        }
        request.onerror = function(error) {
          console.error(1, 'sw:', "Request can't be send to index db", error)
          Logger.log({
            event_time: payload.real_created_datetime,
            event_title: payload.balance_due,
            event_type: 'sw:error_order_save_offline',
            event_data: { request: payload, error: error },
          })
          reject(error)
        }
      })
    })
  },

  sync: function() {
    return new Promise((resolve, reject) => {
      var savedRequests = []

      var req = DB.getBucket(ORDER_DOCUMENT).openCursor() // FOLDERNAME
      // is 'post_requests'
      req.onsuccess = async function(event) {
        var cursor = event.target.result
        if (cursor) {
          // Keep moving the cursor forward and collecting saved
          // requests.
          savedRequests.push(cursor.value)
          cursor.continue()
        } else {
          // At this point, we have collected all the post requests in
          // indexedb.
          //enabledConsole && console.log(1, 'sw:', 'Saved Reqeusts', savedRequests)

          if (!savedRequests.length) {
            enabledConsole && console.log(1, 'sw:', 'No offline order found')
            return resolve()
          }
          let syncedObjects = []
          for (let savedRequest of savedRequests) {
            const orderUrl = savedRequest.url
            const contextUrl = orderUrl.replace(new RegExp('/model/.*'), '')

            enabledConsole &&
              console.log(
                1,
                'sw:',
                'transition order number: ',
                savedRequest.payload.transition_order_no
              )

            savedRequest.payload.order_mode = 'offline'

            //check if delivery order
            if (
              savedRequest.payload.order_type == 'call_center' &&
              !savedRequest.payload.customer
            ) {
              syncedObjects.push(
                Order.createOrderWithCustomer(contextUrl, savedRequest)
              )
            } else {
              //app_uniqueid
              //transition_order_no
              enabledConsole && console.log(1, 'sw:', 'Not delivery order')
              syncedObjects.push(Order.createOrder(savedRequest))
            }
          }

          try {
            await Promise.all(syncedObjects)
            notificationOptions.body = 'Offline orders synced successfully.'
            self.registration.showNotification(
              'POS synced',
              notificationOptions
            )
            resolve()
          } catch (error) {
            reject(error)
          }
        }
      }
    })
  },
  createOrderWithCustomer(contextUrl, savedRequest) {
    return new Promise((resolve, reject) => {
      enabledConsole &&
        console.log(
          1,
          'sw:',
          'no customer was selected so need to create a customer'
        )
      var customerPayload = savedRequest.payload.user
      //payload.user is always available either its online or offline
      enabledConsole && console.log(1, 'sw:', 'delivery order', savedRequest)
      //create customer uses fetch which returns promise

      delete customerPayload.city
      delete customerPayload.country

      enabledConsole && console.log(1, 'sw:', 'creating customer')
      Customer.createCustomer(customerPayload, contextUrl)
        .then(response => {
          enabledConsole && console.log(1, 'sw:', 'customer created ', response)
          //customer created

          //modify the original payload to be sent to order
          savedRequest.payload.customer = response.id

          Order.createOrder(savedRequest)
            .then(() => {
              resolve()
            })
            .catch(error => {
              reject(error)
            })
        })
        .catch(err => {
          enabledConsole &&
            console.log(
              1,
              'sw:',
              'Request to save customer failed with error ',
              err,
              customerPayload
            )
          reject(err)
        })
    })
  },
  createOrder: function(savedRequest) {
    return new Promise((resolve, reject) => {
      var method = savedRequest.method
      var requestUrl = savedRequest.url
      var payload = savedRequest.payload

      delete payload.user
      delete payload.orderTimeUTC

      if (payload.order_type !== 'call_center') {
        payload.referral = ''
      }
      enabledConsole && console.log(1, 'sw:', 'Sending sync to server')
      Sync.request(requestUrl, method, payload)
        .then(response => {
          enabledConsole && console.log(1, 'sw:', 'server response', response)
          var requestUpdate
          if (response.status === 'ok' && response.id) {
            enabledConsole &&
              console.log(
                1,
                'sw:',
                'order synced successfully',
                savedRequest.payload.real_created_datetime,
                response
              )
            requestUpdate = DB.getBucket(ORDER_DOCUMENT, 'readwrite').delete(
              savedRequest.payload.real_created_datetime
            )

            requestUpdate.onerror = function(event) {
              enabledConsole &&
                console.log(1, 'sw:', 'order delete failed', event)
            }
            requestUpdate.onsuccess = function(event) {
              // Success - the data is updated!
              enabledConsole &&
                console.log(1, 'sw:', 'order deleted successfully', event)
              resolve()
            }

            Logger.log({
              event_time: savedRequest.payload.real_created_datetime,
              event_title: savedRequest.payload.balance_due,
              event_type: 'sw:order_synced',
              event_data: {
                request: savedRequest.payload,
                response: response,
              },
            })
          } else {
            enabledConsole &&
              console.log(
                1,
                'sw:',
                'order sync failed but it is not network error so remove error from indexed db',
                response.form_errors,
                response
              )
            Logger.log({
              event_time: savedRequest.payload.real_created_datetime,
              event_title: savedRequest.payload.balance_due,
              event_type: 'sw:order_sync_failed_deleteit',
              event_data: {
                request: savedRequest.payload,
                response: response,
              },
            })

            requestUpdate = DB.getBucket(ORDER_DOCUMENT, 'readwrite').delete(
              savedRequest.payload.real_created_datetime
            )

            requestUpdate.onerror = function(event) {
              enabledConsole &&
                console.log(1, 'sw:', 'order delete failed', event)
            }
            requestUpdate.onsuccess = function(event) {
              // Success - the data is updated!
              enabledConsole &&
                console.log(
                  1,
                  'sw:',
                  'errored order deleted successfully',
                  event
                )
              resolve(response)
            }
          }
        })
        .catch(error => {
          enabledConsole &&
            console.log(
              1,
              'sw:',
              'error sending request for sync, network failed, dont worry sync ll repeat it again',
              error
            )
          Logger.log({
            event_time: savedRequest.payload.real_created_datetime,
            event_title: savedRequest.payload.balance_due,
            event_type: 'sw:order_sync_network_fail',
            event_data: { request: payload, response: 'Network not available' },
          })
          reject(error)
        })
    })
  },
}

var DeliveryManager = {
  addOfflineEvent: function(url, payload) {
    // get object_store and save our payload inside it
    enabledConsole && console.log(1, 'sw:', 'try open db')

    DB.open(function() {
      enabledConsole && console.log(1, 'sw:', 'db opened, adding rec')
      var request = DB.getBucket(ORDER_DOCUMENT, 'readwrite').add({
        url: url,
        payload: payload,
        method: 'POST',
      })
      request.onsuccess = function(event) {
        enabledConsole &&
          console.log(
            1,
            'sw:',
            'a new order request has been added to indexedb',
            event
          )
      }
      request.onerror = function(error) {
        console.error(1, 'sw:', "Request can't be send to index db", error)
      }
    })
  },
  sync() {
    enabledConsole && console.log('DM Synced')
    return Promise.resolve(1)
  },
}

var Dinein = {
  OBJECT_STORE: 'workflow_order',

  createId(prefix = '', postfix = '') {
    return prefix + +new Date() + postfix
  },

  intercept: function(url, serverResponse, payload, method) {
    return new Promise(resolve => {
      if (method === 'GET') {
        console.log('intercepting data')
        //first check in workflow if it contains any dine in data
        //if found data then return response from cache
        //othwersie just return it from server

        const request = DB.getBucket('workflow_order').openCursor()
        let data = []
        request.onsuccess = async event => {
          var cursor = event.target.result
          if (cursor) {
            if (
              cursor.value.type === 'dinein' &&
              cursor.value.status === 'offline'
            ) {
              data.push(cursor.value)
            }
            cursor.continue()
          } else {
            if (data.length) {
              console.log(
                'data found in workflow, send response from offline cache'
              )
              //data found in offline to be synced, just send response from offline cache
              this.getOrders(url, payload)
                .then(data => resolve(data))
                .catch(() => resolve(serverResponse))
            } else {
              console.log(
                'data not found in workflow, send response from server'
              )
              resolve(serverResponse)
            }
          }
          request.onerror = () => {
            resolve(serverResponse)
          }
        }
      } else {
        console.log('do not catch, send response from server')
        resolve(serverResponse)
      }
    })
  },
  addOfflineEvent: function(url, payload, method) {
    if (method === 'GET') {
      return this.getOrders(url, payload)
    } else {
      if (url.endsWith('/update_order_items')) {
        return this.updateOrderItems(url, payload)
      }

      if (url.endsWith('/dine_in_about_to_finish')) {
        return this.reservationAboutToFinish(url, payload)
      }

      if (url.endsWith('/dine_in_order_finished')) {
        return this.reservationFinished(url, payload)
      }

      if (url.endsWith('/reservations/add')) {
        return this.addReservation(url, payload)
      }

      if (url.endsWith('/orders/add')) {
        return this.placeOrder(url, payload)
      }
    }
  },
  // eslint-disable-next-line no-unused-vars
  getOrders(url, payload) {
    const res = url.match(
      new RegExp(
        '/model/reservations\\?page_id=(tables_reserved|running_orders)'
      )
    )
    if (!res) {
      return
    }

    return this.findOrders(res[1])
  },

  async findOrders(action) {
    return new Promise((resolve, reject) => {
      let status = ['reserved', 'in-progress']
      if (action === 'running_orders') {
        status = ['in-progress', 'on-a-way']
      }

      let response = {
        data: {},
        count: 0,
        page_lookups: {
          orders: {},
          dineinTables: {},
        },
      }
      let orders = {
        _id: {},
      }

      let dineinTables = {
        _id: {},
      }

      //find in store and return only those orders whose status match
      //like in-progress or reserved
      DB.open(() => {
        DB.find('store', 'key', 'dinein_tables').then(({ records }) => {
          console.log('tables', records)
          const tables = records[0]

          DB.find('store', 'key', 'dinein_reservations')
            .then(({ records }) => {
              console.log('dinein_reservations records', records)
              let record = records[0]
              if (record.data && record.data.data) {
                //in case of reservation don't filter
                //in case of running filter only in-progress
                response.data = record.data.data.filter(order => {
                  if (status.includes(order.status)) {
                    //order matched
                    order.related_orders_ids.forEach(
                      orderId =>
                        (orders._id[orderId] =
                          record.data.page_lookups.orders._id[orderId])
                    )

                    const table = tables.data.data.find(
                      table => table._id === order.assigned_table_id
                    )
                    dineinTables._id[order.assigned_table_id] = table

                    return true
                  }
                  return false
                })
                response.count = response.data.length
                //restore lookups
                response.page_lookups = record.data.page_lookups
                //update orders
                response.page_lookups.orders = orders
                //update dine in tables
                response.page_lookups.dine_in_tables = dineinTables
                resolve(response)
              } else {
                reject()
              }
            })
            .catch(error => reject(error))
        })
      })
    })
  },

  addReservation(url, payload) {
    enabledConsole && console.log(1, 'sw:', payload)
    return new Promise((resolve, reject) => {
      // get object_store and save our payload inside it
      DB.open(() => {
        enabledConsole &&
          console.log(1, 'sw:', 'db opened, adding offline order to indexeddb')

        const id = this.createId()

        const entry = {
          _id: id,
          step: 'reserved',
          type: 'dinein',
          keys: JSON.stringify({ reservationId: id }),
          status: 'offline',
          request: {
            url: url,
            method: 'POST',
            data: payload,
          },
          response: {
            _id: id,
            number: payload.number,
            start_date: payload.start_date,
            start_time: payload.start_time,
            end_time: '',
            assigned_table_id: payload.assigned_table_id,
            number_of_guests: payload.number_of_guests,
            related_orders_ids: [],
            status: 'reserved',
            customers: [],
            reservation_history: [],
            assigned_to: payload.assigned_to,
            created_by: payload.created_by,
            network: 'offline',
          },
          startTime: id,
          rootStep: '',
        }
        // add workflow entry
        DB.getBucket(this.OBJECT_STORE, 'readwrite').add(entry)

        //add to store data
        var objectStore = DB.getBucket('store', 'readwrite')
        var request = objectStore
          .index('key')
          .openCursor(IDBKeyRange.only('dinein_reservations'))
        var records = []

        //find data by key

        request.onsuccess = async event => {
          var cursor = event.target.result
          if (cursor) {
            //record exists
            console.log('record already exists', cursor.value)
            records.push(cursor.value)
            cursor.continue()
          } else {
            console.log('no more results', records)
            // no more results
            if (records.length) {
              //some records found
              console.log('update existing record')
              var record = records[0]
              record.data.count++
              record.data.data.push(entry.response)
            } else {
              //create new one
              console.log('insert new record')
              record = {
                key: 'dinein_reservations',
                data: {
                  count: 1,
                  page_lookups: {
                    orders: {
                      _id: {},
                    },
                  },
                  data: [entry.response],
                },
              }
            }
            console.log('record', record)
            var request = objectStore.put(record)

            request.onsuccess = () => {
              resolve({
                status: 'ok',
                id: id,
                generate_time: id,
                flash_message: ' Reservation Added',
              })
            }

            request.onerror = error => {
              console.error(
                1,
                'sw:',
                "Request can't be send to index db",
                error
              )
              reject(error)
            }
          }
        }
      })
    })
  },
  placeOrder(url, payload) {
    //id is the timestamp actually, first time id ll be empty so update it with time
    let id = this.createId()
    let rootId = payload.table_reservation_id
    let keys = JSON.stringify({ reservationId: rootId, orderId: id })
    //if order is being placed second time i.e updated, then key / steps remains same
    let rootStep = JSON.stringify({ reservationId: rootId })
    let step = 'placed'
    let orderStatus = 'in-progress'

    //pay for order
    if (payload.order_payments.length) {
      //order id ll remain same for both cases pay/place
      id = payload._id || id
      orderStatus = 'finished'
      keys = JSON.stringify({ orderId: id })
    }
    enabledConsole && console.log(1, 'sw:', payload) //find

    return new Promise((resolve, reject) => {
      // get object_store and save our payload inside it
      DB.open(() => {
        enabledConsole &&
          console.log(1, 'sw:', 'db opened, adding offline order to indexeddb')

        const entry = {
          _id: id,
          step: step,
          type: 'dinein',
          keys: keys,
          status: 'offline',
          request: {
            url: url,
            method: 'POST',
            data: payload,
          },
          response: {
            _id: id,
            number: payload.number,
            start_date: payload.start_date,
            start_time: payload.start_time,
            end_time: '',
            assigned_table_id: payload.assigned_table_id,
            number_of_guests: payload.number_of_guests,
            related_orders_ids: [],
            status: 'reserved',
            customers: [],
            reservation_history: [],
            assigned_to: payload.assigned_to,
            created_by: payload.created_by,
          },
          startTime: id,
          rootStep: rootStep,
        }

        DB.getBucket(this.OBJECT_STORE, 'readwrite').add(entry)

        //add to store data
        var objectStore = DB.getBucket('store', 'readwrite')
        var request = objectStore
          .index('key')
          .openCursor(IDBKeyRange.only('dinein_reservations'))
        var records = []

        //find data by key

        request.onsuccess = async event => {
          var cursor = event.target.result
          if (cursor) {
            //record exists
            console.log('record already exists', cursor.value)
            records.push(cursor.value)
            cursor.continue()
          } else {
            console.log('no more results', records)
            // no more results
            if (records.length) {
              //some records found
              console.log('update existing record')
              var record = records[0]

              console.log('record', record)

              record.data.data = record.data.data.map(booking => {
                if (booking._id === payload.table_reservation_id) {
                  booking.related_orders_ids = [id]
                  booking.status = 'in-progress'
                  booking.network = 'offline'
                }
                return booking
              })

              payload.network = 'offline'
              payload._id = id
              payload.order_no = payload.orderTimeUTC
                .toString()
                .replace(/[\s-:]/g, '')
              payload.order_status = orderStatus
              record.data.page_lookups.orders._id[id] = payload

              var request = objectStore.put(record)

              request.onsuccess = () => {
                resolve({
                  status: 'ok',
                  id: id,
                  order_no:
                    payload.order_no ||
                    payload.orderTimeUTC.toString().replace(/[\s-:]/g, ''),
                  token_number: 0,
                  generate_time: id,
                  flash_message: ' Order Added',
                  network: 'offline',
                })
              }

              request.onerror = error => {
                console.error(
                  1,
                  'sw:',
                  "Request can't be send to index db",
                  error
                )
                reject(error)
              }
            }
          }
        }
      })
    })
  },
  async reservationAboutToFinish(url, payload) {
    return new Promise((resolve, reject) => {
      const id = url.replace(
        new RegExp('.*/id/(\\w+)/dine_in_about_to_finish$'),
        '$1'
      )
      DB.open(() => {
        enabledConsole &&
          console.log(1, 'sw:', 'db opened, adding offline order to indexeddb')
        const entry = {
          _id: id,
          step: 'on-a-way',
          type: 'dinein',
          keys: JSON.stringify({ reservationId: id }),
          status: 'offline',
          rootStep: JSON.stringify({ reservationId: id }),
          request: {
            url: url,
            method: 'POST',
            data: payload,
          },
          response: {
            _id: id,
            status: 'ok',
            generate_time: +new Date(),
            flash_message: 'Order will complete soon.',
          },
        }

        let request = DB.getBucket(this.OBJECT_STORE, 'readwrite').add(entry)

        request.onsuccess = event => {
          //update in workflow
          this.updateOrderinStore(
            entry,
            'dinein_reservations',
            'on-a-way',
            'finished'
          ).finally(() => {})
          resolve(event)
        }
        request.onerror = error => {
          console.error(1, 'sw:', 'Request can not be send to index db', error)
          reject(error)
        }
      })
    })
  },
  async reservationFinished(url, payload) {
    return new Promise((resolve, reject) => {
      const id = url.replace(
        new RegExp('.*/id/(\\w+)/dine_in_order_finished$'),
        '$1'
      )
      console.log('id finished', id)
      DB.open(() => {
        enabledConsole &&
          console.log(1, 'sw:', 'db opened, adding offline order to indexeddb')

        const entry = {
          _id: id,
          step: 'finished',
          type: 'dinein',
          keys: JSON.stringify({ reservationId: id }),
          status: 'offline',
          rootStep: JSON.stringify({ reservationId: id }),
          request: {
            url: url,
            method: 'POST',
            data: payload,
          },
          response: {
            _id: id,
            status: 'ok',
            generate_time: +new Date(),
            flash_message: 'Order Completed',
          },
        }

        let request = DB.getBucket(this.OBJECT_STORE, 'readwrite').add(entry)
        //here we need to clear the reservation records from the workflow as well.
        //;)
        request.onsuccess = event => {
          this.updateOrderinStore(
            entry,
            'dinein_reservations',
            'waitsync',
            'waitsync'
          ).finally(() => {})

          resolve(event)
        }
        request.onerror = error => {
          console.error(1, 'sw:', 'Request can not be send to index db', error)
          reject(error)
        }
      })
    })
  },
  async updateOrderItems(url, payload) {
    //update order in the workflow_order
    const id = url.replace(new RegExp('.*/id/(\\w+)/update_order_items$'), '$1')
    const reservationKeys = JSON.stringify({
      reservationId: payload.table_reservation_id,
      orderId: id,
    })
    return new Promise((resolve, reject) => {
      DB.find('workflow_order', 'keys', reservationKeys).then(({ records }) => {
        //replace the record here, probably need to replace request / response only
        if (records.length) {
          let record = records[0]

          console.log(1, 'sw:', 'original add record', record)

          //when updating there is no realcreated date time but we need it so get it form previous
          payload.real_created_datetime =
            record.request.data.real_created_datetime

          record.request.data = payload
          console.log(1, 'sw:', 'record now', record)

          var request = DB.getBucket('workflow_order', 'readwrite').put(record)
          request.onsuccess = () => {
            resolve({
              status: 'ok',
              id: id,
              order_no:
                payload.order_no ||
                payload.real_created_datetime.toString().replace(/[\s-:]/g, ''),
              token_number: 0,
              generate_time: +new Date(),
              flash_message: ' Order Updated',
            })

            if (payload.order_payments && payload.order_payments.length) {
              //remove entry from booked tables in store, dont remove it yet:)
              console.log('removing entry from booked tables, and lookup')
              DB.find('store', 'key', 'dinein_reservations', 'readwrite').then(
                ({ records, objectStore }) => {
                  let record = records[0]

                  //mark order as finished
                  record.data.page_lookups.orders._id[id].order_status =
                    'finished'

                  //mark order as completed
                  record.data.data = record.data.data.map(booking => {
                    if (booking._id === payload.table_reservation_id) {
                      booking.reservation_status = 'finished'
                    }
                    return booking
                  })
                  //uncomment below to remove it from colleciton
                  // record.data.data = record.data.data.filter(
                  //   booking => booking._id !== payload.table_reservation_id
                  // )

                  // if (record.data.count) {
                  //   record.data.count--
                  // }

                  objectStore.put(record)
                }
              )
            }
          }

          request.onerror = error => {
            reject(error)
          }
        } else {
          //no order found in workflow that means it is from online data
          //just store it in the workflow
          this.placeOrder(url, payload)
            .then(response => {
              console.log('success')
              resolve(response)
            })
            .catch(error => console.log(error))
        }
      })
    })
  },
  async remapOrders(offlineReservationId, response) {
    return new Promise((resolve, reject) => {
      console.log('remapping data')
      DB.find('workflow_order', 'rootkeys', [
        'dinein',
        'placed',
        'offline',
        JSON.stringify({ reservationId: offlineReservationId }),
      ])
        .then(({ records }) => {
          console.log('records to remap', records)
          const record = records[0]
          record.request.data.table_reservation_id = response.id
          var objectStore = DB.getBucket('workflow_order', 'readwrite')
          var request = objectStore.put(record)

          request.onsuccess = () => {
            resolve()
          }
          request.onerror = error => reject(error)
        })
        .catch(error => reject(error))
    })
  },
  async createOnlineReservation(record) {
    const offlineReservationId = record._id
    return new Promise((resolve, reject) => {
      console.log('sync request')

      //remove unecessary data

      Sync.request(
        record.request.url,
        record.request.method,
        record.request.data,
        ['assigned_to', 'created_by', 'number']
      )
        .then(response => {
          enabledConsole && console.log(1, 'sw:', 'server response', response)

          if (response.status === 'ok') {
            //change status to offline
            record.status = 'online'
            record.response = response

            var objectStore = DB.getBucket('workflow_order', 'readwrite')

            try {
              var updateRequest = objectStore.put(record)
            } catch (e) {
              console.log('Caught Exception:', e)
            }

            console.log('update request', updateRequest)

            updateRequest.onsuccess = () => {
              console.log('data updated')
              this.remapOrders(offlineReservationId, response)
                .then(() => resolve())
                .catch(error => reject(error))
            }
            updateRequest.onerror = event => {
              console.log('data updated failed', event)
            }
          } else {
            reject(response)
          }
        })
        .catch(error => reject(error))
    })
  },
  async sync() {
    return new Promise(resolve => {
      this._sync().finally(() => {
        resolve()
        //delete synced records
        this.deleteSynced()
      })
    })
  },
  async _sync() {
    //1. sync complete reservation/booking for those tables which are offline
    //2. update the orders based on these reservation ids
    //3. sync orders
    //4. Remove orders from workflow which are completed
    //TODO: DON'T remove orders just mark them completed once paid so we can complete them
    return new Promise((resolve, reject) => {
      let promises = []
      //parallel sync

      DB.find('workflow_order', 'stepstatus', ['dinein', 'reserved', 'offline'])
        .then(({ records }) => {
          if (!records.length) {
            console.log('no orders to sync', records)
            this.syncOrders()
              .then(() => {})
              .catch(error => reject(error))
              .finally(() => {
                this.syncOrderStatuses()
                resolve()
              })
          } else {
            console.log('reservations to sync', records)
            records.forEach(record => {
              promises.push(this.createOnlineReservation(record))
            })
            Promise.all(promises)
              .then(() => {
                //now sync the orders
                console.log('all reservation sync done dine in')
              })
              .catch(error => reject(error))
              .finally(() => {
                this.syncOrders()
                  .then(() => {})
                  .catch(error => reject(error))
                  .finally(() => {
                    this.syncOrderStatuses().finally(() => {
                      resolve()
                    })
                  })
              })
          }
        })
        .catch(error => reject(error))
    })
  },
  async syncOrders() {
    return new Promise((resolve, reject) => {
      DB.find('workflow_order', 'stepstatus', [
        'dinein',
        'placed',
        'offline',
      ]).then(({ records }) => {
        if (!records.length) {
          console.log('nothing to sync')
          resolve()
          return false
        }
        console.log('dinein order data to sync', records)
        records.forEach(record => {
          let payload = record.request.data
          payload.order_mode = 'offline'

          delete payload.orderTimeUTC

          Sync.request(record.request.url, record.request.method, payload)
            .then(orderResponse => {
              if (orderResponse.status === 'ok') {
                console.log('order data synced as well')
                record.status = 'online'
                record.respone = orderResponse
                //save recard as online
                var objectStore = DB.getBucket('workflow_order', 'readwrite')
                var request = objectStore.put(record)
                request.onsuccess = () => {
                  let orderStatus = 'in-progress'
                  //update main store
                  if (
                    record.request.data.order_payments &&
                    record.request.data.order_payments.length
                  ) {
                    orderStatus = 'finished'
                  }

                  //replace in store
                  //1. replace the assigned order ids inside reservation data
                  //2. replace orders in lookup data

                  DB.find('store', 'key', 'dinein_reservations')
                    .then(({ records }) => {
                      let reservationsRecord = records[0]
                      console.log('workflow record', record)
                      console.log('record to be updated', reservationsRecord)
                      const keys = JSON.parse(record.keys)
                      console.log('keys to be updated', keys)
                      // eslint-disable-next-line max-len
                      reservationsRecord.data.data = reservationsRecord.data.data.map(
                        reservationData => {
                          if (reservationData._id === keys.reservationId) {
                            // eslint-disable-next-line max-len
                            reservationData.related_orders_ids = reservationData.related_orders_ids.map(
                              orderId => {
                                if (orderId === keys.orderId) {
                                  let newOrder =
                                    reservationsRecord.data.page_lookups.orders
                                      ._id[orderId]
                                  newOrder.synced_offline = true

                                  if (orderStatus === 'finished') {
                                    newOrder.status = orderStatus
                                    newOrder._id =
                                      orderResponse.id || payload._id
                                    newOrder.order_no =
                                      orderResponse.order_no || payload.order_no
                                  } else {
                                    newOrder._id = orderResponse.id
                                    newOrder.order_no = orderResponse.order_no
                                  }

                                  //remove old order and replace it by new one
                                  delete reservationsRecord.data.page_lookups
                                    .orders._id[orderId]

                                  // eslint-disable-next-line max-len
                                  reservationsRecord.data.page_lookups.orders._id[
                                    newOrder._id
                                  ] = newOrder

                                  orderId = newOrder._id
                                  console.log(
                                    'new OrderId and order to be replaced',
                                    orderId,
                                    newOrder
                                  )
                                }
                                return orderId
                              }
                            )
                          }
                          return reservationData
                        }
                      )

                      var objectStore = DB.getBucket('store', 'readwrite')
                      var request = objectStore.put(reservationsRecord)
                      request.onsuccess = () => {
                        console.log('order synced back in store')
                      }
                    })
                    .catch(error => console.log(error))
                  resolve()
                }
                request.onerror = error => {
                  reject(error)
                }
              } else {
                reject(orderResponse)
              }
            })
            .catch(error => reject(error))
            .finally(() => resolve())
        })
      })
    })
  },
  async syncAboutToFinish() {
    return new Promise((resolve, reject) => {
      DB.find('workflow_order', 'stepstatus', [
        'dinein',
        'on-a-way',
        'offline',
      ]).then(({ records }) => {
        if (!records.length) {
          console.log('nothing to sync')
          resolve()
        } else {
          console.log('dinein order data to sync', records)
          records.forEach(record => {
            let payload = record.request.data || {}
            payload.order_mode = 'offline'

            //find actual reservation which was synced to get real id
            DB.find('workflow_order', 'stepstatus', [
              'dinein',
              'reserved',
              'online',
            ]).then(({ records }) => {
              let url = ''
              if (records.length) {
                const parentRecord = records.find(
                  reservationRec => reservationRec._id === record._id
                )
                url = record.request.url.replace(
                  new RegExp('/id/(\\w+)/'),
                  '/id/' + parentRecord.response.id + '/'
                )
              } else {
                //record was placed online get reservation
                url = record.request.url
              }
              Sync.request(url, record.request.method, payload)
                .then(orderResponse => {
                  if (orderResponse.status === 'ok') {
                    console.log('order data synced as well')
                    record.status = 'online'
                    record.respone = orderResponse
                    //save recard as online
                    var objectStore = DB.getBucket(
                      'workflow_order',
                      'readwrite'
                    )
                    var request = objectStore.put(record)
                    request.onsuccess = () => {
                      //replace in store
                      //1. replace the assigned order ids inside reservation data
                      //2. replace orders in lookup data

                      this.updateOrderinStore(
                        record,
                        'dinein_reservations',
                        'on-a-way',
                        'finished'
                      ).finally(() => {})
                    }
                    request.onerror = error => {
                      reject(error)
                    }
                  } else {
                    reject(orderResponse)
                  }
                })
                .catch(error => reject(error))
                .finally(() => {})
            })
          })
          resolve()
        }
      })
    })
  },
  async syncCompleted() {
    return new Promise((resolve, reject) => {
      DB.find('workflow_order', 'stepstatus', [
        'dinein',
        'finished',
        'offline',
      ]).then(({ records }) => {
        if (!records.length) {
          console.log('nothing to sync')
          resolve()
        } else {
          //remove orders from workflow and store here
          console.log('dinein order data to sync', records)
          records.forEach(record => {
            let payload = record.request.data || {}
            payload.order_mode = 'offline'

            //find actual reservation which was synced to get real id
            DB.find('workflow_order', 'stepstatus', [
              'dinein',
              'reserved',
              'online',
            ]).then(({ records }) => {
              let url = ''
              if (records.length) {
                const parentRecord = records.find(
                  reservationRec => reservationRec._id === record._id
                )
                url = record.request.url.replace(
                  new RegExp('/id/(\\w+)/'),
                  '/id/' + parentRecord.response.id + '/'
                )
              } else {
                //order was online
                //finish it in offline
                url = record.request.url
              }

              Sync.request(url, record.request.method, payload)
                .then(orderResponse => {
                  if (orderResponse.status === 'ok') {
                    console.log('order data finished synced as well')
                    record.status = 'online'
                    record.respone = orderResponse
                    //save recard as online
                    var objectStore = DB.getBucket(
                      'workflow_order',
                      'readwrite'
                    )
                    var request = objectStore.put(record)

                    request.onsuccess = () => {
                      //delete from store in both lookups and the orders

                      this.deleteOrderinStore(
                        record,
                        'dinein_reservations'
                      ).finally(() => {})
                    }
                    request.onerror = error => {
                      reject(error)
                    }
                  } else {
                    reject(orderResponse)
                  }
                })
                .catch(error => reject(error))
                .finally(() => {})
            })
          })
          resolve()
        }
      })
    })
  },
  async syncOrderStatuses() {
    return new Promise(resolve => {
      this.syncAboutToFinish().finally(() => {
        this.syncCompleted().finally(() => {
          resolve()
        })
      })
    })
  },
  //key: dinein_reservations
  updateOrderinStore(workflowRecord, storeKey, reservationStatus, orderStatus) {
    const keys = JSON.parse(workflowRecord.keys)
    //in case of reservation there should be no orderId only reservation id
    //example reservation is being completed
    console.log('keys to be updated', keys)

    return new Promise((resolve, reject) => {
      DB.find('store', 'key', storeKey, 'readwrite')
        .then(({ records, objectStore }) => {
          if (!records.length) {
            resolve()
          } else {
            let storeRecord = records[0]

            let orderIds = []
            //mark order as finished
            if (keys.orderId) {
              orderIds.push(keys.orderId)
            } else {
              //find all orders in that reservation and find keys
              storeRecord.data.data.forEach(booking => {
                if (booking._id === keys.reservationId) {
                  orderIds = booking.related_orders_ids
                }
              })
            }
            //update Lookuo
            orderIds.forEach(orderId => {
              storeRecord.data.page_lookups.orders._id[
                orderId
              ].order_status = orderStatus
            })

            //mark order as completed
            storeRecord.data.data = storeRecord.data.data.map(booking => {
              if (booking._id === keys.reservationId) {
                booking.reservation_status = reservationStatus
                booking.status = reservationStatus
              }
              return booking
            })

            var request = objectStore.put(storeRecord)

            request.onsuccess = event => {
              resolve(event)
            }
            request.onerror = error => {
              console.error(
                1,
                'sw:',
                'Request can not be send to index db',
                error
              )
              reject(error)
            }
          }
        })
        .catch(error => console.log(error))
    })
  },
  deleteOrderinStore(workflowRecord, storeKey) {
    const keys = JSON.parse(workflowRecord.keys)
    //in case of reservation there should be no orderId only reservation id
    //example reservation is being completed
    console.log('keys to be deleted', keys)

    return new Promise((resolve, reject) => {
      DB.find('store', 'key', storeKey, 'readwrite')
        .then(({ records, objectStore }) => {
          if (!records.length) {
            resolve()
          } else {
            let storeRecord = records[0]

            let orderIds = []
            //mark order as finished
            if (keys.orderId) {
              orderIds.push(keys.orderId)
            } else {
              //find all orders in that reservation and find keys
              storeRecord.data.data.forEach(booking => {
                if (booking._id === keys.reservationId) {
                  orderIds = booking.related_orders_ids
                }
              })
            }
            //delete from lookups
            orderIds.forEach(orderId => {
              delete storeRecord.data.page_lookups.orders._id[orderId]
            })

            //delete from orders data
            storeRecord.data.data = storeRecord.data.data.map(
              booking => booking._id !== keys.reservationId
            )

            var request = objectStore.put(storeRecord)

            request.onsuccess = event => {
              resolve(event)
            }
            request.onerror = error => {
              console.error(
                1,
                'sw:',
                'Request can not be send to index db',
                error
              )
              reject(error)
            }
          }
        })
        .catch(error => console.log(error))
    })
  },
  async deleteSynced() {
    //delete from workflow which are online
    //1. get which are finished step: finished, status: "online"
    //2. get reservation where step = reserved and _id from step 1
    //3. remove every thing where _id = _id from step 1
    //4. get related order ids from reservation and delete where id from them
    return new Promise(resolve => {
      let finishedReservations = []
      let reservations = []

      DB.cursor(
        'workflow_order',
        'stepstatus',
        ['dinein', 'finished', 'online'],
        'readwrite',
        (objectStore, cursor) => {
          return new Promise(resolve => {
            finishedReservations.push(cursor.value)
            objectStore.delete(cursor.primaryKey)
            resolve()
          })
        }
      ).then(() => {
        console.log('finished reservations', finishedReservations)
        finishedReservations.forEach(finishedReservation => {
          DB.cursor(
            'workflow_order',
            'idstepstatus',
            [finishedReservation._id, 'dinein', 'reserved', 'online'],
            'readwrite',
            (objectStore, cursor) => {
              return new Promise(resolve => {
                reservations.push(cursor.value)
                objectStore.delete(cursor.primaryKey)
                resolve()
              })
            }
          ).then(() => {
            console.log('base reservations', reservations)
            DB.cursor(
              'workflow_order',
              '_id',
              finishedReservation._id,
              'readwrite',
              (objectStore, cursor) => {
                return new Promise(resolve => {
                  objectStore.delete(cursor.primaryKey)
                  resolve()
                })
              }
            ).then(() => {
              reservations.forEach(reservation => {
                DB.cursor(
                  'workflow_order',
                  'rootStep',
                  reservation.keys,
                  'readwrite',
                  (objectStore, cursor) => {
                    return new Promise(resolve => {
                      objectStore.delete(cursor.primaryKey)
                      resolve()
                    })
                  }
                )
              })
              resolve()
            })
          })
        })
      })
    })
  },
}

var WorkflowOrder = {
  addOfflineEvent: async function(url, payload, method) {
    return new Promise((resolve, reject) => {
      if (method === 'GET') {
        const id = url.replace(new RegExp('.*/id/'), '')
        //search in workflow orders
        DB.find('workflow_order', '_id', id).then(({ records }) => {
          if (records.length) {
            var record = records[0]
            //get table number from the reservation request
            //reservation: {reservationId: "1583129391094"}
            //order: keys: {reservationId: "1583129391094", orderId: "1583

            let keys = {
              reservationId: JSON.parse(record.keys).reservationId,
            }
            if (record.step === 'placed') {
              keys['orderId'] = record._id
            }
            const reservationKeys = JSON.stringify(keys)

            DB.find('workflow_order', 'keys', reservationKeys)
              .then(({ records }) => {
                if (!records.length) {
                  console.log('Error, unable to fetch the record')
                  resolve()
                  return false
                }
                const reservation = records[0]
                let order = record.request.data
                order._id = record._id
                order.order_number = order.real_created_datetime
                  .toString()
                  .replace(/[\s-:]/g, '')

                resolve({
                  collected_data: {
                    status: 'In Progress',
                    order_type: 'Dine In',
                    table_number: reservation.request.data.number,
                    customer: {},
                    page_lookups: {},
                    store_invoice_templates: {},
                  },
                  item: order,
                })
              })
              .catch(error => reject(error))
          } else {
            //no record found in workflow, that means order was placed online but needs to update in offline
            //store must have required data, search id in store
            DB.find('store', 'key', 'dinein_reservations').then(
              ({ records }) => {
                console.log('dinein_reservations records', records)
                let record = records[0]
                //in case of reservation don't filter
                //in case of running filter only in-progress
                if (
                  typeof record.data.page_lookups.orders._id[id] !== 'undefined'
                ) {
                  //find reservation
                  const order = record.data.page_lookups.orders._id[id]
                  const reservation = record.data.data.find(reservation =>
                    reservation.related_orders_ids.includes(id)
                  )
                  resolve({
                    collected_data: reservation,
                    item: order,
                  })
                }
              }
            )
          }
        })
      }
    })
  },
}
if (workbox) {
  enabledConsole && console.log(1, 'sw:', 'workbox found ')
  setupCache()
  enabledConsole && console.log(1, 'sw:', 'cache setup complete')
  setupEventListners()
  enabledConsole && console.log(1, 'sw:', 'event listner setup complete')
}

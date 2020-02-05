// custom service-worker.js
/* global workbox */
/* eslint-disable no-console */
//appVersion has production build number . staging build number . int build number
var appVersion = '6.6.33'

var clientUrl = ''

var ORDER_DOCUMENT = 'order_post_requests'
var LOG_DOCUMENT = 'log'
var client = null
var enabledConsole = false
var notificationOptions = {
  body: '',
  icon: './img/icons/apple-icon.png',
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

var EventListener = {
  setup: function() {
    this._install()
    this._activate()
    this._sync()
    this._message()
    this._push()
    this._fetch()
  },

  _install() {
    self.addEventListener('install', function(event) {
      event.waitUntil(self.skipWaiting()) // Activate worker immediately
    })
  },

  _activate() {
    self.addEventListener('activate', function(event) {
      enabledConsole && console.log(1, 'sw:', 'in activation')
      event.waitUntil(
        caches.keys().then(function(cacheNames) {
          enabledConsole && console.log('cachenames', cacheNames)
          self.clients.claim()
          enabledConsole && console.log('update cachenames', cacheNames)
          return Promise.all(
            cacheNames
              // eslint-disable-next-line no-unused-vars
              .filter(function(cacheName) {
                enabledConsole && console.log('clear this one? ', cacheName)
                return true
                // Return true if you want to remove this cache,
                // but remember that caches are shared across
                // the whole origin
              })
              .map(function(cacheName) {
                enabledConsole && console.log('clearing ', cacheName)
                return caches.delete(cacheName)
              })
          )
        })
      )
    })
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

      var handler = Factory.offlineHandler(clonedRequest)
      if (handler) {
        // attempt to send request normally
        event.respondWith(
          fetch(clonedRequest).catch(function(error) {
            // only save post requests in browser, if an error occurs, GET FROM MSG WE SEND EARLIER
            //we saved form_data global var from msg
            enabledConsole &&
              console.log(
                1,
                'sw:',
                'Network offline, saving request offline',
                error
              )
            handler
              .addOfflineEvent(clonedRequest.url, Sync.formData)
              .then(() => {
                Sync.formData = null
              })
          })
        )
      }

      if (!event.clientId) {
        return
      }

      self.clients.get(event.clientId).then(thisClient => {
        if (thisClient) {
          client = thisClient
        }
      })
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
  request(requestUrl, method, payload) {
    return new Promise((resolve, reject) => {
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
    return [Order, DeliveryManager]
  },

  offlineHandler(request) {
    switch (request.method) {
      case 'POST':
        if (request.url.match('/orders/add')) {
          return Order
        }
        if (request.url.match('/deliveryManager/add')) {
          return DeliveryManager
        }

        break
      case 'GET':
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
          resolve()
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

if (workbox) {
  enabledConsole && console.log(1, 'sw:', 'workbox found ')
  setupCache()
  enabledConsole && console.log(1, 'sw:', 'cache setup complete')
  setupEventListners()
  enabledConsole && console.log(1, 'sw:', 'event listner setup complete')
}

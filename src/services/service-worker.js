// custom service-worker.js
/* global workbox */
/* eslint-disable no-console */
var clientUrl = ''

var ORDER_DOCUMENT = 'order_post_requests'
var LOG_DOCUMENT = 'log'
var client = null

var lastSynced = new Date().getTime()

var notificationOptions = {
  body: '',
  icon: './img/icons/favicon.png',
  image: './img/icons/favicon.png',
  vibrate: [300, 200, 300],
  badge: './img/icons/favicon.png',
}

if (workbox) {
  console.log('sw:', 'workbox found ')
  setupCache()
  console.log('cache setup complete')
  setupEventListners()
  console.log('event listner setup complete')
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
  SYNC_AFTER_SECONDS: 30, //5sec, 60 * 5 = 5 min

  setup() {
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
      event.waitUntil(self.clients.claim()) // Become available to all pages
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
      //console.log('sw:', 'form data', event.data)
      if (event.data.hasOwnProperty('form_data')) {
        // receives form data from script.js upon submission
        Sync.formData = event.data.formData
        console.log(
          'sw:',
          'assigned form data to service worker',
          Sync.formData
        )
      }

      //this is manually sync, we ll remove it later
      else if (event.data.hasOwnProperty('sync')) {
        //console.log('sw:', 'sync event received ', event.data)
        var nowTime = new Date().getTime()
        // console.log(
        //   'sw:',
        //   'last synced',
        //   lastSynced,
        //   'sync received',
        //   nowTime,
        //   'seconds passed last sync',
        //   (nowTime - lastSynced) / 1000
        // )

        if (nowTime - lastSynced > this.SYNC_AFTER_SECONDS * 1000) {
          console.log(
            'sw:',
            this.SYNC_AFTER_SECONDS,
            ' seconds passed, syncing now'
          )
          lastSynced = nowTime
          const syncIt = async () => {
            return new Promise(resolve => {
              setTimeout(function() {
                Sync.backgroudSync(resolve)
              }, 1000 * 10)
            })
          }
          event.waitUntil(syncIt())
        } else {
          // console.log(
          //   SYNC_AFTER_SECONDS,
          //   ' not passed from last sync, do not sync now'
          // )
        }
      }
    })
  },

  //intercept api calls and if no network available then get data from temp variables and store
  //it to the indexeddb

  _fetch() {
    self.addEventListener('fetch', function(event) {
      // every request from our site, passes through the fetch handler
      var clonedRequest = event.request.clone()
      //console.log('I am a request with url: ', clonedRequest.url)
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
            console.log('sw:', 'Network offline, saving request offline', error)
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

      self.clients.get(event.clientId).then(thisClient => (client = thisClient))
    })
  },

  //sync event, when system comes online, lets sync what we have in indexedDB
  _sync() {
    self.addEventListener('sync', function(event) {
      console.log('sw:', 'browser sync event received', event)
    })
  },
}

var DB = {
  IDB_VERSION: 4,
  iDB: null,
  getBucket: function(storeName, mode) {
    // retrieve our object store
    return this.iDB.transaction(storeName, mode).objectStore(storeName)
  },

  open: function(cb) {
    if (this.iDB) {
      console.log('sw:', 'IDB already opened')
      if (cb) {
        console.log('sw:', 'calling callback to insert data')
        cb(this.iDB)
      }
    } else {
      console.log('sw:', 'opening database')
      var indexedDBOpenRequest = indexedDB.open('dim-pos', this.IDB_VERSION)

      indexedDBOpenRequest.onerror = function(error) {
        // error creating db
        console.error('sw:', 'IndexedDB open error:', error)
      }

      // This will execute each time the database is opened.
      indexedDBOpenRequest.onsuccess = function() {
        console.log(
          'sw:',
          'db opened for success . Save your database handler, for example something, DB_HANDLER = event.target.result'
        )
        this.iDB = this.result
        if (cb) {
          console.log('sw:', 'calling callback to insert data')
          cb(this.iDB)
        }
      }

      indexedDBOpenRequest.onblocked = function(event) {
        console.log(
          'sw:',
          'sw block error not important, already opened',
          event
        )
        this.iDB = this.result
        // Another connection is open, preventing the upgrade,
        // and it didn't close immediately.
      }
    }
  },
}

var Sync = {
  formData: null,
  headers: null,
  dbAuthData: null,
  msg: 'Offline orders are synced with server.',

  sendTokenToClient: function(token) {
    client.postMessage({
      msg: 'token',
      data: token,
    })
  },

  backgroudSync: async function(resolve) {
    DB.open(async () => {
      //open db before sync, db is opened only when insertion, there might be a case when
      //there is no insertion but sync is needed
      await Promise.all(Factory.syncHandlers().sync())
      resolve()
    })
  },
  auth() {
    if (this.headers) {
      return Promise.resolve(this.headers)
    }

    return new Promise((resolve, reject) => {
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
      authreq.onsuccess = async function(event) {
        reject(event)
      }
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
              console.log('sw: ', 'refresh token response', response)

              this.headers.authorization = 'Bearer ' + response.token
              this.dbAuthData.token = response.token

              DB.getBucket('auth', 'readwrite').put(this.dbAuthData)

              this.sendTokenToClient(response.token)
              console.log('second request to create order')
              resolve(this.headers)
            })
            .catch(function(response) {
              console.log('sw: ', 'Second request Error ', response)
              reject(response)
            })
        })
        .catch(error => reject(error))
    })
  },
  request(requestUrl, method, payload) {
    return new Promise((resolve, reject) => {
      this.auth(headers => {
        fetch(requestUrl, {
          headers: headers,
          method: method,
          body: JSON.stringify(payload),
        }).then(response => {
          //handle both code errors and network error
          if (response.status < 400) {
            response.json().then(response => {
              resolve(response)
            })
          } else if (response.status == 401) {
            //network / token expired, reauth
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
                console.log('New token successful, resend request')
                this.request(requestUrl, method, payload)
              })
              .catch(error => {
                console.log('sw:', 'Token refresh failed')
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
    console.log('sw:', data)
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

    return Sync.request(requestUrl, method, payload)
  },
}

var Order = {
  addOfflineEvent: function(url, payload) {
    return new Promise((resolve, reject) => {
      // get object_store and save our payload inside it
      console.log('sw:', 'try open db')

      DB.open(() => {
        console.log('sw:', 'db opened, adding offline order to indexeddb')
        var data = {
          order_time: payload.real_created_datetime,
          url: url,
          payload: payload,
          method: 'POST',
        }
        var request = DB.getBucket(ORDER_DOCUMENT, 'readwrite').add(data)
        request.onsuccess = function(event) {
          console.log(
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
          console.error('sw:', "Request can't be send to index db", error)
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
          //console.log('sw:', 'Saved Reqeusts', savedRequests)

          if (!savedRequests.length) {
            console.log('sw:', 'No request found')
            return resolve()
          }

          for (let savedRequest of savedRequests) {
            const orderUrl = savedRequest.url
            const contextUrl = orderUrl.replace(new RegExp('/model/.*'), '')

            console.log(
              'sw:',
              'transition order number: ',
              savedRequest.payload.transition_order_no
            )

            savedRequest.payload.order_mode = 'offline'
            var payload = savedRequest.payload

            //check if delivery order
            if (payload.order_type == 'call_center' && !payload.customer) {
              console.log(
                'sw:',
                'no customer was selected so need to create a customer'
              )
              var customerPayload = payload.user
              //payload.user is always available either its online or offline
              console.log('sw:', 'delivery order')
              //create customer uses fetch which returns promise
              console.log('sw:', 'creating customer')

              delete customerPayload.city
              delete customerPayload.country

              Customer.createCustomer(customerPayload, contextUrl)
                .then(response => response.json())
                .then(response => {
                  console.log('sw:', 'customer created ', response)
                  //customer created

                  //modify the original payload to be sent to order
                  savedRequest.payload.customer = response.id

                  this.createOrder(resolve, reject, savedRequest)
                })
                .catch(err => {
                  console.log(
                    'sw:',
                    'Request to save customer failed with error ',
                    err,
                    customerPayload
                  )
                  reject(err)
                })
            } else {
              //app_uniqueid
              //transition_order_no
              console.log('sw:', 'Not delivery order')
              this.createOrder(resolve, reject, savedRequest)
            }
          }
        }
      }
    })
  },

  createOrder: function(resolve, reject, savedRequest) {
    var method = savedRequest.method
    var requestUrl = savedRequest.url
    var payload = savedRequest.payload
    delete payload.user

    Sync.request(requestUrl, method, payload)
      .then(response => {
        console.log('sw:', 'server response', response)
        if (response.status == 200) {
          response.json().then(response => {
            var requestUpdate
            if (response.status === 'ok' && response.id) {
              console.log(
                'sw:',
                'order synced successfully',
                savedRequest.payload.real_created_datetime,
                response
              )
              requestUpdate = DB.getBucket(ORDER_DOCUMENT, 'readwrite').delete(
                savedRequest.payload.real_created_datetime
              )

              requestUpdate.onerror = function(event) {
                console.log('sw:', 'order delete failed', event)
              }
              requestUpdate.onsuccess = function(event) {
                // Success - the data is updated!
                console.log('sw:', 'order deleted successfully', event)
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

              notificationOptions.body = 'Offline orders synced successfully.'
              resolve(
                self.registration.showNotification(
                  'POS synced',
                  notificationOptions
                )
              )
            } else {
              console.log(
                'sw:',
                'order sync failed',
                response.form_errors,
                response
              )
              Logger.log({
                event_time: savedRequest.payload.real_created_datetime,
                event_title: savedRequest.payload.balance_due,
                event_type: 'sw:order_sync_failed_delete',
                event_data: {
                  request: savedRequest.payload,
                  response: response,
                },
              })

              requestUpdate = DB.getBucket(ORDER_DOCUMENT, 'readwrite').delete(
                savedRequest.payload.real_created_datetime
              )

              requestUpdate.onerror = function(event) {
                console.log('sw:', 'order delete failed', event)
              }
              requestUpdate.onsuccess = function(event) {
                // Success - the data is updated!
                console.log('sw:', 'order delted successfully', event)
              }
            }
          })
          resolve(response)
        }
      })
      .catch(error => {
        console.log(
          'sw:',
          'error sending request for sync, network failed',
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
  },
}

var DeliveryManager = {
  addOfflineEvent: function(url, payload) {
    // get object_store and save our payload inside it
    console.log('sw:', 'try open db')

    DB.open(function() {
      console.log('sw:', 'db opened, adding rec')
      var request = DB.getBucket(ORDER_DOCUMENT, 'readwrite').add({
        url: url,
        payload: payload,
        method: 'POST',
      })
      request.onsuccess = function(event) {
        console.log(
          'sw:',
          'a new order request has been added to indexedb',
          event
        )
      }
      request.onerror = function(error) {
        console.error('sw:', "Request can't be send to index db", error)
      }
    })
  },
  sync() {
    return new Promise()
  },
}

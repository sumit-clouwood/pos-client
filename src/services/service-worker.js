// custom service-worker.js
/* global workbox */
/* eslint-disable no-console */
var clientUrl = ''

var form_data
var IDB_VERSION = 3
var ORDER_DOCUMENT = 'order_post_requests'

var client = null

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
  _eventListner_install()
  _eventListner_activate()
  _eventListner_sync()
  _eventListner_message()
  _eventListner_push()
  _eventListner_fetch()
}

function _eventListner_install() {
  self.addEventListener('install', function(event) {
    event.waitUntil(self.skipWaiting()) // Activate worker immediately
  })
}
function _eventListner_activate() {
  self.addEventListener('activate', function(event) {
    event.waitUntil(self.clients.claim()) // Become available to all pages
  })
}

function _eventListner_push() {
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
}

//we send form data earlier before sending the actual request
//if request was failed we get form data and add that to indexedb for offline
//otherwise don't don any thing
//messages can be received from pos app i.e to store temporary data in variables
function _eventListner_message() {
  //custom events
  self.addEventListener('message', function(event) {
    console.log('sw:', 'form data', event.data)
    if (event.data.hasOwnProperty('form_data')) {
      // receives form data from script.js upon submission
      form_data = event.data.form_data
    }
  })
}

//intercept api calls and if no network available then get data from temp variables and store
//it to the indexeddb

function _eventListner_fetch() {
  self.addEventListener('fetch', function(event) {
    // every request from our site, passes through the fetch handler
    var clonedRequest = event.request.clone()
    //console.log('I am a request with url: ', clonedRequest.url)
    var handler = Factory.offlineHandler(clonedRequest)
    if (handler) {
      // attempt to send request normally
      event.respondWith(
        fetch(clonedRequest).catch(function(error) {
          // only save post requests in browser, if an error occurs, GET FROM MSG WE SEND EARLIER
          //we saved form_data global var from msg
          console.log('sw:', 'Network offline, saving request offline', error)
          handler.addOfflineEvent(clonedRequest.url, form_data)
        })
      )
    }

    if (!event.clientId) {
      return
    }

    self.clients.get(event.clientId).then(thisClient => (client = thisClient))
  })
}

//sync event, when system comes online, lets sync what we have in indexedDB
function _eventListner_sync() {
  self.addEventListener('sync', function(event) {
    console.log(
      'sw:',
      'SYNC EVENT RECEIVED, now online, lets try postofflineorders'
    )
    console.log('sw:', event)

    if (event.tag === 'syncpos') {
      console.log('sw:', 'correct event received')

      // event.tag name checked
      // here must be the same as the one used while registering
      // sync`
      // Send our POST request to the server, now that the user is online

      const syncIt = async () => {
        return new Promise(resolve => {
          Sync.backgroudSync()
            .then(msg => {
              try {
                notificationOptions.body = msg
                resolve(
                  self.registration.showNotification(
                    'POS synced',
                    notificationOptions
                  )
                )
              } catch (e) {
                console.log('sw:', e)
              }
            })
            .catch(err => {
              console.log('sw:', 'Error syncing orders to server', err)
            })
        })
      }

      event.waitUntil(syncIt())
    }
  })
}

var Customer = {
  createCustomer: function(headers, payload, contextUrl, authData) {
    var method = 'POST'
    var requestUrl = contextUrl + '/model/brand_customers/add'
    // requestUrl = requestUrl.replace(
    //   new RegExp('/api/(.*)/.*/model/'),
    //   '/api/$1/model/'
    // )

    if (!payload.alternative_phone) payload.alternative_phone = null
    if (!payload.gender) payload.gender = 'undisclosed'
    if (!payload.customer_group) payload.customer_group = null

    return new Promise((resolve, reject) => {
      fetch(requestUrl, {
        headers: headers,
        method: method,
        body: JSON.stringify(payload),
      }).then(response => {
        if (response.status < 400) {
          resolve(response)
        } else if (response.status == 401) {
          console.log(
            'sw: ',
            'Token expired, unauthorized access, get refresh token'
          )
          fetch(requestUrl.replace(new RegExp('/api/.*'), '/api/refresh'), {
            headers: headers,
            method: method,
            body: null,
          })
            .then(response => response.json())
            .then(response => {
              console.log('sw: ', 'refresh token response', response)
              headers.token = response.token
              authData.token = response.token
              DB.getBucket('auth', 'readwrite').put(authData)
              Sync.sendTokenToClient(client, 'token', response.token)
              console.log('second request to create order')
              Customer.createCustomer(headers, payload, contextUrl, authData)
            })
            .catch(function(response) {
              console.log('sw: ', 'Second request Error ', response)
              reject(response)
            })
        }
      })
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
}
var Order = {
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
  createOrder: function(resolve, reject, headers, authData, savedRequest) {
    var method = savedRequest.method
    var requestUrl = savedRequest.url
    var payload = savedRequest.payload
    delete payload.user
    payload = JSON.stringify(payload)

    fetch(requestUrl, {
      headers: headers,
      method: method,
      body: payload,
    })
      .then(function(response) {
        console.log('sw:', 'server response', response)
        if (response.status < 400) {
          // If sending the POST request was successful, then
          // remove it from the IndexedDB.
          //increment in the order number

          var requestUpdate = DB.getBucket('auth', 'readwrite').put(authData)

          requestUpdate.onerror = function(event) {
            console.log('sw:', 'update failed', event)
          }
          requestUpdate.onsuccess = function(event) {
            // Success - the data is updated!
            console.log('sw:', 'update good', event)
          }

          console.log('sw:', 'Removing request from index db', savedRequest.id)
          DB.getBucket(ORDER_DOCUMENT, 'readwrite').delete(savedRequest.id)

          resolve(response)
        } else if (response.status == 401) {
          console.log(
            'sw: ',
            'Token expired, unauthorized access, get refresh token'
          )
          fetch(requestUrl.replace(new RegExp('/api/.*'), '/api/refresh'), {
            headers: headers,
            method: method,
            body: null,
          })
            .then(response => response.json())
            .then(response => {
              console.log('sw: ', 'refresh token response', response)
              headers.token = response.token
              authData.token = response.token
              Sync.sendTokenToClient(client, 'token', response.token)
              DB.getBucket('auth', 'readwrite').put(authData)
              console.log('second request to create order')
              Order.createOrder(
                resolve,
                reject,
                headers,
                authData,
                savedRequest
              )
            })
            .catch(function(response) {
              console.log('sw: ', 'Second request Error ', response)
            })
        }
      })
      .catch(function(error) {
        // This will be triggered if the network is still down.
        // The request will be replayed again
        // the next time the service worker starts up.
        console.error('sw:', 'Send to Server failed:', error)
        // since we are in a catch, it is important an error is
        //thrown,so the background sync knows to keep retrying
        // the send to server
        reject(error)
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
    console.log('sw:', 'opening database')
    var indexedDBOpenRequest = indexedDB.open('dim-pos', IDB_VERSION)

    indexedDBOpenRequest.onerror = function(error) {
      // error creating db
      console.error('sw:', 'IndexedDB open error:', error)
    }

    //this ll be nerver called because we have same version as app and store already created
    indexedDBOpenRequest.onupgradeneeded = function() {
      this.iDB = this.result
      console.log(
        'sw:',
        'db opened for upgrade Create/modify the database schema'
      )
      // This should only executes if there's a need to
      // create/update db.
      var objectStore = this.result.createObjectStore(ORDER_DOCUMENT, {
        autoIncrement: true,
        keyPath: 'id',
      })

      objectStore.transaction.oncomplete = function() {
        console.log('sw:', 'create bucket complete', ORDER_DOCUMENT)
        if (cb) {
          console.log('sw:', 'calling callback to insert data')
          cb(this.iDB)
        }
      }
      objectStore.transaction.onerror = function(event) {
        console.log('sw:', 'create bucket complete', event, ORDER_DOCUMENT)
      }
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
      console.log('sw:', 'sw block error not important, already opened', event)
      this.iDB = this.result
      // Another connection is open, preventing the upgrade,
      // and it didn't close immediately.
    }
  },
}

var Sync = {
  msg: 'Offline orders are synced with server.',

  sendTokenToClient: function(client, msg, data) {
    client.postMessage({
      msg: msg,
      data: data,
    })
  },

  backgroudSync: function() {
    return new Promise((resolve, reject) => {
      if (!DB.iDB) {
        DB.open(() => {
          this.syncOrders()
            .then(() => resolve(this.msg))
            .catch(e => reject(e))
        })
      } else {
        this.syncOrders()
          .then(() => resolve(this.msg))
          .catch(e => reject(e))
      }
    })
  },
  syncOrders: function() {
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
          console.log('sw:', 'Saved Reqeusts', savedRequests)

          if (!savedRequests.length) {
            console.log('sw:', 'No request found')
          }
          //add unique id and order id
          //read from the indexedDB
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
                authData = authData[0]

                var authToken = authData.token
                var branch_n = authData.branch_n
                var terminal_code = authData.terminal_code
                //var lastOrderNo = parseInt(authData.lastOrderNo) || 0

                for (let savedRequest of savedRequests) {
                  const orderUrl = savedRequest.url
                  const contextUrl = orderUrl.replace(
                    new RegExp('/model/.*'),
                    ''
                  )
                  const time = savedRequest.payload.real_created_datetime
                  //lastOrderNo++
                  var transitionOrderNo =
                    branch_n + '-' + terminal_code + '-' + time

                  console.log('transition order number: ', transitionOrderNo)

                  // send them to the server one after the other

                  savedRequest.payload.transition_order_no = transitionOrderNo
                  savedRequest.payload.order_mode = 'offline'

                  var headers = {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    authorization: 'Bearer ' + authToken,
                  } // if you have any other headers put them here

                  var payload = savedRequest.payload

                  //check if delivery order
                  if (
                    payload.order_type == 'call_center' &&
                    !payload.customer
                  ) {
                    console.log(
                      'no customer was selected so need to create a customer'
                    )
                    var customerPayload = payload.user
                    //payload.user is always available either its online or offline
                    console.log('sw:', 'delivery order')
                    //create customer uses fetch which returns promise
                    console.log('sw:', 'creating customer')

                    delete customerPayload.city
                    delete customerPayload.country

                    Customer.createCustomer(
                      headers,
                      customerPayload,
                      contextUrl,
                      authData
                    )
                      .then(response => response.json())
                      .then(response => {
                        console.log('sw:', 'customer created ', response)
                        //customer created

                        //modify the original payload to be sent to order
                        savedRequest.payload.customer = response.id

                        Order.createOrder(
                          resolve,
                          reject,
                          headers,
                          authData,
                          savedRequest
                        )
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
                    Order.createOrder(
                      resolve,
                      reject,
                      headers,
                      authData,
                      savedRequest
                    )
                  }
                }
              }
            }
          }
        }
      }
    })
  },
}

var Factory = {
  handler(request) {
    switch (request.method) {
      case 'POST':
        if (request.url.match('/orders/add')) {
          return Order
        }
        break
      case 'GET':
        break
    }
  },
}

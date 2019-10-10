// custom service-worker.js
/* global workbox */
/* eslint-disable no-console */
var clientUrl = ''

var iDB
var form_data
var IDB_VERSION = 4
var APP_VERSION = 3
var ORDER_DOCUMENT = 'order_post_requests'
var LOG_DOCUMENT = 'log'
var client = null
var SYNC_AFTER_SECONDS = 0 //5sec, 60 * 5 = 5 min
var lastSynced = new Date().getTime()

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
  badge: './img/icons/favicon.png?v=' + APP_VERSION,
}

if (workbox) {
  console.log('sw:', 'workbox found ')

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

  self.addEventListener('sync', function(event) {
    console.log('sw:', 'browser sync event received', event)
    // console.log(
    //   'sw:',
    //   'SYNC EVENT RECEIVED, now online, lets try postofflineorders'
    // )
    // console.log('sw:', event)
    // if (event.tag === 'postOfflineOrders') {
    //   console.log('sw:', 'correct event received')
    //   // event.tag name checked
    //   // here must be the same as the one used while registering
    //   // sync`
    //   // Send our POST request to the server, now that the user is online
    //   const syncIt = async () => {
    //     return new Promise(resolve => {
    //       sendPostToServer()
    //         .then(() => {
    //           try {
    //             notificationOptions.body =
    //               'Offline orders are synced with server.'
    //             resolve(
    //               self.registration.showNotification(
    //                 'POS synced',
    //                 notificationOptions
    //               )
    //             )
    //           } catch (e) {
    //             console.log('sw:', e)
    //           }
    //         })
    //         .catch(err => {
    //           console.log('sw:', 'Error syncing orders to server', err)
    //         })
    //     })
    //   }
    //   event.waitUntil(syncIt())
    // }
  })

  //this is manually sync, we ll remove it later
  self.addEventListener('message', function(event) {
    if (event.data.hasOwnProperty('sync')) {
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

      if (nowTime - lastSynced > SYNC_AFTER_SECONDS * 1000) {
        console.log('sw:', SYNC_AFTER_SECONDS, ' seconds passed, syncing now')
        lastSynced = nowTime
        const syncIt = async () => {
          return new Promise(resolve => {
            setTimeout(function() {
              sendPostToServer()
                .then(() => {
                  notificationOptions.body = 'Offline orders are synced'
                  resolve(
                    self.registration.showNotification(
                      'POS synced',
                      notificationOptions
                    )
                  )
                })
                .catch(() => {
                  console.log('sw:', 'SW Error syncing orders to server')
                })
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

  self.addEventListener('message', function(event) {
    //console.log('sw:', 'form data', event.data)
    if (event.data.hasOwnProperty('form_data')) {
      // receives form data from script.js upon submission
      form_data = event.data.form_data
      console.log('sw:', 'assigned form data to service worker', form_data)
    }
  })

  self.addEventListener('fetch', function(event) {
    // every request from our site, passes through the fetch handler
    var clonedRequest = event.request.clone()
    //console.log('I am a request with url: ', clonedRequest.url)

    if (
      form_data &&
      clonedRequest.method === 'POST' &&
      clonedRequest.url.match('/orders/add')
    ) {
      // attempt to send request normally
      event.respondWith(
        fetch(clonedRequest).catch(function(error) {
          // only save post requests in browser, if an error occurs, GET FROM MSG WE SEND EARLIER
          //we saved form_data global var from msg
          console.log('sw:', 'error happened when posting', error)
          console.log('sw:', 'Save to indexeddb for later send')
          savePostRequests(clonedRequest.url, form_data)
        })
      )
    }

    if (!event.clientId) {
      return
    }

    self.clients.get(event.clientId).then(thisClient => (client = thisClient))
  })

  self.addEventListener('install', function(event) {
    event.waitUntil(self.skipWaiting()) // Activate worker immediately
  })

  self.addEventListener('activate', function(event) {
    event.waitUntil(self.clients.claim()) // Become available to all pages
  })
}

function getObjectStore(storeName, mode) {
  // retrieve our object store
  return iDB.transaction(storeName, mode).objectStore(storeName)
}
function savePostRequests(url, payload) {
  // get object_store and save our payload inside it
  //console.log('sw:', 'try open db')

  openDatabase(function(idb) {
    console.log('sw:', 'db opened, adding offline order to indexeddb', idb)
    var data = {
      order_time: payload.real_created_datetime,
      url: url,
      payload: payload,
      method: 'POST',
    }
    var request = getObjectStore(ORDER_DOCUMENT, 'readwrite').add(data)
    request.onsuccess = function(event) {
      console.log(
        'sw:',
        'a new order request has been added to indexedb',
        event
      )

      log({
        event_time: payload.real_created_datetime,
        event_title: payload.balance_due,
        event_type: 'sw:order_save_offline',
        event_data: payload,
      })

      //reset form data
      form_data = null
    }
    request.onerror = function(error) {
      console.error('sw:', "Request can't be send to index db", error)
      log({
        event_time: payload.real_created_datetime,
        event_title: payload.balance_due,
        event_type: 'sw:error_order_save_offline',
        event_data: { request: payload, error: error },
      })
    }
  })
}

function openDatabase(cb) {
  //console.log('sw:', 'opening database')
  var indexedDBOpenRequest = indexedDB.open('dim-pos', IDB_VERSION)

  indexedDBOpenRequest.onerror = function(error) {
    // error creating db
    console.error('sw:', 'IndexedDB open error:', error)
  }

  // This will execute each time the database is opened.
  indexedDBOpenRequest.onsuccess = function() {
    // console.log(
    //   'sw:',
    //   'db opened for success . Save your database handler, for example something, DB_HANDLER = event.target.result'
    // )
    iDB = this.result
    if (cb) {
      //console.log('sw:', 'calling callback to insert data')
      cb(iDB)
    }
  }

  indexedDBOpenRequest.onblocked = function(event) {
    console.log('sw:', 'sw block error not important, already opened', event)
    iDB = this.result
    // Another connection is open, preventing the upgrade,
    // and it didn't close immediately.
  }
}

function sendPostToServer() {
  return new Promise((resolve, reject) => {
    if (!iDB) {
      openDatabase(() => {
        sendToServer()
          .then(() => resolve())
          .catch(e => reject(e))
      })
    } else {
      sendToServer()
        .then(() => resolve())
        .catch(e => reject(e))
    }
  })
}

function sendToServer() {
  return new Promise((resolve, reject) => {
    var savedRequests = []
    var req = getObjectStore(ORDER_DOCUMENT).openCursor() // FOLDERNAME
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
        }
        //add unique id and order id
        //read from the indexedDB
        var authreq = getObjectStore('auth').openCursor()
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

              //var lastOrderNo = parseInt(authData.lastOrderNo) || 0

              for (let savedRequest of savedRequests) {
                const orderUrl = savedRequest.url
                const contextUrl = orderUrl.replace(new RegExp('/model/.*'), '')
                //const time = savedRequest.payload.real_created_datetime
                //lastOrderNo++
                //var transitionOrderNo =
                //  branch_n + '-' + terminal_code + '-' + time

                console.log(
                  'sw:',
                  'transition order number: ',
                  savedRequest.payload.transition_order_no
                )

                // send them to the server one after the other

                //savedRequest.payload.transition_order_no = transitionOrderNo
                savedRequest.payload.order_mode = 'offline'

                var headers = {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  authorization: 'Bearer ' + authToken,
                } // if you have any other headers put them here

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

                  createCustomer(headers, customerPayload, contextUrl, authData)
                    .then(response => response.json())
                    .then(response => {
                      console.log('sw:', 'customer created ', response)
                      //customer created

                      //modify the original payload to be sent to order
                      savedRequest.payload.customer = response.id

                      createOrder(
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
                  createOrder(resolve, reject, headers, authData, savedRequest)
                }
              }
            }
          }
        }
      }
    }
  })
}

var createOrder = function(resolve, reject, headers, authData, savedRequest) {
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
    //.then(response => response.json())
    .then(function(response) {
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
            requestUpdate = getObjectStore(ORDER_DOCUMENT, 'readwrite').delete(
              savedRequest.payload.real_created_datetime
            )

            requestUpdate.onerror = function(event) {
              console.log('sw:', 'order delete failed', event)
            }
            requestUpdate.onsuccess = function(event) {
              // Success - the data is updated!
              console.log('sw:', 'order delted successfully', event)
            }

            log({
              event_time: savedRequest.payload.real_created_datetime,
              event_title: savedRequest.payload.balance_due,
              event_type: 'sw:order_synced',
              event_data: { request: savedRequest.payload, response: response },
            })
          } else {
            console.log(
              'sw:',
              'order sync failed',
              response.form_errors,
              response
            )
            log({
              event_time: savedRequest.payload.real_created_datetime,
              event_title: savedRequest.payload.balance_due,
              event_type: 'sw:order_sync_failed_delete',
              event_data: { request: savedRequest.payload, response: response },
            })

            requestUpdate = getObjectStore(ORDER_DOCUMENT, 'readwrite').delete(
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
      } else if (response.status == 401) {
        log({
          event_time: savedRequest.payload.real_created_datetime,
          event_title: savedRequest.payload.balance_due,
          event_type: 'sw:order_sync_token_failed',
          event_data: { request: payload, response: 'auth token failed' },
        })

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
            log({
              event_time: savedRequest.payload.real_created_datetime,
              event_title: savedRequest.payload.balance_due,
              event_type: 'sw:order_sync_token_refreshed',
              event_data: { request: payload, response: response },
            })
            console.log('sw: ', 'refresh token response', response)
            headers.token = response.token
            authData.token = response.token
            sendTokenToClient('token', response.token)
            getObjectStore('auth', 'readwrite').put(authData)
            console.log('sw:', 'second request to create order')
            createOrder(resolve, reject, headers, authData, savedRequest)
          })
          .catch(function(response) {
            console.log('sw: ', 'Second request Error ', response)
          })
      }
    })
    .catch(error => {
      console.log(
        'sw:',
        'error sending request for sync, network failed',
        error
      )
      log({
        event_time: savedRequest.payload.real_created_datetime,
        event_title: savedRequest.payload.balance_due,
        event_type: 'sw:order_sync_network_fail',
        event_data: { request: payload, response: 'Network not available' },
      })
      reject(error)
    })
}

function sendTokenToClient(msg, data) {
  client.postMessage({
    msg: msg,
    data: data,
  })
}

var createCustomer = function(headers, payload, contextUrl, authData) {
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
            getObjectStore('auth', 'readwrite').put(authData)
            sendTokenToClient('token', response.token)
            console.log('sw:', 'second request to create order')
            createCustomer(headers, payload, contextUrl, authData)
          })
          .catch(function(response) {
            console.log('sw: ', 'Second request Error ', response)
            reject(response)
          })
      }
    })
  })
}
function log(data) {
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
  getObjectStore(LOG_DOCUMENT, 'readwrite').add(data)
}

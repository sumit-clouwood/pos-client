importScripts("https://delivery.erp-pos.com/vue-pos/precache-manifest.73aa855445373141acb3cbb0720b0719.js", "https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");

// custom service-worker.js
/* global workbox navigator */
/* eslint-disable no-console */

var iDB
var form_data
var IDB_VERSION = 2
var ORDER_DOCUMENT = 'order_post_requests'

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
  workbox.routing.registerNavigationRoute(
    'https://delivery.erp-pos.com/vue-pos/index.html'
  )

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

  // const queue = new workbox.backgroundSync.Queue('ordersQueue')
  // self.addEventListener('fetch', event => {
  //   // Clone the request to ensure it's save to read when
  //   // adding to the Queue.
  //   if (event.request.url.match(/SaveOrder/g)) {
  //     return queue.addRequest(event.request)

  //     // const promiseChain = fetch(event.request.clone()).catch(() => {
  //     //   return queue.addRequest(event.request)
  //     // })

  //     // event.waitUntil(promiseChain)
  //   }
  // })

  // self.addEventListener('sync', event => {
  //   event.waitUntil(
  //     new Promise(resolve => {
  //       resolve('hello')
  //     })
  //   )
  // })

  self.addEventListener('sync', function(event) {
    console.log('SYNC EVENT RECEIVED, now online, lets try postofflineorders')
    console.log(event)

    if (event.tag === 'postOfflineOrders') {
      console.log('correct event received')

      // event.tag name checked
      // here must be the same as the one used while registering
      // sync
      // Send our POST request to the server, now that the user is online

      const syncIt = async () => {
        return new Promise(resolve => {
          sendPostToServer()
            .then(() => {
              self.registration.showNotification('Orders synced to server')
            })
            .catch(() => {
              console.log('Error syncing orders to server')
            })

          resolve(self.registration.showNotification('Orders synced to server'))
        })
      }

      event.waitUntil(syncIt())
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

  self.addEventListener('message', function(event) {
    console.log('form data', event.data)
    if (event.data.hasOwnProperty('form_data')) {
      // receives form data from script.js upon submission
      form_data = event.data.form_data
    }
  })

  self.addEventListener('fetch', function(event) {
    // every request from our site, passes through the fetch handler
    var clonedRequest = event.request.clone()
    //console.log('I am a request with url: ', clonedRequest.url)

    if (clonedRequest.method === 'POST' || clonedRequest.method === 'OPTIONS') {
      // attempt to send request normally
      event.respondWith(
        fetch(clonedRequest).catch(function(error) {
          // only save post requests in browser, if an error occurs, GET FROM MSG WE SEND EARLIER
          //we saved form_data global var from msg
          console.log('error happened when posting', error)
          savePostRequests(clonedRequest.url, form_data)
        })
      )
    }
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
  console.log('try open db')

  openDatabase(function(idb) {
    console.log('db opened, adding rec', idb)
    var request = getObjectStore(ORDER_DOCUMENT, 'readwrite').add({
      url: url,
      payload: payload,
      method: 'POST',
    })
    request.onsuccess = function(event) {
      console.log('a new order request has been added to indexedb', event)
    }
    request.onerror = function(error) {
      console.error("REquest can't be send to index db", error)
    }
  })
}

function openDatabase(cb) {
  console.log('opening database')
  var indexedDBOpenRequest = indexedDB.open('dim-pos', IDB_VERSION)

  indexedDBOpenRequest.onerror = function(error) {
    // error creating db
    console.error('IndexedDB open error:', error)
  }

  //this ll be nerver called because we have same version as app and store already created
  indexedDBOpenRequest.onupgradeneeded = function() {
    iDB = this.result
    console.log('db opened for upgrade Create/modify the database schema')
    // This should only executes if there's a need to
    // create/update db.
    var objectStore = this.result.createObjectStore(ORDER_DOCUMENT, {
      autoIncrement: true,
      keyPath: 'id',
    })

    objectStore.transaction.oncomplete = function() {
      console.log('create bucket complete', ORDER_DOCUMENT)
      if (cb) {
        console.log('calling callback to insert data')
        cb(iDB)
      }
    }
    objectStore.transaction.onerror = function(event) {
      console.log('create bucket complete', event, ORDER_DOCUMENT)
    }
  }

  // This will execute each time the database is opened.
  indexedDBOpenRequest.onsuccess = function() {
    console.log(
      'db opened for success . Save your database handler, for example something, DB_HANDLER = event.target.result'
    )
    iDB = this.result
    if (cb) {
      console.log('calling callback to insert data')
      cb(iDB)
    }
  }

  indexedDBOpenRequest.onblocked = function(event) {
    console.log('sw block error not important, already opened', event)
    iDB = this.result
    // Another connection is open, preventing the upgrade,
    // and it didn't close immediately.
  }
}
function sendPostToServer() {
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
            console.log(authData)

            if (authData && authData[0]) {
              authData = authData[0]
              console.log('auth data from db', authData)

              var authToken = authData.token
              var deviceCode = authData.deviceCode
              var franchiesCode = authData.franchiesCode
              var lastOrderNo = parseInt(authData.lastOrderNo) || 0

              for (let savedRequest of savedRequests) {
                lastOrderNo++
                var transitionOrderNo =
                  franchiesCode + '-' + deviceCode + '-' + lastOrderNo

                // send them to the server one after the other
                console.log('saved request', savedRequest)
                var requestUrl = savedRequest.url

                savedRequest.payload.transition_order_no = transitionOrderNo
                savedRequest.payload.app_uniqueid = cyrb53(transitionOrderNo)

                var payload = JSON.stringify(savedRequest.payload)
                var method = savedRequest.method

                var headers = {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  authorization: 'Bearer ' + authToken,
                } // if you have any other headers put them here

                //app_uniqueid
                //transition_order_no
                fetch(requestUrl, {
                  headers: headers,
                  method: method,
                  body: payload,
                })
                  .then(function(response) {
                    console.log('server response', response)
                    if (response.status < 400) {
                      // If sending the POST request was successful, then
                      // remove it from the IndexedDB.
                      //increment in the order number
                      authData.lastOrderNo = lastOrderNo

                      var requestUpdate = getObjectStore(
                        'auth',
                        'readwrite'
                      ).put(authData)

                      requestUpdate.onerror = function(event) {
                        console.log('update failed', event)
                      }
                      requestUpdate.onsuccess = function(event) {
                        // Success - the data is updated!
                        console.log('update good', event)
                      }

                      console.log(
                        'Removing request from index db',
                        savedRequest.id
                      )
                      getObjectStore(ORDER_DOCUMENT, 'readwrite').delete(
                        savedRequest.id
                      )

                      resolve(response)
                    }
                  })
                  .catch(function(error) {
                    // This will be triggered if the network is still down.
                    // The request will be replayed again
                    // the next time the service worker starts up.
                    console.error('Send to Server failed:', error)
                    // since we are in a catch, it is important an error is
                    //thrown,so the background sync knows to keep retrying
                    // the send to server
                    reject(error)
                  })
              }
            }
          }
        }
      }
    }
  })
}

var cyrb53 = function(str, seed = 0) {
  var h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed
  for (var i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i)
    h1 = Math.imul(h1 ^ ch, 2654435761)
    h2 = Math.imul(h2 ^ ch, 1597334677)
  }
  h1 =
    Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
    Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 =
    Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
    Math.imul(h1 ^ (h1 >>> 13), 3266489909)
  return 4294967296 * (2097151 & h2) + (h1 >>> 0)
}


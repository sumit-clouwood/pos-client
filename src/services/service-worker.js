// custom service-worker.js
/* global workbox navigator */
/* eslint-disable no-console */

var iDB
var form_data
var IDB_VERSION = 2
var ORDER_DOCUMENT = 'order_post_requests'
var serverUrl = 'https://int.erp-pos.com'
var clientUrl = 'https://delivery.erp-pos.com'

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
  workbox.routing.registerNavigationRoute(clientUrl + '/vue-pos/index.html')

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

  //this is manually sync, we ll remove it later
  self.addEventListener('message', function(event) {
    if (event.data.hasOwnProperty('sync')) {
      console.log('sync event', event.data)
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

                savedRequest.payload.transition_order_no = transitionOrderNo
                savedRequest.payload.app_uniqueid = cyrb53(transitionOrderNo)
                savedRequest.payload.order_mode = 'offline'

                var headers = {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  authorization: 'Bearer ' + authToken,
                } // if you have any other headers put them here

                var payload = savedRequest.payload

                //check if delivery order
                //customer_id
                //address_id
                if (
                  payload.order_type == 'delivery' &&
                  !(payload.customer_id && payload.address_id)
                ) {
                  var customerPayload = payload.user

                  console.log('delivery order')
                  //create customer uses fetch which returns promise
                  console.log('creating customer')
                  createCustomer(headers, customerPayload)
                    .then(response => {
                      console.log('customer created ', response)
                      //customer created
                      console.log('creating customer address')

                      //modify the original payload to be sent to order
                      savedRequest.payload.customer_id = customerPayload.customer_id =
                        response.data.customer_id

                      createAddress(headers, customerPayload)
                        .then(response => {
                          console.log('customer address created', response)
                          //re calculate payload
                          console.log(
                            'now sending order with customer_id and address_id'
                          )

                          //modify original payload to be sent to order
                          savedRequest.payload.address_id =
                            response.data.addressId

                          console.log(
                            'making call to save order',
                            savedRequest.payload
                          )

                          createOrder(
                            resolve,
                            reject,
                            headers,
                            lastOrderNo,
                            authData,
                            savedRequest
                          )
                        })
                        .catch(err => {
                          console.log(
                            'Request to save customer address failed with error ',
                            err,
                            customerPayload
                          )
                          reject(err)
                        })
                    })
                    .catch(err => {
                      console.log(
                        'Request to save customer failed with error ',
                        err,
                        customerPayload
                      )
                      reject(err)
                    })
                } else {
                  //app_uniqueid
                  //transition_order_no
                  console.log('Not delivery order')
                  createOrder(
                    resolve,
                    reject,
                    headers,
                    lastOrderNo,
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
}

var createOrder = function(
  resolve,
  reject,
  headers,
  lastOrderNo,
  authData,
  savedRequest
) {
  var method = savedRequest.method
  var requestUrl = savedRequest.url
  var payload = JSON.stringify(savedRequest.payload)

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

        var requestUpdate = getObjectStore('auth', 'readwrite').put(authData)

        requestUpdate.onerror = function(event) {
          console.log('update failed', event)
        }
        requestUpdate.onsuccess = function(event) {
          // Success - the data is updated!
          console.log('update good', event)
        }

        console.log('Removing request from index db', savedRequest.id)
        getObjectStore(ORDER_DOCUMENT, 'readwrite').delete(savedRequest.id)

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

  var precacheList = [
    serverUrl + '/images/category-icons/thumbnail/1540985680-category-icon.png',
    serverUrl +
      '/sub_category_images/thumbnail/new_1520230534-subcategory-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1518430079-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1518431747-item-image.png',
    serverUrl +
      '/sub_category_images/thumbnail/new_1520230565-subcategory-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1525263913-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1520230357-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1520230408-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1524985770-item-image.png',
    serverUrl +
      '/sub_category_images/thumbnail/new_1520230583-subcategory-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1524988596-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1520232489-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1524986103-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1524985778-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1520232378-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1524987109-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1520232448-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1520232469-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1524986732-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1520232399-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1520232408-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1520232497-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1520232435-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1520232479-item-image.png',
    serverUrl +
      '/sub_category_images/thumbnail/new_1520230594-subcategory-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1520232568-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1520232548-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1520232617-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1520232604-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1520232597-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1524987198-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1524988224-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1520232562-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1524986829-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1520232542-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1524985785-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1520232610-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1524986145-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1520232554-item-image.png',
    serverUrl +
      '/sub_category_images/thumbnail/new_1520230610-subcategory-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1520232752-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1520232716-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1524986912-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1520232740-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1520232746-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1520232707-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1524986336-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1524985862-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1520232669-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1524987320-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1520232682-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1520232758-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1524987263-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1520232654-item-image.png',
    serverUrl + '/images/category-icons/thumbnail/1540981680-category-icon.png',
    serverUrl +
      '/sub_category_images/thumbnail/new_1518516412-subcategory-image.jpg',
    serverUrl + '/menu_item_image/thumbnail/new_1520233382-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1520232922-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1519557952-item-image.jpg',
    serverUrl + '/menu_item_image/thumbnail/new_1520232930-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1520232905-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1520233375-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1520233388-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1520233395-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1525263060-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1525264731-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1525939842-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1525264707-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1525974058-item-image.png',
    serverUrl +
      '/sub_category_images/thumbnail/new_1518516557-subcategory-image.jpg',
    serverUrl + '/menu_item_image/thumbnail/new_',
    serverUrl + '/menu_item_image/thumbnail/new_1518517331-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1518517440-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1518517712-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1525265433-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1518517622-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1525265379-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1518517524-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1518517561-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1519558086-item-image.jpg',
    serverUrl + '/menu_item_image/thumbnail/new_1525265548-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1518517289-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1518517385-item-image.png',
    serverUrl + '/images/category-icons/thumbnail/1540985688-category-icon.png',
    serverUrl +
      '/sub_category_images/thumbnail/new_1518520059-subcategory-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1518520219-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1518520256-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1518520287-item-image.png',
    serverUrl +
      '/sub_category_images/thumbnail/new_1518520075-subcategory-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1518520410-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1518520457-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1518520496-item-image.png',
    serverUrl + '/images/category-icons/thumbnail/1540985704-category-icon.png',
    serverUrl + '/menu_item_image/thumbnail/',
    serverUrl + '/menu_item_image/thumbnail/new_1537426985-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1537426615-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1537426052-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1520231001-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1537426118-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1537425806-item-image.png',
    serverUrl + '/images/category-icons/thumbnail/1540985711-category-icon.png',
    serverUrl +
      '/sub_category_images/thumbnail/new_1520233621-subcategory-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1518525626-item-image.jpg',
    serverUrl + '/menu_item_image/thumbnail/new_1518525660-item-image.jpg',
    serverUrl + '/menu_item_image/thumbnail/new_1518525502-item-image.jpg',
    serverUrl + '/menu_item_image/thumbnail/new_1518525589-item-image.jpg',
    serverUrl + '/menu_item_image/thumbnail/new_1518525465-item-image.jpg',
    serverUrl + '/menu_item_image/thumbnail/new_1518525557-item-image.jpg',
    serverUrl +
      '/sub_category_images/thumbnail/new_1520233641-subcategory-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1518525343-item-image.jpg',
    serverUrl + '/menu_item_image/thumbnail/new_1518525257-item-image.jpg',
    serverUrl + '/menu_item_image/thumbnail/new_1518525215-item-image.jpg',
    serverUrl + '/menu_item_image/thumbnail/new_1518525179-item-image.jpg',
    serverUrl + '/menu_item_image/thumbnail/new_1518525144-item-image.jpg',
    serverUrl + '/menu_item_image/thumbnail/new_1518525295-item-image.jpg',
    serverUrl + '/images/category-icons/thumbnail/1537779043-category-icon.png',
    serverUrl + '/menu_item_image/thumbnail/new_1537864694-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1537865031-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1537865132-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1537864508-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1537864868-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1537865280-item-image.png',
    serverUrl + '/images/category-icons/thumbnail/1540985733-category-icon.png',
    serverUrl + '/menu_item_image/thumbnail/new_1518526734-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1518526838-item-image.jpg',
    serverUrl + '/menu_item_image/thumbnail/new_1518526767-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1527444498-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1537429544-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1537427945-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1537429655-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1532425756-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1537428263-item-image.png',
    serverUrl + '/images/category-icons/thumbnail/1540985741-category-icon.png',
    serverUrl + '/menu_item_image/thumbnail/new_1518526458-item-image.jpg',
    serverUrl + '/images/category-icons/thumbnail/cat-icon-placeholder.png',
    serverUrl + '/menu_item_image/thumbnail/new_',
    serverUrl + '/menu_item_image/thumbnail/new_',
    serverUrl + '/images/category-icons/thumbnail/1541151746-category-icon.png',
    serverUrl + '/menu_item_image/thumbnail/new_1520610651-item-image.jpg',
    serverUrl + '/menu_item_image/thumbnail/new_1538891697-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1551356492-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1534396891-item-image.jpg',
    serverUrl + '/images/category-icons/thumbnail/1541151767-category-icon.png',
    serverUrl + '/images/category-icons/thumbnail/1540985822-category-icon.png',
    serverUrl + '/menu_item_image/thumbnail/new_1541173913-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1518527124-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1518527164-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1518527192-item-image.jpg',
    serverUrl + '/menu_item_image/thumbnail/new_1518527083-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1518527030-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1518527058-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1524998951-item-image.png',
    serverUrl + '/menu_item_image/thumbnail/new_1520783489-item-image.png',
    //modifier images
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528294599-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528102262-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528102297-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528102319-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528102346-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528102375-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528102403-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528102735-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528103013-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528103057-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528103094-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528103124-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528130089-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528103728-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528104548-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528104753-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528104841-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528105040-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528105135-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528105175-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528108968-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528109076-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528109129-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528109173-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528109375-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528109597-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528129408-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528129883-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1545811963-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1529564531-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528148822-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528149210-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528149313-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528149334-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528149377-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528149408-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528149476-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528149543-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528149567-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528615279-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528615348-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528615380-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528615409-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528615436-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528615458-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528615479-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528703039-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528703077-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528703111-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528703142-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528703162-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528703238-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528704295-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528704327-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528705040-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528705109-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528705372-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528705427-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528705662-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528708293-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528708357-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528709586-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528709678-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528796608-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528796649-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528796736-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528797082-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1551075649-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1551075176-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528706569-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528706610-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528706676-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528706743-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528707231-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528707447-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528707480-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1528707511-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1545812088-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1538904327-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1538904354-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1538904392-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1538904444-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1538904708-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1538904737-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1538904851-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1538904937-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1538904967-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1551075547-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1545903184-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1545903241-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1545904156-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1545904685-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1545904778-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1545905878-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1545905983-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1545906042-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1545906117-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1545906214-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1545906532-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1546515623-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1546515765-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1546515854-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1546516004-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1546516201-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1546516952-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1546517006-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1546517067-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1546517126-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1546517176-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1546517647-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1548761173-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1548760133-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1547892411-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1548761355-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1548761583-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1548761496-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1548761615-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1547892651-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1548766423-item-modifier-image.png',
    serverUrl +
      '/website_item_image/itemmodifiers/thumbnail/new_1548761565-item-modifier-image.png',
  ]
  //workbox.precaching.precacheAndRoute(precacheList)
}

var createCustomer = function(headers, payload) {
  var method = 'POST'
  var requestUrl = serverUrl + '/api/auth/crm/create/Customer'
  return fetch(requestUrl, {
    headers: headers,
    method: method,
    body: JSON.stringify(payload),
  })
}

var createAddress = function(headers, payload) {
  var method = 'POST'
  var requestUrl = serverUrl + '/api/auth/crm/create/NewCustomerAddress'
  var address = {
    customer_id: payload.customer_id,
    add_delivery_area: payload.delivery_area,
    location_id: payload.location_id,
    add_building: payload.building,
    add_street: payload.street,
    add_flat_number: payload.flat_number,
    add_landmark: payload.building,
    add_city: payload.city,
    country: payload.country,
  }

  return fetch(requestUrl, {
    headers: headers,
    method: method,
    body: JSON.stringify(address),
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

/* eslint-disable no-console */
import db from '@/services/network/DB'
import DataService from '@/services/DataService'
import NetworkService from '@/services/NetworkService'
import LocationService from '@/services/data/LocationService'
import Fingerprint2 from 'fingerprintjs2'
import * as CONST from '@/constants'
import $store from './store'

export default {
  store: null,

  lastSynced: null,
  syncInterval: 10, //300 sec = 5 min

  validateSubscription(store) {
    this.store = store
    return new Promise((resolve, reject) => {
      LocationService.validateStoreSubscription()
        .then(response => {
          if (response.data && response.data.is_expired) {
            reject()
          } else {
            resolve()
          }
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  loadStore() {
    return this.fetchData()
  },

  setup(store) {
    //user already logged in, setup is not called without login
    this.store = store
    return new Promise((resolve, reject) => {
      //setup idb
      this.setupDB()
        .then(async idb => {
          console.log('dbsetup, now feth data')
          $store.commit('sync/setIdb', idb)
          //fetch current logged in user details, because login api doesn't send us user details infull
          this.fetchLoggedInUser()
            .then(() => {
              resolve()
            })
            .catch(error => {
              console.log('error db: ', error)
              reject(error)
            })
        })
        .catch(error => {
          console.log('error db: ', error)
          reject(error)
        })

      //setup network
      this.setNetwork()
    })
  },
  //call user details and then call menu api
  async fetchLoggedInUser() {
    DataService.setLang($store.state.location.locale)
    return new Promise((resolve, reject) => {
      const currentStoreId =
        $store.getters['context/store_id'] || localStorage.getItem('store_id')
      this.detectBrowser().then(deviceId => {
        //there is possibility that user was logged in and page refreshed
        //auth/auth ll check only token, if token present then go fwd otherwise bk
        $store.dispatch('auth/auth', deviceId).then(() => {
          $store
            .dispatch('auth/getUserDetails')
            .then(user => {
              if (user) {
                if (
                  !user.item.brand_stores.length &&
                  user.item.brand_access_type === 'all'
                ) {
                  //context already set from app.vue

                  if (!user.item.brand_id) {
                    //mostly its superadmin which don't have brand_stores
                    //load the store from api if it is in url
                    if ($store.getters['context/store_id']) {
                      $store.commit('context/LOAD_STORE_FROM_CONTEXT', true)
                      resolve()
                    } else {
                      reject('Please select store id')
                    }
                  } else {
                    $store.commit('context/RESET')

                    //set multiselect here for stores
                    //check if store in context doesn't belong to current brand then reset store context and present multi select here
                    $store.commit('context/LOAD_STORE_FROM_CONTEXT', false)
                    //it is store owner with all stores access, in that case we might need to load the stores by brand id
                    //set brand context id here, so this user can pick store from only its own brand
                    $store.dispatch(
                      'context/setBrandContext',
                      user.item.brand_id
                    )

                    $store
                      .dispatch('location/getLocationData', false)
                      .then(response => {
                        $store.commit('location/SET_LOCATION_DATA', response)
                        $store.commit(
                          'context/SET_STORES_LENGTH',
                          response.data.available_stores.length
                        )
                        if (response.data.available_stores.length > 1) {
                          $store.commit(
                            'context/SET_MULTI_STORES',
                            response.data.available_stores
                          )

                          let selectedStore = undefined

                          if (currentStoreId) {
                            selectedStore = response.data.available_stores.find(
                              _store => _store._id === currentStoreId
                            )
                          }
                          if (selectedStore) {
                            $store.commit(
                              'context/SET_CURRENT_STORE',
                              selectedStore
                            )
                            //if storeid is same, getter ll not act, in that case load store from context
                            $store.commit(
                              'context/LOAD_STORE_FROM_CONTEXT',
                              true
                            )
                          }
                        } else {
                          //if store owner has only one store
                          $store.dispatch(
                            'context/setStoreContext',
                            response.data.available_stores[0]._id
                          )
                          $store.commit(
                            'context/SET_CURRENT_STORE',
                            response.data.available_stores[0]
                          )
                        }

                        resolve()
                      })
                      .catch(() =>
                        reject('Store info not found. Please login again.')
                      )
                  }
                } else {
                  $store.commit('context/RESET')
                  $store.commit('context/LOAD_STORE_FROM_CONTEXT', false)
                  $store.commit(
                    'context/SET_STORES_LENGTH',
                    user.item.brand_stores.length
                  )
                  $store.dispatch('context/setBrandContext', user.item.brand_id)

                  let userstores = []
                  for (var i in user.collected_data.page_lookups.root_stores
                    ._id) {
                    userstores.push(
                      user.collected_data.page_lookups.root_stores._id[i]
                    )
                  }
                  if (user.item.brand_stores.length > 1) {
                    //find stores from lookup
                    $store.commit('context/SET_MULTI_STORES', userstores)
                    let selectedStore = undefined
                    if (currentStoreId) {
                      selectedStore = userstores.find(
                        _store => _store._id === currentStoreId
                      )
                    }
                    if (selectedStore) {
                      $store.commit('context/SET_CURRENT_STORE', selectedStore)
                      //if storeid is same, getter ll not act, in that case load store from context
                      $store.commit('context/LOAD_STORE_FROM_CONTEXT', true)
                      $store.dispatch(
                        'context/setStoreContext',
                        selectedStore._id
                      )
                    }
                  } else {
                    //USER has only one store
                    $store.dispatch(
                      'context/setStoreContext',
                      user.item.brand_stores[0]
                    )
                    $store.commit('context/SET_CURRENT_STORE', userstores[0])
                    //if storeid is same, getter ll not act, in that case load store from context
                    if (currentStoreId === user.item.brand_stores[0]) {
                      $store.commit('context/LOAD_STORE_FROM_CONTEXT', true)
                    }
                  }
                  resolve(user)
                }
              } else {
                //user was not found, or user coming from the backend,
                //if user is coming from the backend we have no user details,
                //in that case we are dependent on context or ui menu api

                //get user info from store
                // check if we have store id otherwise we ll call ui menu
                let callerOption = undefined
                if (!$store.getters['context/store_id']) {
                  callerOption = false
                }
                $store
                  .dispatch('location/getLocationData', callerOption)
                  .then(response => {
                    //set versions here
                    $store.commit('location/SET_LOCATION_DATA', response)
                    $store.dispatch(
                      'context/setBrandContext',
                      response.data.brand._id
                    )
                    let selectedStore = null
                    if (currentStoreId) {
                      selectedStore = response.data.available_stores.find(
                        _store => _store._id === currentStoreId
                      )
                    }

                    if (response.data.available_stores.length > 1) {
                      $store.commit(
                        'context/SET_STORES_LENGTH',
                        response.data.available_stores.length
                      )
                      $store.commit(
                        'context/SET_MULTI_STORES',
                        response.data.available_stores
                      )

                      if (selectedStore) {
                        $store.commit(
                          'context/SET_CURRENT_STORE',
                          selectedStore
                        )
                        //if storeid is same, getter ll not act, in that case load store from context
                        $store.commit('context/LOAD_STORE_FROM_CONTEXT', true)
                        $store.dispatch(
                          'context/setStoreContext',
                          selectedStore._id
                        )
                      }
                    } else {
                      $store.dispatch(
                        'context/setStoreContext',
                        response.data.available_stores[0]._id
                      )
                      $store.commit(
                        'context/SET_CURRENT_STORE',
                        response.data.available_stores[0]
                      )
                      //if storeid is same, getter ll not act, in that case load store from context
                      $store.commit('context/LOAD_STORE_FROM_CONTEXT', true)
                    }

                    resolve()
                  })
                  .catch(() =>
                    reject('Store info not found. Please login again.')
                  )
              }
            })
            .catch(error => {
              reject(error)
            })
        })
      })
    })
  },
  updateLoading(key) {
    $store.commit('sync/updateLoading', {
      key: key,
      status: CONST.LOADING_STATUS_DONE,
    })
  },
  //this function is called when we recieve msg from service worker i.e token updated
  // also loaded when we click on a category to load new data
  reloadSystem(caller) {
    if (caller === 'sw') {
      //reload ui menu as token updated
      return $store.dispatch('location/fetch')
    }
    return Promise.resolve()
  },
  loadUI(caller) {
    DataService.setLang($store.state.location.locale)
    return new Promise((resolve, reject) => {
      this.reloadSystem(caller)
        .then(() => {
          this.store
            .dispatch('category/fetchAll')
            .then(async () => {
              await Promise.all([
                $store.dispatch('modifier/fetchAll'),
                $store.dispatch('tax/fetchAll'),
                $store.dispatch('surcharge/fetchAll'),
                $store.dispatch('discount/fetchAll'),
              ])
              $store.commit('sync/loaded', true)
              resolve()
              if (caller != 'orderStart') {
                $store.dispatch('payment/fetchAll')
                $store.dispatch('invoice/printRules').then(() => {
                  $store.dispatch('invoice/fetchTemplates')
                })
              }
            })
            .catch(error => reject(error))
        })
        .catch(error => reject(error))
      //continue loading other service in parallel
    })
  },
  //this function is loaded when pos is loaded, called from App
  initLoadUI() {
    DataService.setLang($store.state.location.locale)
    return new Promise((resolve, reject) => {
      $store.commit('location/SET_STORE_PREREQUISITE', false)
      //call ui_menu
      $store
        .dispatch('location/fetch')
        .then(locationDetails => {
          this.updateLoading('store')
          $store.dispatch('payment/fetchAll').then(() => {})
          $store.dispatch('surcharge/fetchAll').then(() => {})
          $store.dispatch('discount/fetchAll').then(() => {})

          $store
            .dispatch('category/fetchAll')
            .then(() => {
              this.updateLoading('catalog')
              let storeIds = []
              //this check is for superadmin but I believe we should only check store_group accesstype to
              //load multiple stores at once, but problem is super admin don't have this, so we need to check
              //if not all, store or countries then load, I ll revise it with Yuvraj and Sohin and ll check only 'store_group' access type
              if (
                !['all', 'store', 'country'].includes(
                  locationDetails.userDetails.brand_access_type
                )
              ) {
                if (
                  locationDetails.availableStoreGroups &&
                  locationDetails.availableStoreGroups.length &&
                  locationDetails.userDetails.brand_access_type !==
                    'store_group'
                ) {
                  storeIds = locationDetails.availableStoreGroups.forEach(
                    group => {
                      storeIds = [...storeIds, group.group_stores]
                    }
                  )
                } else if (
                  locationDetails.userDetails.brand_access_type ===
                  'store_group'
                ) {
                  storeIds = locationDetails.stores
                }
              }

              if (storeIds && storeIds.length) {
                $store.dispatch(
                  'discount/fetchMultistore',
                  locationDetails.stores
                )
                $store.dispatch(
                  'customer/fetchMultiStore',
                  locationDetails.stores
                )
                $store.dispatch(
                  'category/fetchMultistore',
                  locationDetails.stores
                )
                $store.dispatch(
                  'modifier/fetchMultistore',
                  locationDetails.stores
                )
              }

              $store.dispatch('modifier/fetchAll').then(() => {
                this.updateLoading('modifiers')

                $store.commit('sync/loaded', true)
                resolve()
              })
            })
            .catch(error => reject(error))
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  abortPos(error) {
    console.log(error)
    //reset collections for orders
    $store.commit('location/SET_STORE_PREREQUISITE', error)
  },
  checkStorePrerequisite() {
    //register device
    $store
      .dispatch('location/registerTerminal')
      .then()
      .catch(() =>
        this.abortPos({
          title: 'Device registration not allowed.',
          description: 'Please contact your store owner for access',
        })
      )
    //check subscription
    this.validateSubscription()
      .then()
      .catch(error =>
        this.abortPos({
          title: 'Store subscription has been expired.',
          description: error,
        })
      )
  },
  defferedLoadApis() {
    this.checkStorePrerequisite()

    $store.dispatch('location/timezone')
    Promise.all([
      $store.dispatch('auth/fetchAllStoreUsers'),
      $store.dispatch('auth/fetchRoles'),
    ]).then(() => {
      $store.dispatch('auth/setRolesAndUsers')
    })
    //load delivery areas only from below customer
    $store.dispatch('customer/fetchDeliveryArea', '')
    $store.dispatch('customer/customerGroupList')
    $store.dispatch('customer/fetchCRMCustomerFields')

    $store.dispatch('category/fetchMeasurementUnits')
    $store.dispatch('location/referrals')

    $store.dispatch('invoice/printRules').then(() => {
      $store.dispatch('invoice/fetchTemplates')
    })

    $store.dispatch('payment/setTranslations')
    $store.dispatch('category/getItemPreparingTime')

    $store.dispatch('printingServer/getKitchens')
    $store.dispatch('announcement/fetchAll', $store.state.auth.userDetails)

    $store.dispatch('printingServer/fetchAllKitchens')
    $store.dispatch('tax/openItemTaxes')
    $store.dispatch('dinein/fetchAll')

    //delayed loading data
  },
  fetchData() {
    return new Promise((resolve, reject) => {
      DataService.setContext({
        store: $store.getters['context/store'],
        brand: $store.getters['context/brand'],
      })

      this.initLoadUI()
        .then(() => {
          //lets resolve the promise so pos can be loaded, other things ll be loaded later
          //delivery areas are must have for modifying crm order so need to laod customers delivery areas
          resolve()
          this.defferedLoadApis()
        })
        .catch(error => {
          console.log('UI Failed', error)
          reject(error)
        })
    })
  },

  setupDB(resolver = null) {
    return new Promise(resolve => {
      const version = 5
      db.openDatabase(version)
        .then(({ idb, flag, event }) => {
          console.log('db opened flag: ', flag)
          if (flag === 'upgrade') {
            console.log('creating buckets')
            this.createBuckets(event, version)
            var transaction = event.target.transaction
            transaction.oncomplete = function(event) {
              // Now store is available to be populated
              resolve(idb)

              if (resolver) {
                resolver(idb)
              }
              console.log('buckets created', event)
            }
          } else {
            resolve(idb)
          }
        })
        .catch(({ idb, event }) => {
          console.log('ooops', event, idb)
          if (event == 'blocked') {
            console.log(
              'db was already opened may be by sw or app itself, closing and retrying'
            )
            idb.close()
            this.setupDB(resolve).then()
          }
        })
    })
  },

  authBucket() {
    db.createBucket('auth')
    $store.commit('sync/setIdbVersion', 1)
    console.log('auth bucket created')
  },
  orderPostRequestBucket() {
    const bucket = db.createBucket('order_post_requests', {
      keyPath: 'order_time',
    })
    bucket.createIndex('order_time', 'order_time', { unique: true })

    console.log('order post requests bucket created')
    $store.commit('sync/setIdbVersion', 2)
  },
  eventsBucket() {
    const bucket = db.createBucket('events', { keyPath: 'url' })
    bucket.createIndex('url', 'url', { unique: true })
    console.log('events bucket created')
    $store.commit('sync/setIdbVersion', 3)
  },
  logBucket() {
    const bucket = db.createBucket('log', {
      autoIncrement: true,
      keyPath: 'id',
    })
    bucket.createIndex('log_time', 'log_time', { unique: false })
    bucket.createIndex('event_time', 'event_time', {
      unique: false,
    })
    bucket.createIndex('event_type', 'event_type', {
      unique: false,
    })
    bucket.createIndex('event_title', 'event_title', {
      unique: false,
    })
    bucket.createIndex('event_data', 'event_data', {
      unique: false,
    })

    console.log('log bucket created')
    $store.commit('sync/setIdbVersion', 4)
  },
  orderWorkflowBucket() {
    const bucket = db.createBucket('workflow_order', {
      keyPath: ['_id', 'type', 'step'],
    })

    bucket.createIndex('_id', '_id', { unique: false })
    bucket.createIndex('step', 'step', { unique: false })
    bucket.createIndex('type', 'type', { unique: false })
    bucket.createIndex('keys', 'keys', {
      unique: false,
    })
    bucket.createIndex('status', 'status', {
      unique: false,
    })
    bucket.createIndex('rootStep', 'rootStep', {
      unique: false,
    })

    bucket.createIndex('rootkeys', ['type', 'step', 'status', 'rootStep'], {
      unique: false,
    })
    bucket.createIndex('idkey', ['_id', 'type', 'step'], {
      unique: true,
    })
    bucket.createIndex('stepstatus', ['type', 'step', 'status'], {
      unique: false,
    })
    bucket.createIndex('idstepstatus', ['_id', 'type', 'step', 'status'], {
      unique: false,
    })

    console.log('order workflow bucket created')
    $store.commit('sync/setIdbVersion', 5)
  },
  dataStore() {
    const bucket = db.createBucket('store', { keyPath: 'key' })
    bucket.createIndex('key', 'key', { unique: true })
    console.log('datastore bucket created')
    $store.commit('sync/setIdbVersion', 5)
  },

  createBuckets(event, version) {
    //createbucket doesn't wait so don't need promise here
    const buckets = [
      ['authBucket'],
      ['orderPostRequestBucket'],
      ['eventsBucket'],
      ['logBucket'],
      ['dataStore', 'orderWorkflowBucket'],
    ]

    for (let i = event.oldVersion; i < version; i++) {
      for (const j in buckets[i]) {
        this[buckets[i][j]]()
      }
    }
  },

  setNetwork() {
    NetworkService.status((status, msg) => {
      //this function below ll be called every one minutes because it
      //is set as interval in netwrokserivce to run every one minute
      // so call back ll run every minute
      if (!localStorage.getItem('token')) {
        console.log(
          1,
          'we do not have token or data cleared, do not sync and do not create idb'
        )
        return
      }

      $store.commit('sync/status', status)
      if (process.env.NODE_ENV === 'production' && msg === 'on') {
        const nowTime = new Date().getTime() //miliseconds

        // console.log(
        //   'sw:',
        //   'last synced',
        //   this.lastSynced,
        //   'sync received',
        //   nowTime,
        //   'seconds passed last sync',
        //   (nowTime - this.lastSynced) / 1000
        // )
        console.log(nowTime, this.lastSynced, this.syncInterval, 'nowTime')
        if (nowTime - this.lastSynced > this.syncInterval * 1000) {
          this.lastSynced = nowTime
          /*let userAgent = window.navigator.userAgent.toLowerCase(),
            ios = /dims_kot_app/.test(userAgent)*/
          // console.log(window.navigator, navigator, 'userAgent - userAgent')
          if ('serviceWorker' in navigator) {
            setTimeout(function() {
              navigator.serviceWorker.controller.postMessage({
                sync: 1,
              })
            }, 1000 * 10)
          }
        } else {
          //console.log(this.syncInterval, ' not passed yet')
        }
      } else {
        //system gone offline
        $store.dispatch('sync/offlineSync', false)
      }
    })
  },
  detectBrowser() {
    return new Promise(resolve => {
      const browserComponents = [
        'userAgent',
        'language',
        'deviceMemory',
        'hardwareConcurrency',
        'screenResolution',
        'availableScreenResolution',
        'timezoneOffset',
        'timezone',
        'indexedDb',
        'cpuClass',
        'platform',
        'canvas',
        'webgl',
        'webglVendorAndRenderer',
      ]
      setTimeout(function() {
        Fingerprint2.get(function(components) {
          const values = components.filter(component => {
            if (browserComponents.includes[component.key]) {
              return component.value
            }
          })
          const murmur = Fingerprint2.x64hash128(values.join(''), 31)
          resolve(murmur)
        })
      }, 10)
    })
  },
}

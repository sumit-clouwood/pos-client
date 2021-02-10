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
  //starting point of app loading, it is called from the private
  setup(store) {
    //remove current context
    this.store = store
    this.store.commit('context/RESET')
    return new Promise((resolve, reject) => {
      this.setupDB()
        .then(idb => {
          console.log('dbsetup, now feth data')
          this.store.commit('sync/setIdb', idb)
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
      return this.store.dispatch('location/fetch')
    }
    return Promise.resolve()
  },
  loadUI(caller) {
    return new Promise((resolve, reject) => {
      this.reloadSystem(caller)
        .then(() => {
          if (caller != 'orderStart') {
            this.store.dispatch('auth/fetchRoles').then(() => {
              this.store.dispatch('auth/setCurrentRole')
              this.store.dispatch('auth/fetchAllStoreUsers')
            })
          }
          this.store
            .dispatch('category/fetchAll')
            .then(async () => {
              await Promise.all([
                this.store.dispatch('modifier/fetchAll'),
                this.store.dispatch('tax/fetchAll'),
                this.store.dispatch('surcharge/fetchAll'),
                this.store.dispatch('discount/fetchAll'),
              ])
              this.store.commit('sync/loaded', true)
              resolve()
              if (caller != 'orderStart') {
                this.store.dispatch('payment/fetchAll')
                this.store.dispatch('customer/fetchAll')
                this.store.dispatch('dinein/fetchAll')
                this.store.dispatch('carhop/initFetch')
                this.store.dispatch('invoice/printRules').then(() => {
                  this.store.dispatch('invoice/fetchTemplates')
                })

                this.store.dispatch(
                  'announcement/fetchAll',
                  this.store.state.auth.userDetails
                )
              }
            })
            .catch(error => reject(error))
        })
        .catch(error => reject(error))
      //continue loading other service in parallel
    })
  },
  //this function is loaded when pos is loaded, called from App
  loadStore() {
    DataService.setLang(
      $store.getters['context/current_store'].default_language
    )
    return new Promise((resolve, reject) => {
      $store.dispatch('auth/fetchRoles').then(() => {
        $store.dispatch('auth/setCurrentRole')
        $store.dispatch('auth/fetchAllStoreUsers')
      })

      this.updateLoading('store')
      $store.dispatch('payment/fetchAll').then(() => {})
      $store.dispatch('tax/openItemTaxes')
      $store.dispatch('surcharge/fetchAll').then(() => {})
      $store.dispatch('discount/fetchAll').then(() => {})
      $store.dispatch('dinein/fetchAll')
      const user = $store.getters['auth/current_user']
      $store
        .dispatch('category/fetchAll')
        .then(() => {
          let storeIds = []
          //this check is for superadmin but I believe we should only check store_group accesstype to
          //load multiple stores at once, but problem is super admin don't have this, so we need to check
          //if not all, store or countries then load, I ll revise it with Yuvraj and Sohin and ll check only 'store_group' access type
          if (!['all', 'store', 'country'].includes(user.brand_access_type)) {
            if (user.brand_access_type === 'store_group') {
              storeIds = user.brand_stores
            }
          }

          if (storeIds && storeIds.length) {
            $store.dispatch('discount/fetchMultistore', user.brand_stores)
            $store.dispatch('customer/fetchMultiStore', user.brand_stores)
            $store.dispatch('category/fetchMultistore', user.brand_stores)
            $store.dispatch('modifier/fetchMultistore', user.brand_stores)
          }
          this.updateLoading('catalog')
          $store.dispatch('modifier/fetchAll').then(() => {
            this.updateLoading('modifiers')

            $store.commit('sync/loaded', true)
            $store.dispatch('payment/setTranslations').then(() => {})
            resolve()
          })
          $store.dispatch('printingServer/getKitchens').then(() => {})
          $store.dispatch(
            'announcement/fetchAll',
            $store.state.auth.userDetails
          )
        })
        .catch(error => reject(error))
    })
  },
  //this ll be called from private view, we ll have user id from user login
  async fetchLoggedInUser() {
    const user = await this.store.dispatch('auth/getUserDetails')
    const userRole =
      user.collected_data.page_lookups.admin_roles._id[user.item.admin_role]
        .name
    if (userRole === 'Super Admin') {
      //we need to restrict access for user
    } else {
      this.store.commit(
        'context/SET_STORES_LENGTH',
        user.item.brand_stores.length
      )
      this.store.commit('context/SET_BRAND_ID', user.item.brand_id)

      let userstores = []
      for (var i in user.collected_data.page_lookups.root_stores._id) {
        userstores.push(user.collected_data.page_lookups.root_stores._id[i])
      }
      if (user.item.brand_stores.length > 1) {
        //find stores from lookup
        this.store.commit('context/SET_MULTI_STORES', userstores)
      } else {
        //USER has only one store
        this.store.commit('context/SET_STORE_ID', user.item.brand_stores[0])
        this.store.commit('context/SET_CURRENT_STORE', userstores[0])
        //set context to dataservice
      }
    }
    return user
  },
  /* abondoned */
  fetchStore() {
    //load store info here
    //if we have store id in url, it ll load ui menu in store context, otherwise in user context
    return this.store.dispatch('location/fetch')
  },
  /* abondoned */
  fetchData() {
    return new Promise((resolve, reject) => {
      this.detectBrowser().then(deviceId => {
        this.store
          .dispatch('auth/auth', deviceId)
          .then(() => {
            DataService.setContext({
              store: this.store.getters['context/store'],
              brand: this.store.getters['context/brand'],
            })

            this.initLoadUI()
              .then(() => {
                //lets resolve the promise so pos can be loaded, other things ll be loaded later
                resolve()
                this.loadApiData('catalog')

                this.loadApiData('customer')

                //delayed loading data
                this.loadApiData('order')
              })
              .catch(error => {
                console.log('UI Failed', error)
                reject(error)
              })
            // store.dispatch('loyalty/fetchAll', response)
            // store.dispatch(
            //   'deliveryManager/fetchDMOrderDetail',
            //   response
            // )
            // store.dispatch('deliveryManager/getDispatchOrder', response)
          })
          .catch(error => reject(error))
      })
    })
  },

  loadApiData(api) {
    return new Promise(resolve => {
      switch (api) {
        case 'catalog':
          resolve()
          break
        case 'customer':
          this.store.dispatch('customer/fetchAll').then(() => {})
          resolve()
          break
        case 'order':
          this.store.dispatch('invoice/printRules').then(() => {
            this.store.dispatch('invoice/fetchTemplates')
          })
          resolve()
          break
      }
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
          console.log('ooops', event)
          if (event == 'blocked') {
            console.log(
              'db was already opened may be by sw or app itself, closing and retrying'
            )
            idb.close()
            this.setupDB(resolve)
          }
        })
    })
  },

  authBucket() {
    db.createBucket('auth')
    this.store.commit('sync/setIdbVersion', 1)
    console.log('auth bucket created')
  },
  orderPostRequestBucket() {
    const bucket = db.createBucket('order_post_requests', {
      keyPath: 'order_time',
    })
    bucket.createIndex('order_time', 'order_time', { unique: true })

    console.log('order post requests bucket created')
    this.store.commit('sync/setIdbVersion', 2)
  },
  eventsBucket() {
    const bucket = db.createBucket('events', { keyPath: 'url' })
    bucket.createIndex('url', 'url', { unique: true })
    console.log('events bucket created')
    this.store.commit('sync/setIdbVersion', 3)
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

    this.store.commit('sync/setIdbVersion', 4)
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

    this.store.commit('sync/setIdbVersion', 5)
  },
  dataStore() {
    const bucket = db.createBucket('store', { keyPath: 'key' })
    bucket.createIndex('key', 'key', { unique: true })
    console.log('datastore bucket created')
    this.store.commit('sync/setIdbVersion', 5)
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

        if (nowTime - this.lastSynced > this.syncInterval * 1000) {
          this.lastSynced = nowTime

          setTimeout(function() {
            navigator.serviceWorker.controller.postMessage({
              sync: 1,
            })
          }, 1000 * 10)
        } else {
          //console.log(this.syncInterval, ' not passed yet')
        }
      } else {
        //system gone offline
        this.store.dispatch('sync/offlineSync', false)
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

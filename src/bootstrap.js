/* eslint-disable no-console */
import db from '@/services/network/DB'
import DataService from '@/services/DataService'
import NetworkService from '@/services/NetworkService'
import Fingerprint2 from 'fingerprintjs2'
import * as CONST from '@/constants'

export default {
  store: null,

  lastSynced: null,
  syncInterval: 10, //300 sec = 5 min

  setup(store) {
    this.store = store
    return new Promise((resolve, reject) => {
      this.setupDB()
        .then(idb => {
          this.store.commit('sync/setIdb', idb)
          this.fetchData()
            .then(() => {
              resolve()
            })
            .catch(error => reject(error))
        })
        .catch(error => reject(error))

      //setup network
      this.setNetwork()
    })
  },

  updateLoading(key) {
    this.store.commit('sync/updateLoading', {
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
    DataService.setLang(this.store.state.location.locale)
    return new Promise((resolve, reject) => {
      this.reloadSystem(caller)
        .then(() => {
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
            })
            .catch(error => reject(error))
        })
        .catch(error => reject(error))
      //continue loading other service in parallel
    })
  },
  //this function is loaded when pos is loaded, called from App
  initLoadUI() {
    DataService.setLang(this.store.state.location.locale)
    return new Promise((resolve, reject) => {
      this.store
        .dispatch('location/fetch')
        .then(locationDetails => {
          this.updateLoading('store')
          this.store.dispatch('payment/fetchAll').then(() => {})
          this.store.dispatch('tax/openItemTaxes')
          this.store.dispatch('surcharge/fetchAll').then(() => {})
          this.store.dispatch('discount/fetchAll').then(() => {})

          this.store
            .dispatch('category/fetchAll')
            .then(() => {
              if (
                locationDetails.userDetails.brand_access_type === 'store_group'
              ) {
                this.store.dispatch(
                  'discount/fetchMultistore',
                  locationDetails.stores
                )
                this.store.dispatch(
                  'category/fetchMultistore',
                  locationDetails.stores
                )
                this.store.dispatch(
                  'modifier/fetchMultistore',
                  locationDetails.stores
                )
              }
              this.updateLoading('catalog')
              this.store.dispatch('modifier/fetchAll').then(() => {
                this.updateLoading('modifiers')

                this.store.commit('sync/loaded', true)
                resolve()
              })
            })
            .catch(error => reject(error))
        })
        .catch(error => reject(error))
    })
  },

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

  setupDB() {
    return new Promise(resolve => {
      this.createDb(1)
        .then(idb => {
          idb.close()
          this.createDb(2).then(idb => {
            idb.close()
            this.createDb(3).then(idb => {
              idb.close()
              this.createDb(4).then(idb => {
                resolve(idb)
              })
            })
          })
        })
        .catch(event => {
          if (event.target.error.code === 0) {
            //db has been created already so try with a recent version
            const version = 4
            db.openDatabase(version)
              .then(({ idb, flag }) => {
                if (flag === 'open') {
                  this.store.commit('sync/setIdbVersion', version)
                  resolve(idb)
                }
              })
              .catch(error => {
                console.log(error)
              })
          }
        })
    })
  },
  createDb(version) {
    return new Promise((resolve, reject) => {
      db.openDatabase(version)
        .then(({ idb, flag, event }) => {
          if (flag === 'upgrade') {
            this.createBuckets(event)
              .then(() => {
                resolve(idb)
              })
              .catch(error => reject(error))
          } else {
            reject(event)
          }
        })
        .catch(error => reject(error))
    })
  },
  createBuckets(event) {
    return new Promise((resolve, reject) => {
      if (event.oldVersion === 0) {
        // version 1 -> 2 upgrade
        console.log('creating bucket auth')
        db.createBucket('auth')
          .then(() => {
            console.log('created bucket auth')
            this.store.commit('sync/setIdbVersion', 1)
            resolve(1)
          })
          .catch(error => reject(error))
      }
      if (event.oldVersion === 1) {
        // version 2 -> 3 upgrade
        console.log('creating bucket order_post_requests')
        db.createBucket(
          'order_post_requests',
          { keyPath: 'order_time' },
          bucket => {
            bucket.createIndex('order_time', 'order_time', { unique: true })
          }
        )
          .then(() => {
            console.log('created bucket order_post_requests')
            this.store.commit('sync/setIdbVersion', 2)
            resolve(2)
          })
          .catch(error => reject(error))
      }
      if (event.oldVersion === 2) {
        // initial database creation
        // (your code does nothing here)
        console.log('creating bucket events')
        db.createBucket('events', { keyPath: 'url' }, bucket => {
          bucket.createIndex('url', 'url', { unique: true })
        })
          .then(() => {
            console.log('created bucket events')
            this.store.commit('sync/setIdbVersion', 3)

            resolve(3)
          })
          .catch(error => reject(error))
      }
      if (event.oldVersion === 3) {
        // initial database creation
        // (your code does nothing here)
        console.log('creating bucket logs')
        db.createBucket(
          'log',
          {
            autoIncrement: true,
            keyPath: 'id',
          },
          bucket => {
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
          }
        )
          .then(() => {
            console.log('created bucket events')
            this.store.commit('sync/setIdbVersion', 4)

            resolve(4)
          })
          .catch(error => reject(error))
      }
    })
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

      this.store.commit('sync/status', status)
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

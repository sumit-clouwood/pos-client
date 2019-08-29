/* eslint-disable no-console */
import db from '@/services/network/DB'
import DataService from '@/services/DataService'
import NetworkService from '@/services/NetworkService'
import Fingerprint2 from 'fingerprintjs2'
import * as CONST from '@/constants'

export default {
  store: null,
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

  loadUI() {
    DataService.setLang(this.store.state.location.locale)
    return new Promise((resolve, reject) => {
      this.store
        .dispatch('location/fetch')
        .then(() => {
          this.store
            .dispatch('category/fetchAll')
            .then(() => {
              this.store.dispatch('modifier/fetchAll').then(() => {
                this.store.commit('sync/loaded', true)
                resolve()

                this.store.dispatch('auth/getUserDetails')
                this.store.dispatch('surcharge/fetchAll').then(() => {})
                this.store.dispatch('discount/fetchAll').then(() => {})
                this.store.dispatch('payment/fetchAll').then(() => {})
              })
            })
            .catch(error => reject(error))
        })
        .catch(error => reject(error))
      //continue loading other service in parallel
    })
  },

  initLoadUI() {
    DataService.setLang(this.store.state.location.locale)
    return new Promise((resolve, reject) => {
      this.store
        .dispatch('location/fetch')
        .then(() => {
          this.updateLoading('store')
          this.store
            .dispatch('category/fetchAll')
            .then(() => {
              this.updateLoading('catalog')
              this.store.dispatch('modifier/fetchAll').then(() => {
                this.updateLoading('modifiers')
                this.store.commit('sync/loaded', true)
                resolve()

                this.store.dispatch('auth/getUserDetails')
                this.store.dispatch('customer/fetchAll').then(() => {})
                this.store.dispatch('surcharge/fetchAll').then(() => {})
                this.store.dispatch('discount/fetchAll').then(() => {})
                this.store.dispatch('payment/fetchAll').then(() => {})
                this.store.dispatch('announcement/fetchAll').then(() => {})
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

            this.initLoadUI().then(() => resolve())

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

  setupDB() {
    return new Promise(resolve => {
      this.createDb(1)
        .then(idb => {
          idb.close()
          this.createDb(2).then(idb => {
            idb.close()
            this.createDb(3).then(idb => {
              resolve(idb)
            })
          })
        })
        .catch(event => {
          if (event.target.error.code === 0) {
            //db has been created already so try with a recent version
            const version = 3
            db.openDatabase(version).then(({ idb, flag }) => {
              if (flag === 'open') {
                this.store.commit('sync/setIdbVersion', version)
                resolve(idb)
              }
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
            resolve(idb)
          } else {
            reject(event)
          }
        })
        .catch(error => reject(error))
    })
  },
  createBuckets(event) {
    if (event.oldVersion === 0) {
      // version 1 -> 2 upgrade
      db.createBucket('auth')
      this.store.commit('sync/setIdbVersion', 1)
    }
    if (event.oldVersion === 1) {
      // version 2 -> 3 upgrade
      db.createBucket('order_post_requests', { keyPath: 'order_time' }).then(
        bucket => {
          bucket.createIndex('order_time', 'order_time', { unique: true })
        }
      )
      this.store.commit('sync/setIdbVersion', 2)
    }
    if (event.oldVersion === 2) {
      // initial database creation
      // (your code does nothing here)
      db.createBucket('events', { keyPath: 'url' }).then(bucket => {
        bucket.createIndex('url', 'url', { unique: true })
      })
      this.store.commit('sync/setIdbVersion', 3)
    }
  },

  setNetwork() {
    NetworkService.status((status, msg) => {
      this.store.commit('sync/status', status)
      if (process.env.NODE_ENV === 'production' && msg === 'on') {
        console.log('force sync in 10 sec from app')
        setTimeout(function() {
          navigator.serviceWorker.controller.postMessage({
            sync: 1,
          })
        }, 1000 * 10)
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
          console.log('device id', murmur)
          resolve(murmur)
        })
      }, 10)
    })
  },
}

/* eslint-disable no-console */
import db from '@/services/network/DB'
import DataService from '@/services/DataService'
import NetworkService from '@/services/NetworkService'
import Fingerprint2 from 'fingerprintjs2'

export default {
  setup(store) {
    return new Promise((resolve, reject) => {
      this.setupDB(store)
        .then(idb => {
          store.commit('sync/setIdb', idb)
          this.fetchData(store)
            .then(() => {
              resolve()
            })
            .catch(error => reject(error))
        })
        .catch(error => reject(error))

      //setup network
      this.setNetwork(store)
    })
  },

  fetchData(store) {
    return new Promise((resolve, reject) => {
      this.detectBrowser().then(deviceId => {
        store
          .dispatch('auth/auth', deviceId)
          .then(response => {
            DataService.setContext(store.getters['context/url'])
            //async

            // if (syncDate) {
            //   store.commit('sync/updateSyncDate', syncDate)
            // }
            //sync
            store
              .dispatch('location/fetch', response)
              .then(() => {
                store
                  .dispatch('category/fetchAll', response)
                  .then(() => {
                    store.commit('sync/loaded', true)
                    resolve()
                    // store.dispatch('modifier/fetchAll', response).then(() => {
                    //   resolve()
                    // })
                    // store.dispatch('announcement/fetchAll', response)
                    // store.dispatch('surcharge/fetchAll', response)
                    // store.dispatch('discount/fetchAll', response)
                    store.dispatch('customer/fetchAll', response)
                    // store.dispatch('payment/fetchAll', response)
                    // //store.dispatch('giftcard/fetchAll', response)
                    // store.dispatch('invoice/fetchAll', response)
                    // store.dispatch('loyalty/fetchAll', response)
                    // store.dispatch(
                    //   'deliveryManager/fetchDMOrderDetail',
                    //   response
                    // )
                    // store.dispatch('deliveryManager/getDispatchOrder', response)
                  })
                  .catch(error => reject(error))
              })
              .catch(error => reject(error))
          })
          .catch(error => reject(error))
      })
    })
  },

  setupDB(store) {
    return new Promise(resolve => {
      this.createDb(store, 1)
        .then(idb => {
          idb.close()
          this.createDb(store, 2).then(idb => {
            idb.close()
            this.createDb(store, 3).then(idb => {
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
                store.commit('sync/setIdbVersion', version)
                resolve(idb)
              }
            })
          }
        })
    })
  },
  createDb(store, version) {
    return new Promise((resolve, reject) => {
      db.openDatabase(version)
        .then(({ idb, flag, event }) => {
          if (flag === 'upgrade') {
            this.createBuckets(store, event)
            resolve(idb)
          } else {
            reject(event)
          }
        })
        .catch(error => reject(error))
    })
  },
  createBuckets(store, event) {
    if (event.oldVersion === 0) {
      // version 1 -> 2 upgrade
      db.createBucket('auth')
      store.commit('sync/setIdbVersion', 1)
    }
    if (event.oldVersion === 1) {
      // version 2 -> 3 upgrade
      db.createBucket('order_post_requests')
      store.commit('sync/setIdbVersion', 2)
    }
    if (event.oldVersion === 2) {
      // initial database creation
      // (your code does nothing here)
      db.createBucket('events', { keyPath: 'url' }).then(store => {
        store.createIndex('url', 'url', { unique: true })
      })
      store.commit('sync/setIdbVersion', 3)
    }
  },

  setNetwork(store) {
    NetworkService.status((status, msg) => {
      store.commit('sync/status', status)
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

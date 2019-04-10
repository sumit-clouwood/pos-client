/* eslint-disable no-console */
import db from '@/services/network/DB'
import NetworkService from '@/services/NetworkService'
import Fingerprint2 from 'fingerprintjs2'

export default {
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

  setupDB(store) {
    return new Promise((resolve, reject) => {
      let version = 1

      db.openDatabase(version)
        .then(({ idb, flag }) => {
          if (flag === 'upgrade') {
            db.createBucket('auth')
              .then(() => {
                version++
                idb.close()

                setTimeout(function() {
                  db.openDatabase(version)
                    .then(({ idb, flag }) => {
                      if (flag === 'upgrade') {
                        db.createBucket('order_post_requests')
                          .then(() => {
                            store.commit('sync/setIdbVersion', version)
                            //resolve the first call back process with second idb
                            resolve(idb)
                          })
                          .catch(error => reject(error))
                      }
                    })
                    .catch(error => reject(error))
                }, 1000 * 1)
              })
              .catch(error => reject(error))
          } else {
            resolve(idb)
          }
        })
        .catch(event => {
          if (event.srcElement.error.code === 0) {
            //db has been created already so try with a recent version
            const version = 2
            db.openDatabase(version)
              .then(({ idb, flag }) => {
                if (flag === 'open') {
                  store.commit('sync/setIdbVersion', version)
                  resolve(idb)
                } else {
                  reject(
                    'DB in upgrade status, Problem in creatin db buckets, check version'
                  )
                }
              })
              .catch(error => reject(error))
          } else {
            reject(event.srcElement.error)
          }
        })
    })
  },

  fetchData(store) {
    return new Promise((resolve, reject) => {
      this.detectBrowser().then(deviceId => {
        store
          .dispatch('auth/auth', deviceId)
          .then(response => {
            store.dispatch('location/setLocation')
            //async
            store
              .dispatch('location/fetch', response)
              .then(() => {
                //sync
                store
                  .dispatch('category/fetchAll', response)
                  .then(result => {
                    if (!result || result.error) {
                      reject(result.error || 'No result from category/fetchAll')
                    }

                    store.dispatch('modifier/fetchAll', response).then(() => {
                      store.commit('sync/loaded', true)
                      resolve()
                    })

                    store.dispatch('announcement/fetchAll', response)
                    store.dispatch('surcharge/fetchAll', response)
                    store.dispatch('discount/fetchAll', response)
                    store.dispatch('customer/fetchAll', response)
                    store.dispatch('payment/fetchAll', response)
                    store.dispatch('giftcard/fetchAll', response)
                    store.dispatch('invoice/fetchAll', response)
                    store.dispatch('loyalty/fetchAll', response)
                  })
                  .catch(error => reject(error))
              })
              .catch(error => reject(error))
          })
          .catch(error => reject(error))
      })
    })
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
}

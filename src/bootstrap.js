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
  //this function is called when we recieve msg from service worker i.e token updated
  // also loaded when we click on a category to load new data
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

                this.store.dispatch('surcharge/fetchAll').then(() => {})
                this.store.dispatch('discount/fetchAll').then(() => {})
                this.store.dispatch('payment/fetchAll').then(() => {})
                this.store.dispatch('auth/fetchRoles').then(() => {})
              })
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

                setTimeout(() => {
                  console.log('delayed loading catalog data started')
                  this.loadApiData('catalog').then(() =>
                    console.log('delayed loading catalog data done')
                  )
                }, 3000)

                setTimeout(() => {
                  console.log('delayed loading customer data started')
                  this.loadApiData('customer').then(() =>
                    console.log('delayed loading customer data done')
                  )
                }, 4000)

                //delayed loading data
                setTimeout(() => {
                  console.log('delayed loading order data started')
                  this.loadApiData('order').then(() =>
                    console.log('delayed loading order data done')
                  )
                }, 8000)
              })
              .catch(error => {
                //if refresh token faild log out user here
                return reject(error)
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
          this.store.dispatch('surcharge/fetchAll').then(() => {})
          this.store.dispatch('discount/fetchAll').then(() => {})
          this.store.dispatch('payment/fetchAll').then(() => {})
          resolve()
          break
        case 'customer':
          this.store.dispatch('announcement/fetchAll').then(() => {})
          this.store.dispatch('auth/getUserDetails')
          this.store.dispatch('customer/fetchAll').then(() => {})
          this.store.dispatch('auth/fetchRoles').then(() => {})

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
        db.createBucket('order_post_requests')
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
    })
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

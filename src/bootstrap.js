/* eslint-disable no-console */
import db from '@/services/network/DB'
import NetworkService from '@/services/NetworkService'

export default {
  setup(store) {
    return new Promise((resolve, reject) => {
      console.info('setting up db')

      this.setupDB(store)
        .then(idb => {
          console.info('DB setup complete', idb)
          store.commit('sync/setIdb', idb)
          console.log('putting up store init data')
          this.fetchData(store)
            .then(() => {
              console.log('resolving for main')
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
                console.log('first store  auth created')
                version++
                idb.close()

                console.log('wait a sec to close db')
                setTimeout(function() {
                  db.openDatabase(version)
                    .then(({ idb, flag }) => {
                      console.log(flag)
                      if (flag === 'upgrade') {
                        db.createBucket('order_post_requests')
                          .then(() => {
                            console.log(
                              'second store order_post_requests create'
                            )
                            console.log('commiting db version', version)
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
            console.log('db already exists', version)
            db.openDatabase(version)
              .then(({ idb, flag }) => {
                if (flag === 'open') {
                  store.commit('sync/setIdbVersion', version)
                  console.log('db already upgraded, resolving')
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
      store
        .dispatch('auth/auth')
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
                })
                .catch(error => reject(error))
            })
            .catch(error => reject(error))
        })
        .catch(error => reject(error))
    })
  },

  setNetwork(store) {
    NetworkService.status((status, msg, event) => {
      store.commit('sync/status', status)
      console.log('network status: ', status, msg, event)
      if (msg === 'on') {
        try {
          console.log('force sync in 10 sec from app')
          setTimeout(function() {
            navigator.serviceWorker.controller.postMessage({
              sync: 1,
            })
          }, 1000 * 10)
        } catch (e) {
          console.log("Couldn't send msg to service worker in dev", msg)
        }
      }
    })
  },
}

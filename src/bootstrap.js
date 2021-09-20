/* eslint-disable no-console */
import db from '@/services/network/DB'
import DataService from '@/services/DataService'
import NetworkService from '@/services/NetworkService'
import * as CONST from '@/constants'
import $store from './store'

export default {
  store: null,

  lastSynced: null,
  syncInterval: 10, //300 sec = 5 min

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
          resolve()
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

  setupDB(resolver = null) {
    return new Promise(resolve => {
      const version = 6
      db.openDatabase(version)
        .then(({ idb, flag, event }) => {
          console.log('db opened flag: ', flag)
          if (flag === 'upgrade') {
            console.log('creating buckets')

            //if old version is 0, new is 1
            if (event.oldVersion < 1) {
              this.authBucket()
            }

            if (event.oldVersion < 2) {
              this.logBucket()
            }

            if (event.oldVersion < 5) {
              this.dataStore()
              this.orderWorkflowBucket()
            }
            console.log('all buckets created')
            //in 3 and 5 we created events and store buckets
            //if old version was 5 or below 5
            if (event.oldVersion < 6) {
              console.log('delete eventsBucket and orderPostRequestBucket')

              idb.deleteObjectStore('eventsBucket')
              idb.deleteObjectStore('orderPostRequestBucket')
            }

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
    console.log('auth bucket created')
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
  },
  dataStore() {
    const bucket = db.createBucket('store', { keyPath: 'key' })
    bucket.createIndex('key', 'key', { unique: true })
    console.log('datastore bucket created')
  },

  setNetwork() {
    NetworkService.status(status => {
      //this function below ll be called every one minutes because it
      //is set as interval in netwrokserivce to run every one minute
      // so call back ll run every minute

      $store.commit('sync/status', status)
    })
  },
}

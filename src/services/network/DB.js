/* eslint-disable no-console */
import * as dbconstants from './Constants'

export default {
  idb: null,
  openDatabase(version, cb) {
    //check for support
    return new Promise((resolve, reject) => {
      if (!('indexedDB' in window)) {
        reject("This browser doesn't support IndexedDB")
      }
      let self = this
      let dbrequest = window.indexedDB.open(dbconstants.IDB_NAME, version)

      dbrequest.onupgradeneeded = function(event) {
        console.log('app upgraded', event)
        self.idb = event.target.result
        if (cb) {
          cb(self.idb, resolve)
        } else {
          resolve(self.idb)
        }
      }

      dbrequest.onsuccess = function(event) {
        console.log('success', event)
        self.idb = dbrequest.result
        resolve(self.idb)
      }

      dbrequest.onblocked = function(event) {
        console.log('block error not important', event)
        // Another connection is open, preventing the upgrade,
        // and it didn't close immediately.
      }

      dbrequest.onerror = function(event) {
        console.log('error', event)
        reject(event)
      }
    })
  },
  createBucket(bucket) {
    var self = this
    return new Promise((resolve, reject) => {
      console.log(this.idb)
      const objectStore = this.idb.createObjectStore(bucket, {
        autoIncrement: true,
        keyPath: 'id',
      })
      objectStore.transaction.oncomplete = function() {
        console.log(`create bucket complete ${bucket}`)
        resolve(self.idb.transaction(bucket, 'readwrite').objectStore(bucket))
      }
      objectStore.transaction.onerror = function(event) {
        console.log(`create bucket error ${bucket}`)
        reject(event)
      }
    })
  },
  getBucket(bucketName, mode) {
    // retrieve our object storend
    if (!mode) {
      mode = 'readwrite'
    }

    return new Promise((resolve, reject) => {
      try {
        const bucket = this.idb
          .transaction(bucketName, mode)
          .objectStore(bucketName)
        console.log('bucket fetched', bucket)
        resolve(bucket)
      } catch (e) {
        console.log('bucket not found')
        reject(e)
        // this.createBucket(bucketName)
        //   .then(() => {
        //     const bucket = this.idb
        //       .transaction(bucketName, mode)
        //       .objectStore(bucketName)
        //     console.log('bucket created', bucket)
        //     resolve(bucket)
        //   })
        //   .catch(error => {
        //     console.log('bucket create error', error)
        //     reject(error)
        //   })
      }
    })
  },
  add(bucket, data) {
    return new Promise((resolve, reject) => {
      try {
        const req = bucket.add(data)
        req.onsuccess = function(event) {
          console.log('record added to bucket')
          resolve(event)
        }
        req.onerror = function(event) {
          console.log('record add to bucket failed')
          reject(event)
        }
      } catch (e) {
        console.log('error', e)
        reject(e)
      }
    })
  },
  fetch(bucket) {
    return new Promise((resolve, reject) => {
      const req = bucket.openCursor() // FOLDERNAME
      let savedRequests = []
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
          console.log('fetched requests')
          resolve(savedRequests)
        }
      }
      req.onerror = async function(event) {
        console.log('fetch failed', event)
        reject(event)
      }
    })
  },
  close() {
    console.log('closing db connection')
    this.idb.close()
  },
}

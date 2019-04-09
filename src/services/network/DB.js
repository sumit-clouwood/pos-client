import * as dbconstants from './Constants'

export default {
  idb: null,
  openDatabase(version) {
    //check for support
    return new Promise((resolve, reject) => {
      if (!('indexedDB' in window)) {
        reject("This browser doesn't support IndexedDB")
      }
      let self = this
      let dbrequest = window.indexedDB.open(dbconstants.IDB_NAME, version)

      dbrequest.onupgradeneeded = function(event) {
        self.idb = event.target.result
        resolve({ idb: self.idb, flag: 'upgrade' })
      }

      dbrequest.onsuccess = function() {
        self.idb = dbrequest.result
        resolve({ idb: self.idb, flag: 'open' })
      }

      dbrequest.onblocked = function() {
        // Another connection is open, preventing the upgrade,
        // and it didn't close immediately.
        reject('blocked')
      }

      dbrequest.onerror = function(event) {
        reject(event)
      }
    })
  },
  createBucket(bucket) {
    var self = this
    return new Promise((resolve, reject) => {
      const objectStore = this.idb.createObjectStore(bucket, {
        autoIncrement: true,
        keyPath: 'id',
      })
      objectStore.transaction.oncomplete = function() {
        resolve(self.idb.transaction(bucket, 'readwrite').objectStore(bucket))
      }
      objectStore.transaction.onerror = function(event) {
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
        resolve(bucket)
      } catch (e) {
        reject(e)
      }
    })
  },
  add(bucket, data) {
    return new Promise((resolve, reject) => {
      try {
        const req = bucket.add(data)
        req.onsuccess = function(event) {
          resolve(event)
        }
        req.onerror = function(event) {
          reject(event)
        }
      } catch (e) {
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
          resolve(savedRequests)
        }
      }
      req.onerror = async function(event) {
        reject(event)
      }
    })
  },
  close() {
    this.idb.close()
  },
}

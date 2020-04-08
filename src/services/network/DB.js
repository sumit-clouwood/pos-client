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
        resolve({ idb: self.idb, flag: 'upgrade', event: event })
      }

      dbrequest.onsuccess = function(event) {
        self.idb = dbrequest.result
        resolve({ idb: self.idb, flag: 'open', event: event })
      }

      dbrequest.onblocked = function() {
        // Another connection is open, preventing the upgrade,
        // and it didn't close immediately.
        reject({ idb: self.idb, event: 'blocked' })
      }

      dbrequest.onerror = function(event) {
        reject(event)
      }
    })
  },
  createBucket(bucket, options) {
    return this.idb.createObjectStore(
      bucket,
      options
        ? options
        : {
            autoIncrement: true,
            keyPath: 'id',
          }
    )
  },
  getBucket(bucketName, mode) {
    // retrieve our object storend
    if (!mode) {
      mode = 'readwrite'
    }

    return new Promise((resolve, reject) => {
      try {
        const transaction = this.idb.transaction(bucketName, mode)

        if (transaction) {
          const bucket = transaction.objectStore(bucketName)
          resolve(bucket)

          transaction.onerror = function(event) {
            reject(`Bucket ${bucketName} failed, ${transaction}, ${event}`)
          }
        } else {
          reject(`Bucket ${bucketName} failed, ${transaction}`)
        }
      } catch (e) {
        reject(`Bucket ${bucketName} failed, ${e}`)
      }
    })
  },
  find(bucket, key) {
    return new Promise((resolve, reject) => {
      var objectStoreRequest = bucket.get(key)
      objectStoreRequest.onsuccess = function() {
        resolve(objectStoreRequest.result)
      }
      objectStoreRequest.onerror = function(event) {
        reject(event)
      }
    })
  },
  delete(bucket, key) {
    return new Promise((resolve, reject) => {
      var objectStoreRequest = bucket.delete(key)
      objectStoreRequest.onsuccess = function() {
        resolve(objectStoreRequest.result)
      }
      objectStoreRequest.onerror = function(event) {
        reject(event)
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
  put(bucket, data) {
    return new Promise((resolve, reject) => {
      try {
        const req = bucket.put(data)
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

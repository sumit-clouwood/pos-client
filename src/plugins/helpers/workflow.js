import DB from '@/services/network/DB'

export default {
  bucketName: 'order_post_requests',
  DBVersion: 4,
  keyName: 'order_time', //this we can use as id/pk, it is being used in old code so we don't want to distract
  //running customers, can't take a risk to change its name, once every thing stable we ll change it.
  createId(prefix = '', postfix = '') {
    return prefix + +new Date() + postfix
  },
  getEntry() {
    return {
      step: '',
      keys: {},
      status: '',
      request: {
        url: '',
        data: {},
      },
      response: {},
      startTime: '',
      endTime: '',
      rootStep: '',
    }
  },
  openDB() {
    if (DB.idb) return Promise.resolve()
    return DB.openDatabase(this.DBVersion)
  },
  async addEntry({ id, step, keys, status, request, startTime, rootStep }) {
    this.openDB().then(() => {
      return new Promise((resolve, reject) => {
        let entry = this.getEntry()

        entry.step = step
        entry.keys = keys
        entry.status = status
        entry.request = request
        entry.startTime = startTime
        entry.rootStep = rootStep

        entry[this.keyName] = id

        DB.getBucket(this.bucketName, 'readwrite')
          .then(bucket =>
            DB.add(bucket, entry)
              .then(() => resolve())
              .catch(err => reject(err))
          )
          .catch(err => reject(err))
      })
    })
  },

  async removeEntry(id) {
    return new Promise((resolve, reject) => {
      DB.getBucket(this.bucketName, 'readwrite').then(bucket =>
        DB.delete(bucket, id)
          .then(() => resolve())
          .catch(err => reject(err))
      )
    })
  },

  async updateEntry(entry) {
    return new Promise((resolve, reject) => {
      DB.getBucket(this.bucketName, 'readwrite').then(bucket =>
        DB.put(bucket, entry)
          .then(() => resolve())
          .catch(err => reject(err))
      )
    })
  },
  async findEntry(key) {
    return new Promise((resolve, reject) => {
      DB.getBucket(this.bucketName, 'readwrite').then(bucket =>
        DB.find(bucket, key)
          .then(data => resolve(data))
          .catch(err => reject(err))
      )
    })
  },
  async getEntries() {
    return new Promise((resolve, reject) => {
      DB.getBucket(this.bucketName, 'readwrite').then(bucket =>
        DB.fetch(bucket)
          .then(data => resolve(data))
          .catch(err => reject(err))
      )
    })
  },
}

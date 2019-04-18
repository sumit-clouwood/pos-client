/* eslint-disable no-console */
import axios from 'axios'
import db from '@/services/network/DB'
import DateTime from '@/plugins/helpers/DateTime.js'

const apiURL =
  process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_ENDPOINT : ''

axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.post['Accept'] = 'application/json'

export default {
  getSyncDate() {
    return this.syncDate
  },
  getLive(url, resolve, reject) {
    const newDate = new DateTime()
    this.syncDate = newDate.getDate()

    axios
      .get(apiURL + url)
      .then(response => {
        this.saveEventOffline({ request: url, response: response.data })
          .then(() => {
            this.setLastUpdate(url, new Date())
          })
          .catch(error => {
            reject(error)
          })
        resolve(response)
      })
      .catch(() => {
        this.getOfflineEventData(url).then(response => {
          if (response) {
            resolve(response)
          } else {
            reject('No data found in both live and local')
          }
        })
      })
  },

  get(url) {
    return new Promise((resolve, reject) => {
      axios
        .get(apiURL + url)
        .then(response => resolve(response))
        .catch(error => reject(error))
    })
  },

  getCacheable(url) {
    return new Promise((resolve, reject) => {
      this.getOfflineEventData(url)
        .then(response => {
          if (!response.lastUpdated) {
            //no response found in local db, get it from live
            this.getLive(url, resolve, reject)
          } else {
            const lastUpdatedTime = response.lastUpdated.getTime()
            const nowTime = new Date().getTime()
            const days = (nowTime - lastUpdatedTime) / (1000 * 3600 * 24)
            if (days > 1) {
              //resync time greater than 1 day, get live, we ll change this later
              this.getLive(url, resolve, reject)
            } else {
              const newDate = new DateTime(response.lastUpdated)
              this.syncDate = newDate.getDate()
              resolve(response)
            }
          }
        })
        .catch(() => {
          //no data found in the localdb
          this.getLive(url, resolve, reject)
        })
    })
  },

  post(url, data) {
    return new Promise((resolve, reject) => {
      axios
        .post(apiURL + url, data)
        .then(response => resolve(response))
        .catch(error => reject(error))
    })
  },

  applyMiddleWare(token) {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token

    axios.interceptors.request.use(
      function(config) {
        // Do something before request is sent
        return config
      },
      function(error) {
        // Do something with request error
        return Promise.reject(error)
      }
    )
  },

  auth(env, deviceId) {
    if (process.env.VUE_APP_API_ENDPOINT === 'http://13.127.145.151') {
      //use post method
      const url = apiURL + '/api/auth/login'

      const data = {
        email: env.VUE_APP_API_USERNAME,
        password: env.VUE_APP_API_PASSWORD,
        device_id: deviceId,
      }

      return new Promise((resolve, reject) => {
        axios
          .post(url, data)
          .then(response => {
            return resolve(response)
          })
          .catch(response => {
            return reject(response)
          })
      })
    } else {
      //use get method
      const url =
        apiURL +
        '/api/auth/login/' +
        '?email=' +
        env.VUE_APP_API_USERNAME +
        '&password=' +
        env.VUE_APP_API_PASSWORD +
        '&device_id=' +
        deviceId

      return new Promise((resolve, reject) => {
        axios
          .post(url)
          .then(response => {
            return resolve(response)
          })
          .catch(response => {
            return reject(response)
          })
      })
    }
  },
  saveEventOffline({ request, response }) {
    return new Promise((resolve, reject) => {
      db.getBucket('events').then(bucket => {
        db.put(bucket, { url: request, data: response })
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    })
  },
  setLastUpdate(request, time) {
    db.getBucket('events').then(bucket =>
      db.find(bucket, request).then(data => {
        data.lastUpdated = time
        db.put(bucket, data)
      })
    )
  },
  getOfflineEventData(request) {
    return new Promise((resolve, reject) => {
      db.getBucket('events').then(bucket =>
        db
          .find(bucket, request)
          .then(data => {
            resolve(data)
          })
          .catch(error => reject(error))
      )
    })
  },
}

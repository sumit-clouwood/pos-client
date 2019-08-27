/* eslint-disable no-console */
import axios from 'axios'
import createAuthRefreshInterceptor from 'axios-auth-refresh'
import db from '@/services/network/DB'
import DateTime from '@/plugins/helpers/DateTime.js'

const apiURL = process.env.VUE_APP_API_ENDPOINT

console.log('api url', process.env.NODE_ENV, apiURL)

axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.post['Accept'] = 'application/json'

// Set up access token with axios

function getAccessToken() {
  //we will remove this later
  if (localStorage.getItem('token')) {
    return 'Bearer ' + localStorage.getItem('token')
  } else {
    return ''
  }
}

function setMiddleware() {
  axios.interceptors.request.use(request => {
    request.headers['Authorization'] = getAccessToken()
    return request
  })
}

setMiddleware()

// Setup refresh tokens
// This unction that will be called to refresh authorization
// Note: Refresh token is generated by token saved at laravel, so we don't need to send any token data
const refreshAuthLogic = failedRequest =>
  axios.post(apiURL + '/refresh').then(tokenRefreshResponse => {
    localStorage.setItem('token', tokenRefreshResponse.data.token)
    db.getBucket('auth').then(bucket => {
      db.fetch(bucket).then(data => {
        data[0].token = tokenRefreshResponse.data.token
        db.put(bucket, data[0])
      })
    })
    failedRequest.response.config.headers['Authorization'] = getAccessToken()
    return Promise.resolve()
  })

// Instantiate the interceptor (you can chain it as it returns the axios instance)
createAuthRefreshInterceptor(axios, refreshAuthLogic)

export default {
  context: { store: '', brand: '' },
  setContext(context) {
    this.context = context
  },
  removeMiddleware() {
    delete axios.defaults.headers['Authorization']
  },
  setLang(lang) {
    this.lang = lang
  },
  getAbsUrl(url) {
    return url.replace(/last_sync_date=[^&]*&?/, '')
  },
  getContextUrl(url, level) {
    if (level === false) {
      return url
    } else if (level === 'brand') {
      return this.context.brand + url
    } else {
      return this.context.store + url
    }
  },
  isValidResponse(response) {
    let validResponse = false
    if (typeof response.data.status !== 'undefined') {
      //check for status
      validResponse = ['success', 'ok', '1', 'form_errors'].includes(
        response.data.status
      )
    } else if (typeof response.data.error !== 'undefined') {
      //check for error
      validResponse = response.data.error ? false : true
    } else {
      validResponse = response.data ? true : false
    }
    return validResponse
  },

  getLive(url, resolve, reject) {
    //const newDate = new DateTime()
    //this.syncDate = newDate.getDate()
    const absUrl = this.getAbsUrl(url)
    axios
      .get(apiURL + url)
      .then(response => {
        if (this.isValidResponse(response)) {
          this.saveEventOffline({
            request: absUrl,
            response: response.data,
          })
            .then(() => {
              this.setLastUpdate(absUrl, new Date())
            })
            .catch(error => {
              reject(error)
            })
          resolve(response)
        } else {
          reject(response)
        }
      })
      .catch(() => {
        this.getOfflineEventData(absUrl).then(response => {
          if (response) {
            resolve(response)
          } else {
            reject(`No data found in both live and local for url ${absUrl}`)
          }
        })
      })
  },

  get(url, level) {
    url = this.getContextUrl(url, level)
    return new Promise((resolve, reject) => {
      // axios
      //   .get(apiURL + url)
      //   .then(response => {
      //     if (this.isValidResponse(response)) {
      //       resolve(response)
      //     } else {
      //       reject(response)
      //     }
      //   })
      //   .catch(error => reject(error))
      return this.getLive(url, resolve, reject)
    })
  },

  getT(url, level) {
    url += '&translations_needed=1&lang=' + this.lang
    return this.get(url, level)
  },

  getCacheable(url, level) {
    url = this.getContextUrl(url, level)
    const absUrl = this.getAbsUrl(url)
    return new Promise((resolve, reject) => {
      this.getOfflineEventData(absUrl)
        .then(response => {
          if (!response.lastUpdated) {
            //no response found in local db, get it from live
            this.getLive(url, resolve, reject)
          } else {
            const lastUpdatedTime = response.lastUpdated.getTime()
            const nowTime = new Date().getTime()
            const days = (nowTime - lastUpdatedTime) / (1000 * 3600 * 24)

            const newDate = new DateTime(response.lastUpdated)

            if (days > 1) {
              //resync time greater than 1 day, get live, we ll change this later
              this.getLive(
                absUrl + '&last_sync_date=' + newDate.getDate(),
                resolve,
                reject
              )
            } else {
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

  post(url, data, level) {
    url = this.getContextUrl(url, level)
    return new Promise((resolve, reject) => {
      axios
        .post(apiURL + url, data)
        .then(response => {
          if (this.isValidResponse(response)) {
            resolve(response)
          } else {
            reject(response)
          }
        })
        .catch(error => reject(error))
    })
  },

  factory() {
    return axios
  },

  saveEventOffline({ request, response }) {
    return new Promise((resolve, reject) => {
      db.getBucket('events')
        .then(bucket => {
          db.put(bucket, { url: request, data: response })
            .then(response => {
              resolve(response)
            })
            .catch(error => {
              reject(error)
            })
        })
        .catch(error =>
          console.log(
            'error opening db bucket events',
            error,
            request,
            response
          )
        )
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

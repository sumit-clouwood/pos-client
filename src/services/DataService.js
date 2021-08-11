/* eslint-disable no-console */
import axios from 'axios'
import createAuthRefreshInterceptor from 'axios-auth-refresh'
import db from '@/services/network/DB'
import $store from '@/store'
const apiURL = process.env.VUE_APP_API_ENDPOINT
const CDN_ENABLED = false

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
    if (
      CDN_ENABLED &&
      request.method == 'get' &&
      request.url.includes('/cached/api')
    ) {
      request.headers['Authorization'] = 'as_guest'
    } else {
      request.headers['Authorization'] = getAccessToken()
    }
    return request
  })
}

setMiddleware()

// Setup refresh tokens
// This unction that will be called to refresh authorization
// Note: Refresh token is generated by token saved at laravel, so we don't need to send any token data
const refreshAuthLogic = failedRequest =>
  axios
    .post(apiURL + '/refresh')
    .then(tokenRefreshResponse => {
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
    .catch(error => {
      console.log('refresh token failed: ', error)
      localStorage.setItem('token', '')
      localStorage.setItem('brand_id', '')
      localStorage.setItem('store_id', '')
      return Promise.reject(error)
    })

// Instantiate the interceptor (you can chain it as it returns the axios instance)
createAuthRefreshInterceptor(axios, refreshAuthLogic)

export default {
  context: { store: '', brand: '' },
  setStore(store) {
    this.store = store
  },
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
      validResponse = ['success', 'ok', '1', 'form_errors', 'loaded'].includes(
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

  get(url, level) {
    if (!url.includes('pos_menu')) {
      let uriparts = url
        .substring(1)
        .replace('model/', '')
        .split('/')

      let model = uriparts[0].split('?')[0]

      let apiVersion = $store.getters['sync/getVersion'](model)

      let glue = '?'

      if (url.includes('?')) {
        glue = '&'
      }

      if (apiVersion) {
        url += glue + 'fetch_version=' + apiVersion
      }
    }

    url = this.getContextUrl(url, level)

    return new Promise((resolve, reject) => {
      if (!localStorage.getItem('token')) {
        this.store.dispatch('auth/logout', {
          preserve: ['brand_id', 'store_id'],
        })
        return Promise.reject('token expired or not found, logout')
      }

      let endpoint = apiURL

      if (CDN_ENABLED && !url.includes('pos_menu')) {
        endpoint = apiURL.replace(new RegExp('/api$'), '/cached/api')
      }

      axios
        .get(endpoint + url)
        .then(response => {
          if (this.isValidResponse(response)) {
            resolve(response)
          } else {
            reject(response)
          }
        })
        .catch(err => {
          reject(err)
        })
    })
  },

  getT(url, level) {
    url += '&translations_needed=1&lang=' + this.lang || 'en-US'
    return this.get(url, level)
  },

  post(url, data, level) {
    if (!localStorage.getItem('token')) {
      this.store.dispatch('auth/logout')
      return Promise.reject('token expired or not found, logout')
    }

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

  invoiceapp(url, data) {
    return new Promise((resolve, reject) => {
      axios
        /*.get(url + '?data=' + data)
        .headers[{ 'Content-Encoding': 'gzip' }].then(response => {*/
        .post(url, data)
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
}

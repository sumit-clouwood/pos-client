/* eslint-disable no-console */
import axios from 'axios'

const apiURL =
  process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_ENDPOINT : ''

axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.post['Accept'] = 'application/json'

export default {
  get(url) {
    return new Promise((resolve, reject) => {
      axios
        .get(apiURL + url)
        .then(response => resolve(response))
        .catch(error => reject(error))
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
}

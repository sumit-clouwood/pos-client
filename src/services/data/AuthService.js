import DataService from '@/services/DataService'
const authUrl = process.env.VUE_APP_API_ENDPOINT + '/login'

export default {
  getAccess() {
    //use post method
    return new Promise((resolve, reject) => {
      if (localStorage.getItem('token')) {
        let data = {
          token: localStorage.getItem('token'),
        }
        resolve({
          data: data,
        })
      } else {
        reject('Auth failed, Please check if token exists.')
      }
    })
  },
  getRoles() {
    return DataService.get('/model/brand_roles?no_limit=true')
  },

  login(data) {
    return new Promise((resolve, reject) => {
      DataService.factory()
        .post(authUrl, data)
        .then(response => {
          //temporary values
          return resolve(response)
        })
        .catch(response => {
          return reject(response.response.data.error)
        })
    })
  },
  logout(msg) {
    return new Promise((resolve, reject) => {
      DataService.factory()
        .post(process.env.VUE_APP_API_ENDPOINT + '/logout?' + msg)
        .then(response => {
          DataService.removeMiddleware()
          resolve(response)
        })
        .catch(response => reject(response))
    })
  },

  userDetails(userId) {
    // return DataService.get(`/model/brand_users/id/${userId}`, 'brand')
    return DataService.get(`/model/users/id/${userId}`, false)
  },
}

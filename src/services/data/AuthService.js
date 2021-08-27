import DataService from '@/services/DataService'
const authUrl = process.env.VUE_APP_API_ENDPOINT + '/login'
const pinloginUrl = process.env.VUE_APP_API_ENDPOINT + '/swipe_login'

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
    return DataService.get(`/model/brand_roles?no_limit=true&byColumn=0`)
  },
  getUsers(roleId) {
    return DataService.get(
      `/model/users?no_limit=true&byColumn=0&brand_role=${roleId}`
    )
  },
  getAllUsers() {
    return DataService.get(
      `/model/brand_users?page_id=brand_users_main_tbl&no_limit=true`
    )
  },
  getStoreUsers(pageId, level, roleId) {
    return DataService.get(
      `/model/brand_users?page_id=${pageId}&query=&no_limit=true&byColumn=0&brand_role=${roleId}`,
      level
    )
  },

  pinlogin(data) {
    return new Promise((resolve, reject) => {
      DataService.factory()
        .post(pinloginUrl, data)
        .then(response => {
          //temporary values
          return resolve(response)
        })
        .catch(response => {
          return reject(response)
        })
    })
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
  async logincust(data) {
    return new Promise(async resolve => {
      const response = await fetch(authUrl, {
        method: 'POST',
        body: data,
      })
      resolve(response)
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

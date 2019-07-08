import DataService from '@/services/DataService'
const authUrl = process.env.VUE_APP_API_ENDPOINT + '/login'

export default {
  getAccess(env) {
    //use post method
    return new Promise((resolve, reject) => {
      if (localStorage.getItem('token')) {
        let data = {
          token: localStorage.getItem('token'),
        }
        resolve({
          data: data,
        })
      } else if (
        process.env.NODE_ENV !== 'production' ||
        process.env.VUE_APP_LOCAL_SERVER
      ) {
        const data = {
          email: env.VUE_APP_API_USERNAME,
          password: env.VUE_APP_API_PASSWORD,
        }

        DataService.factory()
          .post(authUrl, data)
          .then(response => {
            //temporary values
            localStorage.setItem('token', response.data.token)
            return resolve(response)
          })
          .catch(response => {
            return reject(response)
          })
      } else {
        reject('Auth failed, Please check if token exists.')
      }
    })
  },
  getRoles() {
    return DataService.get('/model/brand_roles?no_limit=true')
  },
}

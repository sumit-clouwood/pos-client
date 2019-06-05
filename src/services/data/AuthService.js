import DataService from '@/services/DataService'
const authUrl = '/login/'
const deviceCode = '100'
const franchiseCode = '0004'
const lastOrderNo = '1000'

export default {
  getAccess(env, deviceId) {
    //use post method
    return new Promise((resolve, reject) => {
      if (localStorage.getItem('token')) {
        let data = {
          token: localStorage.getItem('token'),
          device_code: localStorage.getItem('device_code'),
          franchise_code: localStorage.getItem('franchise_code'),
          last_order_no: localStorage.getItem('last_order_no'),
        }

        const userString = localStorage.getItem('user')
        if (userString) {
          data.user = JSON.parse(userString)
        }
        resolve({
          data: data,
        })
      } else {
        const data = {
          email: env.VUE_APP_API_USERNAME,
          password: env.VUE_APP_API_PASSWORD,
          device_id: deviceId,
        }

        DataService.post(authUrl, data)
          .then(response => {
            //temporary values
            response.data.device_code = deviceCode
            response.data.franchise_code = franchiseCode
            response.data.last_order_no = lastOrderNo

            localStorage.setItem('token', response.data.token)
            localStorage.setItem('user', JSON.stringify(response.data.user))
            localStorage.setItem('device_code', response.data.device_code)
            localStorage.setItem('franchise_code', response.data.franchise_code)
            localStorage.setItem('last_order_no', response.data.last_order_no)
            return resolve(response)
          })
          .catch(response => {
            return reject(response)
          })
      }
    })
  },
}

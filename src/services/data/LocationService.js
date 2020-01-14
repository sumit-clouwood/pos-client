import DataService from '@/services/DataService'

export default {
  //Get country,city,location and drivers data by location id . ?lang=ru-RU
  getLocationData() {
    //const language = typeof lang != 'undefined' ? '&lang=' + lang : ''
    return new Promise((resolve, reject) => {
      DataService.getT('/ui_menu?&menu_needed=false')
        .then(response => resolve(response))
        .catch(error => {
          return DataService.getT('/ui_menu?&menu_needed=false', false)
            .then(response => resolve(response))
            .catch(errorWithoutContext =>
              reject(error + ', Error without context: ' + errorWithoutContext)
            )
        })
    })
  },
  getReferrals() {
    return DataService.get(
      '/model/brand_referrals?page_id=brand_referrals_main_tbl&query=&limit=999&ascending=1&page=1&byColumn=0&item_status=true&orderBy=referral_name'
    )
  },
  userDetails(userId) {
    // return DataService.get(`/model/brand_users/id/${userId}`, 'brand')
    return DataService.get(`/model/users/id/${userId}`, false)
  },

  registerDevice(deviceId) {
    return DataService.get(`/model/store_cashier_apps`).then(response => {
      if (
        !response.data ||
        !response.data.data.find(device => device.terminal_code == deviceId)
      ) {
        return DataService.post(`/model/store_cashier_apps/add`, {
          enabled: true,
          s_n: 1,
          terminal_code: deviceId,
          terminal_id: deviceId.substr(16),
        })
      } else {
        return Promise.resolve({ data: { id: deviceId } })
      }
    })
  },
}

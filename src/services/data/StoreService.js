import DataService from '@/services/DataService'

export default {
  getApiVersions() {
    return DataService.get('/versions')
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
  validateStoreSubscription() {
    return DataService.get(
      '/model/subscriptions/get_subscription_status',
      null,
      false
    )
  },
}

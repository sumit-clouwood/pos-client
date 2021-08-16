import DataService from '@/services/DataService'

export default {
  fetchHoldOrder(...[orderId, lastSyncDate]) {
    return DataService.get(
      `/auth/order/details?order_id=${orderId}&last_sync_date=${lastSyncDate}`,
      null,
      false
    )
  },
}

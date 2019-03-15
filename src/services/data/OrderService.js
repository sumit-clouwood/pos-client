import DataService from '@/services/DataService'

export default {
  saveOrder(data) {
    return DataService.post('/api/auth/order/SaveOrder', data)
  },

  deleteOrder(orderId) {
    return DataService.get(`/api/auth/order/deleteOrder/?&order_id=${orderId}`)
  },

  updateOrder(...[locationId, orderStatus, orderId, orderType, timestamp]) {
    return DataService.post(
      `/api/auth/deliveryManager/update/order?location_id=${locationId}&order_status=${orderStatus}&order_id=${orderId}&order_type=${orderType}&timestamp=${timestamp}`
    )
  },
}

/* eslint-disable no-console */
import DataService from '@/services/DataService'

export default {
  saveOrder(data, userdata) {
    let msg = {
      form_data: data,
    }

    msg.form_data.user = userdata
    try {
      navigator.serviceWorker.controller.postMessage(msg)
    } catch (e) {
      console.log("Couldn't send msg to service worker in dev", msg)
    }
    return DataService.post('/api/auth/order/SaveOrder', data)
  },

  deleteOrder(orderId) {
    return DataService.get(`/api/auth/order/deleteOrder/?&order_id=${orderId}`)
  },

  updateOrder(data) {
    return DataService.post('/api/auth/deliveryManager/update/order', data)
  },

  fetchOnlineOrderDetails(...[orderid, locationId]) {
    return DataService.get(
      `/api/auth/online-order-list/${locationId}/${orderid}`
    )
  },
}

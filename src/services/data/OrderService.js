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
    return DataService.post('/model/orders/add', data)
  },

  deleteOrder(orderId) {
    return DataService.get(`/api/auth/order/deleteOrder/?order_id=${orderId}`)
  },

  updateOrder(data) {
    return DataService.post('/api/auth/deliveryManager/update/order', data)
  },

  fetchOnlineOrderDetails(...[orderid, locationId]) {
    return DataService.get(
      `/api/auth/online-order-list/${locationId}/${orderid}`
    )
  },
  getOrders(query, limit, orderBy, orderStatus, page) {
    return DataService.get(
      // `/model/orders?page_id=orders_main_tbl&query=&limit=10&ascending=1&page=1&byColumn=0&orderBy=order_status&orderStatus=${orderStatus}`
      `/model/orders?page_id=orders_main_tbl&query=${query}&limit=${limit}&ascending=1&page=${page}&byColumn=0&orderBy=${orderBy}&order_status=${orderStatus}`
    )
  },
  getGlobalDetails(modal, id) {
    return DataService.get(`/model/${modal}/id/${id}`, 'brand')
  },
}

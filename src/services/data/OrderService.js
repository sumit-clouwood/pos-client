/* eslint-disable no-console */
import DataService from '@/services/DataService'

export default {
  saveOrder(data, userdata) {
    let msg = {
      form_data: data,
    }

    if (userdata) {
      msg.form_data.user = userdata
    }
    try {
      navigator.serviceWorker.controller.postMessage(msg)
    } catch (e) {
      console.log("Couldn't send msg to service worker in dev", msg)
    }
    return DataService.post('/model/orders/add', data)
  },

  // deleteOrder(orderId) {
  //   return DataService.get(`/auth/order/deleteOrder/?order_id=${orderId}`)
  // },

  updateOrder(data) {
    return DataService.post('/auth/deliveryManager/update/order', data)
  },

  fetchOnlineOrderDetails(...[orderid, locationId]) {
    return DataService.get(`/auth/online-order-list/${locationId}/${orderid}`)
  },
  getOrders(query, limit, orderBy, orderStatus, page, pageId, storeId) {
    return DataService.get(
      `/model/orders?page_id=${pageId}&query=${query}&limit=${limit}&ascending=1&page=${page}&byColumn=0&orderBy=${orderBy}&order_status=${orderStatus}&store_id=${storeId}`
    )
  },
  getGlobalDetails(modal, id, action) {
    let validAction = action !== '' ? '/' + action : ''
    return DataService.get(`/model/${modal}/id/${id}${validAction}`, 'brand')
  },

  getModalDetails(model) {
    return DataService.get(`/model/${model}?no_limit=true`, 'brand')
  },

  updateOrderAction(id, action, params) {
    let setBrand = action == 'cancel_order' ? 'brand' : ''
    return DataService.post(
      `/model/orders/id/${id}/${action}`,
      params,
      setBrand
    )
  },

  modifyOrder(order, id, type) {
    if (type) {
      type += '_'
    } else {
      type = ''
    }
    return DataService.post(`/model/orders/id/${id}/modify_${type}order`, order)
  },
}

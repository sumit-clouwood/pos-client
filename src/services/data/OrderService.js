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
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        navigator.serviceWorker.controller.postMessage(msg)
      } else {
        console.log('service worker not found in app ')
      }
    } catch (e) {
      console.log("Couldn't send msg to service worker in dev", e, msg)
    }
    delete data.user
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
  getOrders(
    query,
    limit,
    orderBy,
    orderStatus,
    orderType,
    page,
    pageId,
    storeId,
    customerId
  ) {
    let customer = customerId != '' ? '&customer=' + customerId : ''
    return DataService.get(
      `/model/orders?page_id=${pageId}&query=${query}&limit=${limit}&ascending=1&page=${page}&byColumn=1&orderBy=${orderBy}&order_status=${orderStatus}&order_type=${orderType}&store_id=${storeId}${customer}`
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
    let setBrand = ['delivery_ready'].includes(action) ? 'brand' : ''
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
  updateOrderItems(order, id, type) {
    if (type) {
      type += '_'
    } else {
      type = ''
    }
    return DataService.post(`/model/orders/id/${id}/update_order_items`, order)
  },
}

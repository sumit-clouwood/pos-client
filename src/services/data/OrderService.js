/* eslint-disable no-console */
import DataService from '@/services/DataService'
import Logger from '@/services/network/Logger'
import DateTime from '@/mixins/DateTime.js'

export default {
  saveOrder(data) {
    const orderTimeUTC = this.getOrderTimeUTC()
    let msg = {
      form_data: { ...data, ...orderTimeUTC },
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

    //remove offline data
    delete data.user

    return new Promise((resolve, reject) => {
      DataService.post('/model/orders/add', data)
        .then(response => {
          Logger.log({
            event_time: data.real_created_datetime,
            event_title: data.balance_due,
            event_type: 'pos_order_success',
            event_data: { request: data, response: response.data },
          })
          resolve(response)
        })
        .catch(error => {
          Logger.log({
            event_time: data.real_created_datetime,
            event_title: data.balance_due,
            event_type: 'pos_order_failed',
            event_data: {
              request: data,
              response: { message: error.message },
            },
          })
          reject(error)
        })
    })
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
  //Adding this code to overcome other parts of system,
  // On Transaction Screen We don't need orders which are cancelled or modified
  getOrdersForTransactionScreen(
    query,
    limit,
    orderBy,
    orderSystemStatus,
    orderType,
    page,
    pageId,
    storeId,
    customerId
  ) {
    let customer = customerId != '' ? '&customer=' + customerId : ''
    return DataService.get(
      `/model/orders?page_id=${pageId}&query=${query}&limit=${limit}&ascending=1&page=${page}&byColumn=1&orderBy=${orderBy}&order_system_status=${orderSystemStatus}&order_type=${orderType}&store_id=${storeId}${customer}`
    )
  },
  getGlobalDetails(modal, id, action) {
    let validAction = action !== '' ? '/' + action : ''
    return DataService.get(`/model/${modal}/id/${id}${validAction}`, 'brand')
  },

  getModalDetails(model) {
    let query =
      model === 'brand_cancellation_reasons'
        ? '?no_limit=true&byColumn=1&item_status=true'
        : '?no_limit=true'
    return DataService.get(`/model/${model}${query}`, 'brand')
  },

  getModifyReasons() {
    return DataService.get(`/model/brand_modify_reasons?no_limit=true`, 'brand')
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
  SetPOSWaitingTime(waiting_time, store_id) {
    return DataService.post(
      `/model/stores/id/${store_id}/store_waiting_time_action_id`,
      waiting_time
    )
  },

  getOrderTimeUTC() {
    return { orderTimeUTC: DateTime.getUTCDateTime() }
  },

  updateOrderItems(order, id) {
    const orderTimeUTC = this.getOrderTimeUTC()
    let msg = {
      form_data: { ...order, ...orderTimeUTC },
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

    //remove offline data
    delete order.user
    return DataService.post(`/model/orders/id/${id}/update_order_items`, order)
  },
  invoiceAPI(order, apiurl) {
    return DataService.invoiceapp(apiurl + `/printorder`, order)
  },
}

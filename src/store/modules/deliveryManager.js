import * as mutation from './deliveryManager/mutation-types'
import DMService from '@/services/data/DeliveryManagerService'
// import LookupData from '@/plugins/helpers/LookupData'
/* eslint-disable no-console */

const state = {
  deliveryOrderStatus: 'in-progress',
  collected: 'no',
  orders: [],
  onlineOrders: { count: 0, orders: false },
  orderCounts: 0,
  listType: 'New Orders',
  section: 'crm',
  selectedOrder: false,
  selectedDriver: false,
  deliveredOrderGroup: [],
  deliveredOrderCollection: [],
  moreOrders: false,
  is_pagination: true,
  selectedStores: '',
  availableStores: false,
  ordersPerPage: 12,
  params: {
    query: '',
    limit: 12,
    orderBy: 'real_created_datetime',
    page: 1,
    totalPages: 10,
    pageId: 'home_delivery_acceptance',
  },
  drivers: [],
  deliveryServiceDriver: [],
  driverBucket: [],
  driver: null,
  driverId: null,
  loading: false,
  processing: false,
}
const getters = {
  drivers: (state, getters, rootState) =>
    state.drivers.filter(
      driver =>
        driver.brand_stores.includes(rootState.context.storeId) ||
        driver.brand_access_type === 'all'
    ),
  deliveryServiceDriver: (state, getters, rootState) =>
    state.deliveryServiceDriver.filter(
      driver =>
        driver.brand_stores.includes(rootState.context.storeId) ||
        driver.brand_access_type === 'all'
    ),
  orders: state => state.orders.filter(order => order.deleted === false),
  onlineOrders: state => state.onlineOrders,
  currentDriverOrders: (state, getters) => {
    if (state.driverId) {
      const driver = state.drivers.find(driver => driver._id == state.driverId)
      return getters['getOrdersByDriver'](driver)
    }
    return []
  },
  driverOrders: (state, getters) => {
    let orders = {}
    if (state.driver) {
      orders[state.driver.name] = getters['getOrdersByDriver'](state.driver)
    } else {
      getters['drivers'].forEach(driver => {
        orders[driver.name] = getters['getOrdersByDriver'](driver)
      })
    }
    return orders
  },
  getOrdersByDriver: (state, getters, rootState, rootGetters) => driver => {
    const cashMethod = rootGetters['payment/cash']

    let data = {
      orders: [],
      amountToCollect: 0,
      totalAmount: 0,
      cashPayment: 0,
      creditPayment: 0,
      totalDeliveryTime: 0,
      driverId: driver._id,
    }
    state.orders.forEach(order => {
      if (order.driver == driver._id) {
        data.orders.push(order)
        data.amountToCollect += parseFloat(order.balance_due)
        if (order.order_payments && order.order_payments.length) {
          order.order_payments.forEach(payment => {
            data.totalAmount += parseFloat(payment.collected)
            if (cashMethod._id == payment.entity_id) {
              data.cashPayment += parseFloat(payment.collected)
            } else {
              data.creditPayment += parseFloat(payment.collected)
            }
          })
        } else {
          //it is for sure credit payment
          data.creditPayment += parseFloat(order.balance_due)
        }
        //delivery time, start to end
        order.order_history.forEach(history => {
          if (history.name == 'ORDER_HISTORY_TYPE_RECORD_DELIVERED') {
            order.deliveryEndTime = history.created_at
          } else if (
            history.name == 'ORDER_HISTORY_TYPE_RECORD_DELIVERY_STARTED'
          ) {
            order.deliveryStartTime = history.created_at
          } else if (history.name == 'ORDER_HISTORY_TYPE_RECORD_READY') {
            order.deliveryReadyTime = history.created_at
          } else {
            order.deliveryPlacedTime = history.created_at
          }
        })

        if (order.deliveryEndTime && order.deliveryStartTime) {
          data.totalDeliveryTime +=
            parseInt(order.deliveryEndTime.$date.$numberLong) -
            parseInt(order.deliveryStartTime.$date.$numberLong)
        }
      }
    })
    return data
  },
  avgTime: () => driverOrders => {
    if (driverOrders.totalDeliveryTime && driverOrders.orders) {
      const miliseconds =
        driverOrders.totalDeliveryTime / driverOrders.orders.length
      return new Date(miliseconds).toISOString().substr(11, 8)
    } else {
      return '00:00:00'
    }
  },

  timeDiff: () => (time1, time2) => {
    var time = new Date(time2.$date.$numberLong - time1.$date.$numberLong)
      .toISOString()
      .substr(11, 8)
      .split(':')

    let str = ''
    if (parseInt(time[0]) > 0) {
      str += time[0] + ' Hours '
    }
    if (parseInt(time[1]) > 0) {
      str += time[1] + ' Minutes '
    }

    str += time[2] + ' Seconds '
    return str
  },
}

const actions = {
  fetchDMOrderDetail(
    { commit, state, dispatch, rootGetters },
    dmautoloader = true
  ) {
    if (!dmautoloader) return dmautoloader
    commit(mutation.SET_LOADING, true)
    // return new Promise((resolve, reject) => {
    const params = [
      state.params.query,
      state.params.limit,
      state.params.orderBy,
      // state.deliveryOrderStatus,
      state.params.page,
      state.params.pageId,
      state.selectedStores,
    ]
    let section = 'delivery_home'
    if (state.section === 'takeaway') {
      section = 'delivery_take_away'
    }
    if (state.section === 'future') {
      section = 'delivery'
    }
    let checkAPIPermission = rootGetters['location/permitted'](
      state.params.pageId,
      section
    )
    if (checkAPIPermission) {
      DMService.getDMOrderDetails(...params)
        .then(response => {
          commit(mutation.SET_LOADING, true)
          if (response.data) {
            commit(mutation.SET_DM_ORDERS, response.data)
            commit(mutation.SET_TOTAL_ORDER, response.data.count)
            commit(mutation.SET_LOADING, false)
            /*if (section === 'delivery_home') {*/
            dispatch('getDrivers')
            dispatch('getDeliveryServiceDriver')
            // }
          }
        })
        .catch(() => {
          commit(mutation.SET_LOADING, false)
        })
    } else {
      commit(mutation.SET_LOADING, false)
    }
  },
  getDrivers({ commit, rootGetters }) {
    let role = rootGetters['auth/getRole']('Driver')
    if (role) {
      DMService.getUsers(role._id).then(response => {
        commit(mutation.DRIVERS, response.data.data)
      })
    }
  },
  getDeliveryServiceDriver({ commit, rootGetters }) {
    console.log(rootGetters['context/brand'])
    let brandId = rootGetters['context/brand'].replace('/', '')
    DMService.getDeliveryServices(brandId).then(response => {
      commit(mutation.SERVICE_DRIVERS, response.data.data)
    })
  },
  getOnlineOrders({ rootGetters, commit, state }) {
    const params = [
      '',
      50,
      'orderBy',
      'real_created_datetime',
      'home_delivery_acceptance',
      state.selectedStores,
    ]
    let checkAPIPermission = rootGetters['location/permitted'](
      'home_delivery_acceptance',
      'delivery_home'
    )
    return new Promise((resolve, reject) => {
      if (checkAPIPermission) {
        DMService.getDMOrderDetails(...params)
          .then(response => {
            commit(mutation.SET_LOADING, true)
            if (response.data) {
              commit(mutation.SET_DM_ORDERS, response.data)
              let onlineOrders = {
                count: response.data.count,
                orders: response.data.data,
              }
              resolve()
              commit(mutation.SET_ONLINE_ORDERS, onlineOrders)
              commit(mutation.SET_LOADING, false)
            }
          })
          .catch(er => {
            commit(mutation.SET_LOADING, false)
            reject(er)
          })
      } else {
        commit(mutation.SET_LOADING, false)
        reject()
      }
    })
  },

  fetchStoreOrders({ commit, dispatch }, storeId) {
    commit(mutation.SET_SELECTED_STORE, storeId)
    dispatch('fetchDMOrderDetail')
  },

  updateDMOrderStatus(
    { commit, dispatch },
    { orderStatus, collected, pageId }
  ) {
    if (typeof collected != 'undefined') {
      commit(mutation.SET_DM_ORDER_COLLECTED, collected)
    }
    if (pageId == 'home_delivery_pick') {
      dispatch('restoreOrders')
    }
    commit(mutation.SET_DM_ORDER_STATUS, orderStatus)
    commit(mutation.SET_DM_PAGE_ID, pageId)
    dispatch('fetchDMOrderDetail')
  },

  updateTakeAway({ rootState }, orderId) {
    const params = [rootState.location.location, orderId]
    DMService.updateTakeAwayOrder(...params).then(() => {
      /*dispatch('fetchOrderCount')*/
    })
  },

  /*fetchOrderCount({ commit, rootState }) {
    const params = [rootState.location.location, '']
    DMService.getDMOrderCount(...params).then(response => {
      commit(mutation.SET_DM_ORDER_COUNT, response.data.data)
    })
  },*/

  showOrderDetails({ commit }, order) {
    commit(mutation.SET_SELECTED_DM_ORDERS, order)
  },

  selectDriver({ commit, dispatch }, driverInfo) {
    commit(mutation.SET_SELECTED_DM_DRIVER, driverInfo)
    dispatch('restoreOrders')
  },

  showMoreOrders({ rootState, commit }, driverId) {
    const params = [rootState.location.location, driverId]
    DMService.getMoreOrders(...params).then(response => {
      commit(mutation.SET_SHOW_MORE_ORDERS, response.data.data)
    })
  },

  addOrderToDriverBucket({ commit, dispatch }, order) {
    commit(mutation.ADD_TO_DRIVER_BUCKET, order)
    return dispatch('updateOrder', {
      orderId: order._id,
      deleted: true,
    })
  },

  removeOrderFromDriverBucket({ commit, dispatch }, orderId) {
    commit(mutation.REMOVE_FROM_DRIVER_BUCKET, orderId)
    dispatch('updateOrder', {
      orderId: orderId,
      deleted: false,
    })
  },

  restoreOrders({ commit }) {
    commit('REMOVE_FROM_DRIVER_BUCKET')
    commit('DM_RESTORE_ORDERS')
  },

  updateOrder({ state, commit }, { orderId, deleted }) {
    const index = state.orders.findIndex(dmOrder => dmOrder._id == orderId)
    const order = state.orders[index]
    order.deleted = deleted
    //for delete { index: index, remove: 1 }
    //for update it could be { index: index, remove: 1, insert : {object} }
    commit('DM_UPDATE_ORDERS', { index: index, remove: 1, insert: order })
    return Promise.resolve()
  },

  assignBucketToDriver({ state, commit }) {
    if (state.processing) {
      return false
    }
    commit('SET_PROCESSING', true)
    const orderIds = state.driverBucket.map(order => order._id)
    return new Promise((resolve, reject) => {
      DMService.assignOrdersToDriver(state.selectedDriver._id, orderIds)
        .then(response => {
          if (response.data.status == 'ok') {
            commit('REMOVE_FROM_DRIVER_BUCKET')
            resolve()
            /*alert(rootGetters['auth/multistore'])
              if (rootGetters['auth/multistore']) {
                dispatch(
                  'order/updateOrderAction',
                  {
                    orderStatus: 'ready',
                    collected: 'no',
                    pageId: 'home_delivery_pick',
                  },
                  { root: true }
                )
              }*/
          }
        })
        .catch(er => {
          reject(er)
        })
        .finally(() => commit('SET_PROCESSING', false))
    })
  },
  printInvoice({ commit, rootState }, { templateId, order }) {
    let dt = rootState.auth.deviceType
    let isIOS = dt.osType
    commit('invoice/SET_TEMPLATE_ID', templateId, { root: true })
    if (isIOS) order.item.isReprint = 1
    commit('checkout/SET_ORDER', order.item, { root: true })
    if (order.table_number) {
      //set table no to show on invoice, only dinein order ll have it
      commit('dinein/SELECTED_TABLE_RESERVATION', order.table_number, {
        root: true,
      })
    }
    commit('order/SET_ORDER_ID', order.item._id, { root: true })
    commit('checkout/PRINT', true, { root: true })
    commit('checkout/SET_PAYMENT_ACTION', 'dine-in-running-order', {
      root: true,
    })
  },

  modifyOrder({ rootState, commit, dispatch }) {
    //dont show customer selection popup for modification order, can add skip button on order form instead using below
    commit('location/SET_MODAL', '#order-confirmation', { root: true })

    //this order contains customer, order info so when needed you can use state.order.selectedOrder

    return dispatch('order/addDeliveryOrder', rootState.order.selectedOrder, {
      root: true,
    })
  },

  showDriverOrders({ commit }, driverId) {
    commit(mutation.SET_DRIVER_ID, driverId)
    //set driver to null if you don't need to show the details
  },
}

const mutations = {
  [mutation.LIST_TYPE](state, listType) {
    state.listType = listType
  },
  [mutation.SECTION](state, section) {
    state.section = section
  },
  [mutation.SET_DM_ORDER_COLLECTION](state, OrderDetailsUpdate) {
    if (!state.deliveredOrderCollection[OrderDetailsUpdate.driverId]) {
      state.deliveredOrderGroup[OrderDetailsUpdate.driverId].push([])
    } else {
      state.deliveredOrderGroup[OrderDetailsUpdate.driverId].push(
        OrderDetailsUpdate
      )
    }
  },
  [mutation.SET_DM_ORDER_GROUP](state, order) {
    if (!state.deliveredOrderCollection[order.driverId]) {
      state.deliveredOrderGroup[order.driverId] = []
    } else {
      state.deliveredOrderCollection[order.driverId].push(order)
    }
  },
  [mutation.SET_DM_ORDER_STATUS](state, status) {
    state.deliveryOrderStatus = status
  },
  [mutation.SET_DM_ORDER_COLLECTED](state, collected) {
    state.collected = collected
  },
  [mutation.SET_LOADING](state, status) {
    state.loading = status
  },
  [mutation.SET_DM_ORDERS](state, orderDetails) {
    state.orders = orderDetails.data.map(order => {
      order.deleted = false
      return order
    })
    let stores = orderDetails.page_lookups.stores
    state.availableStores = stores._id
  },
  [mutation.SET_SELECTED_DM_ORDERS](state, selectedOrderDetails) {
    state.selectedOrder = selectedOrderDetails
  },
  [mutation.SET_TOTAL_ORDER](state, count) {
    state.params.totalPages = Math.ceil(
      parseInt(count) / parseInt(state.ordersPerPage)
    )
  },
  [mutation.SET_SELECTED_STORE](state, storeId) {
    state.selectedStores = storeId
  },
  [mutation.SET_SELECTED_DM_DRIVER](state, driverInfo) {
    state.selectedDriver = driverInfo
  },
  [mutation.SET_SHOW_MORE_ORDERS](state, orderDetails) {
    state.moreOrders = orderDetails
  },
  [mutation.DRIVERS](state, drivers) {
    state.drivers = drivers
  },
  [mutation.SERVICE_DRIVERS](state, drivers) {
    state.deliveryServiceDriver = drivers
  },
  [mutation.SET_DM_PAGE_ID](state, pageId) {
    state.params.pageId = pageId
  },
  [mutation.SET_DM_PAGE](state, page) {
    state.params.page = page
  },
  [mutation.DM_UPDATE_ORDERS](state, { index, remove, insert }) {
    if (insert) {
      state.orders.splice(index, remove, insert)
    } else {
      state.orders.splice(index, remove)
    }
  },
  [mutation.DM_RESTORE_ORDERS](state) {
    state.orders = state.orders.map(order => {
      order.deleted = false
      return order
    })
  },
  [mutation.ADD_TO_DRIVER_BUCKET](state, order) {
    state.driverBucket.push(order)
    // $('#past-order').modal('toggle')
  },
  [mutation.SET_DRIVER](state, driver) {
    state.driver = driver
  },
  [mutation.SET_DRIVER_ID](state, driverId) {
    state.driverId = driverId
  },
  SET_PROCESSING(state, status) {
    state.processing = status
  },

  [mutation.REMOVE_FROM_DRIVER_BUCKET](state, orderId) {
    let bucket = []
    if (orderId) {
      state.driverBucket.filter(function(ele) {
        if (ele._id != orderId) {
          bucket.push(ele)
        }
      })
    }
    state.driverBucket = bucket
  },
  [mutation.SET_ONLINE_ORDERS](state, onlineOrders) {
    state.onlineOrders = onlineOrders
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

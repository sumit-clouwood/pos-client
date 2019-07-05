import * as mutation from './deliveryManager/mutation-types'
import DMService from '@/services/data/DeliveryManagerService'
// import LookupData from '@/plugins/helpers/LookupData'
/* eslint-disable no-console */

const state = {
  deliveryOrderStatus: 'in-progress',
  collected: 'no',
  orders: [],
  orderCounts: 0,
  selectedOrder: false,
  selectedDriver: false,
  deliveredOrderGroup: [],
  deliveredOrderCollection: [],
  moreOrders: false,
  is_pagination: true,
  pageSize: 8,
  selectedStores: '',
  availableStores: false,
  params: {
    query: '',
    limit: 10,
    orderBy: 'real_created_datetime',
    page: 1,
    totalPages: 0,
    pageId: 'home_delivery_new',
  },
  drivers: false,
  driverBucket: [],
}
const getters = {
  orders: state => state.orders.filter(order => order.deleted === false),
}

const actions = {
  fetchDMOrderDetail({ commit, state, dispatch }) {
    // return new Promise((resolve, reject) => {
    const params = [
      state.params.query,
      state.params.limit,
      state.params.orderBy,
      state.deliveryOrderStatus,
      state.params.page,
      state.params.pageId,
      state.selectedStores,
    ]
    DMService.getDMOrderDetails(...params).then(response => {
      commit(mutation.SET_DM_ORDERS, response.data)
      dispatch('getDrivers')
    })
  },
  getDrivers({ commit }) {
    DMService.getRoles().then(response => {
      const role = response.data.data.find(
        user => user.start_path === 'delivery_home'
      )
      if (role) {
        DMService.getUsers(role._id).then(response => {
          commit(mutation.DRIVERS, response.data.data)
        })
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
    dispatch('updateOrder', {
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
  },

  assignBucketToDriver({ state, commit, dispatch }) {
    const orderIds = state.driverBucket.map(order => order._id)
    DMService.assignOrdersToDriver(state.selectedDriver._id, orderIds).then(
      response => {
        if (response.data.status == 'ok') {
          commit('REMOVE_FROM_DRIVER_BUCKET')
          dispatch('order/updateOrderAction', {
            orderStatus: 'ready',
            collected: 'no',
            pageId: 'home_delivery_pick',
          })
        }
      }
    )
  },
}

const mutations = {
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
  [mutation.SET_DM_PAGE_ID](state, pageId) {
    state.params.pageId = pageId
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
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

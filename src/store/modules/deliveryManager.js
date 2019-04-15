import * as mutation from './deliveryManager/mutation-types'
import DMService from '@/services/data/DeliveryManagerService'

const state = {
  deliveryOrderStatus: 'running',
  collected: 'no',
  orders: false,
  orderCounts: '',
  selectedOrder: false,
  selectedDriver: false,
}
const getters = {}

const actions = {
  fetchDMOrderDetail({ commit, rootState, dispatch }) {
    // return new Promise((resolve, reject) => {
    const params = [
      rootState.location.location,
      state.deliveryOrderStatus,
      state.collected,
    ]
    DMService.getDMOrderDetails(...params).then(response => {
      commit(mutation.SET_DM_ORDERS, response.data.data)
      dispatch('fetchOrderCount')
    })
    // })
  },

  updateDMOrderStatus({ commit, dispatch }, orderStatus) {
    commit(mutation.SET_DM_ORDER_STATUS, orderStatus)
    dispatch('fetchDMOrderDetail')
  },

  fetchOrderCount({ commit, rootState }) {
    const params = [rootState.location.location, '']
    DMService.getDMOrderCount(...params).then(response => {
      commit(mutation.SET_DM_ORDER_COUNT, response.data.data)
    })
  },

  showOrderDetails({ commit }, order) {
    commit(mutation.SET_SELECTED_DM_ORDERS, order)
  },

  selectDriver({ commit }, driverInfo) {
    commit(mutation.SET_SELECTED_DM_DRIVER, driverInfo)
  },

  attachOrderDriver({ rootState, dispatch }, { orderId, driverId, timestamp }) {
    const params = [rootState.location.location, orderId, driverId, timestamp]
    DMService.assignDriverToOrder(...params).then(() => {
      dispatch('fetchOrderCount')
    })
  },
}

const mutations = {
  [mutation.SET_DM_ORDER_STATUS](state, status) {
    state.deliveryOrderStatus = status
  },
  [mutation.SET_DM_ORDER_COUNT](state, orderCount) {
    state.orderCounts = orderCount
  },
  [mutation.SET_DM_ORDERS](state, orderDetails) {
    state.orders = orderDetails
  },
  [mutation.SET_SELECTED_DM_ORDERS](state, selectedOrderDetails) {
    state.selectedOrder = selectedOrderDetails
  },
  [mutation.SET_SELECTED_DM_DRIVER](state, driverInfo) {
    state.selectedDriver = driverInfo
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

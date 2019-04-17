import * as mutation from './deliveryManager/mutation-types'
import DMService from '@/services/data/DeliveryManagerService'

const state = {
  deliveryOrderStatus: 'running',
  collected: 'no',
  orders: false,
  orderCounts: '',
  selectedOrder: false,
  selectedDriver: false,
  deliveredOrderGroup: [],
  deliveredOrderCollection: [],
  moreOrders: false
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
      // dispatch('prepareDeliveredOrderGroup')
    })
    // })
  },

  updateDMOrderStatus({ commit, dispatch }, {orderStatus, collected}) {
    if(typeof collected != 'undefined') {
      commit(mutation.SET_DM_ORDER_COLLECTED, collected)
    }
    commit(mutation.SET_DM_ORDER_STATUS, orderStatus)
    dispatch('fetchDMOrderDetail')
  },

  updateTakeAway({ rootState }, orderId) {
    const params = [
      rootState.location.location,
      orderId,
    ]
    DMService.updateTakeAwayOrder(...params).then(() => {
      dispatch('fetchOrderCount')
    })
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

  showMoreOrders({rootState, commit}, driverId) {
    const params = [
      rootState.location.location,
      driverId
    ]
    DMService.getMoreOrders(...params).then( response => {
      commit(mutation.SET_SHOW_MORE_ORDERS, response.data.data)
    })
  },

  prepareDeliveredOrderGroup({ commit }) {
    let OrderDetailsUpdate = {'totalDelivered': 0, 'totalAmount': 0, 'cash': 0, 'credit': 0}
    if(state.orders){
      state.orders.driverPerformanceList.forEach(order => {
        if (!state.deliveredOrderCollection[order.driverId]){
          commit(mutation.SET_DM_ORDER_GROUP, order)
          commit(mutation.SET_DM_ORDER_COLLECTION,order)
          OrderDetailsUpdate = {'totalDelivered': 0, 'totalAmount': 0, 'cash': 0, 'credit': 0, 'id': order.driverId}
        }

        commit(mutation.SET_DM_ORDER_COLLECTION,order)
        // this.deliveredOrderCollection[order.driverId].push(order)

        if(OrderDetailsUpdate.id == order.driverId)
        {
          OrderDetailsUpdate.id = order.driverId
          OrderDetailsUpdate.driverName = order.driverName
          OrderDetailsUpdate.totalDelivered += parseInt(order.noOfOrders)
          OrderDetailsUpdate.totalAmount += parseFloat(order.orderSum)
          OrderDetailsUpdate.cash += parseFloat(order.cash)
          OrderDetailsUpdate.credit += parseFloat(order.credit)
          OrderDetailsUpdate.avgDeliveryTime = order.averageDeliveryTime

        }
        if(!state.deliveredOrderGroup[order.driverId][0]) {
          commit(mutation.SET_DM_ORDER_GROUP,OrderDetailsUpdate)
        }

      })

    }
  }
}

const mutations = {
  [mutation.SET_DM_ORDER_COLLECTION] (state, OrderDetailsUpdate) {
    if(!state.deliveredOrderCollection[OrderDetailsUpdate.driverId]) {
      state.deliveredOrderGroup[OrderDetailsUpdate.driverId].push([])
    } else {
      state.deliveredOrderGroup[OrderDetailsUpdate.driverId].push(OrderDetailsUpdate)
    }
  },
  [mutation.SET_DM_ORDER_GROUP] (state, order) {
    if(!state.deliveredOrderCollection[order.driverId]) {
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
  [mutation.SET_SHOW_MORE_ORDERS](state, orderDetails) {
    state.moreOrders = orderDetails
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

import * as mutation from './deliveryManager/mutation-types'
import DMService from '@/services/data/DeliveryManagerService'

const state = {
  deliveryOrderStatus: 'running',
  collected: 'no',
  orders: false,
  orderCounts: ''
}
const getters = {

}

const actions = {
  fetchDMOrderDetail({ commit, rootState }) {
    return new Promise((resolve, reject) => {
      const params = [
      // rootState.location.location,
        '5a965a0114d48822951e6b22',
        state.deliveryOrderStatus,
        state.collected,
      ]
      console.log(params)
      DMService.getDMOrderDetails(...params).then(response => {
        console.log(response.data)
        commit(mutation.SET_DM_ORDERS, response.data.data)
      })
    })
  },

  updateDMOrderStatus({ commit, dispatch }, orderStatus) {
    commit(mutation.SET_DM_ORDER_STATUS, orderStatus)
    dispatch('fetchDMOrderDetail')
  },

  fetchOrderCount( { commit, rootState } ) {
    const params = [
      // rootState.location.location,
      '5a965a0114d48822951e6b22',
      ''
    ]
    DMService.getDMOrderCount(...params).then(response => {
      console.log(response.data)
      commit(mutation.SET_DM_ORDER_COUNT,response.data.data)
    })
  }

}

const mutations = {
  [mutation.SET_DM_ORDER_STATUS](state, status) {
    state.deliveryOrderStatus = status
  },
  [mutation.SET_DM_ORDERS](state, orderDetails) {
    state.orders = orderDetails
  },
  [mutation.SET_DM_ORDER_COUNT](state, orderCount) {
    state.orderCounts = orderCount
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
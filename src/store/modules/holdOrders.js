import * as mutation from './holdOrders/mutation-types'
import HoldListService from '@/services/data/HoldListService'

const state = {
  getHoldOrders: {},
  orderDetails: {},
}

const getters = {}

const actions = {
  getHoldOrders({ commit, rootState }) {
    const params = [
      rootState.location.location,
      rootState.sync.date,
      rootState.sync.compress,
    ]
    HoldListService.fetchAll(...params).then(response => {
      commit(mutation.GET_HOLD_ORDERS, response.data)
    })
  },

  fetchOrder({ state, commit, rootState, dispatch }, orderId) {
    const params = [orderId, '']
    HoldListService.fetchHoldOrder(...params).then(response => {
      commit(mutation.GET_HOLD_ORDER_DETAILS, response.data.data)
      alert('Work in progress')
      state.orderDetails.items.forEach(item => {
        // dispatch('order/addToOrder',{ item }, { root: true })
      })
    })
  },
}

const mutations = {
  [mutation.GET_HOLD_ORDERS](state, holdOrders) {
    state.getHoldOrders = holdOrders
  },
  [mutation.GET_HOLD_ORDER_DETAILS](state, order) {
    state.orderDetails = order
  },
}

export default {
  namespaced: true,
  actions,
  state,
  mutations,
  getters,
}

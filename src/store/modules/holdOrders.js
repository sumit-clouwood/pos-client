import * as mutation from './holdOrders/mutation-types'
import HoldListService from '@/services/data/HoldListService'

const state = {
  getHoldOrders: false,
  orderDetails: {},
  orderStatus: false
}

const getters = {}

const actions = {
  getHoldOrders({ commit, rootState, rootGetters }) {
    /*let orderTotal = rootGetters['order/orderTotal']
    if(orderTotal > 0) {
      // dispatch('checkout/pay', {}, { root: true })
    }*/
    const params = [
      rootState.location.location,
      rootState.sync.date,
      rootState.sync.compress,
    ]
    HoldListService.fetchAll(...params).then(response => {
      commit(mutation.GET_HOLD_ORDERS, response.data.data)
    })
  },

  fetchOrder({ state, commit, dispatch }, orderId) {
    const params = [orderId, '']
    HoldListService.fetchHoldOrder(...params).then(response => {
      commit(mutation.GET_HOLD_ORDER_DETAILS, response.data.data)
      let item_ids = []
      state.orderDetails.items.forEach(item => {
        item_ids.push(item.item_id)
      })
      dispatch('order/addHoldOrder', { item_ids }, { root: true })
    })
  },

  holdOrder({ commit }) {
    commit(mutation.SET_ORDER_STATUS, 'on-hold')
  },
}

const mutations = {
  [mutation.GET_HOLD_ORDERS](state, holdOrders) {
    state.getHoldOrders = holdOrders
  },
  [mutation.GET_HOLD_ORDER_DETAILS](state, order) {
    state.orderDetails = order
  },
  [mutation.SET_ORDER_STATUS](state, orderStatus) {
    state.orderStatus = orderStatus
  },
}

export default {
  namespaced: true,
  actions,
  state,
  mutations,
  getters,
}

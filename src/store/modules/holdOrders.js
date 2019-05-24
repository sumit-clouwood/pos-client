import * as mutation from './holdOrders/mutation-types'
import OrderService from '@/services/data/OrderService'
// import OrderService from '../../services/data/OrderService'

const state = {
  getHoldOrders: false,
  orderDetails: {},
  pageLookups: {},
  params: {
    query: '',
    limit: 10,
    orderBy: 'order_status',
    orderStatus: 'on-hold',
    page: 1,
  },
}

const getters = {}

const actions = {
  getHoldOrders({ commit, state }) {
    const params = [
      state.params.query,
      state.params.limit,
      state.params.orderBy,
      state.params.orderStatus,
      state.params.page,
    ]
    OrderService.getOrders(...params).then(response => {
      commit(mutation.GET_HOLD_ORDERS, response.data.data)
      commit(mutation.PAGE_LOOKUP, response.data.page_lookups)
    })
  },

  fetchOrder({ state, commit, dispatch }, selectedOrder) {
    commit(mutation.GET_HOLD_ORDER_DETAILS, selectedOrder)
    let item_ids = state.orderDetails.items
    // state.orderDetails.items.forEach(item => {
    //   item_ids.push(item._id.$oid)
    // })
    // eslint-disable-next-line no-console
    // console.log(item_ids)
    dispatch('order/addHoldOrder', { item_ids }, { root: true })
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
  [mutation.PAGE_LOOKUP](state, pageLookups) {
    state.pageLookups = pageLookups
  },
}

export default {
  namespaced: true,
  actions,
  state,
  mutations,
  getters,
}

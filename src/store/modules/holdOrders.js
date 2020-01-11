import * as mutation from './holdOrders/mutation-types'
import OrderService from '@/services/data/OrderService'

const state = {
  getHoldOrders: false,
  orderDetails: {},
  pageLookups: {},
  loading: false,
  params: {
    query: '',
    limit: 10,
    orderBy: 'order_status',
    orderStatus: 'on-hold',
    page: 1,
    totalPages: 0,
  },
}

const getters = {
  page: state => {
    return state.params.page
  },
}

const actions = {
  getHoldOrders({ commit, state, rootState }) {
    const params = [
      state.params.query,
      state.params.limit,
      state.params.orderBy,
      state.params.orderStatus,
      rootState.order.orderType.OTApi,
      state.params.page,
      'orders_main_tbl',
      rootState.location.store._id,
      '',
    ]
    commit(mutation.LOADING, false)
    OrderService.getOrders(...params).then(response => {
      commit(mutation.GET_HOLD_ORDERS, response.data)
      commit(mutation.GET_MORE_ORDER, state.params.page)
      commit(mutation.LOADING, true)
      commit(mutation.PAGE_LOOKUP, response.data.page_lookups)
    })
  },

  fetchOrder({ commit, dispatch }, selectedOrder) {
    commit(mutation.GET_HOLD_ORDER_DETAILS, selectedOrder)
    dispatch('order/addHoldOrder', selectedOrder, { root: true })
    if (selectedOrder.customer != null) {
      dispatch('customer/fetchSelectedCustomer', selectedOrder.customer, {
        root: true,
      }).then(() => {
        dispatch(
          'customer/setCustomerAddressById',
          selectedOrder.customer_address_id,
          {
            root: true,
          }
        )
      })
    }
  },

  holdOrder({ commit }) {
    commit(mutation.SET_ORDER_STATUS, 'on-hold')
  },

  remove({ commit }, order) {
    const orderIndex = state.getHoldOrders.findIndex(
      holdeOrder => holdeOrder._id == order._id
    )
    commit(mutation.REMOVE_ORDER, orderIndex)
  },
}

const mutations = {
  [mutation.GET_HOLD_ORDERS](state, holdOrders) {
    state.getHoldOrders = holdOrders.data
    state.params.totalPages = Math.ceil(
      parseInt(holdOrders.count) / parseInt(state.params.limit)
    )
  },
  [mutation.GET_MORE_ORDER](state, pageNumber) {
    state.params.page = pageNumber
  },
  [mutation.LOADING](state, status) {
    state.loading = status
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
  [mutation.REMOVE_ORDER](state, index) {
    state.getHoldOrders.splice(index, 1)
  },
  [mutation.RESET](state) {
    state.getHoldOrders = false
    state.orderDetails = {}
    state.pageLookups = {}
  },
}

export default {
  namespaced: true,
  actions,
  state,
  mutations,
  getters,
}

import * as mutation from './transactionOrders/mutation-types'
import OrderService from '@/services/data/OrderService'

const state = {
  getTransactionOrders: false,
  orderDetails: {},
  pageLookups: {},
  loading: false,
  params: {
    query: '',
    limit: 10,
    orderBy: 'order_status',
    orderStatus: 'on-hold',
    page: 1,
    pageId: 'transactional_orders',
    totalPages: 0,
  },
}

const getters = {}

const actions = {
  getTransactionOrders({ commit, state }) {
    const params = [
      state.params.query,
      state.params.limit,
      state.params.orderBy,
      state.params.orderStatus,
      state.params.page,
      // state.params.pageId,
      'orders_main_tbl',
      '',
      '',
    ]
    commit(mutation.LOADING, false)
    OrderService.getOrders(...params).then(response => {
      commit(mutation.GET_TRANSACTION_ORDERS, response.data)
      commit(mutation.LOADING, true)
      commit(mutation.PAGE_LOOKUP, response.data.page_lookups)
    })
  },
}

const mutations = {
  [mutation.GET_TRANSACTION_ORDERS](state, transactionOrders) {
    // eslint-disable-next-line no-console
    console.log(transactionOrders.data)
    state.getTransactionOrders = transactionOrders.data
  },
  [mutation.LOADING](state, status) {
    state.loading = status
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

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
    page: 1,
    pageId: 'transactional_orders',
    totalPages: 0,
    customerId: '',
  },
}

const getters = {}

const actions = {
  getTransactionOrders({ commit, state, rootState }) {
    const params = [
      state.params.query,
      state.params.limit,
      '',
      '',
      state.params.page,
      state.params.pageId,
      rootState.context.storeId,
      state.params.customerId,
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

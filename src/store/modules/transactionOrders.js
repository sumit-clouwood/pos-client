import * as mutation from './transactionOrders/mutation-types'
import OrderService from '@/services/data/OrderService'

const state = {
  getTransactions: false,
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

const getters = {
    getOrderItemsStr: () => orderItems => {
        let str = orderItems.map(function (item) {
            return item.name
        }).toString()
        return str
    },
}

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
      commit(mutation.TRANSACTIONS, response.data)
      commit(mutation.LOADING, true)
      commit(mutation.PAGE_LOOKUP, response.data.page_lookups)
    })
  },
  collectSearchTransactions({ commit, state }, searchTerm) {
    let searchedItems = []
    if (searchTerm.length > 0) {
      state.getTransactions.data.map(order => {
        order.items.map(item => {
          if (item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) != -1) {
            searchedItems.push(order)
          }
        })
      })
    }
    commit(mutation.TRANSACTIONS, searchedItems)
  },
}

const mutations = {
  [mutation.TRANSACTIONS](state, transactionOrders) {
    state.getTransactions = transactionOrders //Set whole collection
    if (transactionOrders.data && transactionOrders.data.length > 0) {
      state.getTransactionOrders = transactionOrders.data
    } else if(transactionOrders.length > 0) {
      state.getTransactionOrders = transactionOrders
    } else {
      state.getTransactionOrders = {}
      state.item = null
    }
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

import * as mutation from './transactionOrders/mutation-types'
import OrderService from '@/services/data/OrderService'
import LookupData from '../../plugins/helpers/LookupData'

const state = {
  getTransactions: false,
  getTransactionOrders: false,
  displayTransactionOrders: false,
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
    let str = orderItems
      .map(function(item) {
        return item.name
      })
      .toString()
    return str
  },
}

const actions = {
  getTransactionOrders({ commit, state, rootState, dispatch }) {
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
      commit(mutation.ALL_TRANSACTIONS, response.data)
      commit(mutation.LOADING, true)
      commit(mutation.PAGE_LOOKUP, response.data.page_lookups)
      if (state.displayTransactionOrders.length > 0) {
        let firstOrder = state.displayTransactionOrders[0]._id
        dispatch('order/selectedOrderDetails', firstOrder, { root: true })
      }
    })
  },
  collectSearchTransactions({ commit, state, dispatch }, searchTerm) {
    let searchedItems = []
    if (searchTerm != '' && searchTerm.length > 0) {
      state.getTransactions.data.map(order => {
        //Searching with Order No.
        if (
          order.order_no
            .toString()
            .toLowerCase()
            .indexOf(searchTerm.toString().toLowerCase()) != -1
        ) {
          searchedItems.push(order)
        }

        //Searching with Order Item Names
        order.items.map(item => {
          if (item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) != -1) {
            searchedItems.push(order)
          }
        })

        //Searching with Order Customer Name
        if (order.customer != null && order.customer.length > 0) {
          let customerName = LookupData.get({
            collection: state.getTransactions.page_lookups.brand_customers._id,
            matchWith: order.customer,
            selection: 'name',
          })
          order['customer_name'] = customerName
          if (
            order.customer_name
              .toString()
              .toLowerCase()
              .indexOf(searchTerm.toString().toLowerCase()) != -1
          ) {
            searchedItems.push(order)
          }
        }
      })
      commit(mutation.SEARCH_TRANSACTIONS, searchedItems)
    } else {
      dispatch('getTransactionOrders')
    }
  },
}

const mutations = {
  //Set whole collection
  [mutation.ALL_TRANSACTIONS](state, transactionOrders) {
    state.getTransactions = transactionOrders
    state.displayTransactionOrders = transactionOrders.data
  },
  //Collection to display only.
  [mutation.TRANSACTIONS_ORDERS](state, transactionOrders) {
    state.displayTransactionOrders = transactionOrders.data
  },
  //Set a third collection for searching, will be merged into TRANSACTIONS_ORDERS mutate.
  [mutation.SEARCH_TRANSACTIONS](state, transactionOrders) {
    if (transactionOrders.data && transactionOrders.data.length > 0) {
      state.displayTransactionOrders = transactionOrders.data
    } else if (transactionOrders.length > 0) {
      state.displayTransactionOrders = transactionOrders
    } else {
      state.displayTransactionOrders = {}
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

import * as mutation from './transactionOrders/mutation-types'
import moment from 'moment-timezone'
import OrderService from '@/services/data/OrderService'
import LookupData from '../../plugins/helpers/LookupData'

const state = {
  transactionOrders: false,
  displayTransactionOrders: false,
  orderDetails: {},
  pageLookups: {},
  loading: false,
  params: {
    query: '',
    limit: 999999,
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
    return new Promise((resolve, reject) => {
      const params = [
        state.params.query,
        state.params.limit,
        '',
        'normal',
        '',
        state.params.page,
        state.params.pageId,
        rootState.context.storeId,
        state.params.customerId,
      ]
      commit(mutation.LOADING, false)
      OrderService.getOrdersForTransactionScreen(...params)
        .then(response => {
          commit(mutation.ALL_TRANSACTIONS, response.data)
          commit(mutation.LOADING, true)
          commit(mutation.PAGE_LOOKUP, response.data.page_lookups)
          if (
            typeof state.transactionOrders !== undefined &&
            state.transactionOrders
          ) {
            dispatch('setTransactionOrders', '') //Set Sorted & Group Order List
          }
          resolve(state.transactionOrders)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  selectFirstTransactionOrder({ dispatch }) {
    if (
      typeof state.transactionOrders !== undefined &&
      state.transactionOrders
    ) {
      let firstOrder = state.transactionOrders[0]._id
      dispatch('order/selectedOrderDetails', firstOrder, { root: true }) //Set First Order as Selected
    }
  },

  setTransactionOrders({ commit, state, rootState }, searchTerm) {
    let finalArr = {}
    let result = []
    let transactionOrderDates = []
    let searchedItems = []
    let timezoneString = rootState.location.timezoneString
    let data = state.transactionOrders
    if (data) {
      data.forEach(function(value) {
        let orderDateTime = LookupData.convertDatetimeCustom(
          value.real_created_datetime,
          timezoneString,
          'YYYY-MM-DD HH:mm:ss'
        )
        orderDateTime = orderDateTime.substring(0, orderDateTime.indexOf(' '))
        if (orderDateTime.length) {
          value['created_date'] = orderDateTime
          value['created_datetime'] = value.real_created_datetime
          value['order_date'] = moment(orderDateTime.toString()).format(
            'dddd, LL'
          )
        }
        if (transactionOrderDates.indexOf(value['order_date']) == '-1') {
          transactionOrderDates.push(value['order_date'])
        }
        result.push(value)
      })
    }
    if (searchTerm != '' && searchTerm.length > 0) {
      result.map(order => {
        //Searching with Order No.
        if (
          order.order_no
            .toString()
            .toLowerCase()
            .indexOf(searchTerm.toString().toLowerCase()) != -1
        ) {
          if (!searchedItems.includes(order)) searchedItems.push(order)
        }

        //Searching with Order Item Names
        order.items.map(item => {
          if (item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) != -1) {
            if (!searchedItems.includes(order)) searchedItems.push(order)
          }
        })

        //Searching with Order Customer Name
        if (order.customer != null && order.customer.length > 0) {
          let customerName = LookupData.get({
            collection: state.pageLookups.brand_customers._id,
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
            if (!searchedItems.includes(order)) searchedItems.push(order)
          }
        }
      })
      result = searchedItems
    }
    if (result.length > 0) {
      result = result.reduce(function(r, a) {
        r[a.order_date] = r[a.order_date] || []
        r[a.order_date].push(a)
        return r
      }, Object.create(null))
      finalArr = JSON.stringify(result)
    }
    if (finalArr.length > 0) {
      commit('TRANSACTIONS_ORDERS', JSON.parse(finalArr))
    } else {
      commit('TRANSACTIONS_ORDERS', false)
    }
  },
}

const mutations = {
  //Set whole collection
  [mutation.ALL_TRANSACTIONS](state, transactionOrders) {
    state.transactionOrders = transactionOrders.data
  },
  //Collection to display only.
  [mutation.TRANSACTIONS_ORDERS](state, transactionOrders) {
    state.displayTransactionOrders = transactionOrders
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

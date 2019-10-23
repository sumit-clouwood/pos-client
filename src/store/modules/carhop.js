import * as mutation from './carhop/mutation-types'
import CarhopService from '@/services/data/CarhopService'

const state = {
  orderStatus: 'in-progress',
  loading: false,
  limit: 10,
  orders: {
    'in-progress': null,
    finished: null,
  },
  page: {
    'in-progress': 1,
    finished: 1,
  },
}
const getters = {
  page: state => orderStatus => state.page[orderStatus],
}

const actions = {
  initFetch({ commit }) {
    if (!state.orders['in-progress'] || !state.orders['finished']) {
      commit(mutation.SET_LOADING, true)
    }
    commit(mutation.SET_ORDER_STATUS, 'in-progress')

    CarhopService.fetchOrders(state.orderStatus, 1, state.limit).then(
      response => {
        commit(mutation.SET_ORDERS, {
          data: response.data,
          type: 'in-progress',
        })
        commit(mutation.SET_LOADING, false)
      }
    )
    CarhopService.fetchOrders('finished', 1, state.limit).then(response => {
      commit(mutation.SET_ORDERS, { data: response.data, type: 'finished' })
      commit(mutation.SET_LOADING, false)
    })
  },

  fetchOrders({ state, commit }, { orderStatus: orderStatus, page: page }) {
    commit(mutation.SET_ORDER_STATUS, orderStatus)
    CarhopService.fetchOrders(orderStatus, page, state.limit).then(response => {
      commit(mutation.SET_PAGE, { page: page, type: orderStatus })
      commit(mutation.SET_ORDERS, { data: response.data, type: orderStatus })
    })
  },
}
const mutations = {
  [mutation.SET_ORDER_STATUS](state, status) {
    state.orderStatus = status
  },

  [mutation.SET_LOADING](state, status) {
    state.loading = status
  },
  [mutation.SET_ORDERS](state, { data, type }) {
    state.orders[type] = data
  },
  [mutation.SET_PAGE](state, { page, type }) {
    state.page[type] = page
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

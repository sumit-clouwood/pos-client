import * as mutation from './carhop/mutation-types'
import CarhopService from '@/services/data/CarhopService'
// import OrderHelper from '@/plugins/helpers/Order'
import * as PERMS from '@/const/permissions'

const state = {
  orderStatus: 'in-progress',
  loading: false,
  readyOrderNotification: [],
  loadingSilent: false,
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
  initFetch({ commit, rootState, rootGetters }, initLoad = true) {
    // if (!state.orders['in-progress'] || !state.orders['finished']) {
    //   commit(mutation.SET_LOADING, true)
    // } else {
    //   commit(mutation.SET_LOADING_SILENT, true)
    // }
    if (initLoad) {
      commit(mutation.SET_LOADING, true)
      commit(mutation.SET_ORDER_STATUS, 'in-progress')
    }

    commit(mutation.SET_LOADING_SILENT, true)

    //check if allowed to see others orders
    let userId = ''
    if (!rootGetters['auth/allowed'](PERMS.SEE_OTHERS_ORDERS)) {
      userId = rootState.auth.userDetails.item._id
    }

    CarhopService.fetchOrders(state.orderStatus, 1, state.limit, userId).then(
      response => {
        if (response.data) {
          let orders = response.data
          // check if allowed to see others orders
          // if (!rootGetters['auth/allowed'](PERMS.SEE_OTHERS_ORDERS)) {
          //   orders.data = OrderHelper.userOrders(
          //     response.data.data,
          //     rootState.auth.userDetails.item._id
          //   )
          // }
          // /* eslint-disable */
          // console.log(orders.data.length)
          commit(mutation.SET_ORDERS, {
            data: orders,
            type: 'in-progress',
          })
        }
        commit(mutation.SET_LOADING, false)
        commit(mutation.SET_LOADING_SILENT, false)
      }
    )
    CarhopService.fetchOrders('finished', 1, state.limit, userId).then(
      response => {
        if (response.data) {
          let orders = response.data
          //check if allowed to see others orders
          // if (!rootGetters['auth/allowed'](PERMS.SEE_OTHERS_ORDERS)) {
          //   orders.data = OrderHelper.userOrders(
          //     response.data.data,
          //     rootState.auth.userDetails.item._id
          //   )
          // }
          commit(mutation.SET_ORDERS, { data: orders, type: 'finished' })
        }
        commit(mutation.SET_LOADING, false)
        commit(mutation.SET_LOADING_SILENT, false)
      }
    )
  },

  fetchOrders(
    { state, rootState, rootGetters, commit },
    { orderStatus: orderStatus, page: page }
  ) {
    commit(mutation.SET_LOADING_SILENT, true)
    commit(mutation.SET_ORDER_STATUS, orderStatus)
    //check if allowed to see others orders
    let userId = ''
    if (!rootGetters['auth/allowed'](PERMS.SEE_OTHERS_ORDERS)) {
      /* eslint-disable */
      userId = rootState.auth.userDetails.item._id
    }
    CarhopService.fetchOrders(orderStatus, page, state.limit, userId).then(response => {
      if (response.data) {
        let orders = response.data
        //check if allowed to see others orders
        // if (!rootGetters['auth/allowed'](PERMS.SEE_OTHERS_ORDERS)) {
        //   orders.data = OrderHelper.userOrders(
        //     response.data.data,
        //     rootState.auth.userDetails.item._id
        //   )
        // }
        commit(mutation.SET_ORDERS, { data: orders, type: orderStatus })
        commit(mutation.SET_PAGE, { page: page, type: orderStatus })
      }
      commit(mutation.SET_LOADING_SILENT, false)
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
  [mutation.SET_LOADING_SILENT](state, status) {
    state.loadingSilent = status
  },
  READY_ORDER_NOTIFICATION(state, data) {
    state.readyOrderNotification = data
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

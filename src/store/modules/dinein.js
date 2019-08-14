import * as mutation from './dinein/mutation-types'
import DineInService from '@/services/data/DineInService'
import LookupData from '@/plugins/helpers/LookupData'
import * as CONST from '@/constants'

const state = {
  orders:false,
  dineInOrderDetails:{},
  completedOrderDetails:{},
  areas:false,
  tables:false,
  activeArea:false,
  loading:false,
  tablesOnArea:false,
  tableStatus: {'unavailable': 0, 'available_soon': 0, 'available': 0},
  tableOrders:false,
}
const getters = {
  getOrderStatus: () => order_status => {
    if (order_status === CONST.ORDER_STATUS_ON_HOLD || order_status === CONST.ORDER_STATUS_IN_PROGRESS) {
      return 'running-order-details'
    } else {
      return 'done-soon-order'
    }
  },
  getTableNumber: state => orderId => {
    let tableNumber = ''
     state.orders.data.filter(function (order) {
      if(order.order_id === orderId) {
        tableNumber = order.table_number
      }
    })
    return tableNumber
  },
}

const actions = {
  fetchAll({ dispatch, commit }) {
    commit(mutation.LOADING, true)
    dispatch('getDineInOrders')
    dispatch('getDineInTables')
    dispatch('getDineInArea')
    commit(mutation.LOADING, false)
  },
  getDineInOrders({ commit }) {
    DineInService.dineInOrders().then(response => {
      commit(mutation.DINE_IN_ORDERS, response.data)
    })
  },
  getDineInArea({ commit, dispatch }) {
    DineInService.dineAreas().then(response => {
      commit(mutation.DINE_IN_AREAS, response.data)
      dispatch('getTableStatus')
    })
  },
  getDineInTables({ commit }) {
    DineInService.dineTables().then(response => {
      commit(mutation.DINE_IN_TABLES, response.data)
    })
  },
  selectedArea({ commit,dispatch }, area) {
    commit(mutation.SELECTED_AREA, area)
    dispatch('getTableStatus')
  },

  getTableStatus({commit, state}) {
    let tableStatus = {'unavailable': 0, 'available_soon': 0, 'available': 0}
    state.tablesOnArea.forEach(table => {
      let orderIds = []
      state.orders.data.filter(function (order) {
        if(order.table_id === table._id) {
          orderIds.push(order.order_id)
        }
      })
      orderIds.forEach(id => {
        let order = LookupData.get({
          collection: state.orders.page_lookups.orders._id,
          matchWith: id,
          selection: false,
        })
        if (order.order_status == CONST.ORDER_STATUS_ON_HOLD || order.order_status == CONST.ORDER_STATUS_IN_PROGRESS) {
          tableStatus.unavailable += 1
        } else {
          tableStatus.available_soon += 1
        }
      })
      tableStatus.available = parseInt(state.tablesOnArea.length) - parseInt(tableStatus.available_soon + tableStatus.unavailable)
    })
    commit(mutation.TABLE_STATUS, tableStatus)
  },
}

const mutations = {
  [mutation.DINE_IN_AREAS](state, areas) {
    state.areas = areas.data
    if(areas.count > 0) {
      let selectedArea = state.areas.filter(area => area.priority === 1)
      state.activeArea = selectedArea[0]
      state.tablesOnArea = false
      state.tablesOnArea = state.tables.length > 0 ? state.tables.filter(table => table.area_id === state.activeArea._id) : false
    }
  },
  [mutation.DINE_IN_TABLES](state, tables) {
    state.tables = tables.data
  },
  [mutation.DINE_IN_ORDERS](state, orders) {
    state.dineInOrderDetails = orders.page_lookups.orders._id
     /*let order = LookupData.get({
      collection: orders.page_lookups.orders._id,
      matchWith: id,
      selection: false,
    })
    state.completedOrderDetails = order.order_status.*/
    state.orders = orders
  },
  [mutation.SELECTED_AREA](state, activeArea) {
    state.tablesOnArea = false
    state.activeArea = activeArea
    state.tablesOnArea = state.tables.length > 0 ? state.tables.filter(table => table.area_id === activeArea._id) : false
  },
  [mutation.LOADING](state, loadingStatus) {
    state.loading = loadingStatus
  },
  [mutation.TABLE_STATUS](state, tableStatus) {
    state.tableStatus = tableStatus
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
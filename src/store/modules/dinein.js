import * as mutation from './dinein/mutation-types'
import DineInService from '@/services/data/DineInService'
// import LookupData from '@/plugins/helpers/LookupData'
import * as CONST from '@/constants'

const state = {
  orders: false,
  dineInTableDetails: {},
  completedOrderDetails: {},
  areas: false,
  tables: false,
  activeArea: false,
  loading: false,
  tablesOnArea: false,
  tableStatus: {},
  orderOnTables: {},
}
const getters = {
  getOrderStatus: () => order_status => {
    if (
      order_status === CONST.ORDER_STATUS_ON_HOLD ||
      order_status === CONST.ORDER_STATUS_IN_PROGRESS
    ) {
      return 'running-order-details'
    } else {
      return 'done-soon-order'
    }
  },
  getTableNumber: state => orderId => {
    let tableNumber = ''
    state.orders.filter(function(order) {
      if (order.order_id === orderId) {
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
  selectedArea({ commit, dispatch }, area) {
    commit(mutation.SELECTED_AREA, area)
    dispatch('getTableStatus')
  },

  getTableStatus({ commit, state }) {
    let tableStatus = {
      availableCount: 0,
      unavailableCount: 0,
      availableSoonCount: 0,
      table: [],
    }
    let orderOnTable = []

    state.tablesOnArea.forEach(table => {
      let orders = []
      let tableDetails = { id: table._id, number: table.number, status: {} }
      orders = state.orders.filter(
        order => order.assigned_table_id === table._id
      )
      if (orders.length) {
        orders.forEach(order => {
          if (
            order.status === CONST.ORDER_STATUS_RESERVED ||
            order.status === CONST.ORDER_STATUS_IN_PROGRESS
          ) {
            tableStatus.unavailableCount += 1
            tableDetails.status.color = '#c84c4c'
            tableDetails.status.text = 'unavailable'
            tableStatus.table.push(tableDetails)
          } else if (order.status === CONST.ORDER_STATUS_ON_WAY) {
            tableStatus.availableSoonCount += 1
            tableDetails.status.color = '#faa03c'
            tableDetails.status.text = 'available_soon'
            tableStatus.table.push(tableDetails)
          }
          orderOnTable.push({
            tableId: table._id,
            orderIds: order.related_orders_ids,
          })
        })
      } else {
        tableStatus.availableCount =
          parseInt(state.tablesOnArea.length) -
          parseInt(tableStatus.unavailableCount) +
          parseInt(tableStatus.availableSoonCount)
        tableDetails.status.color = '#62bb31'
        tableDetails.status.text = 'available'
        tableStatus.table.push(tableDetails)
      }
      commit(mutation.ORDER_ON_TABLES, orderOnTable)
    })
    commit(mutation.TABLE_STATUS, tableStatus)
  },
}

const mutations = {
  [mutation.DINE_IN_AREAS](state, areas) {
    state.areas = areas.data
    if (areas.count > 0) {
      state.activeArea = state.areas[0]
      state.tablesOnArea = false
      state.tablesOnArea =
        state.tables.length > 0
          ? state.tables.filter(table => table.area_id === state.activeArea._id)
          : false
    }
  },
  [mutation.DINE_IN_TABLES](state, tables) {
    state.tables = tables.data
  },
  [mutation.DINE_IN_ORDERS](state, orders) {
    state.dineInTableDetails = orders.page_lookups.dine_in_tables._id
    /*let order = LookupData.get({
      collection: orders.page_lookups.orders._id,
      matchWith: id,
      selection: false,
    })
    state.completedOrderDetails = order.status.*/
    state.orders = orders.data
  },
  [mutation.SELECTED_AREA](state, activeArea) {
    state.tablesOnArea = false
    state.activeArea = activeArea
    state.tablesOnArea =
      state.tables.length > 0
        ? state.tables.filter(table => table.area_id === activeArea._id)
        : false
  },
  [mutation.LOADING](state, loadingStatus) {
    state.loading = loadingStatus
  },
  [mutation.ORDER_ON_TABLES](state, orderOnTables) {
    state.orderOnTables = orderOnTables
  },
  [mutation.TABLE_STATUS](state, tableStatus) {
    state.tableStatus = tableStatus
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

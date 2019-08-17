import * as mutation from './dinein/mutation-types'
import DineInService from '@/services/data/DineInService'
import LookupData from '@/plugins/helpers/LookupData'
import * as CONST from '@/constants'

const state = {
  orders: false,
  dineInOrderDetails: {},
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
    /*unavailable: ,
      available_soon: { count: 0, table: [] },
      available: { count: 0, table: [] },
    }*/
    let orderOnTable = []

    state.tablesOnArea.forEach(table => {
      let orderIds = []
      state.orders.filter(function(order) {
        if (order.table_id === table._id) {
          orderIds.push(order.order_id)
        }
      })
      let tableDetails = { id: table._id, number: table.number, status: '' }
      orderOnTable.push({ tableId: table._id, orderIds: orderIds })
      commit(mutation.ORDER_ON_TABLES, orderOnTable)
      if (orderIds.length) {
        orderIds.forEach(id => {
          let order = LookupData.get({
            collection: state.dineInOrderDetails,
            matchWith: id,
            selection: false,
          })
          if (
            order.order_status == CONST.ORDER_STATUS_ON_HOLD ||
            order.order_status == CONST.ORDER_STATUS_IN_PROGRESS
          ) {
            tableStatus.unavailableCount += 1
            tableDetails.status = '#c84c4c'
            tableStatus.table.push(tableDetails)
          } else {
            tableStatus.availableSoonCount += 1
            tableDetails.status = '#faa03c'
            tableStatus.table.push(tableDetails)
          }
        })
      } else {
        tableStatus.availableCount =
          parseInt(state.tablesOnArea.length) -
          parseInt(
            tableStatus.unavailableCount + tableStatus.availableSoonCount
          )
        tableDetails.status = '#62bb31'
        tableStatus.table.push(tableDetails)
      }
    })
    /*tableStatus.available.table.id = [
      ...new Set(tableStatus.available.table.id),
    ]*/
    commit(mutation.TABLE_STATUS, tableStatus)
  },
}

const mutations = {
  [mutation.DINE_IN_AREAS](state, areas) {
    state.areas = areas.data
    if (areas.count > 0) {
      let selectedArea = state.areas.filter(area => area.priority === 1)
      state.activeArea = selectedArea[0]
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
    state.dineInOrderDetails = orders.page_lookups.orders._id
    /*let order = LookupData.get({
      collection: orders.page_lookups.orders._id,
      matchWith: id,
      selection: false,
    })
    state.completedOrderDetails = order.order_status.*/
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

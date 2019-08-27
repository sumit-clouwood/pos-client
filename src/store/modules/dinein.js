import * as mutation from './dinein/mutation-types'
import DineInService from '@/services/data/DineInService'
import * as CONST from '@/constants'
import moment from 'moment-timezone'

const state = {
  orders: { running: false, completed: false, lookup: false },
  completedOrderDetails: {},
  areas: false,
  areaLookup: false,
  tables: false,
  activeArea: false,
  loading: false,
  tablesOnArea: false,
  tableStatus: {},
  orderOnTables: {},
  availableTables: false,
  reservation: false,
  orderType: { OTview: 'Dine In', OTApi: 'dine_in' },
  covers: false,
  selectedCover: '',
  POSMoveTableSelection: '',
  allBookedTables: {},
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
    state.orders.running.filter(function(order) {
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
    dispatch('getCovers')
    dispatch('getDineInOrders')
    dispatch('getDineInTables')
    dispatch('getDineInArea')
    commit(mutation.LOADING, false)
  },
  getDineInOrders({ commit }) {
    DineInService.dineInRunningOrders().then(response => {
      commit(mutation.DINE_IN_RUNNING_ORDERS, response.data)
    })
    DineInService.dineInCompleteOrders().then(response => {
      commit(mutation.DINE_IN_COMPLETED_ORDERS, response.data)
    })
  },

  reservationUpdateStatus({ dispatch, commit }, reservationData) {
    const params = [reservationData.reservationId, reservationData.status]
    DineInService.updateReservationStatus(...params).then(response => {
      // eslint-disable-next-line no-console
      commit(mutation.RESERVATION_ID, response.data)
      dispatch('getDineInOrders')
    })
  },
  getBookedTables({ commit }) {
    DineInService.getAllBookedTables().then(response => {
      commit(mutation.BOOKED_TABLES, response.data)
    })
  },
  getDineInArea({ commit, dispatch }) {
    DineInService.dineAreas().then(response => {
      commit(mutation.DINE_IN_AREAS, response.data)
      dispatch('getTableStatus')
    })
  },
  getDineInTables({ commit, dispatch }) {
    DineInService.dineTables().then(response => {
      commit(mutation.DINE_IN_TABLES, response.data)
      commit(mutation.PAGE_LOOKUP, response.data.page_lookups)
      dispatch('getAvailableTables')
    })
  },
  selectedArea({ commit, dispatch }, area) {
    commit(mutation.SELECTED_AREA, area)
    dispatch('getTableStatus')
  },
  getCovers({ commit }) {
    DineInService.dineInCovers().then(response => {
      commit(mutation.COVERS, response.data)
    })
  },
  getTableStatus({ commit, state }) {
    let tableStatus = {
      availableCount: 0,
      unavailableCount: 0,
      availableSoonCount: 0,
      table: [],
    }
    let orderOnTable = []
    if (state.tablesOnArea) {
      state.tablesOnArea.forEach(table => {
        let is_unavail = 0
        let is_avail_soon = 0
        let orders = []
        let tableDetails = { id: table._id, number: table.number, status: {} }

        if (state.orders.running) {
          orders = state.orders.running.filter(
            order => order.assigned_table_id === table._id
          )
        }

        if (orders.length) {
          orders.forEach(order => {
            if (
              order.status === CONST.ORDER_STATUS_RESERVED ||
              order.status === CONST.ORDER_STATUS_IN_PROGRESS
            ) {
              if (order.assigned_table_id == table._id) {
                is_unavail = 1
              }
              // tableStatus.unavailableCount += 1
              tableDetails.status.color = '#c84c4c'
              tableDetails.status.text = 'unavailable'
              tableStatus.table.push(tableDetails)
            } else if (order.status === CONST.ORDER_STATUS_ON_WAY) {
              if (order.assigned_table_id == table._id) {
                is_avail_soon = 1
              }
              // tableStatus.availableSoonCount += 1
              tableDetails.status.color = '#faa03c'
              tableDetails.status.text = 'available_soon'
              tableStatus.table.push(tableDetails)
            }
            orderOnTable.push({
              tableId: table._id,
              orderIds: order.related_orders_ids,
              tableNumber: order.number,
              reservationId: order._id,
            })
          })
          if (is_unavail == 1) {
            tableStatus.unavailableCount += 1
          }
          if (is_avail_soon == 1) {
            tableStatus.availableSoonCount += 1
          }
        } else {
          tableStatus.availableCount = parseInt(state.tablesOnArea.length)
          /*-
          parseInt(tableStatus.unavailableCount) +
          parseInt(tableStatus.availableSoonCount)*/
          tableDetails.status.color = '#62bb31'
          tableDetails.status.text = 'available'
          tableStatus.table.push(tableDetails)
        }
        commit(mutation.ORDER_ON_TABLES, orderOnTable)
      })
    }
    commit(mutation.TABLE_STATUS, tableStatus)
  },

  getAvailableTables({ commit, state }) {
    let areaTable = []
    state.tables.forEach(value => {
      if (state.areaLookup.dine_in_area._id[value.area_id] != undefined) {
        areaTable.push({
          status: '',
          name:
            state.areaLookup.dine_in_area._id[value.area_id].name +
            ' Table Number ' +
            value.number,
          id: value.area_id,
        })
      }
    })
    let availableTables = areaTable
    /*state.tables.length > 0
      ? state.tables.filter(table => table.area_id === state.activeArea._id)
      : false*/
    commit(mutation.AVAILABLE_TABLES, availableTables)
  },

  addReservation({ commit, state, dispatch }, tableId) {
    if (!state.reservation) {
      const params = [
        {
          start_date: moment().format('YYYY-MM-DD'),
          start_time: moment().format('hh:mm'),
          assigned_table_id: tableId,
          number_of_guests: 1,
          customers: [],
        },
      ]
      DineInService.reservationOperation(...params, 'add').then(response => {
        commit(mutation.RESERVATION_RESPONSE, response.data)
        dispatch('getCovers')
        commit('order/ORDER_TYPE', state.orderType, { root: true })
      })
    }
  },
  getSelectedOrder({ dispatch, commit, state, rootState }, orderId) {
    dispatch('order/selectedOrderDetails', orderId, {
      root: true,
    }).then(() => {
      commit('order/ORDER_TYPE', state.orderType, { root: true })
      return dispatch('order/addDeliveryOrder', rootState.order.selectedOrder, {
        root: true,
      })
    })
  },
}

const mutations = {
  [mutation.SET_COVER](state, selectedCover) {
    state.selectedCover = selectedCover
  },
  [mutation.DINE_IN_AREAS](state, areas) {
    state.areas = areas.data
    if (areas.count > 0) {
      state.activeArea = state.areas[0]
      state.tablesOnArea = false
      state.tablesOnArea =
        state.tables.length > 0
          ? state.tables.filter(
              table =>
                table.item_status != 'false' &&
                table.area_id === state.activeArea._id
            )
          : false
    }
  },
  [mutation.DINE_IN_TABLES](state, tables) {
    state.tables = tables.data
  },
  [mutation.DINE_IN_RUNNING_ORDERS](state, orders) {
    state.orders.running = orders.data
    state.orders.lookup = orders.page_lookups
  },
  [mutation.DINE_IN_COMPLETED_ORDERS](state, orders) {
    state.orders.completed = orders.data
    state.orders.lookup = orders.page_lookups
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
  [mutation.COVERS](state, covers) {
    state.covers = covers.data
  },
  [mutation.AVAILABLE_TABLES](state, availableTables) {
    state.availableTables = availableTables
  },
  [mutation.RESERVATION_ID](state, reservationId) {
    state.reservation = reservationId
  },
  [mutation.BOOKED_TABLES](state, bookedTables) {
    state.allBookedTables = bookedTables
  },
  [mutation.PAGE_LOOKUP](state, lookups) {
    state.areaLookup = lookups
  },
  [mutation.POS_MOVE_TABLE_SELECTION](state, tableDetails) {
    state.POSMoveTableSelection = tableDetails
  },
  [mutation.RESERVATION_RESPONSE](state, reservation) {
    // eslint-disable-next-line no-console
    console.log(reservation)
    state.reservation = reservation.id
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

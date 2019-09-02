import * as mutation from './dinein/mutation-types'
import DineInService from '@/services/data/DineInService'
import * as CONST from '@/constants'
import moment from 'moment-timezone'

const state = {
  orders: {
    running: false,
    completed: false,
    lookup_running: false,
    lookup_completed: false,
  },
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
  reservationId: false,
  orderType: { OTview: 'Dine In', OTApi: 'dine_in' },
  covers: false,
  selectedCover: '',
  POSMoveTableSelection: '',
  allBookedTables: { orders: false, lookup: false },
  orderReservationData: {},
  dineInTabType: 'all',
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
    dispatch('getBookedTables')
    // dispatch('dineInRunningOrders')
    dispatch('getDineInTables')
    dispatch('getDineInArea')
    dispatch('getCovers')
    commit(mutation.LOADING, false)
  },
  getDineInOrders({ dispatch }) {
    dispatch('getBookedTables')
    dispatch('dineInRunningOrders')
    dispatch('dineInCompleteOrders')
  },

  reservationUpdateStatus({ dispatch, commit }, reservationData) {
    return new Promise((resolve, reject) => {
      const params = [reservationData.reservationId, reservationData.status]
      DineInService.updateReservationStatus(...params)
        .then(response => {
          commit(mutation.RESERVATION_ID, response.data)
          dispatch('getBookedTables')
          dispatch('dineInRunningOrders')
          dispatch('getTableStatus')
          resolve(response.data)
        })
        .catch(er => reject(er))
    })
  },
  getBookedTables({ commit }) {
    DineInService.getAllBookedTables().then(response => {
      commit(mutation.BOOKED_TABLES, response.data)
    })
  },
  dineInRunningOrders({ commit }) {
    DineInService.dineInRunningOrders().then(response => {
      commit(mutation.DINE_IN_RUNNING_ORDERS, response.data)
    })
  },
  dineInCompleteOrders({ commit }) {
    DineInService.dineInCompleteOrders().then(response => {
      commit(mutation.DINE_IN_COMPLETED_ORDERS, response.data)
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

        if (state.allBookedTables) {
          orders = state.allBookedTables.orders.filter(
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
              startDate: order.start_date,
              startTime: order.start_time,
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
    let orders = []
    let color = '#62bb31'
    state.tables.forEach(value => {
      if (state.areaLookup.dine_in_area._id[value.area_id] != undefined) {
        if (state.allBookedTables.orders) {
          orders = state.allBookedTables.orders.filter(
            order => order.assigned_table_id === value._id
          )
        }
        if (orders.length) {
          orders.forEach(order => {
            if (
              order.status === CONST.ORDER_STATUS_RESERVED ||
              order.status === CONST.ORDER_STATUS_IN_PROGRESS
            ) {
              color = '#c84c4c'
            } else if (order.status === CONST.ORDER_STATUS_ON_WAY) {
              color = '#faa03c'
            }
          })
        }
        areaTable.push({
          status: '',
          color: color,
          name:
            state.areaLookup.dine_in_area._id[value.area_id].name +
            ' [ ' +
            value.number +
            ' ] ',
          id: value.area_id,
          shape: value.table_shape,
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
          number_of_guests: 0,
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
    state.orders.lookup_running = orders.page_lookups
  },
  [mutation.DINE_IN_COMPLETED_ORDERS](state, orders) {
    state.orders.completed = orders.data
    state.orders.lookup_completed = orders.page_lookups
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
    localStorage.setItem('reservationId', reservationId)
  },
  [mutation.BOOKED_TABLES](state, bookedTables) {
    state.allBookedTables.orders = bookedTables.data
    state.allBookedTables.lookup = bookedTables.page_lookups
  },
  [mutation.PAGE_LOOKUP](state, lookups) {
    state.areaLookup = lookups
  },
  [mutation.POS_MOVE_TABLE_SELECTION](state, tableDetails) {
    state.POSMoveTableSelection = tableDetails
  },
  [mutation.RESERVATION_RESPONSE](state, reservation) {
    state.reservationId = reservation.id
    localStorage.setItem('reservationId', reservation.id)
  },
  [mutation.ORDER_RESERVATION_DATA](state, reservationData) {
    state.orderReservationData = reservationData
  },
  [mutation.DINE_IN_TAB_TYPE](state, reservationData) {
    state.dineInTabType = reservationData
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

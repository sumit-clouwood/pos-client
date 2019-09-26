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
  guests: 1,
  orderDetails: false,
  completedOrderDetails: {},
  areas: false,
  areaLookup: false,
  tables: false,
  activeArea: false,
  loading: true,
  tablesOnArea: false,
  tableStatus: {},
  orderOnTables: {},
  availableTables: false,
  selectedTable: false,
  reservation: false,
  reservationId: false,
  orderType: { OTview: 'Dine In', OTApi: 'dine_in' },
  covers: false,
  selectedCover: '',
  POSMoveTableSelection: '',
  allBookedTables: { orders: false, lookup: false },
  orderReservationData: {},
  dineInTabType: 'all',
  split: false,
  totalReservations: { totalPages: 0, pageNumber: 1, limit: 10 },
}
const getters = {
  getOrderStatus: () => order_status => {
    if (
      order_status === CONST.ORDER_STATUS_ON_HOLD ||
      order_status === CONST.ORDER_STATUS_IN_PROGRESS
    ) {
      return 'running-order-details'
    } else if (order_status === CONST.ORDER_STATUS_FINISHED) {
      return 'finished-order'
    } else if (order_status === CONST.ORDER_STATUS_COMPLETED) {
      return 'completed-order'
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
  updateDineInOrderStatus({ dispatch, commit }, orderStatus) {
    commit(mutation.DINE_IN_TAB_TYPE, orderStatus.title)
    if (orderStatus.pageId) {
      let loader = orderStatus.loader ? orderStatus.loader : true
      dispatch(orderStatus.pageId, loader)
    }
  },
  async fetchAll({ dispatch, commit }) {
    commit(mutation.LOADING, true)
    await Promise.all([
      dispatch('getDineInTables'),
      dispatch('getCovers'),
      dispatch('getBookedTables', false),
      dispatch('getDineInArea'),
    ])
    commit(mutation.LOADING, false)
  },
  getDineInOrders({ dispatch }) {
    dispatch('getBookedTables')
    dispatch('dineInRunningOrders')
    // dispatch('dineInCompleteOrders')
  },

  reservationUpdateStatus({ dispatch, commit }, reservationData) {
    return new Promise((resolve, reject) => {
      const params = [reservationData.reservationId, reservationData.status]
      DineInService.updateReservationStatus(...params)
        .then(response => {
          commit(mutation.RESERVATION_ID, false)
          dispatch('dineInRunningOrders', false)
          dispatch('getTableStatus', false)
          resolve(response.data)
        })
        .catch(er => reject(er))
    })
  },
  async getBookedTables({ commit }, loader = true) {
    // eslint-disable-next-line no-console
    console.log('all bookend table')
    if (loader) commit(mutation.LOADING, loader)
    localStorage.setItem('reservationId', false)
    const response = await DineInService.getAllBookedTables()
    commit(mutation.BOOKED_TABLES, response.data)
    if (loader) commit(mutation.LOADING, false)
    return Promise.resolve()
  },

  seOrderData({ commit }, response) {
    let orderDetails = []
    let responseData = response.data.data
    //state.areas = this.getDineInArea
    responseData.forEach(table => {
      let order = []
      let balanceDue = 0
      let currency = ''

      let areaName = state.areas.find(element => {
        return element._id ==
          response.data.page_lookups.dine_in_tables._id[table.assigned_table_id]
            .area_id
          ? element.name
          : ''
      })
      table.related_orders_ids.forEach(order_Id => {
        let od = response.data.page_lookups.orders._id[order_Id]
        order.push(od)
        balanceDue += parseFloat(od.balance_due)
        currency = od.currency
      })
      orderDetails.push({
        table: table,
        orders: order,
        amount: balanceDue + ' ' + currency,
        areaName: areaName.name.toUpperCase(),
      })
    })
    commit(mutation.ORDER_DETAILS, {
      tableData: responseData,
      orderDetails: orderDetails,
    })
  },
  dineInRunningOrders({ commit, state, dispatch }, loader = true) {
    if (loader) commit(mutation.LOADING, loader)
    const params = [
      state.totalReservations.pageNumber,
      state.totalReservations.limit,
    ]

    DineInService.dineInRunningOrders(...params).then(response => {
      dispatch('seOrderData', response)
      commit(mutation.TOTAL_RESERVATION, response.data)
      if (loader) commit(mutation.LOADING, false)
    })
  },
  dineInCompleteOrders({ commit, dispatch }, loader = true) {
    if (loader) commit(mutation.LOADING, loader)
    const params = [
      state.totalReservations.pageNumber,
      state.totalReservations.limit,
    ]
    DineInService.dineInCompleteOrders(...params).then(response => {
      dispatch('seOrderData', response)
      commit(mutation.TOTAL_RESERVATION, response.data)
      if (loader) commit(mutation.LOADING, false)
    })
  },
  getDineInArea({ commit, dispatch }) {
    DineInService.dineAreas().then(response => {
      commit(mutation.DINE_IN_AREAS, response.data)
      dispatch('getTableStatus')
    })
  },
  getDineInTables({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      DineInService.dineTables()
        .then(response => {
          commit(mutation.DINE_IN_TABLES, response.data)
          commit(mutation.PAGE_LOOKUP, response.data.page_lookups)
          dispatch('getAvailableTables')
            .then(() => {
              resolve()
            })
            .catch(error => reject(error))
        })
        .catch(error => reject(error))
    })
  },
  selectedArea({ commit, dispatch }, area) {
    commit(mutation.SELECTED_AREA, area)
    dispatch('getTableStatus')
  },
  async getCovers({ commit }) {
    const response = await DineInService.dineInCovers()
    commit(mutation.COVERS, response.data)
    return Promise.resolve()
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
        let table_details = { id: table._id, number: table.number, status: {} }

        if (state.allBookedTables && state.allBookedTables.orders) {
          orders = state.allBookedTables.orders.filter(
            order => order.assigned_table_id === table._id
          )
        }

        if (orders.length) {
          let tableArray = []
          orders.forEach(order => {
            // // eslint-disable-next-line no-console
            // console.log(order, 'Rajeev')
            if (tableArray[order.assigned_table_id] == undefined)
              tableArray[order.assigned_table_id] = []
            tableArray[order.assigned_table_id].push(order.status)
            if (
              order.status === CONST.ORDER_STATUS_RESERVED ||
              order.status === CONST.ORDER_STATUS_IN_PROGRESS
            ) {
              if (order.assigned_table_id == table._id) {
                is_unavail = 1
              }
              // tableStatus.unavailableCount += 1
              // table_details.status.color = '#c84c4c'
              // table_details.status.text = 'unavailable'
              // tableStatus.table.push(table_details)
            } else if (order.status === CONST.ORDER_STATUS_ON_WAY) {
              if (order.assigned_table_id == table._id) {
                is_avail_soon = 1

                orders.forEach(order => {
                  if (order.status !== CONST.ORDER_STATUS_ON_WAY) {
                    is_avail_soon = 0
                  }
                })
              }
              // tableStatus.availableSoonCount += 1
              // table_details.status.color = '#faa03c'
              // table_details.status.text = 'available_soon'
              // tableStatus.table.push(table_details)
              // eslint-disable-next-line no-console
              // console.log(table_details, 'Rajeev')
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
          if (
            tableArray[table_details.id].includes(
              CONST.ORDER_STATUS_RESERVED
            ) ||
            tableArray[table_details.id].includes(
              CONST.ORDER_STATUS_IN_PROGRESS
            )
          ) {
            table_details.status.color = '#c84c4c'
            table_details.status.text = 'unavailable'
          } else if (
            tableArray[table_details.id].includes(CONST.ORDER_STATUS_ON_WAY)
          ) {
            table_details.status.color = '#faa03c'
            table_details.status.text = 'available_soon'
          } else {
            table_details.status.color = '#62bb31'
            table_details.status.text = 'available'
          }
          tableStatus.table.push(table_details)
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
          table_details.status.color = '#62bb31'
          table_details.status.text = 'available'
          // eslint-disable-next-line no-console
          // console.log(table_details, 'Rajeev')
          tableStatus.table.push(table_details)
        }
        commit(mutation.ORDER_ON_TABLES, orderOnTable)
      })
    }
    commit(mutation.TABLE_STATUS, tableStatus)
  },

  getAvailableTables({ commit, state }) {
    let areaTable = []
    let orders = []
    state.tables.forEach(value => {
      let color = '#62bb31'
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
          name: state.areaLookup.dine_in_area._id[value.area_id].name,
          id: value.area_id,
          table_number: value.number,
          table_id: value._id,
          shape: value.table_shape,
        })
      }
    })
    // let availableTables = areaTable
    /*state.tables.length > 0
      ? state.tables.filter(table => table.area_id === state.activeArea._id)
      : false*/
    commit(mutation.AVAILABLE_TABLES, areaTable)
    return Promise.resolve()
  },

  addReservation({ commit, state, dispatch }, tableId) {
    commit(mutation.LOADING, true)
    dispatch('order/reset', {}, { root: true })
    dispatch('checkout/reset', {}, { root: true })
    return new Promise((resolve, reject) => {
      if (!state.reservation) {
        const params = [
          {
            //need to set UTC
            start_date: moment()
              .utc()
              .format('YYYY-MM-DD'),
            start_time: moment()
              .utc()
              .format('hh:mm'),
            assigned_table_id: tableId,
            number_of_guests: state.guests,
            customers: [],
          },
        ]
        DineInService.reservationOperation(...params, 'add')
          .then(response => {
            commit(mutation.RESERVATION_RESPONSE, response.data)
            dispatch('getCovers').then(() => {
              resolve()
              commit(mutation.LOADING, false)
            })
            commit('order/ORDER_TYPE', state.orderType, { root: true })
          })
          .catch(error => reject(error))
      }
    })
  },
  getSelectedOrder({ dispatch, commit, state, rootState }, orderId) {
    dispatch('order/reset', {}, { root: true })
    dispatch('checkout/reset', {}, { root: true })
    dispatch('order/selectedOrderDetails', orderId, {
      root: true,
    }).then(() => {
      commit('order/ORDER_TYPE', state.orderType, { root: true })
      return dispatch('order/addDiningOrder', rootState.order.selectedOrder, {
        root: true,
      })
    })
  },
  fetchMoreReservations(
    { commit, dispatch },
    { pageNumber, tabName, loader = true }
  ) {
    commit(mutation.SET_PAGE_NO, pageNumber)
    if (tabName === 'running') {
      dispatch('dineInRunningOrders', loader)
    } else {
      dispatch('dineInCompleteOrders', loader)
    }
  },
  moveTable({ commit }, data) {
    const params = [data.reservationid, 'move_table', { table_id: data.table }]
    DineInService.updateReservationTable(...params).then(() => {
      commit(mutation.RESERVATION_ID, data.reservationid)
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
      state.activeArea = state.activeArea ? state.activeArea : state.areas[0]
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
  [mutation.SET_PAGE_NO](state, pageNumber) {
    state.totalReservations.pageNumber = pageNumber
  },
  [mutation.TOTAL_RESERVATION](state, totalReservations) {
    state.totalReservations.totalPages = Math.ceil(
      parseInt(totalReservations.count) /
        parseInt(state.totalReservations.limit)
    )
  },
  [mutation.ORDER_DETAILS](state, data) {
    state.orderDetails = data.orderDetails
  },
  /*[mutation.DINE_IN_COMPLETED_ORDERS](state, orders) {
    state.orders.completed = orders.data
    state.orders.lookup_completed = orders.page_lookups
  },*/
  [mutation.SELECTED_AREA](state, activeArea) {
    state.tablesOnArea = false
    state.activeArea = activeArea
    state.tablesOnArea =
      state.tables.length > 0
        ? state.tables.filter(table => table.area_id === activeArea._id)
        : false
  },
  [mutation.LOADING](state, loadingStatus) {
    // eslint-disable-next-line no-console
    console.log(loadingStatus)
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
  [mutation.NUMBER_GUESTS](state, guest) {
    if (guest) {
      state.guests = guest
    } else {
      let reservation = state.allBookedTables.orders.filter(
        order => order._id === state.reservation
      )
      state.guests =
        typeof reservation[0] != 'undefined'
          ? reservation[0].number_of_guests
          : 0
    }
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
  [mutation.SELECTED_TABLE](state, selectedTable) {
    state.selectedTable = selectedTable
  },
  [mutation.TABLE_SPLIT](state, slitStatus) {
    state.split = slitStatus
  },
  [mutation.RESET](state) {
    state.areas = false
    state.dineInTabType = 'all'
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

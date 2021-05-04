import * as mutation from './dinein/mutation-types'
import DineInService from '@/services/data/DineInService'
import * as CONST from '@/constants'
import moment from 'moment-timezone'
// import OrderHelper from '@/plugins/helpers/Order'
import * as PERMS from '@/const/permissions'
import workflow from '../../plugins/helpers/workflow'
import availability from '../../plugins/helpers/Availability'

const state = {
  orders: {
    running: false,
    completed: false,
    lookup_running: false,
    lookup_completed: false,
  },
  kitchenPrint: true,
  selectedTableRservationData: false,
  bills: null,
  guests: 1,
  updateTableArea: 0,
  statusFlag: 0,
  tableZoomScale: 0.4,
  orderDetails: false,
  completedOrderDetails: {},
  areas: false,
  areaLookup: false,
  tables: false,
  activeArea: false,
  loading: true,
  tablesOnArea: false,
  tableStatus: false,
  orderOnTables: {},
  availableTables: false,
  selectedTable: false,
  reservation: false,
  reservationId: false,
  moveItemReservationId: false,
  orderType: { OTview: 'Dine In', OTApi: 'dine_in' },
  covers: false,
  selectedCover: '',
  POSMoveTableSelection: '',
  allBookedTables: { orders: false, lookup: false },
  orderReservationData: {},
  dineInTabType: 'all',
  split: false,
  totalReservations: { totalPages: 0, pageNumber: 1, limit: 10 },
  billSplit: null,
  processingSplit: false,
  reservationData: null,
  isModified: false,
  moveItemTableId: undefined,
  currentTableReservationData: null,
}
const getters = {
  getCurrentTableRunningReservations: state => {
    if (!state.currentTableReservationData) {
      return false
    }
    return state.currentTableReservationData.map(reservation => {
      if (reservation.status !== 'completed') {
        return reservation
      }
      return false
    })
  },
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
  getTableNumberById: state => tableId => {
    return state.tablesOnArea.find(table => table._id === tableId)
  },
  getTableEmptyTime: (state, getters, rootState) => {
    return rootState.location.store.table_empty_time
  },
  guestInBillItem: state => (item, guest) => {
    if (
      state.bills &&
      state.bills[item.orderIndex] &&
      state.bills[item.orderIndex].includes(guest)
    ) {
      return true
    }
    return false
  },
}

const actions = {
  updateDineInOrderStatus({ dispatch, commit }, orderStatus) {
    commit(mutation.DINE_IN_TAB_TYPE, orderStatus.title)
    if (orderStatus.pageId) {
      let loader = orderStatus.loader /*? orderStatus.loader : true*/
      dispatch(orderStatus.pageId, loader)
    }
  },
  async fetchAll({ dispatch, commit }, data) {
    if (!data || !data.silent) {
      commit(mutation.LOADING, true)
    }
    await Promise.all([
      dispatch('getDineInTables'),
      dispatch('getCovers'),
      dispatch('getBookedTables', false),
      // dispatch('getDineInArea'),
    ])
    if (!data || !data.silent) {
      commit(mutation.LOADING, false)
    }
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
          if (reservationData.status === 'dine_in_about_to_finish')
            dispatch('dineInRunningOrders', false)

          dispatch('getBookedTables', false)
          /*dispatch('dineInRunningOrders', false)
          dispatch('getTableStatus', false)*/
          resolve(response.data)
        })
        .catch(er => reject(er))
    })
  },
  getBookedTables({ commit, dispatch }, loader = false) {
    return new Promise((resolve, reject) => {
      if (loader) commit(mutation.LOADING, loader)
      /*localStorage.setItem('reservationId', false)*/
      DineInService.getAllBookedTables()
        .then(response => {
          //if we have offline bookings data ll be returned always as offline once syced up it ll return original
          //if we get fresh data we need to save it in cache
          workflow.storeData({
            key: 'dinein_reservations',
            data: response.data,
          })

          commit(mutation.BOOKED_TABLES, response.data)
          dispatch('getDineInArea').then(() => {
            return resolve()
          })
          if (loader) commit(mutation.LOADING, false)
        })
        .catch(er => reject(er))
    })
  },
  getBookedTablesOnClick({ state, commit, dispatch }, loader = false) {
    new Promise(async (resolve, reject) => {
      if (loader) commit(mutation.LOADING, loader)
      /*localStorage.setItem('reservationId', false)*/
      await DineInService.getAllBookedTables()
        .then(response => {
          //if we have offline bookings data ll be returned always as offline once syced up it ll return original
          //if we get fresh data we need to save it in cache
          workflow.storeData({
            key: 'dinein_reservations',
            data: response.data,
          })
          if (!state.areas) {
            dispatch('getDineInArea').then(() => {
              return resolve()
            })
          }
          commit(mutation.BOOKED_TABLES, response.data)
          if (loader) commit(mutation.LOADING, false)
        })
        .catch(er => reject(er))
      dispatch('getTableStatus')
    })
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

      // //restrict waiters to see other's orders
      // if (!rootGetters['auth/allowed'](PERMS.SEE_OTHERS_ORDERS)) {
      //   order = OrderHelper.userOrders(
      //     order,
      //     rootState.auth.userDetails.item._id
      //   )
      // }
      if (order) {
        orderDetails.push({
          table: table,
          orders: order,
          amount: balanceDue + ' ' + currency,
          areaName: areaName.name.toUpperCase(),
        })
      }
    })
    commit(mutation.ORDER_DETAILS, {
      tableData: responseData,
      orderDetails: orderDetails,
    })
  },
  dineInRunningOrders(
    { commit, state, dispatch, rootState, rootGetters },
    loader = true
  ) {
    if (loader) commit(mutation.LOADING, loader)

    let userId = ''
    if (!rootGetters['auth/allowed'](PERMS.SEE_OTHERS_ORDERS)) {
      userId = rootState.auth.userDetails.item._id
    }
    const params = [
      state.totalReservations.pageNumber,
      state.totalReservations.limit,
      userId,
    ]

    DineInService.dineInRunningOrders(...params).then(response => {
      dispatch('seOrderData', response)
      commit(mutation.TOTAL_RESERVATION, response.data)
      if (loader) commit(mutation.LOADING, false)
    })
  },
  dineInCompleteOrders(
    { commit, dispatch, rootGetters, rootState },
    loader = true
  ) {
    if (loader) commit(mutation.LOADING, loader)
    let userId = ''
    if (!rootGetters['auth/allowed'](PERMS.SEE_OTHERS_ORDERS)) {
      userId = rootState.auth.userDetails.item._id
    }

    const params = [
      state.totalReservations.pageNumber,
      state.totalReservations.limit,
      userId,
    ]
    DineInService.dineInCompleteOrders(...params).then(response => {
      dispatch('seOrderData', response)
      commit(mutation.TOTAL_RESERVATION, response.data)
      if (loader) commit(mutation.LOADING, false)
    })
  },
  getDineInArea({ commit, dispatch }) {
    return new Promise(resolve => {
      DineInService.dineAreas().then(response => {
        commit(mutation.DINE_IN_AREAS, response.data)
        dispatch('getTableStatus').then(() => {
          return resolve()
        })
      })
    })
  },
  getDineInTables({ commit, dispatch, rootState }) {
    return new Promise((resolve, reject) => {
      DineInService.dineTables()
        .then(response => {
          if (rootState.sync.online) {
            workflow.storeData({
              key: 'dinein_tables',
              data: response.data,
            })
          }
          // eslint-disable-next-line no-console
          console.log(
            response.data,
            'DINE_IN_TABLES, added console log for undefined table number'
          )
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
    commit(mutation.TABLE_SCALE, 0.4)
    dispatch('getTableStatus')
  },
  async getCovers({ commit }) {
    const response = await DineInService.dineInCovers()
    commit(mutation.COVERS, response.data)
    return Promise.resolve()
  },
  // eslint-disable-next-line no-unused-vars
  getTableStatus({ commit, state, getters }) {
    return new Promise(resolve => {
      commit(mutation.TABLE_STATUS, false)
      let tableStatus = {
        availableCount: 0,
        unavailableCount: 0,
        availableSoonCount: 0,
        emptyTableCount: 0,
        table: [],
      }
      let orderOnTable = []
      if (state.tablesOnArea) {
        state.tablesOnArea.forEach(table => {
          let is_unavail = 0
          let is_avail_soon = 0
          let is_reserved_empty = 0
          let orders = []
          let table_details = {
            id: table._id,
            number: table.number,
            status: {},
          }

          if (state.allBookedTables && state.allBookedTables.orders) {
            orders = state.allBookedTables.orders.filter(
              order => order.assigned_table_id === table._id
            )
          }
          let empty_reserved_table = []
          state.allBookedTables.orders.filter(order_table => {
            if (order_table.status === 'reserved') {
              empty_reserved_table[order_table.assigned_table_id] = {
                time: order_table.start_time,
                date: order_table.start_date,
              }
            }
          })
          if (orders.length) {
            let tableArray = []
            orders.forEach(order => {
              if (tableArray[order.assigned_table_id] == undefined)
                tableArray[order.assigned_table_id] = []
              tableArray[order.assigned_table_id].push(order.status)
              if (order.status === CONST.ORDER_STATUS_IN_PROGRESS) {
                if (order.assigned_table_id == table._id) {
                  is_unavail = 1
                } else {
                  is_reserved_empty = 1
                }
              } else if (order.status === CONST.ORDER_STATUS_RESERVED) {
                if (order.assigned_table_id == table._id) {
                  is_reserved_empty = 1
                }
              } else if (order.status === CONST.ORDER_STATUS_ON_WAY) {
                if (order.assigned_table_id == table._id) {
                  is_avail_soon = 1

                  orders.forEach(order => {
                    if (order.status !== CONST.ORDER_STATUS_ON_WAY) {
                      is_avail_soon = 0
                    }
                  })
                }
              }
              orderOnTable.push({
                tableId: table._id,
                orderIds: order.related_orders_ids,
                tableNumber: order.number,
                reservationId: order._id,
                startDate: order.start_date,
                startTime: order.start_time,
                assigned_to: order.assigned_to,
                created_by: order.created_by,
                status: order.status,
                end_time: order.end_time,
              })
            })
            // eslint-disable-next-line no-console
            // console.log('order->length')
            if (
              tableArray[table_details.id].includes(
                CONST.ORDER_STATUS_RESERVED
              ) ||
              tableArray[table_details.id].includes(
                CONST.ORDER_STATUS_IN_PROGRESS
              )
            ) {
              if (empty_reserved_table && empty_reserved_table[table._id]) {
                let table_book_date_time = empty_reserved_table[table._id]
                  ? availability.timeConvert(
                      empty_reserved_table[table._id].time
                    )
                  : 0
                // let table_book_date_time = availability.timeConvert(
                //   order.start_time
                // )
                const table_book_date_date = moment
                  .utc(empty_reserved_table[table._id].date)
                  .format('YYYY-MM-DD')
                const current_date_active = moment.utc().format('YYYY-MM-DD')
                let empty_table_time = availability.timeConvert(
                  getters.getTableEmptyTime
                )
                let getUTCCurrentTime = availability.timeConvert(
                  availability.getUTCCurrentTime()
                )
                if (
                  getUTCCurrentTime > table_book_date_time + empty_table_time ||
                  table_book_date_date < current_date_active
                ) {
                  if (table_book_date_time) {
                    // let new_table = table
                    table_details.status.color = '#c1bfbf'
                    table_details.status.text = 'reserved'
                    // tableStatus.table.push(new_table)
                  }
                } else {
                  table_details.status.color = '#c84c4c'
                  table_details.status.text = 'unavailable'
                }
              } else {
                table_details.status.color = '#c84c4c'
                table_details.status.text = 'unavailable'
              }
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
            if (is_unavail === 1) {
              tableStatus.unavailableCount += 1
            }
            if (is_reserved_empty === 1) {
              tableStatus.emptyTableCount += 1
            }
            if (is_avail_soon === 1) {
              tableStatus.availableSoonCount += 1
            }
          } else {
            tableStatus.availableCount = parseInt(state.tablesOnArea.length)
            table_details.status.color = '#62bb31'
            table_details.status.text = 'available'
            tableStatus.table.push(table_details)
          }
          // eslint-disable-next-line no-console
          // console.log(orderOnTable, 'order no  length')
          commit(mutation.ORDER_ON_TABLES, orderOnTable)
        })
      }
      commit(mutation.TABLE_STATUS, tableStatus)
      resolve()
    })
  },

  getAvailableTables({ commit, state }) {
    let areaTable = []
    let orders = []
    if (state.tables) {
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
    }
    // let availableTables = areaTable
    /*state.tables.length > 0
      ? state.tables.filter(table => table.area_id === state.activeArea._id)
      : false*/
    commit(mutation.AVAILABLE_TABLES, areaTable)
    return Promise.resolve()
  },

  addReservation({ commit, state, dispatch }, tableId) {
    commit(mutation.LOADING, false)
    dispatch('order/reset', {}, { root: true })
    dispatch('checkout/reset', {}, { root: true })
    if (!state.reservation) {
      const params = [
        {
          //need to set UTC
          start_date: moment()
            .utc()
            .format('YYYY-MM-DD'),
          start_time: moment()
            .utc()
            .format('HH:mm'),
          assigned_table_id: tableId,
          number_of_guests: state.guests,
          customers: [],
        },
      ]
      dispatch('newReservation', ...params)
    }
  },
  newReservationForMovingItems(
    { commit, state, rootState, getters, dispatch },
    tableId
  ) {
    commit(mutation.LOADING, false)
    if (rootState.order.selectItemsToMove && state.moveItemTableId) {
      const params = [
        {
          //need to set UTC
          start_date: moment()
            .utc()
            .format('YYYY-MM-DD'),
          start_time: moment()
            .utc()
            .format('HH:mm'),
          assigned_table_id: tableId,
          number_of_guests: state.guests,
          customers: [],
          assigned_to: rootState.auth.userDetails.item._id,
          created_by: rootState.auth.userDetails.item._id,
          number: getters.getTableNumberById(tableId).number,
        },
      ]
      return new Promise(async (resolve, reject) => {
        DineInService.reservationOperation(...params, 'add')
          .then(response => {
            // commit('RESERVATION_RESPONSE_MOVE_ITEMS', response.data)
            commit(mutation.RESERVATION_RESPONSE, response.data)
            commit('order/ORDER_TYPE', state.orderType, { root: true })
            dispatch('getBookedTablesOnClick', false)
            commit('MOVE_ITEM_TABLE_ID', undefined)
            resolve()
          })
          .catch(error => reject(error))
      })
      /* set table id to state to new state (set handle here)*/
    }
  },
  newReservation({ commit, dispatch, rootState, getters }, params) {
    return new Promise(async (resolve, reject) => {
      //offline booking
      params.assigned_to = rootState.auth.userDetails.item._id
      params.created_by = rootState.auth.userDetails.item._id
      params.number = getters.getTableNumberById(
        params.assigned_table_id
      ).number

      DineInService.reservationOperation(params, 'add')

        .then(response => {
          commit(mutation.RESERVATION_RESPONSE, response.data)
          commit('order/ORDER_TYPE', state.orderType, { root: true })
          dispatch('getBookedTablesOnClick', false) //update it for optimization
        })
        .catch(error => reject(error))
    })
  },
  getSelectedOrder({ dispatch, commit, state, rootState }, orderId) {
    return new Promise((resolve, reject) => {
      dispatch('order/reset', {}, { root: true })
      dispatch('checkout/reset', {}, { root: true })
      dispatch('order/selectedOrderDetails', orderId, {
        root: true,
      })
        .then(() => {
          commit('order/ORDER_TYPE', state.orderType, { root: true })
          dispatch('order/addDiningOrder', rootState.order.selectedOrder, {
            root: true,
          })
            .then(() => {
              if (state.selectedTable) {
                let table_number =
                  state.selectedTable.number || state.selectedTable.table_number
                commit(mutation.SELECTED_TABLE_RESERVATION, table_number)
              }
              resolve()
            })
            .catch(error => reject(error))
        })
        .catch(error => reject(error))
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
  moveTable({ commit, state, dispatch }, data) {
    if (state.selectedTable) {
      commit(
        mutation.SELECTED_TABLE_RESERVATION,
        state.selectedTable.table_number
      )
    }

    if (data.reservationid != 'false') {
      const params = [
        data.reservationid,
        'move_table',
        { table_id: data.table },
      ]
      DineInService.updateReservationTable(...params).then(() => {
        commit(mutation.RESERVATION_ID, data.reservationid)
        dispatch('getBookedTablesOnClick', false) //update it for optimization
      })
    }
  },
  updateItemGuest({ state, commit }, { item, guest }) {
    let action = 'add'
    if (state.bills && state.bills[item]) {
      //check if guest already exists with item then remove it
      if (state.bills[item].includes(guest)) {
        action = 'remove'
      } else {
        action = 'update'
      }
    }
    commit(mutation.UPDATE_ITEM_GUEST, {
      item: item,
      guest: guest,
      action: action,
    })
    return Promise.resolve()
  },
  splitBill({ state, commit }) {
    let groups = {}
    for (let [item, guests] of Object.entries(state.bills)) {
      let key = guests.sort().join('-')
      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(item)
    }
    commit(mutation.SPLIT_BILLS, groups)
  },

  switchWaiter({ getters }, waiter) {
    const reservationsOnTable = getters.getCurrentTableRunningReservations

    reservationsOnTable.forEach(reservation => {
      let orderIds = reservation.orderIds
      if (orderIds.length) {
        orderIds.forEach(order_id => {
          DineInService.switchWaiter(reservation.reservationId, {
            switch_from: reservation.assigned_to,
            switch_to: waiter._id,
            order_id: order_id,
          })
        })
      } /*else {
        DineInService.switchWaiter(reservation.reservationId, {
          switch_from: reservation.assigned_to,
          switch_to: waiter._id,
        })
      }*/
    })
  },
  /*switchWaiter({ state, rootGetters }, waiter) {
    if (
        !waiter ||
        (state.reservationData &&
            state.reservationData.assigned_to === waiter._id)
    ) {
      return Promise.reject({
        message: rootGetters['location/_t'](
            'Waiter already assigned to table.'
        ),
      })
    }
    if (!state.reservationData) {
      return Promise.reject({
        message: rootGetters['location/_t']('No order found on table.'),
      })
    }
    return DineInService.switchWaiter(state.reservationData.reservationId, {
      switch_from: state.reservationData.assigned_to,
      switch_to: waiter._id,
    })
  },*/
}

const mutations = {
  [mutation.IS_MODIFIED](state, isModified) {
    state.isModified = isModified
  },
  [mutation.SET_COVER](state, selectedCover) {
    state.selectedCover = selectedCover
  },
  [mutation.DINE_IN_AREAS](state, areas) {
    state.areas = areas.data
    if (areas.count > 0) {
      state.activeArea = state.activeArea ? state.activeArea : state.areas[0]
      state.tablesOnArea = false
      state.tablesOnArea =
        state.tables && state.tables.length > 0
          ? state.tables.filter(
              table =>
                table.item_status != 'false' &&
                table.area_id === state.activeArea._id
            )
          : false
    }
  },
  [mutation.SPLIT_BILLS](state, groups) {
    state.billSplit = groups
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
    if (activeArea) {
      state.tablesOnArea =
        state.tables && state.tables.length > 0
          ? state.tables.filter(table => table.area_id === activeArea._id)
          : false
    }
  },
  [mutation.LOADING](state, loadingStatus) {
    state.loading = loadingStatus
    if (!loadingStatus) state.statusFlag = 0
  },
  [mutation.ORDER_ON_TABLES](state, orderOnTables) {
    state.orderOnTables = orderOnTables
  },
  UPDATE_TABLE_STATUS(state, orderOnTables) {
    state.orderOnTables.table = orderOnTables
  },
  [mutation.TABLE_SCALE](state, scale) {
    state.tableZoomScale = scale
  },
  [mutation.TABLE_STATUS](state, tableStatus) {
    state.tableStatus = tableStatus
    if (tableStatus) state.updateTableArea = Math.floor(Math.random() * 10000)
  },
  [mutation.COVERS](state, covers) {
    state.covers = covers.data
  },
  [mutation.AVAILABLE_TABLES](state, availableTables) {
    state.availableTables = availableTables
  },
  [mutation.RESERVATION_ID](state, reservationId) {
    state.statusFlag = Math.random()
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
    // state.updateTableArea = Math.floor(Math.random() * 10000)
  },
  [mutation.PAGE_LOOKUP](state, lookups) {
    state.areaLookup = lookups
  },
  [mutation.POS_MOVE_TABLE_SELECTION](state, tableDetails) {
    state.POSMoveTableSelection = tableDetails
  },
  [mutation.RESERVATION_RESPONSE](state, reservation) {
    state.statusFlag = Math.random()
    state.reservationId = reservation.id
    localStorage.setItem('reservationId', reservation.id)
  },
  /*RESERVATION_RESPONSE_MOVE_ITEMS(state, reservation) {
    state.statusFlag = Math.random()
    state.moveItemReservationId = reservation.id
    localStorage.setItem('moveItemReservationId', reservation.id)
  },*/
  MOVE_ITEM_TABLE_ID(state, tableId) {
    state.moveItemTableId = tableId
  },
  [mutation.CURRENT_TABLE_RESERVATION](state, reservationData) {
    state.currentTableReservationData = reservationData
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
    state.activeArea = false
  },
  [mutation.PROCESSING_SPLIT](state, status) {
    state.processingSplit = status
  },
  [mutation.KITCHEN_PRINT](state, status) {
    state.kitchenPrint = status
  },
  [mutation.SELECTED_TABLE_RESERVATION](state, reservationData) {
    state.selectedTableRservationData = reservationData
  },
  [mutation.UPDATE_ITEM_GUEST](state, { item, guest, action }) {
    switch (action) {
      case 'add':
        {
          let bills = {}
          if (state.bills) {
            bills = { ...state.bills }
          }
          bills[item] = []
          bills[item].push(guest)
          state.bills = bills
        }
        break
      case 'update':
        {
          let bills = { ...state.bills }
          bills[item].push(guest)
          state.bills = bills
        }
        break
      case 'remove': {
        let bills = { ...state.bills }
        const itemGuests = bills[item].filter(itemGuest => itemGuest != guest)
        bills[item] = itemGuests
        state.bills = bills
        break
      }
    }
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

import * as mutation from './dinein/mutation-types'
import DineInService from '@/services/data/DineInService'
import LookupData from '@/plugins/helpers/LookupData'

const state = {
  orders:false,
  areas:false,
  tables:false,
  activeArea:false,
  loading:false,
  tablesOnArea:false,
  tableStatus:false,
  tableOrders:false,
}
const getters = {}

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
  getDineInArea({ commit }) {
    DineInService.dineAreas().then(response => {
      commit(mutation.DINE_IN_AREAS, response.data)
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
    let OrderOnTable = false
    state.tablesOnArea.forEach(table => {
      alert(table._id)
      let orderId = state.orders.data.filter(order => function () {
        if(order.table_id === table._id) {
          return order._id
        }
      })
      let orderStatus = LookupData.get({
        collection: state.orders.page_lookups.orders._id,
        matchWith: orderId,
        selection: false,
      })
      console.log(orderStatus)
      // let order =state.orders.page_lookups

    })
    commit(mutation.TABLE_STATUS, 'abc')
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
import * as mutation from './holdOrders/mutation-types'
import HoldListService from '@/services/data/HoldListService'

const state = {
  getHoldOrders: {},
}

const getters = {}

const actions = {
  getHoldOrders({ commit, rootState }) {
    const params = [
      rootState.location.location,
      rootState.sync.date,
      rootState.sync.compress,
    ]
    HoldListService.fetchAll(...params).then(response => {
      commit(mutation.GET_HOLD_ORDERS, response.data)
    })
  },
}

const mutations = {
  [mutation.GET_HOLD_ORDERS](state, holdOrders) {
    state.getHoldOrders = holdOrders
  },
}

export default {
  namespaced: true,
  actions,
  state,
  mutations,
  getters,
}

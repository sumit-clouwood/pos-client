import * as mutation from './loyalty/mutation-types'
import LoyaltyService from '@/services/data/LoyaltyService'

const state = {
  loyalty: false,
  loyaltyCustomerList: false,
}
const getters = {}
const actions = {
  fetchAll({ commit, rootState }) {
    const params = [rootState.location.location]
    LoyaltyService.checkLoyaltyLocation(...params).then(response => {
      commit(mutation.LOYALTY, response.data.data)
    })
  },
  searchCustomer({ commit }, searchTerm) {
    LoyaltyService.searchCustomer(searchTerm).then(response => {
      commit(mutation.LOYALTY_CUSTOMERS, response.data)
    })
  },
}
const mutations = {
  [mutation.LOYALTY](state, loyalty) {
    state.loyalty = loyalty
  },
  [mutation.LOYALTY_CUSTOMERS](state, customerList) {
    state.loyaltyCustomerList = customerList
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

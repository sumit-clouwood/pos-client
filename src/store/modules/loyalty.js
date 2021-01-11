import * as mutation from './loyalty/mutation-types'
import LoyaltyService from '@/services/data/LoyaltyService'

const state = {
  loyalty: false,
  loyaltyCustomerList: false,
  customer_status: '',
}
const getters = {}
const actions = {
  fetchAll({ commit, rootState }) {
    const params = [rootState.location.location]
    LoyaltyService.checkLoyaltyLocation(...params).then(response => {
      commit(mutation.LOYALTY, response.data.data)
    })
  },
  createCustomer({ commit }, data) {
    return new Promise(resolve => {
      return LoyaltyService.loyaltyCreateCustomer(data).then(response => {
        commit('CREATE_CUSTOMER_STATES', response.data)
        resolve(response)
      })
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
  CREATE_CUSTOMER_STATES: (state, customer_status) =>
    (state.customer_status = customer_status),
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

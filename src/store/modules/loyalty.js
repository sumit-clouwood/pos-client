import * as mutation from './loyalty/mutation-types'
import LoyaltyService from '@/services/data/LoyaltyService'

const state = {
  loyalty: false,
  loyaltyCustomerList: false,
  customer_status: '',
  loader: false,
}
const getters = {}
const actions = {
  fetchAll({ commit, rootState }) {
    const params = [rootState.location.location]
    LoyaltyService.checkLoyaltyLocation(...params).then(response => {
      commit(mutation.LOYALTY, response.data.data)
    })
  },
  createCustomer({ commit, dispatch }, data) {
    commit('LOADER', true)
    return new Promise((resolve, reject) => {
      return LoyaltyService.loyaltyCreateCustomer(data)
        .then(response => {
          commit('CREATE_CUSTOMER_STATES', response.data)
          resolve(response)
          dispatch('customer/fetchSelectedCustomer', response.data.id, {
            root: true,
          })
          commit('LOADER', false)
        })
        .catch(err => {
          commit('CREATE_CUSTOMER_STATES', err.data)
          resolve(err)
          reject(err)
          commit('LOADER', false)
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
  LOADER: (state, loader) => (state.loader = loader),
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

import * as mutation from './loyalty/mutation-types'
import LoyaltyService from '@/services/data/LoyaltyService'

const state = {
  loyalty: false
}
const getters = {}
const actions = {
  fetchAll({ commit, rootState }) {
    const params = [rootState.location.location]
    LoyaltyService.checkLoyaltyLocation(...params).then(response => {
      console.log(response.data)
      commit(mutation.LOYALTY, response.data.data)
    })
  }
}
const mutations = {
  [mutation.LOYALTY](state, status) {
    state.loyalty = status
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
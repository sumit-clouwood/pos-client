import * as mutation from './loyalty/mutation-types'
import LoyaltyService from '@/services/data/LoyaltyService'

const state = {
  loyalty: false,
}
const getters = {}
const actions = {
  fetchLoyalty({ commit, rootState }) {
    const params = [rootState.location.location]
    LoyaltyService.checkLoyaltyLocation(...params).then(respons => {
      commit(mutation.LOYALTY, respons.data)
    })
  },
}
const mutations = {
  [mutation.LOYALTY](state, status) {
    state.loyalty = status
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

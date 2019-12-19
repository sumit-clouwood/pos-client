import TaxService from '@/services/data/TaxService'

const state = {
  taxes: [],
}

const getters = {
  getTax: state => item => {
    return state.taxes.find(item)
  },
}

const actions = {
  fetchAll({ commit, rootState }) {
    TaxService.fetchAll(rootState.order.orderType.OTApi).then(response => {
      //If taxes available for location.
      if (response.data.data.length) {
        commit('SET_TAXES', response.data.data)
      }
    })
  },

  reset({ commit }) {
    commit('RESET')
  },
}

const mutations = {
  SET_TAXES(state, taxes) {
    state.taxes = taxes
  },
  RESET(state) {
    state.taxes = []
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

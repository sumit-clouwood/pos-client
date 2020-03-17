import * as mutation from './combo/mutation-types'

const state = {
  comboItemsList: {},
}

const actions = {}

const getters = {}

const mutations = {
  [mutation.SET_COMBO_ITEMS](state, comboItems) {
    state.comboItemsList = comboItems
  },
}

export default {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
}

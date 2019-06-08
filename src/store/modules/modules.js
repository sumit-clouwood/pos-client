// initial state
import * as mutation from './modules/mutation-types'

const state = {
  enabledModules: [],
}

// getters
const getters = {
  enabled: state => module => state.enabledModules.includes(module),
}

// actions
const actions = {}

// mutations
const mutations = {
  [mutation.SET_ENABLED_MODULES](state, modules) {
    state.enabledModules = modules
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

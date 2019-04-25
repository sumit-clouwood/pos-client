// initial state
import * as mutation from './context/mutation-types'

const state = {
  brand: null,
  store: null,
}

// getters
const getters = {
  url: state => {
    if (state.brand) {
      if (state.store) {
        return `/${state.brand._id}/${state.store._id}/`
      }
      return `/${state.brand._id}/`
    } else {
      return '/'
    }
  },
}

// actions
const actions = {}

// mutations
const mutations = {
  [mutation.SET_BRAND](state, brand) {
    state.error = brand
  },
  [mutation.SET_STORE](state, store) {
    state.error = store
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

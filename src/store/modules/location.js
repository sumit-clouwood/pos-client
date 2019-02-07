// initial state
const state = {
  location : "5a7c0d5014d488258b134a72"
}

// getters
const getters = {}

// actions
const actions = {
  
}

// mutations
const mutations = {
  updateLocation (state, location) {
    state.location = location
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
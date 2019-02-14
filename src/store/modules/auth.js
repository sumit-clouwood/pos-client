import DataService from '@/services/DataService'

// initial state
const state = {
  token: null
}

// getters
const getters = {}

// actions
const actions = {
  auth ({ commit }) {
    return new Promise((resolve, reject) => {
      DataService.auth(process.env).then(token => {
        commit('setToken', token)
        DataService.applyMiddleWare(state.token);
        token ? resolve() : reject()
      })
    })    
  }
}

// mutations
const mutations = {
  setToken (state, token) {
    state.token = token
  },

  refreshToken (state, { token }) {
    state.token = token
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
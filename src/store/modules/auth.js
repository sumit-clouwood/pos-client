import DataService from '@/services/DataService'
import * as mutation from './user/mutation-types'

// initial state
const state = {
  token: null,
  userDetails: null,
}

// getters
const getters = {}

// actions
const actions = {
  auth({ commit }, deviceId) {
    return new Promise((resolve, reject) => {
      DataService.auth(process.env, deviceId)
        .then(response => {
          if (!response.data.token) {
            reject(response.data.error)
            return false
          }
          commit('setToken', response.data.token)
          DataService.applyMiddleWare(state.token)

          commit(mutation.SET_USER_DETAILS, response.data.data)
          resolve(response)
        })
        .catch(error => reject(error))
    })
  },
}

// mutations
const mutations = {
  setToken(state, token) {
    state.token = token
  },

  refreshToken(state, { token }) {
    state.token = token
  },

  [mutation.SET_USER_DETAILS](state, details) {
    state.userDetails = details
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

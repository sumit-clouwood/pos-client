import AuthService from '@/services/data/AuthService'
import * as mutation from './user/mutation-types'

// initial state
const state = {
  token: null,
  deviceId: null,
  refreshToken: null,
}

// getters
const getters = {}

// actions
const actions = {
  auth({ commit }, deviceId) {
    return new Promise((resolve, reject) => {
      AuthService.getAccess(process.env, deviceId)
        .then(response => {
          if (!response.data.token) {
            reject(response.data.error)
            return false
          }
          commit(mutation.SET_TOKEN, response.data.token)
          commit(mutation.SET_DEVICE_CODE, deviceId)
          resolve(response)
        })
        .catch(error => reject(error))
    })
  },
}

// mutations
const mutations = {
  [mutation.SET_TOKEN](state, token) {
    state.token = token
  },

  [mutation.SET_REFRESH_TOKEN](state, { token }) {
    state.refreshToken = token
  },
  [mutation.SET_DEVICE_CODE](state, code) {
    state.deviceId = code
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

import AuthService from '@/services/data/AuthService'
import * as mutation from './user/mutation-types'

// initial state
const state = {
  token: null,
  deviceId: null,
  refreshToken: null,
  rolePermissions: null,
  userDetails: false,
  permissions: false,
}

// getters
const getters = {
  getRole: state => startPath => {
    return state.rolePermissions.find(user => user.start_path === startPath)
  },
}

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
          AuthService.getRoles().then(rolesPermissions => {
            commit(mutation.SET_ROLE_DETAILS, rolesPermissions.data.data)
          })
          commit(mutation.SET_TOKEN, response.data.token)
          commit(mutation.SET_DEVICE_CODE, deviceId)
          resolve(response)
        })
        .catch(error => reject(error))
    })
  },

  logout() {
    localStorage.setItem('token', '')
    AuthService.logout().then(() => (window.location = '/'))
  },

  getUserDetails({ commit }, userId) {
    if (userId) {
      AuthService.userDetails(userId).then(response => {
        commit(mutation.USER_DETAILS, response.data)
      })
    }
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
  [mutation.SET_ROLE_DETAILS](state, rolePermissions) {
    state.rolePermissions = rolePermissions
  },
  [mutation.USER_DETAILS](state, userDetails) {
    state.userDetails = userDetails
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

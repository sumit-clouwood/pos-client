import DataService from '@/services/DataService'
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
    if (state.rolePermissions) {
      return state.rolePermissions.find(user => user.start_path === startPath)
    }
  },
  loggedIn: state => {
    return state.token
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
          commit(mutation.SET_TOKEN, response.data.token)
          commit(mutation.SET_DEVICE_CODE, deviceId)
          resolve(response)
        })
        .catch(error => reject(error))
    })
  },
  login({ commit }, data) {
    return new Promise((resolve, reject) => {
      AuthService.login(data)
        .then(response => {
          if (!response.data.token) {
            reject(response.data.error)
            return false
          }
          commit(mutation.SET_TOKEN, response.data.token)
          localStorage.setItem('token', response.data.token)
          resolve()
        })
        .catch(error => reject(error))
    })
  },
  checkLogin({ commit, rootGetters }) {
    return new Promise((resolve, reject) => {
      if (localStorage.getItem('token')) {
        commit(mutation.SET_TOKEN, localStorage.getItem('token'))

        if (localStorage.getItem('brand_id')) {
          commit('context/SET_BRAND_ID', localStorage.getItem('brand_id'), {
            root: true,
          })
          commit('context/SET_STORE_ID', localStorage.getItem('store_id'), {
            root: true,
          })
        }

        DataService.setContext({
          brand: rootGetters['context/brand'],
          store: rootGetters['context/store'],
        })
        resolve()
      } else {
        reject('No token found in localstorage')
      }
    })
  },
  logout({ commit, rootGetters }) {
    localStorage.setItem('token', '')
    localStorage.setItem('brand_id', '')
    localStorage.setItem('store_id', '')
    AuthService.logout().then(() => {
      commit('context/RESET', null, { root: true })
      DataService.setContext({
        brand: rootGetters['context/brand'],
        store: rootGetters['context/store'],
      })

      commit('sync/reset', {}, { root: true })

      commit(mutation.SET_TOKEN, false)
    })
  },

  getUserDetails({ commit }, userId) {
    if (userId) {
      AuthService.userDetails(userId)
        .then(response => {
          commit(mutation.USER_DETAILS, response.data)
        })
        .catch(error => {
          //if refresh token faild log out user here
          return Promise.reject(error)
        })
    }
  },
  fetchRoles({ commit }) {
    AuthService.getRoles().then(rolesPermissions => {
      commit(mutation.SET_ROLE_DETAILS, rolesPermissions.data.data)
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

import DataService from '@/services/DataService'
import AuthService from '@/services/data/AuthService'
import * as mutation from './user/mutation-types'
//import db from '@/services/network/DB'

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
  login({ commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      AuthService.login(data)
        .then(response => {
          if (!response.data.token) {
            reject(response.data.error)
            return false
          }

          localStorage.setItem('token', response.data.token)
          //wait for localstorage to be updated
          setTimeout(() => {
            dispatch('location/setContext', null, { root: true }).then(() => {
              commit(mutation.SET_TOKEN, response.data.token)
              resolve()
            })
          }, 100)
          //resolve()
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
  logout({ commit }) {
    if (localStorage.getItem('token')) {
      localStorage.setItem('token', '')
      localStorage.setItem('brand_id', '')
      localStorage.setItem('store_id', '')

      commit(mutation.RESET)

      commit('order/RESET', null, { root: true })
      commit('checkout/RESET', null, { root: true })
      commit('context/RESET', null, { root: true })
      commit('customer/RESET', null, { root: true })
      commit('sync/reset', {}, { root: true })
      commit('location/RESET', true, { root: true })

      DataService.setContext({
        brand: null,
        store: null,
      })

      AuthService.logout().then(() => {})
    }
  },

  getUserDetails({ commit }, userId) {
    if (userId) {
      AuthService.userDetails(userId).then(response => {
        commit(mutation.USER_DETAILS, response.data)
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
  [mutation.RESET](state) {
    state.token = null
    state.deviceId = null
    state.refreshToken = null
    state.rolePermissions = null
    state.userDetails = false
    state.permissions = false
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

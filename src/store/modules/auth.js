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
  cashiers: [],
  cashierEmail: '',
  searchKeyword: '',
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
  cashiers: (state, getters, rootState) =>
    state.cashiers.filter(cashier => {
      if (state.searchKeyword) {
        if (cashier.name.toLowerCase().indexOf(state.searchKeyword) == -1) {
          return false
        }
      }
      return cashier.brand_stores.includes(rootState.context.storeId)
    }),
  cashier: state => loginInfo =>
    state.cashiers.find(cashier => cashier._id === loginInfo.user_id),
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
              resolve(response.data.token)
            })
          }, 100)
          //resolve()
        })
        .catch(error => reject(error))
    })
  },
  pinlogin({ commit, state, getters }, cashierpin) {
    return new Promise((resolve, reject) => {
      AuthService.pinlogin({
        email: state.cashierEmail,
        swipe_card: cashierpin,
      })
        .then(response => {
          localStorage.setItem('token', response.data.token)
          commit(mutation.SET_TOKEN, response.data.token)

          commit(mutation.USER_DETAILS, {
            item: getters.cashier(response.data.user),
          })
          resolve()
        })
        .catch(error => {
          reject(error)
        })
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
  logout({ commit }, msg) {
    if (localStorage.getItem('token') || msg == 'token_not_exists') {
      localStorage.setItem('token', '')
      localStorage.setItem('brand_id', '')
      localStorage.setItem('store_id', '')

      commit(mutation.RESET)

      commit('order/RESET', true, { root: true })
      commit('checkout/RESET', true, { root: true })
      commit('context/RESET', null, { root: true })
      commit('customer/RESET', null, { root: true })
      commit('sync/reset', {}, { root: true })
      commit('location/RESET', true, { root: true })
      commit('holdOrders/RESET', true, { root: true })
      commit('announcement/RESET', true, { root: true })
      commit('discount/RESET', true, { root: true })
      commit('category/RESET', true, { root: true })
      commit('modifier/RESET', true, { root: true })
      commit('payment/RESET', true, { root: true })
      commit('surcharge/RESET', true, { root: true })
      commit('invoice/RESET', true, { root: true })
      commit('dinein/RESET', null, { root: true })

      DataService.setContext({
        brand: null,
        store: null,
      })

      AuthService.logout(msg).then(() => {})
    }
  },

  getUserDetails({ commit }, userId) {
    return new Promise((resolve, reject) => {
      if (userId) {
        AuthService.userDetails(userId).then(response => {
          commit(mutation.USER_DETAILS, response.data)
          resolve()
        })
      } else {
        reject()
      }
    })
  },
  fetchRoles({ commit, getters }) {
    AuthService.getRoles().then(rolesPermissions => {
      commit(mutation.SET_ROLE_DETAILS, rolesPermissions.data.data)
      const cashierRole = getters.getRole('pos')
      AuthService.getUsers(cashierRole._id).then(cashiers => {
        commit(mutation.SET_CASHIERS, cashiers.data.data)
      })
    })
  },
}

// mutations
const mutations = {
  [mutation.SET_TOKEN](state, token) {
    state.token = token
  },

  [mutation.SET_CASHIER_EMAIL](state, email) {
    state.cashierEmail = email
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
  [mutation.SET_CASHIERS](state, cashiers) {
    state.cashiers = cashiers
  },
  setSearchKeyword(state, value) {
    state.searchKeyword = value
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

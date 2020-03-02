import DataService from '@/services/DataService'
import AuthService from '@/services/data/AuthService'
import * as mutation from './user/mutation-types'
import * as PERMS from '@/const/permissions'
//import db from '@/services/network/DB'

// initial state
const state = {
  token: null,
  deviceId: null,
  refreshToken: null,
  rolePermissions: null,
  userDetails: { item: false },
  permissions: false,
  waiters: [],
  cashiers: [],
  cashierEmail: '',
  searchKeyword: '',
  logoutAction: '',
  brandAccessType: false,
  availableStoreGroups: false,
  storeGroupId: false,
  storeUsers: [],
  role: null,
  cashierRoleId: false,
  offlinePinCode: null,
}

// getters

const getters = {
  allowed: state => resource => {
    if (!state.role) {
      //super admin
      return true
    }
    if (resource) {
      let allowed = state.role.store_permissions.find(perm => perm === resource)
      if (!allowed) {
        //find in brand permissions
        allowed = state.role.brand_permissions.find(perm => perm === resource)
      }
      return allowed
    }
    return false
  },
  multistore: state =>
    state.brandAccessType === 'store_group' ||
    (!['all', 'store', 'country'].includes(state.brandAccessType) &&
      state.availableStoreGroups &&
      state.availableStoreGroups.length),
  roleName: state => {
    if (!state.userDetails) {
      return ''
    }
    if (state.userDetails.item) {
      const roleId = state.userDetails.item.brand_role
      if (roleId && state.rolePermissions) {
        const role = state.rolePermissions.find(role => role._id === roleId)
        return role ? role.name : ''
      }
    }
    return ''
  },
  brandRoleId() {
    if (!state.userDetails) {
      return ''
    }
    return state.userDetails.item.brand_role
  },
  waiter: (state, getters) => getters.roleName === 'Waiter',
  carhop: (state, getters) => getters.roleName === 'Carhop User',
  getRole: state => roleName => {
    if (state.rolePermissions) {
      return state.rolePermissions.find(role => role.name === roleName)
    }
  },
  getRoleByPermission: state => permission => {
    if (state.rolePermissions) {
      return state.rolePermissions.filter(role => {
        let allowed = role.store_permissions.find(
          rolePermission => rolePermission === permission
        )

        if (!allowed) {
          //find in brand permissions
          allowed = role.brand_permissions.find(
            rolePermission => rolePermission === permission
          )
        }
        if (allowed) {
          return role
        }
        return false
      })
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
  pinlogin({ commit, dispatch, rootGetters }, { pincode, brand, store }) {
    return new Promise((resolve, reject) => {
      AuthService.pinlogin({
        //email: state.cashierEmail,
        store_id: store,
        brand_id: brand,
        swipe_card: pincode,
      })
        .then(response => {
          localStorage.setItem('token', response.data.token)
          commit(mutation.SET_TOKEN, response.data.token)

          commit('context/SET_BRAND_ID', brand, {
            root: true,
          })
          commit('context/SET_STORE_ID', store, {
            root: true,
          })

          DataService.setContext({
            brand: rootGetters['context/brand'],
            store: rootGetters['context/store'],
          })
          dispatch('getUserDetails', response.data.user.user_id)
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
    return new Promise(resolve => {
      localStorage.setItem('token', '')
      localStorage.setItem('brand_id', '')
      localStorage.setItem('store_id', '')

      commit(mutation.RESET)
      commit(mutation.LOGOUT_ACTION, '')

      commit('order/RESET', true, { root: true })
      commit('checkout/RESET', true, { root: true })
      commit('context/RESET', null, { root: true })
      commit('customer/RESET', {}, { root: true })
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

      if (localStorage.getItem('token') || msg == 'token_not_exists') {
        AuthService.logout(msg).then(() => {})
      }

      resolve()
    })
  },

  getUserDetails({ commit, dispatch }, userId) {
    return new Promise((resolve, reject) => {
      if (userId) {
        AuthService.userDetails(userId).then(response => {
          commit(mutation.USER_DETAILS, response.data)

          dispatch('fetchRoles').then(() => {
            dispatch('setCurrentRole')
            dispatch('fetchAllStoreUsers')
          })

          dispatch('announcement/fetchAll', response.data, {
            root: true,
          }).then(() => {})
          resolve(response.data)
        })
      } else {
        reject()
      }
    })
  },
  fetchRoles({ commit, getters }) {
    return new Promise(resolve => {
      AuthService.getRoles().then(rolesPermissions => {
        resolve(rolesPermissions.data.data)
        commit(mutation.SET_ROLE_DETAILS, rolesPermissions.data.data)
        let cashier = rolesPermissions.data.data.find(
          value => value.name === 'Cashier'
        )
        commit('SET_CASHIER_ROLE_ID', cashier._id)
        const roles = getters.getRoleByPermission(PERMS.WAITER)
        roles.forEach(role => {
          AuthService.getUsers(role._id).then(users => {
            commit(mutation.ADD_WAITERS, users.data.data)
          })
        })
      })
    })
  },
  fetchAllStoreUsers({ state, commit }) {
    return new Promise(resolve => {
      AuthService.getStoreUsers(
        'brand_users_main_tbl',
        true,
        state.cashierRoleId
      ).then(response => {
        resolve(response)
        commit('SET_STORE_USERS', response.data.data)
        commit('location/SET_BRAND_STORES', response.data.page_lookups.stores, {
          root: true,
        })
      })
    })
  },
  // eslint-disable-next-line no-unused-vars
  filterUserInOffline({ state, commit, dispatch, rootGetters }, encryptedPin) {
    let user = { item: false }
    user.item = state.storeUsers.filter(user => {
      return user.e_swipe_card === encryptedPin
    })[0]
    if (user.item) {
      commit(mutation.USER_DETAILS, user)
      dispatch('setCurrentRole')
      let randomToken =
        Math.random()
          .toString(36)
          .slice(2)
          .toUpperCase() +
        Math.random()
          .toString(36)
          .slice(2)
      localStorage.setItem('token', randomToken)
      commit(mutation.SET_TOKEN, randomToken)

      if (
        localStorage.getItem('brand_id') &&
        localStorage.getItem('store_id')
      ) {
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
    }
    return user
  },
  setCurrentRole({ state, commit }) {
    const currentRole = state.rolePermissions.find(
      role => role._id === state.userDetails.item.brand_role
    )
    commit(mutation.SET_ROLE, currentRole)
  },
}

// mutations
const mutations = {
  [mutation.SET_TOKEN](state, token) {
    state.token = token
  },

  [mutation.LOGOUT_ACTION](state, action) {
    state.logoutAction = action
    localStorage.setItem('logoutAction', action)
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
    if (
      userDetails.item &&
      userDetails.item.brand_access_type &&
      userDetails.item.store_group
    ) {
      state.brandAccessType = state.userDetails.item.brand_access_type
      state.storeGroup = state.userDetails.item.store_group
    }
  },
  [mutation.ADD_WAITERS](state, waiters) {
    state.waiters = [...state.waiters, ...waiters]
  },
  [mutation.AVAILABLE_STORE_GROUPS](state, availableStoreGroups) {
    state.availableStoreGroups = availableStoreGroups
  },
  [mutation.SET_ROLE](state, role) {
    state.role = role
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
  [mutation.SET_STORE_USERS](state, storeUsers) {
    state.storeUsers = storeUsers
  },
  [mutation.SET_CASHIER_ROLE_ID](state, cashierRoleId) {
    state.cashierRoleId = cashierRoleId
  },
  [mutation.SET_OFFLINE_PIN](state, offlinePinCode) {
    state.offlinePinCode = offlinePinCode
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

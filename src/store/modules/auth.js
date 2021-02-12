import DataService from '@/services/DataService'
import AuthService from '@/services/data/AuthService'
import * as mutation from './user/mutation-types'
import * as PERMS from '@/const/permissions'
//import db from '@/services/network/DB'

// initial state
const getDefaults = () => {
  return {
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
    brandAccessType: false,
    availableStoreGroups: false,
    storeGroupId: false,
    storeUsers: [],
    role: null,
    cashierRoleId: false,
    offlinePinCode: null,
    deviceType: false,
    currentLoggedInUserId: undefined,
  }
}
const state = getDefaults()
// getters

const getters = {
  current_user: state => state.userDetails.item,
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
  checkDevice({ commit }) {
    //Detect IOS device WebViews
    let standalone = window.navigator.standalone,
      userAgent = window.navigator.userAgent.toLowerCase(),
      safari = /safari/.test(userAgent),
      ios = /dims_kot_app/.test(userAgent)
    // ios = true
    // ios = /android|iphone|ipod|ipad/.test(userAgent)
    /*ios =
        /android|iPad|iPhone|iPod/.test(userAgent) ||
        /android|iPad|iPhone|iPod/.test(navigator.platform) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)*/
    let objDevice = {
      userAgent: userAgent,
      browserType: safari,
      osType: ios,
      standalone: standalone,
      platform: navigator.platform,
      maxTouchPoints: navigator.maxTouchPoints,
    }
    // eslint-disable-next-line no-console
    console.log('objDevice', objDevice)
    localStorage.setItem('objDevice', JSON.stringify(objDevice))
    commit(mutation.DEVICE_TYPE, objDevice)
  },
  login({ commit }, data) {
    return new Promise((resolve, reject) => {
      AuthService.login(data)
        .then(response => {
          if (!response.data.token) {
            reject(response.data.error)
            return false
          }
          commit('SET_CURRENT_LOGGED_IN_USER_ID', response.data.user.user_id)
          localStorage.setItem('token', response.data.token)
          localStorage.setItem('userid', response.data.user.user_id)
          //wait for localstorage to be updated
          setTimeout(() => {
            commit(mutation.SET_TOKEN, response.data.token)
            resolve(response.data.token)
          }, 100)

          //wait for localstorage to be updated
        })
        .catch(error => reject(error))
    })
  },
  pinlogin({ commit, rootGetters }, { pincode }) {
    return new Promise((resolve, reject) => {
      let data = {
        swipe_card: pincode,
      }
      data['store_id'] = rootGetters['context/store_id']
      data['brand_id'] = rootGetters['context/brand_id']
      AuthService.pinlogin(data)
        .then(response => {
          commit('SET_CURRENT_LOGGED_IN_USER_ID', response.data.user.user_id)
          localStorage.setItem('userid', response.data.user.user_id)
          localStorage.setItem('token', response.data.token)
          commit(mutation.SET_TOKEN, response.data.token)
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
        commit('SET_CURRENT_LOGGED_IN_USER_ID', localStorage.getItem('userid'))

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
  changePassword({ state, commit }, data) {
    return new Promise((resolve, reject) => {
      DataService.post(
        `/model/users/id/${state.userDetails.item._id}/change_pass_action_self`,
        data,
        false
      )
        .then(resp => {
          if (resp.data.form_errors) {
            reject(resp.data.form_errors)
          }

          AuthService.userDetails(state.userDetails.item._id)
            .then(response => {
              commit(mutation.USER_DETAILS, response.data)
              resolve(response)
            })
            .catch(error => reject(error))
        })
        .catch(error => reject(error))
    })
  },
  changeNameEmail({ state, commit }, data) {
    return new Promise((resolve, reject) => {
      DataService.post(
        `/model/users/id/${state.userDetails.item._id}/change_name_email_action_self`,
        data,
        false
      )
        .then(resp => {
          if (resp.data.form_errors) {
            reject(resp.data.form_errors)
          }

          AuthService.userDetails(state.userDetails.item._id)
            .then(response => {
              commit(mutation.USER_DETAILS, response.data)
              resolve(response)
            })
            .catch(error => reject(error))
        })
        .catch(error => reject(error))
    })
  },
  changeAvatar({ state }, data) {
    return new Promise((resolve, reject) => {
      DataService.post(
        `/model/users/id/${state.userDetails.item._id}/change_avatar_self`,
        data,
        false
      )
        .then(response => resolve(response))
        .catch(error => reject(error))
    })
  },
  resetModules({ commit }) {
    commit('order/RESET', true, { root: true })
    commit('checkout/RESET', true, { root: true })
    commit('customer/RESET', {}, { root: true })
    commit('invoice/RESET', true, { root: true })
    commit('dinein/RESET', null, { root: true })
    commit('holdOrders/RESET', true, { root: true })
    commit('announcement/RESET', true, { root: true })
    commit('discount/RESET', true, { root: true })
    commit('category/RESET', true, { root: true })
    commit('modifier/RESET', true, { root: true })
    commit('surcharge/RESET', true, { root: true })
    commit('payment/RESET', true, { root: true })
  },
  logout({ commit, dispatch, rootGetters }, data = {}) {
    return new Promise(resolve => {
      localStorage.setItem('token', '')
      localStorage.setItem('brand_id', '')
      localStorage.setItem('store_id', '')
      commit(mutation.RESET)

      dispatch('resetModules')
      commit('customer/IS_BRAND_HAS_DELIVERY_ORDER', true, { root: true })
      commit('sync/reset', {}, { root: true })
      commit('location/RESET', true, { root: true })
      commit('location/USER_SHORT_DETAILS', true, { root: true }) // added  here because it should not reset when checkout, its hide user details

      //preserve brand_id which is needed for switch cashier api
      commit('context/RESET', data, { root: true })

      DataService.setContext({
        brand: rootGetters['context/brand'],
        store: rootGetters['context/store'],
      })

      AuthService.logout().then(() => {})

      resolve()
    })
  },

  getUserDetails({ commit, state }, userId) {
    return new Promise(resolve => {
      if (!userId) {
        userId = state.currentLoggedInUserId
      }
      AuthService.userDetails(userId).then(response => {
        commit(mutation.USER_DETAILS, response.data)
        resolve(response.data)
      })
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
    return new Promise((resolve, reject) => {
      let user = { item: false }
      user.item = state.storeUsers.filter(user => {
        return user.e_swipe_card === encryptedPin
      })[0]
      const brandId = localStorage.getItem('brand_id')
      const storeId = localStorage.getItem('store_id')
      if (!user.item) {
        reject('Invalid user credentials')
      } else if (!brandId || !storeId) {
        reject('Brand or store not found')
      } else {
        if (!user.item.brand_stores.includes(storeId)) {
          reject('Forbidden, store is not accessible')
        } else {
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
          commit('context/SET_BRAND_ID', brandId, {
            root: true,
          })
          commit('context/SET_STORE_ID', storeId, {
            root: true,
          })

          DataService.setContext({
            brand: rootGetters['context/brand'],
            store: rootGetters['context/store'],
          })
          resolve(user)
        }
      }
    })
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
  [mutation.DEVICE_TYPE](state, deviceType) {
    state.deviceType = deviceType
  },
  setSearchKeyword(state, value) {
    state.searchKeyword = value
  },
  [mutation.RESET](state) {
    Object.assign(state, getDefaults())
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
  SET_CURRENT_LOGGED_IN_USER_ID(state, id) {
    state.currentLoggedInUserId = id
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

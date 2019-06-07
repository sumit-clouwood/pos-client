import AuthService from '@/services/data/AuthService'
import * as mutation from './user/mutation-types'
import db from '@/services/network/DB'

// initial state
const state = {
  token: null,
  refreshToken: null,
  userDetails: null,
  deviceCode: false,
  franchiseCode: false,
  lastOrderNo: false,
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

          commit(mutation.SET_USER_DETAILS, response.data.user)
          commit(mutation.SET_DEVICE_CODE, response.data.device_code)
          commit(mutation.SET_FRANCHISE_CODE, response.data.franchise_code)
          commit(mutation.SET_LAST_ORDER_NO, response.data.last_order_no || 0)

          if (response.data.brand_id) {
            commit('context/SET_BRAND_ID', response.data.brand_id, {
              root: true,
            })
            commit('context/SET_STORE_ID', response.data.store_id, {
              root: true,
            })
          }

          const data = {
            user: state.userDetails,
            deviceId: deviceId,
            token: state.token,
            deviceCode: state.deviceCode,
            franchiseCode: state.franchiseCode,
            lastOrderNo: state.lastOrderNo,
          }

          db.getBucket('auth').then(bucket => {
            db.add(bucket, data)
              .then(() => {
                resolve(response)
              })
              .catch(error => reject(error))
          })
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

  [mutation.SET_USER_DETAILS](state, details) {
    state.userDetails = details
  },
  [mutation.SET_DEVICE_CODE](state, code) {
    state.deviceCode = code
  },
  [mutation.SET_FRANCHISE_CODE](state, code) {
    state.franchiseCode = code
  },
  [mutation.SET_LAST_ORDER_NO](state, orderNo) {
    state.lastOrderNo = orderNo
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

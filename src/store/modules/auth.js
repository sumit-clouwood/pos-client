import DataService from '@/services/DataService'
import * as mutation from './user/mutation-types'
import db from '@/services/network/DB'

// initial state
const state = {
  token: null,
  refreshToken: null,
  userDetails: null,
  deviceCode: false,
  franchiesCode: false,
  lastOrderNo: false,
}

// getters
const getters = {}

// actions
const actions = {
  validateToken({ commit }, token) {
    //check token expiry here,
    //if token is expired then use refresh token to regenrate the token
    return new Promise(resolve => {
      commit(mutation.SET_TOKEN, token)
      DataService.applyMiddleWare(state.token)
      resolve(token)
    })
  },
  auth({ commit, dispatch }, deviceId) {
    return new Promise((resolve, reject) => {
      //check if token already exists in indexedDB
      db.getBucket('auth')
        .then(bucket => {
          db.fetch(bucket)
            .then(data => {
              if (data && data[0]) {
                data = data[0]
                //validate that token against api in case we need to refresh token otherwise use it
                dispatch('validateToken', data.token).then(token => {
                  commit(mutation.SET_USER_DETAILS, data.user)
                  commit(mutation.SET_DEVICE_CODE, data.deviceCode)
                  commit(mutation.SET_FRANCHIES_CODE, data.franchiesCode)
                  commit(mutation.SET_LAST_ORDER_NO, data.lastOrderNo)

                  data.token = token
                  resolve(data)
                })
              } else {
                DataService.auth(process.env, deviceId)
                  .then(response => {
                    if (!response.data.token) {
                      reject(response.data.error)
                      return false
                    }
                    commit(mutation.SET_TOKEN, response.data.token)
                    DataService.applyMiddleWare(state.token)

                    commit(mutation.SET_USER_DETAILS, response.data.user)
                    commit(mutation.SET_DEVICE_CODE, response.data.device_code)
                    commit(
                      mutation.SET_FRANCHIES_CODE,
                      response.data.franchies_code
                    )
                    commit(
                      mutation.SET_LAST_ORDER_NO,
                      response.data.last_order_no || 0
                    )

                    const data = {
                      user: state.userDetails,
                      deviceId: deviceId,
                      token: state.token,
                      deviceCode: state.deviceCode,
                      franchiesCode: state.franchiesCode,
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
              }
            })
            .catch(error => reject(error))
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
  [mutation.SET_FRANCHIES_CODE](state, code) {
    state.franchiesCode = code
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

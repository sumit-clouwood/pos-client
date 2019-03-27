/* eslint-disable no-console */
import DataService from '@/services/DataService'
import * as mutation from './user/mutation-types'
import db from '@/services/network/DB'

// initial state
const state = {
  token: null,
  userDetails: null,
  deviceCode: false,
  franchiesCode: false,
  lastOrderNo: false,
}

// getters
const getters = {}

// actions
const actions = {
  auth({ commit, rootState }) {
    return new Promise((resolve, reject) => {
      //check if token already exists in indexedDB
      console.log('in auth')
      const idb = rootState.sync.idb
      console.log(idb)
      db.getBucket('auth')
        .then(bucket => {
          db.fetch(bucket)
            .then(data => {
              console.log('fetched data from auth db', data)
              if (data && data[0]) {
                data = data[0]
                //validate that token against api in case we need to refresh token otherwise use it
                commit('setToken', data.token)
                DataService.applyMiddleWare(state.token)

                commit(mutation.SET_USER_DETAILS, data.user)
                commit(mutation.SET_DEVICE_CODE, data.deviceCode)
                commit(mutation.SET_FRANCHIES_CODE, data.franchiesCode)
                commit(mutation.SET_LAST_ORDER_NO, data.lastOrderNo)

                resolve(data)
              } else {
                const deviceId = '34:79:A6:37:1F:C7'
                // const deviceId = 'XX:XX:XX:XX:XX:XX'.replace(/X/g, function() {
                //   return '0123456789ABCDEF'.charAt(
                //     Math.floor(Math.random() * 16)
                //   )
                // })

                DataService.auth(process.env, deviceId)
                  .then(response => {
                    if (!response.data.token) {
                      reject(response.data.error)
                      return false
                    }
                    commit('setToken', response.data.token)
                    DataService.applyMiddleWare(state.token)

                    commit(mutation.SET_USER_DETAILS, response.data.data)
                    commit(
                      mutation.SET_DEVICE_CODE,
                      response.data.data.device_code
                    )
                    commit(
                      mutation.SET_FRANCHIES_CODE,
                      response.data.data.franchies_code
                    )
                    commit(
                      mutation.SET_LAST_ORDER_NO,
                      response.data.data.last_order_no || 0
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
            .catch(err => console.log('error', err))
        })
        .catch(err => console.log('error', err))
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

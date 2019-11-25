import * as mutation from './dineinReservation/mutation-types'
import DineInService from '@/services/data/DineInService'

const state = {
  selectedReservationDate: false,
  reservations: false,
  userDetails: false,
  storeUsers: false,
  tags: false,
  params: { page: 1, limit: 9999 },
}
const getters = {
  getUTCDate: () => selectedDate => {
    let date = new Date(selectedDate)
    let day =
      date.getUTCDate() < 10 ? '0' + date.getUTCDate() : date.getUTCDate()
    return date.getUTCFullYear() + '-' + (date.getUTCMonth() + 1) + '-' + day
  },
}

const actions = {
  async getReservationByDate({ commit, getters, dispatch }, selectedDate) {
    return await new Promise((resolve, reject) => {
      let UTC_Date = getters.getUTCDate(selectedDate)
      commit(mutation.SELECTED_RESERVATION_DATE, UTC_Date)
      const params = [state.params.page, state.params.limit, UTC_Date]
      DineInService.bookedTables(...params)
        .then(response => {
          dispatch('getTags')
          if (response.data.count == 0) {
            reject()
          } else {
            commit(mutation.ALL_RESERVATIONS, response.data.data)
            resolve(true)
          }
        })
        .catch(() => {
          reject(false)
        })
    })
  },
  getUserDetails({ commit }, mobileNo) {
    DineInService.getDetails(mobileNo).then(resource => {
      commit(mutation.USER_DETAILS, resource.data)
    })
  },
  getTakenBy({ commit }) {
    DineInService.storeUsers().then(response => {
      commit(mutation.TAKEN_BY_LIST, response.data)
    })
  },
  getTags({ commit }) {
    DineInService.getReservationTags().then(response => {
      commit(mutation.TAGS, response.data)
    })
  },
}

const mutations = {
  [mutation.SELECTED_RESERVATION_DATE](state, selectedDate) {
    state.selectedReservationDate = selectedDate
  },
  [mutation.ALL_RESERVATIONS](state, reservationData) {
    state.reservations = reservationData
  },
  [mutation.USER_DETAILS](state, userDetails) {
    state.userDetails = userDetails
  },
  [mutation.TAKEN_BY_LIST](state, storeUsers) {
    state.storeUsers = storeUsers
  },
  [mutation.TAGS](state, tags) {
    state.tags = tags.data
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

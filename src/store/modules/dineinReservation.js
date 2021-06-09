import * as mutation from './dineinReservation/mutation-types'
import DineInService from '@/services/data/DineInService'
import DateTime from '@/plugins/helpers/DateTime'

const state = {
  selectedReservationDate: false,
  reservations: false,
  userHistory: false,
  storeUsers: false,
  tags: false,
  params: { page: 1, limit: 9999 },
  tableBookedStatus: [],
  selectedReservation: {
    status: 'booked',
    customers: [],
    number_of_guests: 1,
  },
}
const getters = {
  getUTCDate: () => selectedDate => {
    let date = new Date(selectedDate)
    let day =
      date.getUTCDate() < 10 ? '0' + date.getUTCDate() : date.getUTCDate()
    let setMonth =
      date.getUTCMonth() + 1 < 10
        ? '0' + (date.getUTCMonth() + 1)
        : date.getUTCMonth() + 1
    return date.getUTCFullYear() + '-' + setMonth + '-' + day
  },
}

const actions = {
  getReservationByDate({ commit, getters, dispatch, state }, selectedDate) {
    return new Promise((resolve, reject) => {
      let UTC_Date = getters.getUTCDate(selectedDate)
      // if (state.selectedReservationDate != UTC_Date) {
      commit(mutation.SELECTED_RESERVATION_DATE, UTC_Date)
      const params = [state.params.page, state.params.limit, UTC_Date, 'booked']
      DineInService.bookedTables(...params)
        .then(response => {
          /*I will move latter getTags to dinein for single call*/
          dispatch('getTags')
          /*if (response.data.count == 0) {
            reject()
          } else {*/
          commit(mutation.ALL_RESERVATIONS, response.data.data)
          resolve(true)
          // }
        })
        .catch(() => {
          reject(false)
        })
      // }
    })
  },
  getUserHistory({ commit }, mobileNo) {
    if (typeof mobileNo !== 'undefined') {
      return new Promise((resolve, reject) => {
        DineInService.getReservationByMobile(mobileNo)
          .then(response => {
            commit(mutation.USER_HISTORY, response.data)
            return resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  },
  editTable({ dispatch, state }, data) {
    return new Promise((resolve, reject) => {
      DineInService.editTableStatus(data)
        .then(response => {
          dispatch('getReservationByDate', state.selectedReservationDate)
          return resolve(response)
        })
        .catch(er => reject(er))
    })
  },
  /*getTakenBy({ commit }) {
    DineInService.storeUsers().then(response => {
      commit(mutation.TAKEN_BY_LIST, response.data)
    })
  },*/
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
    let bookingStatus = []
    let dateTime = new DateTime()
    reservationData.filter(reservation => {
      /*bookingStatus.push({
        start_time: dateTime.convertTime24to12(reservation.start_time),
        status: reservation.status,
      })*/
      bookingStatus.push(dateTime.convertTime24to12(reservation.start_time))
    })
    state.tableBookedStatus = bookingStatus
  },
  [mutation.USER_HISTORY](state, userHistory) {
    let history = []
    /*let fetchedData = {
      guest_email: '',
      guest_fname: '',
      guest_lname: '',
      // guest_phone: guestHistory.guest_phone,
    }*/
    if (userHistory) {
      userHistory.data.forEach(h => {
        history.push({
          start_date: h.start_date,
          start_time: h.start_time,
          status: h.status,
          des: 'NA',
        })
      })
      let guestHistory = userHistory.data[0]
      if (guestHistory) {
        let fetchedData = {
          guest_email: guestHistory.guest_email,
          guest_fname: guestHistory.guest_fname,
          guest_lname: guestHistory.guest_lname,
          guest_phone: guestHistory.guest_phone,
        }
        state.selectedReservation = Object.assign(
          {},
          state.selectedReservation,
          fetchedData
        )
      }
    }
    state.userHistory = history
  },
  [mutation.SELECTED_RESERVATION](state, selectedReservation) {
    state.selectedReservation = selectedReservation
  },
  /*[mutation.TAKEN_BY_LIST](state, storeUsers) {
    state.storeUsers = storeUsers
  },*/
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

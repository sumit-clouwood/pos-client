import * as mutation from './dineinReservation/mutation-types'
import DineInService from '@/services/data/DineInService'

const state = {
  selectedReservationDate: false,
  reservations: false,
  params: { page: 1, limit: 10 },
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
  getReservationByDate({ commit, getters }, selectedDate) {
    let UTC_Date = getters.getUTCDate(selectedDate)
    // eslint-disable-next-line no-console
    console.log(UTC_Date)
    commit(mutation.SELECTED_RESERVATION_DATE, UTC_Date)
    const params = [state.params.page, state.params.limit, UTC_Date]
    DineInService.bookings(...params).then(response => {
      commit(mutation.ALL_RESERVATIONS, response.data.data)
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
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

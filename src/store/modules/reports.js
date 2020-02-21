import ReportService from '@/services/data/ReportService'
import * as mutation from './reports/mutation-type'

const state = {
  BSData: false,
  date_from: '2020-02-19',
  date_to: '2020-02-19',
  hour_from: 24,
  hour_to: 24,
  time_mode: true,
  supervisor_password: false,
}

const getters = {}

const actions = {
  businessSummary({ commit, state }) {
    let data = {
      date_from: state.date_from,
      date_to: state.date_to,
      hour_from: state.hour_from,
      hour_to: state.hour_to,
      time_mode: state.time_mode,
      supervisor_password: state.supervisor_password,
    }
    if (state.supervisor_password) {
      ReportService.fetchBusinessSummery(data).then(response => {
        commit(mutation.BUSINESS_SUMMERY, response.data.data)
      })
    }
  },
}

const mutations = {
  [mutation.BUSINESS_SUMMERY](state, BSData) {
    state.BSData = BSData
  },
  [mutation.DATE_FROM](state, date_from) {
    state.date_from = date_from
  },
  [mutation.DATE_TO](state, date_to) {
    state.date_to = date_to
  },
  [mutation.HOUR_FROM](state, hour_from) {
    state.hour_from = hour_from
  },
  [mutation.HOUR_TO](state, hour_to) {
    state.hour_to = hour_to
  },
  [mutation.TIME_MODE](state, time_mode) {
    state.time_mode = time_mode
  },
  [mutation.SUPERVISOR_PASSWORD](state, supervisor_password) {
    state.supervisor_password = supervisor_password
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

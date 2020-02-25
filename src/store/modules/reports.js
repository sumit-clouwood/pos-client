import ReportService from '@/services/data/ReportService'
import * as mutation from './reports/mutation-type'
import DateTime from '@/mixins/DateTime'

const state = {
  BSData: false,
  date_from: '2020-02-19',
  date_to: '2020-02-19',
  hour_from: 24,
  hour_to: 24,
  time_mode: true, //true means taking store time, false means taking UTC time
  supervisor_password: '',
  passwordVerification: '',
  modalView: '#supervisor-password',
  totalPayments: { value: 0, count: 0 },
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
    // eslint-disable-next-line no-undef,no-console
    console.log(data, 'datadatadata')
    new Promise((resolve, reject) => {
      ReportService.fetchBusinessSummery(data)
        .then(response => {
          // eslint-disable-next-line no-undef,no-console
          console.log(response.data, 'responseresponseresponse')
          if (response.data.status === 'form_errors') {
            let superPassword = response.data.form_errors.supervisor_password[0]
            commit(mutation.PASSWORD_VERIFICATION, superPassword)
            commit(mutation.MODAL_VIEW, '#supervisor-password')
            return false
          } else {
            commit(mutation.BUSINESS_SUMMERY, response.data)
            commit(mutation.MODAL_VIEW, '#business-summary')
            resolve(response.data)
          }
        })
        .catch(er => {
          // commit(mutation.PASSWORD_VERIFICATION, er.data.error)
          reject(er)
        })
    })
  },
  setRequiredData({ commit, rootState, dispatch }) {
    let dateRange = DateTime.getUTCDate()
    dispatch('convertBusinessTimeTOSingleUnit', {
      hms: rootState.location.store.open_hours.opens_at,
      hour_commit: mutation.HOUR_FROM,
    })
    dispatch('convertBusinessTimeTOSingleUnit', {
      hms: rootState.location.store.open_hours.closes_at,
      hour_commit: mutation.HOUR_TO,
    })

    commit(mutation.DATE_FROM, dateRange)
    commit(mutation.DATE_TO, dateRange)
  },
  convertBusinessTimeTOSingleUnit({ commit }, details) {
    let a = details.hms.split(':') // split it at the colons

    // Hours are worth 60 minutes.
    let minutes = +a[0] * 60 + +a[1]
    let minutesToHours = Math.ceil(minutes / 60)
    // eslint-disable-next-line no-console
    console.log(minutesToHours, 'minutesToHours')
    commit(details.hour_commit, 24)
  },
  setSupervisorPassword({ commit, dispatch }, password) {
    commit(mutation.PASSWORD_VERIFICATION, '')
    if (password.length < 1) {
      commit(mutation.MODAL_VIEW, '#supervisor-password')
      commit(mutation.PASSWORD_VERIFICATION, 'Please enter password')
      return false
    }

    commit(mutation.SUPERVISOR_PASSWORD, password)
    dispatch('setRequiredData')
  },
}

const mutations = {
  [mutation.BUSINESS_SUMMERY](state, BSData) {
    state.BSData = BSData
    if (typeof BSData['PAYMENT_TYPES'] != 'undefined') {
      let paymentsValues = Object.values(BSData['PAYMENT_TYPES'])
      state.totalPayments = { value: 0, count: 0 }
      paymentsValues.forEach(payment => {
        // eslint-disable-next-line no-console
        console.log(payment['REPORT-PAYMENT-TYPE-QUANTITY'], 'payment')
        state.totalPayments.count += parseInt(
          payment['REPORT-PAYMENT-TYPE-QUANTITY']
        )
        state.totalPayments.value += parseFloat(payment['REPORT-PAYMENT-TYPE'])
      })
      state.totalPayments
    }
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
  [mutation.MODAL_VIEW](state, modalview) {
    state.modalView = modalview
  },
  [mutation.PASSWORD_VERIFICATION](state, passwordVerification) {
    // eslint-disable-next-line no-console
    console.log(passwordVerification)
    state.passwordVerification = passwordVerification
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

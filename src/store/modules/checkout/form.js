// initial state
const state = {
  amount: '',
  method: 'Cash',
  payments: [],
  creditCardPopup: false,
  LoyalityPopup: false,
  error: false,
  tipAmount: 0,
}

// getters
const getters = {
  validate: (state, getters) => {
    if (getters.payable < 0) return true
    return getters.orderTotal && !getters.payable
  },
  orderTotal: (state, getters, rootState, rootGetters) => {
    return rootGetters['order/orderTotal'] + state.tipAmount
  },
  paid: state => {
    return state.payments.reduce((total, payment) => total + payment.amount, 0)
  },
  payable: (state, getters) => {
    return getters.orderTotal - getters.paid
  },
}

// actions
const actions = {
  addAmount({ commit, getters, rootGetters }) {
    const totalPayable = getters.orderTotal
    const paid = getters.paid
    const remaining = totalPayable - paid

    if (!parseInt(state.amount)) {
      commit('SET_ERROR', `Amount should be greater than 0`)
    } else if (
      (state.method == 'MasterCard' || state.method == 'Visa') &&
      parseFloat(state.amount) > remaining
    ) {
      commit(
        'SET_ERROR',
        "Card payment can't be greater than " +
          rootGetters['location/round'](remaining)
      )
    } else {
      commit('SET_ERROR', false)
      commit('addAmount', {
        amount: parseFloat(state.amount),
        method: state.method,
      })
      commit('setAmount', rootGetters['location/round'](getters.payable))
    }
  },
  addGiftCardAmount({ commit, getters, rootGetters }) {
    commit('SET_ERROR', false)
    commit('addAmount', {
      amount: parseFloat(state.amount),
      method: state.method,
    })
    commit('setAmount', rootGetters['location/round'](getters.payable))
  },
  setAmount({ commit }, amount) {
    commit('setAmount', amount)
  },
  setMethod({ commit }, method) {
    commit('setMethod', method)
  },

  removePayment({ commit, rootGetters }, index) {
    if (state.amount > 0) {
      commit(
        'setAmount',
        rootGetters['location/round'](
          parseFloat(state.amount) - state.payments[index].amount
        )
      )
    } else {
      commit(
        'setAmount',
        rootGetters['location/round'](
          parseFloat(state.amount) + state.payments[index].amount
        )
      )
    }
    commit('removePayment', index)
  },
  reset({ commit }) {
    commit('RESET')
  },
}

// mutations
const mutations = {
  appendAmount(state, val) {
    if (parseInt(val) < 10 || val == '.') {
      state.amount = '' + (state.amount ? state.amount : '') + val
    } else {
      state.amount = val
    }
  },
  removeDigit(state) {
    state.amount = '' + state.amount.substr(0, state.amount.length - 1)
  },
  reset(state) {
    state.amount = 0
  },
  setAmount(state, val) {
    state.amount = val
    if (state.method == 'MasterCard' || state.method == 'Visa') {
      state.creditCardPopup = true
    } else {
      state.creditCardPopup = false
    }
  },
  setMethod(state, method) {
    state.method = method
  },
  addAmount(state, { amount, method }) {
    state.payments.push({
      amount: amount,
      method: method,
    })
  },
  addTip(state, tip) {
    state.tipAmount = tip
  },
  removePayment(state, index) {
    state.payments.splice(index, 1)
  },

  SET_ERROR(state, error) {
    state.error = error
  },

  RESET(state) {
    state.amount = ''
    state.method = 'Cash'
    state.payments = []
    state.creditCardPopup = false
    state.LoyalityPopup = false
    state.error = false
    state.tipAmount = 0
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

// initial state
const state = {
  amount: '',
  method: 'Cash',
  payments: [],
  creditCardPopup: false,
  LoyalityPopup: false,
  error: false,
}

// getters
const getters = {
  paid: state => {
    return state.payments.reduce((total, payment) => total + payment.amount, 0)
  },
  payable: (state, getters, rootState, rootGetters) => {
    const totalPayable = rootGetters['order/orderTotal']
    const paid = getters.paid
    return totalPayable - paid
  },
}

// actions
const actions = {
  addAmount({ commit, getters, rootGetters }) {
    const totalPayable = rootGetters['order/orderTotal']
    const paid = getters.paid
    const remaining = totalPayable - paid

    if (
      (state.method == 'MasterCard' || state.method == 'Visa') &&
      parseFloat(state.amount) > remaining
    ) {
      commit(
        'SET_ERROR',
        'Card payment can\'t be greater than ' +
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
  removePayment(state, index) {
    state.payments.splice(index, 1)
  },

  SET_ERROR(state, error) {
    state.error = error
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

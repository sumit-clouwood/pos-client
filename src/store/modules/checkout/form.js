// initial state
const state = {
  amount: '',
  method: {},
  payments: [],
  creditCardPopup: false,
  LoyaltyPopup: false,
  error: false,
  msg: null,
  tipAmount: 0,
  showCalc: true,
  loyaltyAmount: 0,
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
    if (parseFloat(state.amount) < 0.01) {
      commit('SET_ERROR', 'Amount should be greater than 0.00')
      commit('showCalc', true)
    } else if (
      !state.method.is_cash &&
      !state.method.is_gift &&
      parseFloat(state.amount) - parseFloat(remaining) > 0.01
    ) {
      commit(
        'SET_ERROR',
        "Card payment can't be greater than " +
          rootGetters['location/round'](remaining)
      )
      commit('showCalc', true)
    } else if(state.method.name == 'Loyalty' && parseFloat(state.amount) != parseFloat(state.loyaltyAmount)) {
      commit('SET_ERROR', 'You can add only '+ state.loyaltyAmount + ' loyalty amount.')
      commit('showCalc', true)
    } else {
      commit('SET_ERROR', false)
      commit('showCalc', false)
      commit('addAmount', {
        amount: parseFloat(state.amount),
        method: state.method,
      })
      commit('setAmount', rootGetters['location/round'](getters.payable))
    }
  },
  addGiftCardAmount({ commit, getters, rootGetters, rootState }, code) {
    commit('SET_ERROR', false)
    //chek if current giftcard is valid
    const giftCard = rootGetters['giftcard/find'](code)
    if (!giftCard) {
      commit('SET_ERROR', 'Invalid gift card code')
      commit('showCalc', true)
      return false
    }
    //check if gift card belongs to correct user
    if (giftCard.customer_id != rootState.customer.customer.customer_list._id) {
      commit('SET_ERROR', "Gift card doesn't belong to current customer")
      commit('showCalc', true)
      return false
    }
    //check expiry
    const activatedDate = new Date(giftCard.activated_date)
    const expiryDate = new Date(giftCard.expire_date)
    const today = new Date()

    if (expiryDate.getTime() <= today.getTime()) {
      commit('SET_ERROR', 'Gift card expired')
      commit('showCalc', true)
      return false
    }

    //check active
    if (
      activatedDate.getTime() > today.getTime() ||
      giftCard.status != 'active' ||
      giftCard.is_deleted === 1
    ) {
      commit('SET_ERROR', 'Gift card not active')
      commit('showCalc', true)
      return false
    }

    //check the balance
    if (!giftCard.balance) {
      commit('SET_ERROR', "Gift card doesn't have sufficient balance")
      commit('showCalc', true)
      return false
    }

    let giftCardAmount = giftCard.balance

    if (giftCard.balance > getters.payable) {
      giftCardAmount = getters.payable
    }

    commit('addAmount', {
      amount: giftCardAmount,
      method: state.method,
      code: giftCard.gift_code,
    })
    commit('setAmount', rootGetters['location/round'](getters.payable))
    commit('showCalc', false)
  },
  setAmount({ commit, dispatch }, amount) {
    commit('setAmount', amount)
    dispatch('calculateSpendLoyalty')
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

  calculateSpendLoyalty({ commit, rootState, getters }){
    const loyalty = rootState.customer.loyalty
    const orderTotal = getters.orderTotal
    let amount = parseFloat(loyalty.balance)
    if (amount > 0) {
      if (parseFloat(orderTotal) > 0 && parseFloat(loyalty.balance) >= parseFloat(orderTotal)) {
        amount = parseFloat(orderTotal).toFixed(2)
      }

      if (parseFloat(orderTotal) >= parseFloat(loyalty.max_redeem_amount)) {
        amount = parseFloat(loyalty.max_redeem_amount)
      }

      if (parseFloat(loyalty.balance) < parseFloat(loyalty.min_redeem_amount)) {
        amount = parseFloat('0.0')
      }

    }
    commit('loyaltyAmount', amount)
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
    if (!state.method.is_cash && !state.method.is_gift) {
      state.creditCardPopup = true
    } else {
      state.creditCardPopup = false
    }
  },
  loyaltyAmount(state, val) {
    state.loyaltyAmount = val
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
  showCalc(state, flag) {
    state.showCalc = flag
  },

  SET_ERROR(state, error) {
    state.error = error
  },
  SET_MSG(state, msg) {
    state.msg = msg
  },

  RESET(state) {
    state.amount = ''
    state.payments = []
    state.creditCardPopup = false
    state.LoyaltyPopup = false
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

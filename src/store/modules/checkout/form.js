import * as CONST from '@/constants'
import Num from '@/plugins/helpers/Num'

// initial state
const state = {
  amount: '',
  method: {},
  payments: [],
  LoyaltyPopup: false,
  error: false,
  msg: null,
  tipAmount: 0,
  giftAmount: 0,
  showCalc: true,
  showPayBreak: false,
  loyaltyAmount: 0,
  loyaltyPoints:0,
  action: 'add',
  loyaltyCard: {},
}

// getters
const getters = {
  validate: (state, getters) => {
    if (getters.payable <= 0) return true
    return getters.orderTotal && !getters.payable
  },
  orderTotal: (state, getters, rootState, rootGetters) => {
    return rootGetters['order/orderTotal'] + state.tipAmount
  },
  paid: state => {
    return state.payments.reduce(
      (total, payment) => parseFloat(total) + parseFloat(payment.amount),
      0
    )
  },
  payable: (state, getters) => {
    return getters.orderTotal - getters.paid
  },
  isLoyaltyUsed: state => {
    let loyaltyUsed = 0;
    if (state.payments) {
       state.payments.forEach(element => {
        if (element.method.name == "Loyalty Points") {
          loyaltyUsed = 1;
        }
      });
    }
    return loyaltyUsed;
  }
}

// actions
const actions = {
  validatePayment({ state, dispatch, getters, commit }) {
    if (getters['payable'] <= 0.01) return Promise.resolve()

    if (!state.amount || parseFloat(state.amount) < 0.01) {
      commit('SET_ERROR', 'Amount should be greater than 0.00')
      return Promise.reject()
    } else {
      if (state.method.type == CONST.GIFT_CARD) {
        return dispatch('validateGiftPayment')
      } else if (state.method.type == CONST.LOYALTY) {
        return dispatch('validateLoyaltyPayment')
      } else {
        if (state.method.reference_code) {
          //display reference popup
          return dispatch('validateCardPayment')
        } else {
          return dispatch('validateCashPayment')
        }
      }
    }
  },

  addAmount({ commit, getters, dispatch }) {
    return new Promise((resolve, reject) => {
      dispatch('validatePayment')
        .then(() => {
          commit('SET_ERROR', false)
          commit('showCalc', false)
          commit('showPayBreak', true)
          commit('addAmount', {
            amount: parseFloat(state.amount),
            method: state.method,
          })
          //set back to input box for remaining payment, make sure to round it
          commit('setAmount', Num.round(getters.payable))

          resolve(Num.round(getters.payable))
        })
        .catch(() => {
          commit('showCalc', true)
          commit('showPayBreak', false)
          reject()
        })
    })
  },

  //apply gift card [in use]
  addGiftCardAmount({ commit, getters, dispatch }, code) {
    return new Promise((resolve, reject) => {
      if (!state.amount) {
        commit('setGiftAmount', 0)
        commit('showCalc', true)
        commit('showPayBreak', false)
        reject('Amount should be greater than 0')
      } else {
        dispatch(
          'giftcard/apply',
          { code: code, amount: state.amount },
          { root: true }
        )
          .then(card => {
            //check activation here
            //check expiry
            const activatedDate = new Date(card.activated_date)
            const expiryDate = new Date(card.expire_date)
            const today = new Date()

            if (expiryDate.getTime() <= today.getTime()) {
              commit('setGiftAmount', 0)
              commit('showCalc', true)
              commit('showPayBreak', false)
              reject('Gift Card has been expired.')
            }

            //check active
            else if (activatedDate.getTime() > today.getTime()) {
              commit('setGiftAmount', 0)
              commit('showCalc', true)
              commit('showPayBreak', false)
              reject('Gift Card is not active.')
            }

            //check the balance
            else if (
              !card.remaining_amount ||
              card.remaining_amount < state.amount
            ) {
              commit('setGiftAmount', 0)
              commit('showCalc', true)
              commit('showPayBreak', false)
              reject("Gift card doesn't have sufficient balance")
            } else {
              commit('setGiftAmount', state.amount)
              commit('addGiftAmount', {
                amount: state.amount,
                method: state.method,
                code: code,
                cardId: card._id,
              })
              commit('setAmount', Num.round(getters.payable))
              commit('showCalc', false)
              commit('showPayBreak', true)
              resolve(Num.round(getters.payable))
            }
          })
          .catch(error => {
            commit('setGiftAmount', 0)
            commit('showCalc', true)
            commit('showPayBreak', false)
            reject(error)
          })
      }
    })
  },

  addCardAmount({ commit, getters }, code) {
    return new Promise(resolve => {
      commit('addCardAmount', {
        amount: state.amount,
        method: state.method,
        code: 'Card-' + code,
      })
      commit('showCalc', false)
      commit('showPayBreak', true)
      //set remaining amount into text box
      commit('setAmount', Num.round(getters.payable))
      resolve(Num.round(getters.payable))
    })
  },

  validateCardPayment({ commit, getters }) {
    return new Promise((resolve, reject) => {
      const totalPayable = getters.orderTotal
      const paid = getters.paid
      const remaining = totalPayable - paid
      if (parseFloat(state.amount) <= 0) {
        commit('SET_ERROR', 'Card payment should be greater than 0.00')
        reject()
      } else if (parseFloat(state.amount) - parseFloat(remaining) > 0.01) {
        commit(
          'SET_ERROR',
          "Card payment can't be greater than " + Num.round(remaining)
        )
        reject()
      } else {
        commit('SET_ERROR', false)
        resolve()
      }
    })
  },
  validateLoyaltyPayment({ commit, getters}) {
    return new Promise((resolve, reject) => {
      if (parseFloat(state.amount) != parseFloat(state.loyaltyAmount)) {
        if (parseFloat(state.loyaltyAmount) <= 0.01) {
          commit('SET_ERROR', 'You dont have loyalty amount.')
        } else if(getters.isLoyaltyUsed===1){
          commit('SET_ERROR', 'Loyalty can be used only ones in order')
        } else {
          let amount = isNaN(state.loyaltyAmount) ? 0 : state.loyaltyAmount
          commit('SET_ERROR', 'You can add only ' + amount + ' loyalty amount.')
        }
        reject()
      } else {
        resolve()
      }
    })
  },
  validateGiftPayment({ commit, getters }) {
    return new Promise((resolve, reject) => {
      const totalPayable = getters.orderTotal
      const paid = getters.paid
      const remaining = totalPayable - paid

      if (parseFloat(state.amount) <= 0) {
        commit('SET_ERROR', 'Gift Card payment should be greater than 0.00')
        reject()
      } else if (parseFloat(state.amount) - parseFloat(remaining) > 0.01) {
        commit(
          'SET_ERROR',
          "Gift Card payment can't be greater than " + Num.round(remaining)
        )
        reject()
      } else {
        commit('SET_ERROR', false)
        resolve()
      }
    })
  },
  validateCashPayment() {
    return Promise.resolve(1)
  },

  setAmount({ commit }, amount) {
    commit('setAmount', parseFloat(amount))
  },
  setLoyaltyCard({ commit }, card) {
    commit('setLoyaltyCard', card)
  },
  resetAmount({ commit }) {
    commit('setAmount', 0)
  },
  setMethod({ commit }, method) {
    commit('setMethod', method)
  },

  removePayment({ commit }, index) {
    if (state.amount > 0) {
      commit(
        'setAmount',
        Num.round(parseFloat(state.amount) - state.payments[index].amount)
      )
    } else {
      commit(
        'setAmount',
        Num.round(parseFloat(state.amount) + state.payments[index].amount)
      )
    }
    commit('removePayment', index)
    commit('showPayBreak', true)
  },

  calculateSpendLoyalty({ commit, rootState, getters }) {
    const loyalty = rootState.customer.loyalty.card
    const loyaltyDetails = rootState.customer.loyalty.details
    let orderTotal =  parseFloat(getters.orderTotal)
    let amount = 0,oneLoyaltyPoint = 0;
    if (loyaltyDetails && loyalty) {
      oneLoyaltyPoint = parseFloat(loyaltyDetails.one_point_redeems_to)
      if (orderTotal > 0) {
        let { maxRedeem, minRedeem, loyaltyAmountByPoints } = {
          maxRedeem: parseFloat(loyaltyDetails.maximum_redeem * loyaltyDetails.one_point_redeems_to),
          minRedeem: parseFloat(loyaltyDetails.minimum_redeem * loyaltyDetails.one_point_redeems_to),
          loyaltyAmountByPoints: parseFloat(loyalty.balance * loyaltyDetails.one_point_redeems_to)
        }      
        orderTotal = parseFloat(getters.orderTotal).toFixed(2)
        if(loyaltyAmountByPoints>0){
          if(loyaltyAmountByPoints >= orderTotal) {
            if(orderTotal<=maxRedeem){
              amount = orderTotal
            } else {
              amount = maxRedeem
            }
          }
          if(loyaltyAmountByPoints <= orderTotal && loyaltyAmountByPoints>=minRedeem) {
              if (orderTotal>=minRedeem && orderTotal<=maxRedeem && loyaltyAmountByPoints>=orderTotal){
                amount = orderTotal
              }
              if (orderTotal>=minRedeem && orderTotal<=maxRedeem && loyaltyAmountByPoints<=orderTotal){
                amount = loyaltyAmountByPoints
              }
          }
        }
      }
    }
    commit('loyaltyAmount', amount)
    commit('loyaltyPoints', {amount, oneLoyaltyPoint})
  },

  reset({ commit }) {
    commit('RESET')
  },

  //apply giftcard by customer [future use]
  addGiftCardAmountCustomer({ commit, getters, rootGetters, rootState }, code) {
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
    commit('setAmount', Num.round(getters.payable))
    commit('showCalc', false)
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
    const stramount = '' + state.amount
    state.amount = stramount.substr(0, stramount.length - 1)
  },
  setAmount(state, val) {
    state.amount = val
  },
  setLoyaltyCard(state, val) {
    state.loyaltyCard = val;
  },
  loyaltyAmount(state, val) {
    state.loyaltyAmount = val.toFixed(2)
  },
  loyaltyPoints(state, {amount, oneLoyaltyPoint}) {
    /** 
     * loyalty amount to points 
     * logic : amount/one_point_redeems_to  =  points used 
     */
    if (amount && oneLoyaltyPoint) {
      state.loyaltyPoints  = (amount/oneLoyaltyPoint).toFixed(2);
    } else {
      state.loyaltyPoints  = 0;
    }
  },
  setMethod(state, method) {
    state.method = method
    state.showCalc = true
  },
  addAmount(state, { amount, method }) {
    if (amount > 0) {
      const index = state.payments.findIndex(type => type === method)
      if (index !== -1) {
        let type = state.payments[index]
        type.amount += parseFloat(amount)
        state.payments.splice(index, 1, type)
      } else {
        let isPaymentAcceptble = 1;
        if(method.name == 'Loyalty Points') {
          /* prevent adding multiple loyalty payments using method type */
          /* check existing payments for same (Loyalty Points) method name*/
          state.payments.forEach(element => {
            if(element.method.name=='Loyalty Points'){
              isPaymentAcceptble = 0;
            }
          });
        }
        if(isPaymentAcceptble) {
          state.payments.push({
            amount: amount,
            method: method,
            cardId: state.loyaltyCard._id ? state.loyaltyCard._id : null,
            code: state.loyaltyCard.loyalty_card_code ? state.loyaltyCard.loyalty_card_code : null
          })
        }
      }
    } else {
      state.error = 'Amount can not be 0'
    }
  },
  addGiftAmount(state, { amount, method, code, cardId }) {
    const index = state.payments.findIndex(
      payment =>
        payment.method === method &&
        payment.code === code &&
        payment.cardId == cardId
    )

    if (index !== -1) {
      let type = state.payments[index]
      type.amount += parseFloat(amount)
      state.payments.splice(index, 1, type)
    } else {
      state.payments.push({
        amount: parseFloat(amount),
        method: method,
        code: code,
        cardId: cardId,
      })
    }
  },
  addCardAmount(state, { amount, method, code }) {
    if (amount > 0) {
      const index = state.payments.findIndex(
        payment => payment.method === method && payment.code === code
      )

      if (index !== -1) {
        let type = state.payments[index]
        type.amount += parseFloat(amount)
        state.payments.splice(index, 1, type)
      } else {
        state.payments.push({
          amount: parseFloat(amount),
          method: method,
          code: code,
        })
      }
    } else {
      state.error = 'Amount can not be 0'
    }
  },
  addTip(state, tip) {
    state.tipAmount = tip
    // if (tip > 0 || state.tipAmount > 0) {
    // } else {
    //   state.error = 'Tip amount can not be zero or negative'
    // }
  },
  removePayment(state, index) {
    state.payments.splice(index, 1)
  },
  setAction(state, action) {
    state.action = action
  },
  showCalc(state, flag) {
    state.showCalc = flag
  },
  showPayBreak(state, flag) {
    state.showPayBreak = flag
  },

  setGiftAmount(state, amount) {
    state.giftAmount = amount
  },

  SET_ERROR(state, error) {
    state.error = error
  },
  SET_MSG(state, msg) {
    state.msg = msg
  },

  RESET(state) {
    state.amount = 0
    state.payments = []
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

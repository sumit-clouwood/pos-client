import * as CONST from '@/constants'
import Num from '@/plugins/helpers/Num'
import DateTime from '@/mixins/DateTime'

/*

1- User can pay full order amount using cash (Passed)
2- User can pay partial amount using cash and any other method (other than Aggregator) (Passed)
3- User can pay full amount using card (Passed)
4- User can not pay amount greater then payable amount using card (true for Aggregator methods as well) (Passed)
5- User can partially pay using card methods (Other than aggregator) (Passed)
6- Only One Aggregator method can be used for paying order amount
7- Tip amount should be removed automatically for aggregator payment types

*/

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
  loyaltyPoints: 0,
  action: 'add',
  loyaltyCard: {},
  decimalExists: false,
  forceCash: false,
  processing: false,
  paymentButton: 'add',
  errorAmount: '',
  customerRemainingLoyalty: 0,
  customerLoyaltyItem: 0,
  transactionTokens: {},
}

// getters
const getters = {
  transaction_token: state => id => state.transactionTokens[id],
  payment_method: state => state.method,
  validate: (state, getters) => {
    if (getters.payable <= 0) return true
    return getters.orderTotal && !getters.payable
  },
  orderTotal: (state, getters, rootState, rootGetters) => {
    return (
      parseFloat(rootGetters['order/orderTotal']) + parseFloat(state.tipAmount)
    )
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
  // eslint-disable-next-line no-unused-vars
  isLoyaltyUsed: state => {
    let loyaltyUsed = 0
    if (state.payments) {
      state.payments.forEach(element => {
        if (element.method.name == 'Loyalty Points') {
          loyaltyUsed = 1
        }
      })
    }
    return loyaltyUsed
  },
  validateAggregator: (state, getters, rootState, rootGetters) => {
    if (state.method.type === CONST.AGGREGATOR) {
      const totalPayable = parseFloat(rootGetters['order/orderTotal'])
      if (totalPayable !== state.amount) {
        return false
      }
    }
    return true
  },
}

// actions
const actions = {
  generateTransactionToken({ commit }, id) {
    const token = Math.random()
      .toString(36)
      .substr(2, 9)
    commit('SET_TRANSACTION_TOKEN', { id, token })
    return token
  },
  validatePayment({ state, dispatch, getters, rootGetters, commit }) {
    const totalPayable = getters.orderTotal
    const paid = getters.paid
    const remaining = totalPayable - paid

    if (getters['payable'] <= 0.01) return Promise.resolve()

    if (!state.amount || parseFloat(state.amount) < 0.01) {
      commit(
        'SET_ERROR',
        rootGetters['location/_t']('Please add pending amount below to proceed')
      )
      commit('SET_ERROR_AMOUNT', remaining)
      commit('setAmount', remaining)
      return Promise.reject()
    } else {
      if (state.method.type == CONST.GIFT_CARD) {
        return dispatch('validateGiftPayment')
      } else if (state.method.type == CONST.LOYALTY) {
        return dispatch('validateLoyaltyPayment')
      } else if (state.method.type == CONST.CARD) {
        if (!getters.validateAggregator) {
          if (state.tipAmount) {
            return dispatch('setTipAmountErrors')
          }
          return dispatch('aggregatorPaymentErrors', totalPayable)
        }

        return dispatch('validateCardPayment')
      } else {
        // Handle aggregator payments here
        if (!getters.validateAggregator) {
          if (state.tipAmount) {
            return dispatch('setTipAmountErrors')
          }
          return dispatch('aggregatorPaymentErrors', totalPayable)
        }

        return dispatch('validateCashPayment')
      }
    }
  },

  aggregatorPaymentErrors({ commit, rootGetters }, totalPayable) {
    commit(
      'SET_ERROR',
      rootGetters['location/_t']('Please add below amount to proceed')
    )
    commit('SET_ERROR_AMOUNT', totalPayable)
    commit('setAmount', totalPayable)
    return Promise.reject()
  },

  setTipAmountErrors({ commit, rootGetters }) {
    commit(
      'SET_ERROR',
      rootGetters['location/_t']('Tip amount not allowed for Aggregator types')
    )
    commit('addTip', 0)
    return Promise.reject()
  },

  addAmount({ commit, getters, dispatch }) {
    return new Promise((resolve, reject) => {
      commit('SET_ERROR', '')
      commit('SET_ERROR_AMOUNT', '')
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

            const today = new Date(DateTime.getUTCDateTime())
            const activatedDate = new Date(card.activated_date)
            const expiryDate = new Date(card.expire_date)

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

  addCardAmount({ commit, getters, rootGetters, dispatch }, response) {
    if (parseFloat(state.amount) > 0) {
      return new Promise(resolve => {
        commit('addCardAmount', {
          amount: state.amount,
          method: state.method,
          response: response,
        })

        commit('showCalc', false)
        commit('showPayBreak', true)
        //set remaining amount into text box
        commit('setAmount', Num.round(getters.payable))
        resolve(Num.round(getters.payable))
      })
    } else {
      //set method as cash if amount is zero for card
      const method = rootGetters['payment/cash']
      commit('forceCash', true)
      commit('setMethod', method)
      return dispatch('addAmount')
    }
  },

  validateCardPayment({ commit, getters, rootGetters }) {
    return new Promise((resolve, reject) => {
      const totalPayable = getters.orderTotal
      const paid = getters.paid
      const remaining = totalPayable - paid
      if (parseFloat(state.amount) <= 0) {
        commit(
          'SET_ERROR',
          rootGetters['location/_t'](
            'Please add pending amount below to proceed'
          )
        )
        commit('SET_ERROR_AMOUNT', remaining)
        commit('setAmount', remaining)
        reject()
      } else if (parseFloat(state.amount) - parseFloat(remaining) > 0.01) {
        commit('SET_ERROR', "Payment can't be greater than below amount")
        commit('SET_ERROR_AMOUNT', remaining)
        commit('setAmount', remaining)
        reject()
      } else {
        commit('SET_ERROR', '')
        commit('SET_ERROR_AMOUNT', '')

        resolve()
      }
    })
  },
  validateLoyaltyPayment({ commit, getters, rootGetters }) {
    return new Promise((resolve, reject) => {
      let orderType = rootGetters['order/orderType']
      if (orderType === CONST.ORDER_TYPE_CALL_CENTER) {
        resolve()
      } else {
        if (parseFloat(state.amount) > parseFloat(state.loyaltyAmount)) {
          if (parseFloat(state.loyaltyAmount) <= 0.01) {
            commit('SET_ERROR', 'You do not have loyalty amount.')
            commit('SET_ERROR_AMOUNT', 0)
          } else {
            let amount = isNaN(state.loyaltyAmount) ? 0 : state.loyaltyAmount
            commit('SET_ERROR', `You can't add more than ${amount} loyalty`)
            commit('SET_ERROR_AMOUNT', amount)
          }
          reject()
        } else {
          if (getters.isLoyaltyUsed === 1) {
            commit(
              'SET_ERROR',
              'You already applied loyalty, please remove from payment breakdown and apply again'
            )
            reject()
          } else resolve()
        }
      }
    })
  },
  validateGiftPayment({ commit, getters }) {
    return new Promise((resolve, reject) => {
      const totalPayable = getters.orderTotal
      const paid = getters.paid
      const remaining = totalPayable - paid

      if (parseFloat(state.amount) <= 0) {
        commit('SET_ERROR', 'Gift Card payment should be greater than')
        commit('SET_ERROR_AMOUNT', 0)
        reject()
      } else if (parseFloat(state.amount) - parseFloat(remaining) > 0.01) {
        commit(
          'SET_ERROR',
          "Gift Card payment can't be greater than below amount"
        )
        commit('SET_ERROR_AMOUNT', remaining)
        reject()
      } else {
        commit('SET_ERROR', false)
        resolve()
      }
    })
  },
  validateCashPayment({ state, getters, rootGetters, commit }) {
    return new Promise((resolve, reject) => {
      if (state.paymentButton === 'done') {
        const totalPayable = getters.orderTotal
        const paid = getters.paid
        const remaining = totalPayable - paid
        if (parseFloat(state.amount) <= 0) {
          commit('SET_ERROR', 'Payment should be greater than 0.00')
          reject()
        } else if (parseFloat(state.amount) < totalPayable) {
          commit(
            'SET_ERROR',
            rootGetters['location/_t'](
              'Please add pending amount below to proceed'
            )
          )
          commit('SET_ERROR_AMOUNT', remaining)
          reject()
        } else {
          commit('SET_ERROR', false)
          resolve()
        }
      } else {
        resolve()
      }
    })
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
  setMethod({ commit, rootState, getters, rootGetters }, method) {
    //check if payable is greater than 0 else set cash as method
    commit('setMethod', method)
    if (getters['payable'] <= 0 && !rootState.order.creditOrderPayment.order) {
      commit('setMethod', rootGetters['payment/cash'])
      commit('forceCash', true)
    }
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

  calculateLoyaltyAmountForItem({ commit, rootState, rootGetters, dispatch }) {
    const orderDiscount = rootState.discount.appliedOrderDiscount
    const loyalty_card = rootState.customer.customerLoyalty.card
    // const methods = rootState.payment.methods
    let loyalty_balance = loyalty_card ? parseFloat(loyalty_card.balance) : 0
    const loyalty = rootState.customer.customerLoyalty.details
    let maxRedeem = parseFloat(rootState.location.brand.maximum_redeem)
    let items = rootGetters['order/items']
    let orderType = rootGetters['order/orderType']
    let order_type_spend = orderType + '_spend_points'
    let loyalty_items = []
    let amount = 0
    let redeem_point = 0
    let total_of_one_point_redeem = 0
    let total_redeem_amount_for_items = 0
    let loyalty_details_ids = []
    items.forEach(item => {
      if (loyalty && item) {
        let loyalty_action = loyalty.find(loyalty => {
          if (
            loyalty.for_items.includes(item._id) &&
            loyalty[order_type_spend] === true
          ) {
            return loyalty
          }
        })
        let loyalty_for_item = 0
        let loyalty_apply_on_price = 0
        if (loyalty_action && loyalty_balance > 0.001) {
          if (orderDiscount) {
            loyalty_apply_on_price = parseFloat(
              rootGetters['discount/getOrderDiscountItemAmount'](item)
            )
          } else {
            loyalty_apply_on_price = parseFloat(
              rootGetters['order/itemGrossPriceDiscounted'](item)
            )
          }
          if (!loyalty_details_ids.includes(loyalty_action._id)) {
            total_of_one_point_redeem = loyalty_action.one_point_redeems_to
          }

          loyalty_details_ids.push(loyalty_action._id)
          let redeem_amount_for_item =
            loyalty_apply_on_price * loyalty_action.one_point_redeems_to
          if (redeem_amount_for_item >= loyalty_apply_on_price) {
            loyalty_for_item =
              loyalty_balance <= loyalty_apply_on_price
                ? loyalty_balance
                : loyalty_apply_on_price
          } else {
            loyalty_for_item =
              loyalty_balance <= redeem_amount_for_item
                ? loyalty_balance
                : redeem_amount_for_item
          }
          total_redeem_amount_for_items += loyalty_for_item

          loyalty_balance -= parseFloat(loyalty_for_item)
          item.loyalty_ammount = loyalty_for_item
          loyalty_items.push(item)
        } else {
          item.loyalty_ammount = 0
          loyalty_items.push(item)
        }
      }
    })
    if (total_redeem_amount_for_items > 0 && loyalty_card.balance > 0) {
      amount =
        total_redeem_amount_for_items <= maxRedeem
          ? total_redeem_amount_for_items
          : maxRedeem
      amount = loyalty_card.balance <= amount ? loyalty_card.balance : amount
      redeem_point = amount / total_of_one_point_redeem
    }
    commit('LOYALTY_AMOUNT', amount)
    commit('LOYALTY_POINTS', redeem_point)
    commit('CUSTOMER_LOYALTY_ITEM', loyalty_items)

    /*Added amount directly (before that wee are using this for popup,I will do it in single commit after deployment*/
    // if (state.forceCash) {
    // eslint-disable-next-line no-debugger
    // if (methods && methods.loyalty) {
    //   let loyalty_card = methods.loyalty.find(
    //     payment => payment.type === CONST.LOYALTY
    //   )
    //   // eslint-disable-next-line no-console
    //   console.log(loyalty_card, 'loyalty_card method')
    //   commit('setPaymentMethodLoyalty', loyalty_card)
    // }
    dispatch('setAmount', Num.round(amount))
    dispatch('setLoyaltyCard', loyalty_card)
    // }
  },
  /*calculateSpendLoyalty({ commit, rootState, rootGetters }) {
    // eslint-disable-next-line no-debugger
    // debugger
    const loyalty = rootState.customer.customerLoyalty.card
    const loyaltyDetails = rootState.customer.customerLoyalty.details
    let items = rootGetters['order/items']
    let customer_loyalty_balance = { ...parseFloat(loyalty.balance) }
    let amount = 0
    let redeem_point
    if (loyaltyDetails && loyalty) {
      let total_redeem_amount_for_items = 0
      items.forEach(item => {
        if (item) {
          let loyalty_action = loyaltyDetails.find(loyalty => {
            if (loyalty.for_items.includes(item._id)) {
              return loyalty
            }
          })
          // commented below logic after discuss with sohin no use of money_spent
          /!*if (loyalty_action) {
            total_redeem_amount_for_items +=
              Math.floor(item.netPrice / loyalty_action.money_spent) *
              loyalty_action.one_point_redeems_to
          }*!/
          let loyalty_for_item = 0
          if (loyalty_action && customer_loyalty_balance > 0.001) {
            var redeem_amount =
              item.netPrice * loyalty_action.one_point_redeems_to
            loyalty_for_item =
              customer_loyalty_balance <= redeem_amount
                ? customer_loyalty_balance
                : redeem_amount
            total_redeem_amount_for_items +=
              loyalty_for_item >= item.netPrice
                ? item.netPrice
                : loyalty_for_item

            customer_loyalty_balance -= total_redeem_amount_for_items
            redeem_point +=
              total_redeem_amount_for_items /
              loyalty_action.one_point_redeems_to
          }
        }
      })
      total_redeem_amount_for_items = parseFloat(total_redeem_amount_for_items)
      let maxRedeem = parseFloat(rootState.location.brand.maximum_redeem)
      if (total_redeem_amount_for_items > 0 && customer_loyalty_balance > 0) {
        amount =
          total_redeem_amount_for_items <= maxRedeem
            ? total_redeem_amount_for_items
            : maxRedeem
        amount =
          customer_loyalty_balance <= amount ? customer_loyalty_balance : amount
      }
    }
    commit('LOYALTY_AMOUNT', amount)
    commit('LOYALTY_POINTS', redeem_point)
  },*/

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
  setCashMethod({ commit, rootGetters }) {
    const method = rootGetters['payment/cash']
    commit('forceCash', true)
    commit('setMethod', method)
  },
}

// mutations
const mutations = {
  appendAmount(state, val) {
    if (parseInt(val) < 10) {
      state.amount = '' + (state.amount ? state.amount : '') + val
    } else if (val == '.') {
      state.decimalExists = true
      if (state.amount) {
        if (!state.amount.match(/\./g)) {
          state.amount = state.amount + '.'
        }
      } else {
        state.amount = '0.'
      }
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
    state.loyaltyCard = val
  },
  LOYALTY_AMOUNT(state, val) {
    state.loyaltyAmount = parseFloat(val).toFixed(2)
  },
  LOYALTY_POINTS(state, loyaltyPoint) {
    state.loyaltyPoints = loyaltyPoint
  },
  CUSTOMER_REMAINING_LOYALTY(state, loyaltyPoint) {
    state.customerRemainingLoyalty = loyaltyPoint
  },
  CUSTOMER_LOYALTY_ITEM(state, items) {
    state.customerLoyaltyItem = items
  },
  setMethod(state, method) {
    state.method = method
    state.showCalc = true
  },
  setPaymentMethodLoyalty(state, method) {
    state.method = method
    // state.showCalc = true
  },
  addAmount(state, { amount, method }) {
    state.decimalExists = false
    const paymentIndex = state.payments.findIndex(
      payment => payment.method === method
    )
    if (paymentIndex !== -1) {
      let paymentMethod = state.payments[paymentIndex]
      paymentMethod.amount += parseFloat(amount)
      state.payments.splice(paymentIndex, 1, paymentMethod)
    } else {
      let isPaymentAcceptble = 1
      if (method.type == CONST.LOYALTY) {
        /* prevent adding multiple loyalty payments using method type */
        /* check existing payments for same (Loyalty Points) method name*/
        state.payments.forEach(element => {
          if (element.method.type == CONST.LOYALTY) {
            isPaymentAcceptble = 0
          }
        })
      }
      if (isPaymentAcceptble) {
        let paymentObject = {
          amount: amount,
          method: method,
          cardId: null,
          code: null,
        }
        if (method.type === CONST.LOYALTY) {
          paymentObject.cardId = state.loyaltyCard._id
            ? state.loyaltyCard._id
            : null
          paymentObject.code = state.loyaltyCard.loyalty_card_code
            ? state.loyaltyCard.loyalty_card_code
            : null
        }
        state.payments.push(paymentObject)
      }
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
  addCardAmount(state, { amount, method, response }) {
    let code = response
    if (typeof response === 'object') {
      code = response.code
    }
    if (parseFloat(amount) > 0) {
      let index = -1
      if (typeof response !== 'object') {
        //for real card payment don't group it
        index = state.payments.findIndex(
          payment => payment.method === method && payment.code === code
        )
      }

      if (index !== -1) {
        let type = state.payments[index]
        type.amount += parseFloat(amount)
        state.payments.splice(index, 1, type)
      } else {
        //for real payments always push response
        let paymentData = {
          amount: parseFloat(amount),
          method: method,
          code: code,
        }
        if (typeof response === 'object') {
          paymentData.response = response
        }
        state.payments.push(paymentData)
      }
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
  paymentButton(state, action) {
    state.paymentButton = action
  },
  showCalc(state, flag) {
    state.showCalc = flag
  },
  showPayBreak(state, flag) {
    state.showPayBreak = flag
  },

  forceCash(state, status) {
    state.forceCash = status
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

  SET_DECIMAL(state, decimal) {
    state.decimalExists = decimal
  },

  SET_PROCESSING(state, status) {
    state.processing = status
  },
  SET_ERROR_AMOUNT(state, errorAmount) {
    state.errorAmount = errorAmount
  },
  EMPTY_PAYMENTS(state, payment = []) {
    state.payments = payment
  },
  RESET(state, status = 'complete') {
    state.payments = []
    state.LoyaltyPopup = false
    state.error = false
    state.processing = false
    if (status != 'process') {
      state.amount = 0
      state.tipAmount = 0
    }
  },
  SET_TRANSACTION_TOKEN(state, { id, token }) {
    state.transactionTokens[id] = token
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

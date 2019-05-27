/* eslint-disable no-console */
import OrderService from '@/services/data/OrderService'
import * as mutation from './checkout/mutation-types'
import db from '@/services/network/DB'
import Crypt from '@/plugins/helpers/Crypt.js'
import DateTime from '@/plugins/helpers/DateTime.js'
import * as CONSTANTS from '@/constants'

// initial state
const state = {
  order: false,
  paidAmount: 0,
  payableAmount: 0,
  pendingAmount: 0,
  changedAmount: 0,
  print: false,
  orderNumber: null,
}

// getters
const getters = {}

// actions
const actions = {
  pay({ commit, rootGetters, rootState, dispatch }) {
    return new Promise((resolve, reject) => {
      let validPayment = false

      if (rootState.order.orderType === 'delivery') {
        validPayment = true
      } else {
        const paid = rootGetters['checkoutForm/paid']
        commit(mutation.SET_PAID_AMOUNT, paid)
        const totalPayable = rootGetters['checkoutForm/orderTotal']
        commit(mutation.SET_PAYABLE_AMOUNT, totalPayable)

        let pendingAmount = totalPayable - paid
        pendingAmount = parseFloat(pendingAmount).toFixed(2)
        if (pendingAmount >= 0.01) {
          commit(mutation.SET_PENDING_AMOUNT, pendingAmount)
          commit(
            'checkoutForm/SET_ERROR',
            'Please add pending amount of ' +
              pendingAmount +
              ' before proceeding further.',
            { root: true }
          )
        } else {
          // see if there is a change amount
          const changedAmount = paid - totalPayable
          commit(mutation.SET_CHANGED_AMOUNT, changedAmount)

          validPayment = true
        }
      }

      if (validPayment) {
        //send order for payment
        let order = {}

        try {
          const newDate = new DateTime()
          order = {
            transition_order_no: '',
            currency: rootState.location.currency,
            order_status: 'new',
            order_source: 'pos',
            order_type: rootState.order.orderType,
            order_mode: 'online',
            payment_mode: 'Cash',
            status: 'paid',
            real_created_datetime: newDate.getDate() + ' ' + newDate.getTime(),
            // order_mode: 'online',
            subtotal: rootGetters['order/subTotal'],
            totalDiscount: rootGetters['discount/orderDiscountWithoutTax'],
            totalPid: rootGetters['order/subTotal'],
            balance_due: rootGetters['order/orderTotal'],
            bill_printed: true,
            amount_changed: state.changedAmount,
          }
        } catch (e) {
          console.log(e)
        }

        if (rootState.order.orderType == 'delivery') {
          order.customer_id = rootState.customer.customerId
          order.address_id = rootState.customer.address
            ? rootState.customer.address.id
            : null
          order.status = 'running'
          // order.status = 'on-hold'
        }

        //ORDER SURCHARGES
        //get surcharge for an order
        order.total_surcharge = rootGetters['surcharge/surcharge']
        //add surcharge tax
        order.surcharge_tax = rootState.tax.surchargeTax

        //adding surcharge data
        order.order_surcharges = rootState.surcharge.surcharges.map(
          surcharge => {
            const surchargeAmount = rootState.surcharge.surchargeAmounts.find(
              surchargeAmount => surchargeAmount.id == surcharge._id
            ).amount
            return {
              entity_id: surcharge._id,
              name: surcharge.name,
              type: surcharge.type,
              rate: surchargeAmount,
              tax: surchargeAmount,
              tax_rate: surchargeAmount,
              taxable: surchargeAmount,
            }
          }
        )

        //add order note
        order.order_note = rootState.order.orderNote
        //add referral
        if (rootState.order.referral) {
          order.referral = rootState.order.referral.referralName
          order.referral_id = rootState.order.referral.referralId
        }
        //add future order
        if (rootState.order.futureOrder) {
          order.future_order = 1
          order.future_order_date = rootState.order.futureOrder
        }

        //adding final tax
        order.total_tax = rootState.tax.surchargeTax + rootState.tax.itemsTax

        //adding item data
        order.items = rootState.order.items.map(item => {
          const itemTax = rootState.tax.itemsTaxData.find(
            taxData => taxData.itemId == item._id
          )
          let orderItem = {
            name: item.name,
            entity_id: item._id,
            no: 0,
            tax: itemTax ? itemTax.tax : 0,
            price:
              parseFloat(item.netPrice) + parseFloat(itemTax ? itemTax.tax : 0),
            quantity: item.quantity,
          }

          return orderItem
        })

        //modifiers
        let modifiers = []

        rootState.order.items.forEach(item => {
          if (item.modifiers.length) {
            //get all modifiers by modifier ids attached to item
            item.modifiers.forEach(modifierId => {
              rootState.modifier.itemModifiers.forEach(itemModifier => {
                itemModifier.modifiers.forEach(itemModifierItem => {
                  itemModifierItem.get_modifier_sub_groups.forEach(
                    submodifier => {
                      submodifier.get_modifier_item_list.forEach(submodItem => {
                        if (submodItem._id == modifierId) {
                          modifiers.push({
                            entity_id: submodItem._id,
                            for_item: item._id,
                            price: submodItem.price,
                            tax: submodItem.tax,
                            name: submodItem.name,
                            qty: 1,
                            type: submodItem.subgroup_type,
                          })
                        }
                      })
                    }
                  )
                })
              })
            })
          }
        })
        order.item_modifiers = modifiers

        //order level discount
        if (rootState.discount.appliedOrderDiscount) {
          order.discount_id =
            rootState.discount.appliedOrderDiscount.discount.discount_id
          order.discount_applied = ''
          order.discount_amount =
            rootGetters['discount/orderDiscountWithoutTax']
        }

        //adding tip amount
        order.tip_amount = rootState.checkoutForm.tipAmount

        //loyalty earn setting
        if (rootState.customer.loyalty) {
          order.loyalty_customer = null
          order.customer_id = rootState.customer.customerId
        }

        //adding payment breakdown
        order.order_payments = rootState.checkoutForm.payments.map(payment => {
          let paymentPart = {
            name: payment.method.name,
            collected: payment.amount,
            param1: payment.coce,
            param2: payment.amount,
            param3: payment.coce,
            entity_id: payment.id,
          }

          //Youvraj, have a check here
          if (payment.method.name == CONSTANTS.LOYALTY) {
            if (parseFloat(rootState.customer.loyalty.balance) > 0) {
              order.loyalty_customer = {
                balance: rootState.customer.loyalty.balance,
                redeemed_amount_value: rootState.checkoutForm.loyaltyAmount,
              }
            }
            order.customer_id = rootState.customer.customerId
          }
          return paymentPart
        })

        order.app_uniqueid = Crypt.uuid()

        console.log('not in delivery or take away ')
        commit(mutation.SET_ORDER, order)
        dispatch('createOrder')
          .then(response => {
            resolve(response)
          })
          .catch(response => {
            reject(response)
          })
      } else {
        reject()
      }
    })
  },
  createOrder({ state, commit, rootState, dispatch }) {
    commit('checkoutForm/SET_MSG', 'loading', {
      root: true,
    })

    return new Promise((resolve, reject) => {
      OrderService.saveOrder(state.order, rootState.customer.offlineData)
        .then(response => {
          dispatch('invoice/fetchAll', null, { root: true }).then(() => {
            //get print rules
            if (response.data.data === 1) {
              //clear all the data related to order, tax, discounts, surcharge etc
              //create invoice
              //add order no to local database
              db.getBucket('auth').then(bucket => {
                db.fetch(bucket).then(data => {
                  if (data && data[0]) {
                    data = data[0]
                    data.lastOrderNo = parseInt(data.lastOrderNo) + 1
                    db.getBucket('auth').then(bucket => {
                      bucket.put(data)
                    })
                    commit('auth/SET_LAST_ORDER_NO', data.lastOrderNo, {
                      root: true,
                    })
                  }
                })
              })

              commit(mutation.SET_ORDER_NUMBER, response.data.order_no)
              commit('checkoutForm/SET_MSG', 'Order Placed Successfully', {
                root: true,
              })
              resolve(response.data)
            } else {
              const error =
                typeof response.data.error !== 'undefined'
                  ? response.data.error
                  : response.data.message

              commit(
                'checkoutForm/SET_ERROR',
                `Order Failed, Server Response: ${error}`,
                { root: true }
              )
              reject(response.data)
            }
          })
        })
        .catch(response => {
          if (
            response.data &&
            typeof response.data.status !== 'undefined' &&
            response.data.status === 0
          ) {
            commit('checkoutForm/SET_ERROR', response.data.error, {
              root: true,
            })
            reject(response.data.error)
          } else {
            commit('checkoutForm/SET_MSG', 'Queued for sending later', {
              root: true,
            })
            resolve(response.data)
          }
        })
      // .finally(() => {
      //   resolve()
      // })
    })
  },
  generateInvoice({ commit }) {
    commit(mutation.PRINT, true)
  },
  reset({ commit, dispatch }) {
    commit(mutation.RESET)
    dispatch('checkoutForm/reset', null, { root: true })
    dispatch('order/reset', null, { root: true })
    dispatch('tax/reset', null, { root: true })
    dispatch('discount/reset', null, { root: true })
    dispatch('surcharge/reset', null, { root: true })
    dispatch('customer/reset', null, { root: true })
  },

  updateOrderStatus(
    { rootState, dispatch },
    { orderStatus, orderId, timestamp, orderType }
  ) {
    const params = [
      {
        location_id: rootState.location.location,
        order_status: orderStatus,
        order_id: orderId,
        order_type: orderType,
        timestamp: timestamp,
        staff_id: rootState.auth.userDetails._id,
      },
    ]
    OrderService.updateOrder(...params).then(() => {})
    dispatch('deliveryManager/fetchOrderCount', null, { root: true })
    /*commit(mutation.SET_ORDER, order)
    dispatch('createOrder')*/
  },
}

// mutations
const mutations = {
  [mutation.SET_ORDER](state, order) {
    state.order = order
  },
  [mutation.SET_PAID_AMOUNT](state, amount) {
    state.paidAmount = amount
  },
  [mutation.SET_PAYABLE_AMOUNT](state, amount) {
    state.payableAmount = amount
  },
  [mutation.SET_PENDING_AMOUNT](state, amount) {
    state.pendingAmount = amount
  },
  [mutation.SET_CHANGED_AMOUNT](state, amount) {
    state.changedAmount = amount
  },
  [mutation.PRINT](state, flag) {
    state.print = flag
  },
  [mutation.SET_ORDER_NUMBER](state, orderNumber) {
    state.orderNumber = orderNumber
  },
  [mutation.RESET](state) {
    state.order = false
    state.paidAmount = 0
    state.payableAmount = 0
    state.pendingAmount = 0
    state.changedAmount = 0
    state.print = false
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

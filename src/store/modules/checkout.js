/* eslint-disable no-console */
import OrderService from '@/services/data/OrderService'
import * as mutation from './checkout/mutation-types'
//import db from '@/services/network/DB'
//import Crypt from '@/plugins/helpers/Crypt.js'
import DateTime from '@/plugins/helpers/DateTime.js'
//import Num from '@/plugins/helpers/Num.js'
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
            customer: '',
            referral: '',
            transition_order_no: '',
            currency: rootState.location.currency,
            order_status: CONSTANTS.ORDER_STATUS_IN_PROGRESS,
            order_source: CONSTANTS.ORDER_SOURCE_POS,
            order_type: rootState.order.orderType,
            order_mode: 'online',
            real_created_datetime: newDate.getDate() + ' ' + newDate.getTime(),
            // order_mode: 'online',
            //remove the modifiers prices from subtotal
            sub_total: rootGetters['order/subTotal'],
            total_discount: rootGetters['discount/orderDiscountWithoutTax'],
            total_paid: rootGetters['order/subTotal'],

            bill_printed: true,
            amount_changed: state.changedAmount,

            order_building: '',
            order_street: '',
            order_flat_number: '',
            order_nearest_landmark: '',
            order_city: '',
            order_country: '',
            order_delivery_area: '',

            item_discounts: [],
            item_modifiers: '',
            order_surcharges: '',
            order_discounts: [],
            order_payments: '',
          }
        } catch (e) {
          console.log(e)
        }

        if (rootState.order.orderType == 'delivery') {
          order.customer = rootState.customer.customerId
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

        order.order_surcharges = rootState.surcharge.surchargeAmounts.map(
          appliedSurcharge => {
            const surcharge = rootState.surcharge.surcharges.find(
              surcharge => surcharge._id === appliedSurcharge.id
            )
            return {
              entity_id: surcharge._id,
              name: surcharge.name,
              type: surcharge.type,
              price: appliedSurcharge.amount,
              rate: surcharge.rate,
              tax: appliedSurcharge.tax,
              tax_rate: surcharge.tax_sum,
              taxable: surcharge.tax_sum ? true : false,
            }
          }
        )

        //add order note
        order.order_note = rootState.order.orderNote
        //add referral
        if (rootState.order.referral) {
          //order.referral = rootState.order.referral.referralName
          order.referral = rootState.order.referral.referralId
        }
        //add future order
        if (rootState.order.futureOrder) {
          order.future_order = 1
          order.future_order_date = rootState.order.futureOrder
        }

        //adding item data
        let item_discounts = []
        //let itemDiscountedTax = 0
        order.items = rootState.order.items.map(item => {
          const itemTax = rootState.tax.itemsTaxData.find(
            taxData => taxData.itemId == item._id
          )

          let orderItem = {
            name: item.name,
            entity_id: item._id,
            no: 0,
            tax: itemTax ? itemTax.undiscountedTax : 0,
            price: parseFloat(item.undiscountedNetPrice),
            qty: item.quantity,
          }

          //reduce modifier prices and taxes from item before sending it to checkout
          const modifiers = rootGetters['tax/itemModifiersTaxData'](item._id)

          orderItem.price -= modifiers.reduce((total, modifier) => {
            return total + modifier.price
          }, 0)
          orderItem.tax -= modifiers.reduce((total, modifier) => {
            return total + modifier.tax
          }, 0)

          if (item.discount) {
            let itemDiscount = item.discount
            itemDiscount.itemId = item._id
            itemDiscount.quantity = item.quantity
            itemDiscount.tax = itemTax.undiscountedTax - itemTax.tax
            //itemDiscountedTax += itemDiscount.tax
            item_discounts.push(itemDiscount)
          }
          return orderItem
        })

        //adding final tax
        const itemsTax = rootState.tax.itemsTaxData.reduce((totalTax, item) => {
          return totalTax + item.tax * item.quantity
        }, 0)
        const surchargeTax = rootState.surcharge.surchargeAmounts.reduce(
          (totalTax, item) => {
            return totalTax + item.tax
          },
          0
        )

        if (rootState.discount.appliedOrderDiscount) {
          //order discount was applied
          order.total_tax = rootGetters['tax/totalTax']
        } else {
          //no order discount, may be  item discount applied
          order.total_tax = surchargeTax + itemsTax
        }
        //add discounted tax
        // order.total_tax +=
        //   +rootState.discount.taxDiscountAmount + itemDiscountedTax

        //discount already applied on tax
        order.balance_due = rootGetters['order/orderTotal']
        //modifiers
        let modifiers = []

        rootState.order.items.forEach(item => {
          if (item.modifiers.length) {
            item.modifiers.forEach(modifierId => {
              const subgroups = rootGetters['modifier/itemModifiers'](item._id)
              subgroups.forEach(subgroup => {
                subgroup.modifiers.forEach(modifier => {
                  if (modifier._id === modifierId) {
                    const modfierTaxData = rootGetters['tax/modifierTaxData']({
                      itemId: item._id,
                      modifierId: modifierId,
                    })
                    modifiers.push({
                      entity_id: modifierId,
                      for_item: item._id,
                      price: modfierTaxData.price,
                      tax: modfierTaxData.tax,
                      name: modifier.name,
                      qty: item.quantity,
                      type: subgroup.item_type,
                    })
                  }
                })
              })
            })
            //get all modifiers by modifier ids attached to item
          }
        })
        order.item_modifiers = modifiers

        //order level discount
        order.order_discounts = []

        if (rootState.discount.appliedOrderDiscount) {
          const discount = rootState.discount.appliedOrderDiscount.discount
          const orderDiscount = {
            name: discount.name,
            price: rootGetters['discount/orderDiscountWithoutTax'],
            tax: rootState.discount.taxDiscountAmount,
            type: discount.type,
            rate:
              discount.type === CONSTANTS.VALUE
                ? discount.value
                : discount.rate,
            include_surcharge: discount.include_surcharge,
            entity_id: discount._id,
          }
          order.order_discounts.push(orderDiscount)
        }

        //addint item discounts

        order.item_discounts = item_discounts.map(itemDiscount => {
          return {
            name: itemDiscount.name,
            type: itemDiscount.type,
            rate:
              itemDiscount.type === CONSTANTS.VALUE
                ? itemDiscount.value
                : itemDiscount.rate,
            price: itemDiscount.discount * itemDiscount.quantity,
            tax: itemDiscount.tax * itemDiscount.quantity,
            for_item: itemDiscount.itemId,
            entity_id: itemDiscount.id,
          }
        })
        //adding tip amount
        order.tip_amount = rootState.checkoutForm.tipAmount

        //adding payment breakdown
        order.order_payments = rootState.checkoutForm.payments.map(payment => {
          let paymentPart = {
            entity_id: payment.method._id,
            name: payment.method.name,
            collected: payment.amount,
            param1: payment.code,
            param2: payment.amount,
            param3: payment.code,
          }

          //Youvraj, have a check here
          if (payment.method.type == CONSTANTS.LOYALTY) {
            if (parseFloat(rootState.customer.loyalty.balance) > 0) {
              order.loyalty_customer = {
                balance: rootState.customer.loyalty.balance,
                redeemed_amount_value: rootState.checkoutForm.loyaltyAmount,
              }
            }
            order.customer = rootState.customer.customerId
          }
          return paymentPart
        })

        //order.app_uniqueid = Crypt.uuid()

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
          // if (response.data.id) {
          //   commit('checkoutForm/SET_MSG', 'Order Placed Successfully', {
          //     root: true,
          //   })
          //   resolve(response.data)
          //   return true
          // }
          dispatch('invoice/printRules', null, { root: true }).then(() => {
            //get print rules
            if (response.data.status === 'ok') {
              //clear all the data related to order, tax, discounts, surcharge etc
              //create invoice
              //add order no to local database
              // db.getBucket('auth').then(bucket => {
              //   db.fetch(bucket).then(data => {
              //     if (data && data[0]) {
              //       data = data[0]
              //       data.lastOrderNo = parseInt(data.lastOrderNo) + 1
              //       db.getBucket('auth').then(bucket => {
              //         bucket.put(data)
              //       })
              //       commit('auth/SET_LAST_ORDER_NO', data.lastOrderNo, {
              //         root: true,
              //       })
              //     }
              //   })
              // })

              // commit(mutation.SET_ORDER_NUMBER, response.data.order_no)
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

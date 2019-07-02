/* global $ */
/* eslint-disable no-console */
import OrderService from '@/services/data/OrderService'
import * as mutation from './checkout/mutation-types'
//import db from '@/services/network/DB'
//import Crypt from '@/plugins/helpers/Crypt.js'
import DateTime from '@/plugins/helpers/DateTime.js'
import Num from '@/plugins/helpers/Num.js'
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
  pay({ commit, rootGetters, rootState, dispatch, state }, { action }) {
    return new Promise((resolve, reject) => {
      let validPayment = false
      const totalPayable = rootGetters['checkoutForm/orderTotal']
      commit(mutation.SET_PAYABLE_AMOUNT, totalPayable)

      if (
        rootState.order.orderType.OTApi === CONSTANTS.ORDER_TYPE_CALL_CENTER ||
        action === CONSTANTS.ORDER_STATUS_ON_HOLD
      ) {
        validPayment = true
      } else {
        const paid = rootGetters['checkoutForm/paid']
        commit(mutation.SET_PAID_AMOUNT, paid)

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
            order_status:
              action === CONSTANTS.ORDER_STATUS_ON_HOLD
                ? CONSTANTS.ORDER_STATUS_ON_HOLD
                : CONSTANTS.ORDER_STATUS_IN_PROGRESS,
            order_source: CONSTANTS.ORDER_SOURCE_POS,
            order_type: rootState.order.orderType.OTApi,
            order_mode: 'online',
            real_created_datetime: newDate.getDate() + ' ' + newDate.getTime(),
            // order_mode: 'online',
            //remove the modifiers prices from subtotal
            sub_total: Num.round(rootGetters['order/subTotal']),
            total_discount: Num.round(
              rootGetters['discount/orderDiscountWithoutTax']
            ),

            print_count: 1,
            amount_changed: Num.round(state.changedAmount),

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
        if (
          rootState.order.orderType.OTApi == CONSTANTS.ORDER_TYPE_CALL_CENTER
        ) {
          order.customer = rootState.customer.customerId
          /*order.address_id = rootState.customer.address
            ? rootState.customer.address.id
            : null*/
          const address = rootState.customer.address
          // address.delivery_area
          order.order_building = address.building
          order.order_street = address.street
          order.order_flat_number = address.flat_number
          order.order_nearest_landmark = address.nearest_landmark
          order.order_city = address.city
          order.order_country = address.country
          order.order_delivery_area = address.delivery_area_id
        }

        //ORDER SURCHARGES
        //get surcharge for an order
        order.total_surcharge = Num.round(rootGetters['surcharge/surcharge'])
        //add surcharge tax
        order.surcharge_tax = Num.round(rootState.tax.surchargeTax)

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
              price: Num.round(appliedSurcharge.amount),
              rate: surcharge.rate,
              tax: Num.round(appliedSurcharge.tax),
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
        let itemModifiers = []
        let item_discounts = []
        //let itemDiscountedTax = 0
        let itemNumber = 0
        order.items = rootState.order.items.map(item => {
          const itemTax = rootState.tax.itemsTaxData.find(
            taxData => taxData.itemId == item._id
          )

          let orderItem = {
            name: item.name,
            entity_id: item._id,
            no: itemNumber,
            tax: itemTax ? Num.round(itemTax.undiscountedTax) : 0,
            price: Num.round(parseFloat(item.undiscountedNetPrice)),
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
            itemDiscount.itemNo = itemNumber
            itemDiscount.quantity = item.quantity
            itemDiscount.tax = itemTax.undiscountedTax - itemTax.tax
            //itemDiscountedTax += itemDiscount.tax
            item_discounts.push(itemDiscount)
          }

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
                    itemModifiers.push({
                      entity_id: modifierId,
                      for_item: itemNumber,
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
          itemNumber++
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
        order.total_tax = Num.round(order.total_tax)
        //add discounted tax
        // order.total_tax +=
        //   +rootState.discount.taxDiscountAmount + itemDiscountedTax

        //discount already applied on tax
        order.balance_due = Num.round(rootGetters['order/orderTotal'])
        //modifiers
        order.item_modifiers = itemModifiers

        //order level discount
        order.order_discounts = []

        if (rootState.discount.appliedOrderDiscount) {
          const discount = rootState.discount.appliedOrderDiscount.discount
          const orderDiscount = {
            name: discount.name,
            price: Num.round(rootGetters['discount/orderDiscountWithoutTax']),
            tax: Num.round(rootState.discount.taxDiscountAmount),
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
            price: Num.round(itemDiscount.discount * itemDiscount.quantity),
            tax: Num.round(itemDiscount.tax * itemDiscount.quantity),
            for_item: itemDiscount.itemNo,
            entity_id: itemDiscount.id,
          }
        })
        //adding tip amount
        order.tip_amount = rootState.checkoutForm.tipAmount

        //adding payment breakdown
        let totalPaid = 0
        order.order_payments = rootState.checkoutForm.payments.map(payment => {
          let paymentPart = {
            entity_id: payment.method._id,
            name: payment.method.name,
            collected: payment.amount,
            param1: payment.cardId,
            param2: payment.amount,
            param3: payment.code,
          }
          totalPaid += payment.amount
          //Yuvraj, have a check here
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

        order.total_paid = Num.round(totalPaid)

        //applying Fixing

        order.sub_total = order.sub_total.toFixed(2)
        order.total_discount = order.total_discount.toFixed(2)
        order.total_surcharge = order.total_surcharge.toFixed(2)
        order.total_tax = order.total_tax.toFixed(2)
        order.amount_changed = order.amount_changed.toFixed(2)
        order.tip_amount = parseFloat(order.tip_amount).toFixed(2)
        order.total_paid = order.total_paid.toFixed(2)
        order.surcharge_tax = order.surcharge_tax.toFixed(2)
        order.balance_due = order.balance_due.toFixed(2)

        order.item_discounts = order.item_discounts.map(discount => {
          discount.rate = discount.rate.toFixed(2)
          discount.price = discount.price.toFixed(2)
          discount.tax = discount.tax.toFixed(2)
          return discount
        })

        order.order_surcharges = order.order_surcharges.map(surcharge => {
          surcharge.rate = surcharge.rate
            ? surcharge.rate.toFixed(2)
            : surcharge.rate
          surcharge.price = surcharge.price.toFixed(2)
          surcharge.tax = surcharge.tax.toFixed(2)
          surcharge.tax_rate = surcharge.tax_rate
            ? surcharge.tax_rate.toFixed(2)
            : surcharge.tax_rate
          return surcharge
        })

        order.items = order.items.map(item => {
          item.price = item.price.toFixed(2)
          item.tax = item.tax.toFixed(2)
          return item
        })

        order.item_modifiers = order.item_modifiers.map(item => {
          item.price = item.price.toFixed(2)
          item.tax = item.tax.toFixed(2)
          return item
        })

        order.order_payments = order.order_payments.map(item => {
          item.collected = parseFloat(item.collected).toFixed(2)
          return item
        })

        //order.app_uniqueid = Crypt.uuid()

        console.log('not in delivery or take away ')
        commit(mutation.SET_ORDER, order)
        dispatch('createOrder', action)
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

  createOrder({ state, commit, rootState, rootGetters, dispatch }, action) {
    commit(
      'checkoutForm/SET_MSG',
      { data: '', result: 'loading' },
      {
        root: true,
      }
    )
    return new Promise((resolve, reject) => {
      let response = null
      //order.order is a hold order, state.order contains current order
      if (rootState.order.orderStatus === CONSTANTS.ORDER_STATUS_ON_HOLD) {
        let order = { ...state.order }
        //order.modify_reason = 'Process order'
        order.new_real_transition_order_no = ''
        delete order.real_created_datetime

        response = OrderService.modifyOrder(
          order,
          rootState.order.orderId,
          'hold'
        )
      } else {
        response = OrderService.saveOrder(
          state.order,
          rootState.customer.offlineData
        )
      }

      response
        .then(response => {
          //remove current order from hold list as it might be processed, refetching ll do it
          dispatch('holdOrders/getHoldOrders', null, { root: true })

          if (response.data.status === 'ok') {
            if (action === CONSTANTS.ORDER_STATUS_ON_HOLD) {
              commit(
                'checkoutForm/SET_MSG',
                { result: '', data: 'Order has been hold Successfully' },
                {
                  root: true,
                }
              )
              resolve()
              dispatch('reset')
              return true
            }

            if (!rootState.order.orderId) {
              commit('order/SET_ORDER_ID', response.data.id, { root: true })
            }

            //else
            commit(
              'checkoutForm/SET_MSG',
              { result: 'success', data: 'Order Placed Successfully' },
              {
                root: true,
              }
            )

            resolve(response.data)

            dispatch('invoice/printRules', null, { root: true }).then(() => {
              //get print rules
              //get invoice template
              const templateId = rootGetters['invoice/templateId']
              dispatch(
                'invoice/fetchTemplate',
                {
                  orderId: rootState.order.orderId,
                  templateId: templateId,
                },
                {
                  root: true,
                }
              ).then(() => {
                commit(
                  'checkoutForm/SET_MSG',
                  { result: 'success', data: 'Order Placed Successfully' },
                  {
                    root: true,
                  }
                )
                resolve(response.data)
              })
            })
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
        .catch(response => {
          if (response.data && response.data.status === 'fail') {
            commit('checkoutForm/SET_ERROR', response.data.error, {
              root: true,
            })
            reject(response.data.error)
          } else {
            if (response.message === 'Network Error') {
              commit(
                'checkoutForm/SET_MSG',
                { result: '', data: 'Queued for sending later' },
                {
                  root: true,
                }
              )
              dispatch('reset')
            } else {
              var err_msg = ''
              if (
                response.data &&
                response.data[response.data.status] &&
                typeof response.data[response.data.status] != 'undefined'
              ) {
                response.data[response.data.status].forEach(value => {
                  err_msg += value + ' '
                })

                commit(
                  'checkoutForm/SET_MSG',
                  { result: '', data: err_msg },
                  {
                    root: true,
                  }
                )
              }
            }
            resolve(response.data)
          }
        })
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

/* eslint-disable no-console */
import OrderService from '@/services/data/OrderService'
import * as mutation from './checkout/mutation-types'
import db from '@/services/network/DB'

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

      if (rootState.order.orderType != 'Walk-in') {
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
        const date = new Date().toJSON().slice(0, 10)
        const time = new Date().toJSON().slice(11, 19)

        let order = {
          transition_order_no: '',
          location_id: rootState.location.location,
          payment_mode: 'Cash',
          status: 'paid',
          order_type: rootState.order.orderType,
          currency_code: rootState.location.currency,
          collected: 'no',
          order_queue: '0',
          created_date: date,
          created_time: time,
          order_mode: 'online',
          balance_due: rootGetters['order/orderTotal'],
          subtotal: rootGetters['order/subTotal'],
          amount_changed: state.changedAmount,
        }

        const cyrb53 = function(str, seed = 0) {
          let h1 = 0xdeadbeef ^ seed,
            h2 = 0x41c6ce57 ^ seed
          for (let i = 0, ch; i < str.length; i++) {
            ch = str.charCodeAt(i)
            h1 = Math.imul(h1 ^ ch, 2654435761)
            h2 = Math.imul(h2 ^ ch, 1597334677)
          }
          h1 =
            Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
            Math.imul(h2 ^ (h2 >>> 13), 3266489909)
          h2 =
            Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
            Math.imul(h1 ^ (h1 >>> 13), 3266489909)
          return 4294967296 * (2097151 & h2) + (h1 >>> 0)
        }

        if (rootState.order.orderType == 'delivery') {
          order.customer_id = rootState.customer.customerId
          order.address_id = rootState.customer.address
            ? rootState.customer.address.id
            : null
          order.status = 'on-hold'
        }

        //get surcharge for an order
        order.surcharge = rootGetters['surcharge/surcharge']
        //add surcharge tax
        order.surcharge_tax = rootState.tax.surchargeTax
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
        //adding surcharge data
        order.surchargeData = rootState.surcharge.surcharges.map(surcharge => {
          const surchargeAmount = rootState.surcharge.surchargeAmounts.find(
            surchargeAmount => surchargeAmount.id == surcharge._id
          ).amount
          return {
            surcharge_id: surcharge._id,
            surcharge_name: surcharge.name,
            surcharge_type: surcharge.type,
            surcharge_amount: surchargeAmount,
            surcharge_amount_value: surchargeAmount,
          }
        })

        //adding final tax
        order.final_tax = rootState.tax.surchargeTax + rootState.tax.itemsTax

        //adding item data
        order.itemData = rootState.order.items.map(item => {
          const itemTax = rootState.tax.itemsTaxData.find(
            taxData => taxData.itemId == item._id
          )
          let orderItem = {
            itemName: item.name,
            item_name: item.item_name,
            itemId: item._id,
            itemTax: itemTax ? itemTax.tax : 0,
            total:
              parseFloat(item.price) + parseFloat(itemTax ? itemTax.tax : 0),
            item_discount_price: parseFloat(item.price),
            item_discount_id: item.discount.id,
            item_discount_name: item.discount.name,
            item_price_each: parseFloat(item.undiscountedPrice),
            item_discountontotal:
              parseFloat(item.discount.discount) * item.quantity || 0,
            quantity: item.quantity,
          }

          if (item.modifiers.length) {
            let regularModifiers = []
            let mandatoryModifiers = []
            let priceModifiers = []

            //get all modifiers by modifier ids attached to item
            let modifiers = []
            item.modifiers.forEach(modifierId => {
              rootState.modifier.itemModifiers.forEach(itemModifier => {
                itemModifier.modifiers.forEach(itemModifierItem => {
                  itemModifierItem.get_modifier_sub_groups.forEach(
                    submodifier => {
                      submodifier.get_modifier_item_list.forEach(submodItem => {
                        if (submodItem._id == modifierId) {
                          modifiers.push({
                            _id: submodItem._id,
                            location_price: submodItem.price,
                            modifierSubGroup: submodifier._id,
                            item_name: submodItem.name,
                            noofselection: 1,
                            type: submodItem.subgroup_type,
                          })
                        }
                      })
                    }
                  )
                })
              })
            })

            modifiers.forEach(modifier => {
              switch (modifier.type) {
                case 'mandatory':
                  mandatoryModifiers.push(modifier)
                  break
                case 'price':
                  priceModifiers.push(modifier)
                  break
                default:
                  regularModifiers.push(modifier)
              }
            })
            orderItem.modifiers = {
              regular_modifiers: regularModifiers,
              mandatory_modifiers: mandatoryModifiers,
              price_modifiers: priceModifiers,
            }
          }
          return orderItem
        })

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
        order.payBreakDown = rootState.checkoutForm.payments.map(payment => {
          let paymentPart = [payment.method.name, payment.amount]
          if (
            payment.code ||
            (payment.method.name != 'Loyalty' && payment.method.name != 'Cash')
          ) {
            // paymentPart.push(payment.code)
            paymentPart.push('Card-1234')
          }
          //loyalty redeem setting
          if (payment.method.name == 'Loyalty') {
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

        if (!order.payBreakDown.length) {
          order.payBreakDown = [['Cash', 0]]
        }

        if (
          rootState.order.orderType == 'delivery' ||
          rootState.order.orderType == 'takeaway'
        ) {
          //its a crm/delivery order, include cusotmer id

          //get last order no from indexedDB and update it in rootstate
          let lastOrderNo = 1
          db.getBucket('auth')
            .then(bucket => {
              console.log(bucket)
              db.fetch(bucket).then(data => {
                console.log('fetched data from auth db', data)
                if (data && data[0]) {
                  data = data[0]
                  //validate that token against api in case we need to refresh token otherwise use it
                  lastOrderNo = parseInt(data.lastOrderNo) + 1

                  console.log('lastorder number', lastOrderNo)
                  const transitionOrderNo =
                    rootState.auth.franchiesCode +
                    '-' +
                    rootState.auth.deviceCode +
                    '-' +
                    lastOrderNo
                  order.app_uniqueid = cyrb53(transitionOrderNo)

                  commit(mutation.SET_ORDER, order)
                  dispatch('createOrder')
                    .then(response => {
                      resolve(response)
                    })
                    .catch(response => {
                      reject(response)
                    })
                }
              })
            })
            .catch(error => console.log('error from db', error))
            .finally(res => console.log('final res', res))
        } else {
          console.log('not in delivery or take away ')
          commit(mutation.SET_ORDER, order)
          dispatch('createOrder')
            .then(response => {
              resolve(response)
            })
            .catch(response => {
              reject(response)
            })
        }
      } else {
        reject()
      }
    })
  },
  createOrder({ state, commit, rootState }) {
    commit('checkoutForm/SET_MSG', 'loading', {
      root: true,
    })

    return new Promise((resolve, reject) => {
      OrderService.saveOrder(state.order, rootState.customer.offlineData)
        .then(response => {
          if (response.data.data === 1) {
            //clear all the data related to order, tax, discounts, surcharge etc
            //create invoice
            //add order no to local database
            db.getBucket('auth').then(bucket => {
              db.fetch(bucket).then(data => {
                if (data && data[0]) {
                  data = data[0]
                  data.lastOrderNo = parseInt(data.lastOrderNo) + 1
                  db.getBucket('auth').put(data)
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
            commit(
              'checkoutForm/SET_ERROR',
              `Order Failed, Server Response: ${response.data.error}`,
              { root: true }
            )
            reject(response.data)
          }
        })
        .catch(response => {
          commit('checkoutForm/SET_MSG', 'Queued for sending later', {
            root: true,
          })
          resolve(response.data)
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
    { rootState },
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

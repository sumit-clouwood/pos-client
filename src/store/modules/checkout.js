import OrderService from '@/services/data/OrderService'
import * as mutation from './checkout/mutation-types'
import Num from '@/plugins/helpers/Num.js'
import * as CONSTANTS from '@/constants'
import { compressToBase64 } from 'lz-string'
import OrderHelper from '@/plugins/helpers/Order'

// initial state
const state = {
  order: false,
  paidAmount: 0,
  payableAmount: 0,
  pendingAmount: 0,
  changedAmount: 0,
  print: false,
  loading: false,
  orderNumber: null,
  changeAmountStatus: false,
  paymentMsgStatus: false,
  processing: false,
  paymentAction: '',
  splitPaid: false,
}

// getters
const getters = {
  complete: (state, getters, rootState) => {
    //if order was never splitted means it is completed
    if (
      ['dine-in-place-order'].includes(state.paymentAction) &&
      !rootState.order.splitted
    ) {
      return true
    }

    //if item was never splitted
    if (!rootState.order.splitted) {
      return true
    }

    //if splitted once
    return rootState.order.totalItems === rootState.order.totalItemsPaid
  },
  calculateOrderTotals: () => order => {
    let data = {
      subTotal: 0,
      totalTax: 0,
      totalSurcharge: 0,
      balanceDue: 0,
      surchargeTax: 0,
      totalDiscount: 0,
    }

    order.items.forEach(item => {
      data.subTotal += item.price * item.qty
      data.totalTax += item.tax * item.qty
    })

    order.item_modifiers.forEach(modifier => {
      data.subTotal += modifier.price * modifier.qty
      data.totalTax += modifier.tax * modifier.qty
    })

    order.order_surcharges.forEach(surcharge => {
      data.totalSurcharge += surcharge.price
      data.surchargeTax += surcharge.tax
      data.totalTax += surcharge.tax
    })

    order.item_discounts.forEach(discount => {
      data.subTotal -= Num.round(discount.price)
      data.totalTax -= Num.round(discount.tax)
    })

    order.order_discounts.forEach(discount => {
      data.totalDiscount += Num.round(discount.price)
      data.totalTax -= Num.round(discount.tax)
    })

    data.balanceDue =
      data.subTotal + data.totalTax + data.totalSurcharge - data.totalDiscount

    if (order.delivery_surcharge) {
      data.balanceDue += Num.round(order.delivery_surcharge)
    }
    return data
  },
}

// actions
const actions = {
  validatePayment({ rootState, rootGetters, commit }, action) {
    const totalPayable = rootGetters['checkoutForm/orderTotal']
    commit(mutation.SET_PAYABLE_AMOUNT, totalPayable)

    if (
      rootState.order.orderType.OTApi === CONSTANTS.ORDER_TYPE_CALL_CENTER ||
      [
        'dine-in-place-order',
        'carhop-place-order',
        'dine-in-order-preview',
        'modify-backend-order',
        CONSTANTS.ORDER_STATUS_ON_HOLD,
      ].includes(action)
    ) {
      return Promise.resolve()
    }

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
      return Promise.reject()
    }
    return Promise.resolve()
  },

  validateEvent({ commit, rootState, dispatch }, { action, data }) {
    if (state.processing === true) {
      // eslint-disable-next-line
      console.log('Dual event detected')
      return Promise.reject('Dual event detected')
    }

    //if no order start time then reject otherwise
    //reset order start time
    if (!rootState.order.startTime) {
      // eslint-disable-next-line no-console
      console.log('Fake order or an order already in progress')
      return Promise.reject('Fake order or an order already in progress')
    }

    // set the async state
    commit(mutation.SET_PROCESSING, true)
    commit('checkoutForm/SET_PROCESSING', true, { root: true })
    return dispatch('validateOrder', { action: action, data: data })
  },

  validateOrder({ rootState, commit }, { data }) {
    //check if split order is on but no item was plitted
    //if not coming from split order, because split bill is still under process
    if (typeof data !== 'undefined' && data.route !== 'splitOrder') {
      if (rootState.order.splitBill || rootState.order.splitted) {
        if (rootState.order.items.every(item => item.split === false)) {
          commit('order/RESET_SPLIT_BILL', null, { root: true })
        }
      }
    }
    return Promise.resolve()
  },

  injectCrmData({ rootState, rootGetters }, order) {
    //add referral
    if (rootState.order.referral) {
      //order.referral = rootState.order.referral.referralName
      order.referral = rootState.order.referral.referralId
    }

    if (
      rootState.order.orderStatus === CONSTANTS.ORDER_STATUS_IN_DELIVERY ||
      (rootState.order.orderSource === 'backend' &&
        rootState.order.orderType.OTApi === CONSTANTS.ORDER_TYPE_CALL_CENTER)
    ) {
      //order was modifying from delivery so no need to overwrite info
      order.customer = rootState.order.selectedOrder.item.customer
      order.order_building = rootState.order.selectedOrder.item.order_building
      order.order_street = rootState.order.selectedOrder.item.order_street
      order.order_flat_number =
        rootState.order.selectedOrder.item.order_flat_number
      order.order_nearest_landmark =
        rootState.order.selectedOrder.item.order_nearest_landmark
      order.order_city = rootState.order.selectedOrder.item.order_city
      order.order_country = rootState.order.selectedOrder.item.order_country
      order.order_delivery_area =
        rootState.order.selectedOrder.item.order_delivery_area
    } else if (rootState.customer.offlineData) {
      //offline data was saved
      order.customer = ''
      const address = rootState.customer.offlineData
      // address.delivery_area
      order.order_building = address.building
      order.order_street = address.street
      order.order_flat_number = address.flat_number
      order.order_nearest_landmark = address.nearest_landmark
      order.order_city = address.city
      order.order_country = address.country
      order.order_delivery_area = address.delivery_area_id

      //add user address for creating online customer request
      order.user = address
    } else {
      //network online
      order.customer = rootState.customer.customerId
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
    let deliveryAreaId = null

    if (
      rootState.order.selectedOrder &&
      rootState.order.selectedOrder.customer
    ) {
      order.customer_address_id = rootState.customer.address[0]._id
      deliveryAreaId = rootState.customer.address[0].delivery_area_id
    } else if (rootState.customer.address) {
      order.customer_address_id = rootState.customer.address._id.$oid
      deliveryAreaId = rootState.customer.address.delivery_area_id
    } else {
      deliveryAreaId = order.order_delivery_area
    }

    const deliveryArea = rootGetters['customer/findDeliveryArea'](
      deliveryAreaId
    )
    if (deliveryArea) {
      if (deliveryArea.special_order_surcharge) {
        order.delivery_surcharge = deliveryArea.special_order_surcharge
      }
    }
    //add delivery surcharges
    return Promise.resolve(order)
  },

  injectHoldOrderData({ rootState }, order) {
    if (rootState.customer.address) {
      order.customer_address_id =
        rootState.order.selectedOrder.customer.customer_addresses[0]._id.$oid
    }
    return Promise.resolve(order)
  },

  injectDineinData({ rootState }, order) {
    order.table_reservation_id =
      localStorage.getItem('reservationId') || rootState.dinein.reserverationId
    return Promise.resolve(order)
  },

  preOrderHook({ rootState, dispatch }, { order, action }) {
    if (rootState.order.orderType.OTApi == CONSTANTS.ORDER_TYPE_CALL_CENTER) {
      return dispatch('injectCrmData', order)
    }

    if (rootState.order.orderType.OTApi === CONSTANTS.ORDER_TYPE_DINE_IN) {
      return dispatch('injectDineinData', order)
    }

    if (action === CONSTANTS.ORDER_STATUS_ON_HOLD) {
      return dispatch('injectHoldOrderData', order)
    }

    return Promise.resolve(order)
  },

  paymentsHook({ rootState, getters, rootGetters, commit }, { action, order }) {
    let totalPaid = 0

    if (rootState.checkoutForm.payments.length) {
      order.order_payments = rootState.checkoutForm.payments.map(payment => {
        let orderPoints = 0
        const amount = !isNaN(payment.amount) ? payment.amount : 0

        if (payment.method.name === CONSTANTS.ORDER_PAYMENT_TYPE_LOYALTY) {
          orderPoints = rootState.checkoutForm.loyaltyPoints
        } else {
          orderPoints = amount
        }

        let paymentPart = {
          entity_id: payment.method._id,
          name: payment.method.name,
          collected: amount,
          param1: payment.cardId,
          param2: orderPoints,
          param3: payment.code,
        }

        totalPaid += amount
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

      if (rootState.order.orderType.OTApi !== CONSTANTS.ORDER_TYPE_DINE_IN) {
        order.order_payments = order.order_payments.map(item => {
          item.collected = Num.round(item.collected).toFixed(2)
          return item
        })
      }
    } else {
      //don't send any payment info for these orders below

      const actions = [
        'dine-in-place-order',
        'carhop-place-order',
        'dine-in-order-preview',
        'modify-backend-order',
        CONSTANTS.ORDER_STATUS_ON_HOLD,
      ]
      const orderTypes = [CONSTANTS.ORDER_TYPE_CALL_CENTER]

      if (
        actions.includes(action) ||
        orderTypes.includes(rootState.order.orderType.OTApi)
      ) {
        order.order_payments = []
      } else {
        //if not in above orders, possibility is it is 100% discount so send cash 0 payment
        const method = rootGetters['payment/cash']
        order.order_payments = [
          {
            entity_id: method._id,
            name: method.name,
            collected: '0.00',
            param1: '',
            param2: '',
            param3: '',
          },
        ]
      }
    }

    //order level discount

    order.item_discounts = order.item_discounts.map(discount => {
      discount.rate = Num.round(discount.rate)
      discount.price = Num.round(discount.price)
      discount.tax = Num.round(discount.tax)
      return discount
    })

    order.order_surcharges = order.order_surcharges.map(surcharge => {
      surcharge.rate = surcharge.rate
        ? Num.round(surcharge.rate)
        : surcharge.rate
      surcharge.price = Num.round(surcharge.price)
      surcharge.tax = Num.round(surcharge.tax)
      surcharge.tax_rate = surcharge.tax_rate
        ? Num.round(surcharge.tax_rate)
        : surcharge.tax_rate
      return surcharge
    })

    const orderData = getters.calculateOrderTotals(order)

    order.sub_total = orderData.subTotal.toFixed(2)
    order.total_surcharge = orderData.totalSurcharge.toFixed(2)
    order.surcharge_tax = orderData.surchargeTax.toFixed(2)
    order.total_discount = orderData.totalDiscount.toFixed(2)
    order.total_tax = orderData.totalTax.toFixed(2)
    order.balance_due = Num.round(orderData.balanceDue).toFixed(2)

    //applying Fixing

    order.tip_amount = Num.round(order.tip_amount).toFixed(2)

    order.total_paid = Num.round(totalPaid).toFixed(2)

    //if (order.delivery_surcharge) {
    order.delivery_surcharge = Num.round(order.delivery_surcharge).toFixed(2)
    //}
    let changedAmount =
      totalPaid - (orderData.balanceDue + parseFloat(order.tip_amount))
    if (changedAmount < 0) {
      changedAmount = 0
    }
    commit(mutation.SET_CHANGED_AMOUNT, changedAmount)

    order.amount_changed = Num.round(changedAmount).toFixed(2)

    return Promise.resolve(order)
  },

  addItemsToOrder({ rootState, rootGetters, dispatch }, { order, action }) {
    let itemModifiers = []
    let item_discounts = []

    order.items = []
    rootState.order.items.forEach(oitem => {
      let item = null
      if (rootState.order.splitBill) {
        if (action === 'dine-in-place-order') {
          //place order
          if (oitem.paid === false) {
            item = oitem
          }
        } else {
          //pay for order
          if (oitem.split && oitem.paid === false) {
            item = oitem
          }
        }
      } else {
        item = oitem
      }

      if (item) {
        let orderItem = {
          name: item.name,
          entity_id: item._id,
          no: item.orderIndex,
          status: 'in-progress',
          //itemTax.undiscountedTax is without modifiers
          tax: item.tax,
          price: item.netPrice,
          qty: item.quantity,
          note: item.note,
          originalItem: item,
        }
        if (typeof item.kitchen_invoice !== 'undefined') {
          orderItem['kitchen_invoice'] = item.kitchen_invoice
        }
        if (typeof item.kitchen_invoice !== 'undefined') {
          orderItem['kitchen_invoice'] = item.kitchen_invoice
        }

        //we are sending item price and modifier prices separtely but sending
        //item discount as total of both discounts

        if (item.discount) {
          let itemDiscountedTax = Num.round(
            rootGetters['order/itemTaxDiscount'](item)
          )

          if (item.discountedNetPrice) {
            const modifiersTax = rootGetters['order/itemModifiersTax'](item)
            itemDiscountedTax = item.tax + modifiersTax - item.discountedTax
          }

          const modifiersDiscountedTax = Num.round(
            rootGetters['order/itemModifierTaxDiscount'](item)
          )

          let itemDiscount = item.discount
          itemDiscount.itemId = item._id
          itemDiscount.itemNo = item.orderIndex
          itemDiscount.quantity = item.quantity
          //undiscountedTax is without modifiers

          if (item.discountedNetPrice) {
            //don't round fixed discount calculations
            itemDiscount.tax = itemDiscountedTax + modifiersDiscountedTax
          } else {
            itemDiscount.tax = Num.round(
              itemDiscountedTax + modifiersDiscountedTax
            )
          }
          itemDiscount.price =
            rootGetters['order/itemNetDiscount'](item) +
            rootGetters['order/itemModifierDiscount'](item)
          item_discounts.push(itemDiscount)
        }

        if (item.modifiersData && item.modifiersData.length) {
          item.modifiersData.forEach(modifier => {
            itemModifiers.push({
              entity_id: modifier.modifierId,
              for_item: item.orderIndex,
              price: modifier.price,
              tax: modifier.tax,
              name: modifier.name,
              qty: item.quantity,
              type: modifier.type,
            })
          })
          //get all modifiers by modifier ids attached to item
        }
        order.items.push(orderItem)
      }
    })
    order.item_discounts = item_discounts.map(itemDiscount => {
      return {
        name: itemDiscount.name,
        type: itemDiscount.type,
        rate:
          itemDiscount.type === CONSTANTS.VALUE
            ? itemDiscount.value
            : itemDiscount.rate,
        price: itemDiscount.price * itemDiscount.quantity,
        tax: itemDiscount.tax * itemDiscount.quantity,
        for_item: itemDiscount.itemNo,
        entity_id: itemDiscount.id,
      }
    })

    order.item_modifiers = itemModifiers

    return dispatch('orderItemsHook', order)
  },

  injectDineInItemsData({ rootState }, order) {
    let orderCovers = []
    order.items = order.items.map(oitem => {
      let itemCover = oitem.originalItem.coverNo
        ? oitem.originalItem.coverNo
        : rootState.dinein.selectedCover._id
      let itemCoverName = oitem.originalItem.cover_name
        ? oitem.originalItem.cover_name
        : rootState.dinein.selectedCover.name

      if (!orderCovers.some(item => item.entity_id == itemCover)) {
        if (itemCover) {
          orderCovers.push({ entity_id: itemCover, name: itemCoverName })
        }
      }

      oitem.cover_no = itemCover
      oitem.guest = rootState.dinein.guests
      oitem.cover_name = itemCoverName
      return oitem
    })
    order.covers = orderCovers
    return Promise.resolve(order)
  },

  orderItemsHook({ rootState, dispatch }, order) {
    if (rootState.order.orderType.OTApi === CONSTANTS.ORDER_TYPE_DINE_IN) {
      return dispatch('injectDineInItemsData', order)
    }
    return Promise.resolve(order)
  },

  pay({ commit, getters, rootGetters, rootState, dispatch }, { action, data }) {
    return new Promise((resolve, reject) => {
      commit(mutation.SET_PAYMENT_ACTION, action)
      dispatch('validateEvent', { action: action, data: data })
        .then(() => {
          dispatch('validatePayment', action)
            .then(() => {
              //send order for payment
              let order = {}
              const orderPlacementTime = rootState.order.startTime

              try {
                const transitionOrderNo =
                  rootState.location.store.branch_n +
                  '-' +
                  rootState.location.terminalCode +
                  '-' +
                  orderPlacementTime

                let orderStatus = CONSTANTS.ORDER_STATUS_IN_PROGRESS

                if (action === CONSTANTS.ORDER_STATUS_ON_HOLD) {
                  orderStatus = CONSTANTS.ORDER_STATUS_ON_HOLD
                }

                order = {
                  cashier_id: rootState.auth.userDetails.item._id,
                  customer: '',
                  customer_address_id: '',
                  referral: '',
                  transition_order_no: transitionOrderNo,
                  currency: rootState.location.currency,
                  order_status: orderStatus,

                  order_source: CONSTANTS.ORDER_SOURCE_POS,
                  order_type: rootState.order.orderType.OTApi,
                  order_mode: 'online',
                  //this time can be used to indentify offline order
                  real_created_datetime: orderPlacementTime,
                  // order_mode: 'online',
                  //remove the modifiers prices from subtotal
                  print_count: 0,
                  amount_changed: 0,
                  order_building: '',
                  order_street: '',
                  order_flat_number: '',
                  order_nearest_landmark: '',
                  order_city: '',
                  order_country: '',
                  order_delivery_area: '',
                  item_discounts: [],
                  item_modifiers: '',
                  order_surcharges: [],
                  order_discounts: [],
                  order_payments: [],
                }
              } catch (e) {
                // eslint-disable-next-line no-console
                console.log(e)
              }

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

              //add future order
              if (rootState.order.futureOrder) {
                order.future_order = 1
                order.future_order_date = rootState.order.futureOrder
              }

              order.order_discounts = []

              if (rootState.discount.appliedOrderDiscount) {
                const discount = rootState.discount.appliedOrderDiscount
                const orderDiscount = {
                  name: discount.name,
                  price: Num.round(
                    rootGetters['discount/orderDiscountWithoutTax']
                  ),
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

              //adding tip amount
              order.tip_amount = rootState.checkoutForm.tipAmount

              dispatch('addItemsToOrder', {
                order: order,
                action: action,
              }).then(order => {
                dispatch('preOrderHook', { action: action, order: order })
                  .then(order => {
                    dispatch('paymentsHook', {
                      order: order,
                      action: action,
                    }).then(order => {
                      //remove unwanted data
                      order.items = order.items.map(item => {
                        delete item.originalItem
                        return item
                      })
                      commit(mutation.SET_ORDER, order)

                      dispatch('createOrder', { action: action, data: data })
                        .then(response => {
                          //reset order start time
                          if (getters.complete) {
                            commit('order/RESET_ORDER_TIME', null, {
                              root: true,
                            })
                            commit(mutation.SET_PROCESSING, false)
                            commit('checkoutForm/SET_PROCESSING', false, {
                              root: true,
                            })
                            if (!['dine-in-order-preview'].includes(action)) {
                              commit('order/SET_SPLIT_BILL', null, {
                                root: true,
                              })
                            }
                          }

                          resolve(response)
                          dispatch('postOrderHook', action)
                        })
                        .catch(response => {
                          commit(mutation.SET_PROCESSING, false)
                          commit('checkoutForm/SET_PROCESSING', false, {
                            root: true,
                          })
                          reject(response)
                        })
                    })
                  })
                  .catch(() => {
                    reject()
                  })
              })
            })
            .catch(error => {
              reject(error)
            })
        })
        .catch(error => {
          reject(error)
        })
      //If order type is dine-in and order placed not paid or order is hold
    })
  },

  postOrderHook({ dispatch }, action) {
    if (['dine-in-order-preview'].includes(action)) {
      return
    }
    dispatch('transactionOrders/getTransactionOrders', null, {
      root: true,
    })
  },

  getModifyOrder({ state, rootState }) {
    let order = { ...state.order }
    order.new_real_transition_order_no =
      rootState.location.store.branch_n +
      '-' +
      rootState.location.terminalCode +
      '-' +
      rootState.order.startTime
    delete order.real_created_datetime
    if (rootState.order.selectedOrder.item.cashier_id) {
      order.cashier_id = rootState.order.selectedOrder.item.cashier_id
    } else if (rootState.order.selectedOrder.item.order_history) {
      const history = OrderHelper.lookup(
        rootState.order.selectedOrder.item,
        'order_history',
        'name',
        'ORDER_HISTORY_TYPE_RECORD_NEW'
      )
      if (history) {
        order.cashier_id = history.user
      }
    }
    return Promise.resolve(order)
  },

  modifyHoldOrder({ dispatch, rootState, rootGetters, commit }, action) {
    return new Promise(resolve => {
      dispatch('getModifyOrder').then(order => {
        OrderService.modifyOrder(order, rootState.order.orderId, 'hold')
          .then(response => {
            if (response.data.status === 'ok') {
              if (action === CONSTANTS.ORDER_STATUS_ON_HOLD) {
                let msgStr = rootGetters['location/_t'](
                  'Hold order has been updated.'
                )
                commit(
                  'checkoutForm/SET_MSG',
                  { result: '', message: msgStr },
                  {
                    root: true,
                  }
                )
                dispatch('reset')
                commit('order/CLEAR_SELECTED_ORDER', null, { root: true })

                resolve()
              } else {
                commit('order/SET_ORDER_ID', rootState.order.orderId, {
                  root: true,
                })
                commit('SET_ORDER_NUMBER', rootState.order.orderData.order_no)
                const msg = rootGetters['location/_t'](
                  'Order placed Successfully'
                )
                dispatch('setMessage', {
                  result: 'success',
                  msg: msg,
                }).then(() => {
                  resolve(response.data)
                  commit('order/CLEAR_SELECTED_ORDER', null, { root: true })
                  commit(mutation.PRINT, true)
                })
              }
              dispatch('holdOrders/getHoldOrders', {}, { root: true })
            } else {
              dispatch('handleSystemErrors', response).then(() => resolve())
            }
          })
          .catch(error => {
            dispatch('handleRejectedResponse', {
              response: error,
              offline: false,
            })
              .then(() => {
                resolve()
              })
              .catch(() => resolve())
          })
      })
    })
  },

  modifyDeliveryOrder({ dispatch, rootState, rootGetters, commit }) {
    return new Promise(resolve => {
      dispatch('getModifyOrder').then(order => {
        order.modify_reason = 'Updated from POS'
        OrderService.modifyOrder(order, rootState.order.orderId)
          .then(response => {
            if (response.data.status === 'ok') {
              let msgStr = rootGetters['location/_t'](
                'Delivery order has been updated.'
              )
              commit(
                'checkoutForm/SET_MSG',
                { result: '', message: msgStr },
                {
                  root: true,
                }
              )
              dispatch('reset')
              commit('order/CLEAR_SELECTED_ORDER', null, { root: true })
              resolve()
            } else {
              dispatch('handleSystemErrors', response).then(() => resolve())
            }
          })
          .catch(error => {
            dispatch('handleRejectedResponse', {
              response: error,
              offline: false,
            })
              .then(() => {
                resolve()
              })
              .catch(() => resolve())
          })
      })
    })
  },

  createDineOrder({ dispatch, commit, getters, rootGetters, state }, action) {
    return new Promise(resolve => {
      OrderService.saveOrder(state.order)
        .then(response => {
          if (response.data.status === 'ok') {
            commit('order/SET_ORDER_ID', response.data.id, { root: true })
            commit('SET_ORDER_NUMBER', response.data.order_no)
            //we are not printing so reset manually here
            let msg = rootGetters['location/_t']('Dinein Order has been paid')
            if (action === 'dine-in-place-order') {
              if (getters.complete) {
                //after split paid we create a new order with remaining items so at end
                //it will reach to this add/create dine in method and show split pay msg
                msg = rootGetters['location/_t']('Dinein Order has been placed')
              } else {
                msg = rootGetters['location/_t'](
                  'Payment done for selected item(s).'
                )
              }
              //Invoice APP API Call with Custom Request JSON
              dispatch('printingServer/printingServerInvoiceRaw', state.order, {
                root: true,
              })
              let resetFull = false
              if (getters.complete) {
                resetFull = true
              }
              dispatch('reset', resetFull)
            } else {
              commit(mutation.PRINT, true)
            }
            dispatch('setMessage', {
              result: 'success',
              msg: msg,
            }).then(() => {
              resolve(response.data)
            })
          } else {
            dispatch('handleSystemErrors', response).then(() => resolve())
          }
        })
        .catch(error => {
          dispatch('handleRejectedResponse', {
            response: error,
            offline: false,
          })
            .then(() => {
              resolve()
            })
            .catch(() => resolve())
        })
    })
  },
  modifyDineOrder(
    { dispatch, rootState, getters, rootGetters, commit },
    action
  ) {
    if (action === 'dine-in-order-preview') {
      return new Promise(resolve => {
        commit(mutation.PRINT, true)
        resolve()
      })
    }
    return new Promise(resolve => {
      dispatch('getModifyOrder').then(order => {
        //delete order.order_system_status
        delete order.new_real_transition_order_no
        //delete order.real_created_datetime
        OrderService.updateOrderItems(order, rootState.order.orderId)
          .then(response => {
            if (response.data.status === 'ok') {
              let msgStr = rootGetters['location/_t'](
                'Dinein order has been placed.'
              )

              if (action === 'dine-in-place-order') {
                msgStr = rootGetters['location/_t'](
                  'Dinein order has been updated.'
                )

                dispatch('createModifyOrderItemList')
                dispatch('reset', true)
                commit('order/CLEAR_SELECTED_ORDER', null, { root: true })
                resolve()
              } else {
                //order paid
                const selectedCovers = rootState.dinein.selectedCover
                commit(
                  'SET_ORDER_NUMBER',
                  rootState.order.selectedOrder.item.order_no
                )
                if (rootState.order.splitted || rootState.order.splitBill) {
                  commit('order/SET_SPLITTED', true, { root: true })
                  //mark items as paid in current execution
                  commit(
                    'order/SET_TOTAL_ITEMS_PAID',
                    state.order.items.length,
                    { root: true }
                  )
                  dispatch('order/markSplitItemsPaid', null, {
                    root: true,
                  }).then(() => {
                    if (!getters.complete) {
                      dispatch('splitOrder', {
                        action: action,
                        data: { selectedCovers: selectedCovers },
                      }).then(() => resolve())
                    } else {
                      commit('order/CLEAR_SELECTED_ORDER', null, { root: true })
                    }
                  })
                  //if splitted once
                }

                commit(mutation.PRINT, true)
                resolve()
              }

              commit(
                'checkoutForm/SET_MSG',
                { result: '', message: msgStr },
                {
                  root: true,
                }
              )
            } else {
              dispatch('handleSystemErrors', response).then(() => resolve())
            }
          })
          .catch(error => {
            dispatch('handleRejectedResponse', {
              response: error,
              offline: false,
            })
              .then(() => {
                resolve()
              })
              .catch(() => {
                resolve()
              })
          })
      })
    })
  },

  createModifyOrderItemList({ rootState, state, dispatch }) {
    let newItems = []
    rootState.order.items.forEach(item => {
      if (typeof item.no === 'undefined') {
        newItems.push({
          name: item.name,
          entity_id: item._id,
          no: item.orderIndex,
          status: 'in-progress',
          //itemTax.undiscountedTax is without modifiers
          tax: item.tax,
          price: item.netPrice,
          qty: item.quantity,
          originalItem: item,
        })
      }
    })
    if (newItems.length) {
      let order = state.order
      order.items = newItems

      dispatch('injectDineInItemsData', order).then(order => {
        order.items = order.items.map(item => {
          delete item.originalItem
          return item
        })
        dispatch('printingServer/printingServerInvoiceRaw', order, {
          root: true,
        })
      })
    }
  },
  // eslint-disable-next-line no-unused-vars
  modifyCarhopOrder({ dispatch, rootState, rootGetters, commit }, action) {
    return new Promise(resolve => {
      dispatch('getModifyOrder').then(order => {
        //delete order.order_system_status
        //delete order.real_created_datetime
        delete order.new_real_transition_order_no

        OrderService.updateOrderItems(order, rootState.order.orderId)
          .then(response => {
            if (response.data.status === 'ok') {
              let msgStr = rootGetters['location/_t'](
                'Carhop order has been placed.'
              )

              //order paid
              commit(
                'SET_ORDER_NUMBER',
                rootState.order.selectedOrder.item.order_no
              )
              commit(mutation.PRINT, true)
              commit('order/CLEAR_SELECTED_ORDER', null, { root: true })
              resolve()

              commit(
                'checkoutForm/SET_MSG',
                { result: '', message: msgStr },
                {
                  root: true,
                }
              )
            } else {
              dispatch('handleSystemErrors', response).then(() => resolve())
            }
          })
          .catch(error => {
            dispatch('handleRejectedResponse', {
              response: error,
              offline: false,
            })
              .then(() => {
                resolve()
              })
              .catch(() => {
                resolve()
              })
          })
      })
    })
  },

  modifyBackendOrder({ dispatch, rootState, rootGetters, commit }, { data }) {
    return new Promise((resolve, reject) => {
      dispatch('getModifyOrder').then(order => {
        order = { ...order, ...data }
        OrderService.modifyOrder(order, rootState.order.orderId)
          .then(response => {
            if (response.data.status === 'ok') {
              commit('order/SET_ORDER_ID', rootState.order.orderId, {
                root: true,
              })
              commit('SET_ORDER_NUMBER', rootState.order.orderData.order_no)

              const msg = rootGetters['location/_t']('Order has been modified.')
              dispatch('setMessage', {
                result: 'success',
                msg: msg,
              }).then(() => {
                resolve(response.data)
                commit(mutation.PRINT, true)
                commit('order/CLEAR_SELECTED_ORDER', null, { root: true })
              })
            } else {
              dispatch('handleSystemErrors', response).then(() =>
                reject(response)
              )
            }
          })
          .catch(error => {
            dispatch('handleRejectedResponse', {
              response: error,
              offline: false,
            })
              .then(() => {
                reject(error)
              })
              .catch(() => {
                reject(error)
              })
          })
      })
    })
  },

  createWalkinOrder({ dispatch, commit, rootGetters }) {
    return new Promise(resolve => {
      OrderService.saveOrder(state.order)
        .then(response => {
          if (response.data.status === 'ok') {
            commit('order/SET_ORDER_ID', response.data.id, { root: true })
            commit('SET_ORDER_NUMBER', response.data.order_no)

            const msg = rootGetters['location/_t']('Order placed Successfully')
            dispatch('setMessage', {
              result: 'success',
              msg: msg,
            }).then(() => {
              resolve(response.data)
              commit(mutation.PRINT, true)
              dispatch('iosWebviewPrintAction', { orderData: state.order })
            })
          } else {
            dispatch('handleSystemErrors', response).then(() => resolve())
          }
        })
        .catch(error => {
          dispatch('handleRejectedResponse', {
            response: error,
            offline: true,
          })
            .then(() => {
              commit(mutation.PRINT, true)
              resolve()
            })
            .catch(() => resolve())
        })
    })
  },

  createDeliveryOrder({ rootGetters, commit, dispatch }) {
    return new Promise(resolve => {
      OrderService.saveOrder(state.order)
        .then(response => {
          if (response.data.status === 'ok') {
            commit('order/SET_ORDER_ID', response.data.id, { root: true })
            commit('SET_ORDER_NUMBER', response.data.order_no)

            const msg = rootGetters['location/_t']('Order placed Successfully')
            dispatch('setMessage', {
              result: 'success',
              msg: msg,
            }).then(() => {
              resolve(response.data)
              commit(mutation.PRINT, true)
              dispatch('iosWebviewPrintAction', { orderData: state.order })
            })
          } else {
            dispatch('handleSystemErrors', response).then(() => resolve())
          }
        })
        .catch(error => {
          dispatch('handleRejectedResponse', {
            response: error,
            offline: true,
          })
            .then(() => {
              commit(mutation.PRINT, true)
              resolve()
            })
            .catch(() => resolve())
        })
    })
  },

  createHoldOrder({ dispatch, commit, rootGetters }) {
    return new Promise(resolve => {
      OrderService.saveOrder(state.order)
        .then(response => {
          if (response.data.status === 'ok') {
            commit('order/SET_ORDER_ID', response.data.id, { root: true })
            commit('SET_ORDER_NUMBER', response.data.order_no)
            //we are not printing so reset manually here
            dispatch('reset')

            const msg = rootGetters['location/_t'](
              'Order has been put on hold.'
            )
            dispatch('setMessage', {
              result: 'success',
              msg: msg,
            }).then(() => {
              resolve(response.data)
              dispatch('holdOrders/getHoldOrders', {}, { root: true })
            })
          } else {
            dispatch('handleSystemErrors', response).then(() => resolve())
          }
        })
        .catch(error => {
          dispatch('handleRejectedResponse', {
            response: error,
            offline: false,
          })
            .then(() => {
              resolve()
            })
            .catch(() => resolve())
        })
    })
  },

  splitOrder({ dispatch, rootState, commit }, { data }) {
    let unpaidItems = rootState.order.items.filter(item => item.paid === false)

    unpaidItems = unpaidItems.map((item, key) => {
      item.oldIndex = item.no
      item.no = key
      item.orderIndex = key
      return item
    })

    commit('order/RESET', false, { root: true })

    dispatch('checkoutForm/reset', 'complete', { root: true })
    dispatch('discount/reset', {}, { root: true })
    dispatch('surcharge/reset', {}, { root: true })

    dispatch('order/startOrder', null, { root: true })

    commit('order/UPDATE_ITEMS', unpaidItems, { root: true })

    // eslint-disable-next-line no-unused-vars

    //provide previously selected covers
    commit('dinein/SET_COVER', data.selectedCovers, { root: true })

    return new Promise((resolve, reject) => {
      dispatch('pay', {
        action: 'dine-in-place-order',
        data: { route: 'splitOrder' },
      })
        .then(newOrder => {
          dispatch('dinein/getSelectedOrder', newOrder.id, {
            root: true,
          })
            .then(() => {
              commit(mutation.SPLIT_PAID, true)
              commit('order/SET_SPLITTED', true, { root: true })
              resolve()
            })
            .catch(error => reject(error))
          //new order has been created with remaining orders,
          //order items have same old order indexes so we need to update them before next order isplaced
          commit('order/SET_SPLIT_BILL', false, { root: true })
        })
        .catch(error => reject(error))
    })
  },
  // eslint-disable-next-line no-unused-vars
  createCarhopOrder({ dispatch, commit, rootGetters, state }, action) {
    return new Promise(resolve => {
      OrderService.saveOrder(state.order)
        .then(response => {
          if (response.data.status === 'ok') {
            commit('order/SET_ORDER_ID', response.data.id, { root: true })
            commit('SET_ORDER_NUMBER', response.data.order_no)
            //we are not printing so reset manually here

            const msg = rootGetters['location/_t'](
              'Carhop Order has been placed'
            )
            //Invoice APP API Call with Custom Request JSON
            dispatch('printingServer/printingServerInvoiceRaw', state.order, {
              root: true,
            })
            dispatch('reset')

            dispatch('setMessage', {
              result: 'success',
              msg: msg,
            }).then(() => {
              resolve(response.data)
            })
          } else {
            dispatch('handleSystemErrors', response).then(() => resolve())
          }
        })
        .catch(error => {
          dispatch('handleRejectedResponse', {
            response: error,
            offline: false,
          })
            .then(() => {
              resolve()
            })
            .catch(() => resolve())
        })
    })
  },

  handleSystemErrors({ dispatch }, response) {
    let error = ''
    if (response.data.status == 'form_errors') {
      for (let i in response.data.form_errors) {
        response.data.form_errors[i].forEach(err => (error += ' ' + err))
      }
    } else {
      error =
        typeof response.data.error !== 'undefined'
          ? response.data.error
          : response.data.message
    }

    return dispatch('setMessage', {
      result: 'error',
      msg: error,
    })
  },
  handleRejectedResponse({ dispatch }, { response, offline = false }) {
    if (offline && response.message === 'Network Error') {
      return dispatch('handleNetworkError', response)
    }
    var err_msg = ''
    if (
      response.data &&
      response.data[response.data.status] &&
      typeof response.data[response.data.status] != 'undefined'
    ) {
      response.data[response.data.status].forEach(value => {
        err_msg += value + ' '
      })
    }

    if (response.data && response.data.error) {
      err_msg = response.data.error
    }

    dispatch('setMessage', {
      result: 'error',
      msg: err_msg,
    })
    return Promise.reject(err_msg)
  },
  handleNetworkError({ rootGetters, commit }) {
    let errorMsg = rootGetters['location/_t'](
      'System went offline. Order is queued for sending later'
    )
    commit(
      'checkoutForm/SET_MSG',
      { result: '', message: errorMsg },
      {
        root: true,
      }
    )
    return Promise.resolve()
  },
  setMessage({ commit }, { result, msg = '' }) {
    commit(
      'checkoutForm/SET_MSG',
      { message: msg, result: result },
      {
        root: true,
      }
    )
    return Promise.resolve()
  },

  createOrder({ rootState, dispatch, commit }, { action, data }) {
    commit(
      'checkoutForm/SET_MSG',
      { message: '', result: 'loading' },
      {
        root: true,
      }
    )

    commit(mutation.PAYMENT_MSG_STATUS, false)

    //orderStatus === CONSTANTS.ORDER_STATUS_ON_HOLD means order was on hold and we want to modify it
    //orderStatus === CONSTANTS.ORDER_STATUS_IN_DELIVERY means this order was made as delivery order
    //                already but we want to modify it from delivery manager

    //order.orderType.OTApi == CONSTANTS.ORDER_TYPE_CALL_CENTER means its a new delivery order
    // we send user directly to delivery manager after printing invoice so we auto print inoivce
    // without waiting for a button to be clicked

    //order.order is a hold order, state.order contains current order
    if (rootState.order.orderStatus === CONSTANTS.ORDER_STATUS_ON_HOLD) {
      return dispatch('modifyHoldOrder', action)
    } else if (
      rootState.order.orderStatus === CONSTANTS.ORDER_STATUS_IN_DELIVERY
    ) {
      return dispatch('modifyDeliveryOrder')
    } else if (action === 'modify-backend-order') {
      return dispatch('modifyBackendOrder', { action: action, data: data })
    } else if (action === CONSTANTS.ORDER_STATUS_ON_HOLD) {
      return dispatch('createHoldOrder')
    } else if (
      rootState.order.orderType.OTApi === CONSTANTS.ORDER_TYPE_CALL_CENTER
    ) {
      return dispatch('createDeliveryOrder')
    } else if (
      rootState.order.orderType.OTApi === CONSTANTS.ORDER_TYPE_DINE_IN
    ) {
      if (rootState.order.order_status !== 'completed') {
        if (rootState.order.orderId || action === 'dine-in-order-preview') {
          return dispatch('modifyDineOrder', action)
        } else {
          return dispatch('createDineOrder', action)
        }
      }
    } else if (
      rootState.order.orderType.OTApi === CONSTANTS.ORDER_TYPE_CARHOP
    ) {
      if (action === 'carhop-place-order' || !rootState.order.orderId) {
        return dispatch('createCarhopOrder', action)
      } else {
        return dispatch('modifyCarhopOrder', action)
      }
    } else {
      return dispatch('createWalkinOrder')
    }
  },

  generateInvoice() {
    //commit(mutation.PRINT, true)
  },
  reset({ state, commit, dispatch, getters }, full = true) {
    if (['dine-in-order-preview'].includes(state.paymentAction)) {
      return
    }
    commit(mutation.RESET, full)

    dispatch('checkoutForm/reset', {}, { root: true })
    dispatch('discount/reset', {}, { root: true })
    dispatch('surcharge/reset', {}, { root: true })
    if (full && getters.complete) {
      dispatch('order/reset', {}, { root: true })
      dispatch('customer/reset', {}, { root: true })
      dispatch('location/reset', {}, { root: true })
    }
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

  iosWebviewPrintAction({ rootState, dispatch }, { orderData }) {
    //Detect IOS device WebViews
    let standalone = window.navigator.standalone,
      userAgent = window.navigator.userAgent.toLowerCase(),
      safari = /safari/.test(userAgent),
      ios = /iphone|ipod|ipad/.test(userAgent)

    if (ios) {
      /*if (!standalone && safari) {
          window.location.href = 'print.me1'
        } else if (standalone && !safari) {
          window.location.href = 'print.me2'
        } else */
      if (!standalone && !safari) {
        //This is  a uiwebview
        const urlParams = new URLSearchParams(window.location.search)
        urlParams.set('iosprint', '1')
        window.location.search = urlParams
      }
    }
    if (orderData) {
      let staff = rootState.auth.userDetails
      let customerDetails = rootState.customer
      let locationData = rootState.location
      let customerId = orderData.customer
      let customerData = [] //Customer Information
      let delivery_area = {} //Delivery Area
      let kitchen_menu_items = []

      //Customer Data
      if (customerId) {
        //get customer name by customer id
        dispatch('customer/fetchSelectedCustomer', customerId, {
          root: true,
        }).then(customer => {
          customerData.push(customer)
        })
        if (orderData.order_delivery_area && customerDetails.deliveryAreas) {
          delivery_area = Object.values(customerDetails.deliveryAreas).find(
            delivery_area => delivery_area._id === orderData.order_delivery_area
          )
        }
      }
      //Item according to Kitchens Sections
      let kitchenSectionsItems = rootState.printingServer.kitchenitems
      if (kitchenSectionsItems.length) {
        orderData.items.forEach(item => {
          let itemKitchen = kitchenSectionsItems.find(
            kitchenItem => kitchenItem._id === item.entity_id
          )
          if (itemKitchen) {
            kitchen_menu_items.push({
              _id: itemKitchen._id,
              category: itemKitchen.category,
              kitchen: itemKitchen.kitchen,
            })
          }
        })
      }
      dispatch('printingServer/convertDatetime', {
        datetime: orderData.real_created_datetime,
        format: 'Do MMMM YYYY',
      })
      dispatch('printingServer/convertDatetime', {
        datetime: orderData.real_created_datetime,
        format: 'h:mm:ss A',
      })
      //Created Date
      // let timezoneString = locationData.timezoneString
      let created_date = rootState.printingServer.createdDateTime.date
      //Created Time
      let created_time = rootState.printingServer.createdDateTime.time
      //Crm Module Permission
      let crm_module_enabled = false
      let cb = locationData.brand
      for (var module of cb.enabled_modules) {
        if (module == 'CRM') {
          crm_module_enabled = true
        }
      }
      if (!rootState.invoice.templates) {
        return
      }
      //Invoice
      let invoiceTemplate = rootState.invoice.templates.data.data.find(
        invoice => invoice
      )
      let orderTypeLabel = orderData.order_type + '_label'
      orderData.order_no = orderData.orderNumber //Custom Order No to give appropriate field for Habib
      //Final JSON
      let jsonResponse = {
        status: 'ok',
        brand_logo: locationData.brand.company_logo
          ? locationData.brand.company_logo
          : '',
        order: orderData,
        menu_items: kitchen_menu_items,
        staff: staff.item.name,
        customer: customerData,
        delivery_area: delivery_area,
        template: invoiceTemplate,
        order_type: invoiceTemplate[orderTypeLabel],
        created_date: created_date,
        created_time: created_time,
        crm_module_enabled: crm_module_enabled,
        translations: rootState.payment.appInvoiceData, //Unstable
        default_header_brand: locationData.brand.name,
        default_header_branch: locationData.store.city + ' Branch',
        default_header_phone: 'Tel No. ' + locationData.brand.contact_phone,
        generate_time: orderData.real_created_datetime,
        flash_message: 'Order Details',
        store_id: rootState.context.storeId,
      }
      let x = JSON.stringify(jsonResponse)
      // let b = new Buffer(x)
      // let stringifyResponse = b.toString('base64')
      let decodedData = compressToBase64(x)
      let url = `printorder?len=` + decodedData.length + `&data=` + decodedData
      localStorage.setItem('orderKitchenInvoiceData', url) //This localstorage variable hold Kitchen invoice api request collection for IOS Webviews. IOS Webviews does not display default Browser Print Window.
    }
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
    let order = { ...state.order }
    order.orderNumber = state.orderNumber
    state.order = order
  },
  [mutation.LOADING](state, loadingStatus) {
    state.loading = loadingStatus
  },
  [mutation.CHANGE_AMOUNT_STATUS](state, status) {
    state.changeAmountStatus = status
  },
  [mutation.PAYMENT_MSG_STATUS](state, status) {
    state.paymentMsgStatus = status
  },
  [mutation.SET_PROCESSING](state, status) {
    state.processing = status
  },
  [mutation.UPDATE_ITEMS](state, items) {
    state.order.items = items
  },
  [mutation.SET_PAYMENT_ACTION](state, action) {
    state.paymentAction = action
  },
  [mutation.SPLIT_PAID](state, action) {
    state.splitPaid = action
  },
  [mutation.RESET](state, full = true) {
    state.paidAmount = 0
    state.payableAmount = 0
    state.pendingAmount = 0
    state.print = false
    if (full) {
      state.order = false
      state.splitPaid = false
    }
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

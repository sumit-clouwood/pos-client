import OrderService from '@/services/data/OrderService'
import * as mutation from './checkout/mutation-types'
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
  loading: false,
  orderNumber: null,
  changeAmountStatus: false,
  paymentMsgStatus: false,
  processing: false,
}

// getters
const getters = {
  complete: (state, getters, rootState) => {
    if (!rootState.order.splitBill) {
      return true
    }
    return !rootState.order.items.some(item => item.paid === false)
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
      data.subTotal += Num.round(Num.round(item.price) * Num.round(item.qty))
      data.totalTax += Num.round(Num.round(item.tax) * Num.round(item.qty))
    })

    order.item_modifiers.forEach(modifier => {
      data.subTotal += Num.round(
        Num.round(modifier.price) * Num.round(modifier.qty)
      )
      data.totalTax += Num.round(
        Num.round(modifier.tax) * Num.round(modifier.qty)
      )
    })

    order.order_surcharges.forEach(surcharge => {
      data.totalSurcharge += Num.round(surcharge.price)
      data.surchargeTax += Num.round(surcharge.tax)
      data.totalTax += Num.round(surcharge.tax)
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
      action == 'dine-in-place-order' ||
      action === CONSTANTS.ORDER_STATUS_ON_HOLD
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
    // see if there is a change amount
    const changedAmount = paid - totalPayable
    commit(mutation.SET_CHANGED_AMOUNT, changedAmount)
    return Promise.resolve()
  },

  validateEvent({ commit, rootState }) {
    if (state.processing === true) {
      // eslint-disable-next-line no-console
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
    return Promise.resolve()
  },

  injectCrmData({ rootState }, order) {
    if (rootState.order.orderStatus === CONSTANTS.ORDER_STATUS_IN_DELIVERY) {
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

    if (rootState.customer.address) {
      order.customer_address_id = rootState.customer.address._id.$oid
    }

    return Promise.resolve(order)
  },

  injectHoldOrderData({ rootState }, order) {
    if (rootState.customer.address) {
      order.customer_address_id = rootState.customer.address._id.$oid
    }
    return Promise.resolve(order)
  },

  injectDineinData({ rootState }, order) {
    order.table_reservation_id =
      localStorage.getItem('reservationId') || rootState.dinein.reserverationId
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

  paymentsHook({ rootState, rootGetters }, { action, order }) {
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
    } else if (
      rootState.order.orderType.OTApi === CONSTANTS.ORDER_TYPE_CALL_CENTER ||
      action === CONSTANTS.ORDER_STATUS_ON_HOLD
    ) {
      //do something here
    } else {
      const method = rootGetters['payment/cash']
      if (action != 'dine-in-place-order') {
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
    order.total_paid = Num.round(totalPaid).toFixed(2)
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
      let itemCover = oitem.coverNo
        ? oitem.coverNo
        : rootState.dinein.selectedCover._id
      let itemCoverName = oitem.cover_name
        ? oitem.cover_name
        : rootState.dinein.selectedCover.name
      if (
        orderCovers.filter(item => item.entity_id == itemCover).length === 0
      ) {
        orderCovers.push({ entity_id: itemCover, name: itemCoverName })
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

  pay(
    { commit, getters, rootGetters, rootState, dispatch, state },
    { action }
  ) {
    return new Promise((resolve, reject) => {
      dispatch('validateEvent')
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
                //order level discount

                order.item_discounts = order.item_discounts.map(discount => {
                  discount.rate = Num.round(discount.rate).toFixed(2)
                  discount.price = Num.round(discount.price).toFixed(2)
                  discount.tax = Num.round(discount.tax).toFixed(2)
                  return discount
                })

                order.order_surcharges = order.order_surcharges.map(
                  surcharge => {
                    surcharge.rate = surcharge.rate
                      ? Num.round(surcharge.rate).toFixed(2)
                      : surcharge.rate
                    surcharge.price = Num.round(surcharge.price).toFixed(2)
                    surcharge.tax = Num.round(surcharge.tax).toFixed(2)
                    surcharge.tax_rate = surcharge.tax_rate
                      ? Num.round(surcharge.tax_rate).toFixed(2)
                      : surcharge.tax_rate
                    return surcharge
                  }
                )

                //formatting
                order.items = order.items.map(item => {
                  item.price = Num.round(item.price).toFixed(2)
                  item.tax = Num.round(item.tax).toFixed(2)
                  return item
                })

                order.item_modifiers = order.item_modifiers.map(item => {
                  item.price = Num.round(item.price).toFixed(2)
                  item.tax = Num.round(item.tax).toFixed(2)
                  return item
                })

                const orderData = getters.calculateOrderTotals(order)

                order.sub_total = orderData.subTotal.toFixed(2)
                order.total_surcharge = orderData.totalSurcharge.toFixed(2)
                order.surcharge_tax = orderData.surchargeTax.toFixed(2)
                order.total_discount = orderData.totalDiscount.toFixed(2)
                order.total_tax = orderData.totalTax.toFixed(2)
                order.balance_due = Num.round(orderData.balanceDue).toFixed(2)

                //applying Fixing

                order.amount_changed = Num.round(order.amount_changed).toFixed(
                  2
                )
                order.tip_amount = Num.round(order.tip_amount).toFixed(2)

                dispatch('preOrderHook', { action: action, order: order })
                  .then(order => {
                    dispatch('paymentsHook', {
                      order: order,
                      action: action,
                    }).then(order => {
                      commit(mutation.SET_ORDER, order)
                      dispatch('createOrder', action)
                        .then(response => {
                          //reset order start time
                          if (getters.complete) {
                            commit('order/RESET_ORDER_TIME', null, {
                              root: true,
                            })
                            commit(mutation.SET_PROCESSING, false)
                            commit('order/SET_SPLIT_BILL', null, { root: true })
                          }

                          resolve(response)
                          dispatch('postOrderHook')
                        })
                        .catch(response => {
                          commit(mutation.SET_PROCESSING, false)
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

  postOrderHook({ dispatch }) {
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
                  'Hold order has been modified.'
                )
                commit(
                  'checkoutForm/SET_MSG',
                  { result: '', message: msgStr },
                  {
                    root: true,
                  }
                )
                dispatch('reset')
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
                'Delivery order has been modified.'
              )
              commit(
                'checkoutForm/SET_MSG',
                { result: '', message: msgStr },
                {
                  root: true,
                }
              )
              dispatch('reset')
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

  modifyDineOrder(
    { dispatch, rootState, getters, rootGetters, commit },
    action
  ) {
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
                  'Dinein order has been modified.'
                )
                let resetFull = false
                if (getters.complete) {
                  resetFull = true
                }
                dispatch('reset', resetFull)
                resolve()
              } else {
                //order paid
                commit(mutation.PRINT, true)
                commit(
                  'SET_ORDER_NUMBER',
                  rootState.order.selectedOrder.item.order_no
                )
                if (rootState.order.splitBill) {
                  //mark items as paid in current execution
                  dispatch('order/markSplitItemsPaid', null, { root: true })
                }

                resolve()

                // if (getters.complete) {
                //   resolve()
                // } else {
                //   //create another order with same reservation id but with remaining items
                //   //dispatch('splitOrder').then(() => resolve())
                // }
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

  modifyBackendOrder({ dispatch, rootState, rootGetters, commit }) {
    return new Promise(resolve => {
      dispatch('getModifyOrder').then(order => {
        order.modify_reason = 'Updated from backend'
        OrderService.modifyOrder(order, rootState.order.orderId)
          .then(response => {
            if (response.data.status === 'ok') {
              let msgStr = rootGetters['location/_t'](
                'Delivery order has been modified.'
              )
              commit(
                'checkoutForm/SET_MSG',
                { result: '', message: msgStr },
                {
                  root: true,
                }
              )
              dispatch('reset')
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
              .catch(() => {
                resolve()
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

  splitOrder({ dispatch, rootState, commit }) {
    const unpaidItems = rootState.order.items.filter(
      item => item.paid === false
    )

    commit('order/RESET', false, { root: true })
    dispatch('checkoutForm/reset', {}, { root: true })
    dispatch('discount/reset', {}, { root: true })
    dispatch('surcharge/reset', {}, { root: true })

    dispatch('order/startOrder', null, { root: true })
    commit(mutation.UPDATE_ITEMS, unpaidItems)
    return dispatch('pay', { action: 'dine-in-place-order' })
  },

  createDineOrder({ dispatch, commit, rootGetters }, action) {
    return new Promise(resolve => {
      OrderService.saveOrder(state.order)
        .then(response => {
          if (response.data.status === 'ok') {
            commit('order/SET_ORDER_ID', response.data.id, { root: true })
            commit('SET_ORDER_NUMBER', response.data.order_no)
            //we are not printing so reset manually here
            let msg = rootGetters['location/_t']('Dinein Order has been paid')
            if (action === 'dine-in-place-order') {
              msg = rootGetters['location/_t']('Dinein Order has been placed')
              dispatch('reset')
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

  createOrder({ rootState, dispatch, commit }, action) {
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
    } else if (rootState.order.orderToModify) {
      return dispatch('modifyBackendOrder')
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
        if (rootState.order.orderId) {
          return dispatch('modifyDineOrder', action)
        } else {
          return dispatch('createDineOrder', action)
        }
      }
    } else {
      return dispatch('createWalkinOrder')
    }
  },

  generateInvoice() {
    //commit(mutation.PRINT, true)
  },
  reset({ commit, dispatch }, full = true) {
    commit(mutation.RESET, full)

    dispatch('checkoutForm/reset', {}, { root: true })
    dispatch('discount/reset', {}, { root: true })
    dispatch('surcharge/reset', {}, { root: true })
    dispatch('customer/reset', {}, { root: true })
    dispatch('location/reset', {}, { root: true })
    if (full) {
      dispatch('order/reset', {}, { root: true })
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
  [mutation.RESET](state, full = true) {
    state.paidAmount = 0
    state.payableAmount = 0
    state.pendingAmount = 0
    state.print = false
    if (full) {
      state.order = false
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

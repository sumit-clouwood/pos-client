import OrderService from '@/services/data/OrderService'
import * as mutation from './checkout/mutation-types'
import Num from '@/plugins/helpers/Num.js'
import * as CONSTANTS from '@/constants'
import { compressToBase64, decompressFromBase64 } from 'lz-string'
import OrderHelper from '@/plugins/helpers/Order'
import CompareData from '@/plugins/helpers/CompareData'

// import * as CONST from '@/constants'
/* eslint-disable */
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
  route: null,
  orderCreationSource: '',
  orderItemsPayload: {},
  dineInSplitedItems: false,
  loaylty_earn_points: [],
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
      if (item.for_combo === false) {
        data.subTotal += Num.round(Num.round(item.price) * Num.round(item.qty))
        data.totalTax += Num.round(Num.round(item.tax) * Num.round(item.qty))
      }
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
        'carhop-update-order',
        'dine-in-order-preview',
        'modify-backend-order',
        'takeaway-place-order',
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

    if (rootState.customer.offlineData) {
      //offline data was saved
      order.customer = ''
      const address = rootState.customer.offlineData
      // address.delivery_area
      order.order_building = address.building
      order.order_street = address.street
      order.order_flat_number = address.flat_number
      order.order_nearest_landmark = address.nearest_landmark
      order.order_city = rootGetters['customer/getElementByAreaId'](
        address.delivery_area_id,
        2
      )
      order.order_country = rootGetters['customer/getElementByAreaId'](
        address.delivery_area_id,
        1
      )
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
      order.order_city = rootGetters['customer/getElementByAreaId'](
        address.delivery_area_id,
        2
      )
      order.order_country = rootGetters['customer/getElementByAreaId'](
        address.delivery_area_id,
        1
      )
      order.order_delivery_area = address.delivery_area_id
    }
    let deliveryAreaId = null

    if (
      rootState.order.selectedOrder &&
      rootState.order.selectedOrder.customer &&
      Array.isArray(rootState.customer.address)
    ) {
      order.customer_address_id = rootState.customer.address[0]._id
      deliveryAreaId = rootState.customer.address[0].delivery_area_id
    } else if (rootState.customer.address) {
      order.customer_address_id = rootState.customer.address._id.$oid || rootState.customer.address._id
      deliveryAreaId = rootState.customer.address.delivery_area_id
    } else {
      deliveryAreaId = order.order_delivery_area
    }

    const deliveryArea = rootGetters['customer/findDeliveryArea'](
      deliveryAreaId
    )
    console.log(deliveryArea, 'delivery area, dd')
    let isDeliverySurchargeRemoved =
      rootState.surcharge.isDeliverySurchargeRemoved
    if (deliveryArea) {
      if (deliveryArea.special_order_surcharge && !isDeliverySurchargeRemoved) {
        order.delivery_surcharge = deliveryArea.special_order_surcharge
      } else {
        order.delivery_surcharge = 0
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

  injectWalkinData({ rootState, rootGetters }, order) {
    if (rootGetters['location/isTokenManager']) {
      let tokenNumber = localStorage.getItem('token_number')
        ? localStorage.getItem('token_number')
        : rootState.location.tokenNumber
      order.token_number = tokenNumber
    }
    return Promise.resolve(order)
  },
  injectTakeawayData({ rootState, rootGetters }, order) {
    // eslint-disable-next-line no-console
    console.log(state.order)
    if (typeof order.items !== 'undefined') {
      order.items = order.items.map(oitem => {
        oitem.kitchen_invoice = 1
        return oitem
      })
    }
    return Promise.resolve(order)
  },

  preOrderHook({ rootState, dispatch }, { order, action }) {
    if (rootState.order.orderType.OTApi == CONSTANTS.ORDER_TYPE_CALL_CENTER) {
      return dispatch('injectCrmData', order)
    }
    if (rootState.order.orderType.OTApi == CONSTANTS.ORDER_TYPE_TAKEAWAY) {
      return dispatch('injectTakeawayData', order)
    }

    if (rootState.order.orderType.OTApi === CONSTANTS.ORDER_TYPE_DINE_IN) {
      return dispatch('injectDineinData', order)
    }
    if (
      rootState.order.orderType.OTApi === CONSTANTS.ORDER_TYPE_WALKIN &&
      !rootState.sync.online
    ) {
      return dispatch('injectWalkinData', order)
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
        let amount = !isNaN(payment.amount) ? payment.amount : 0

        if (payment.method.name === CONSTANTS.ORDER_PAYMENT_TYPE_LOYALTY) {
          amount = parseFloat(rootState.checkoutForm.loyaltyAmount)
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

        if (payment.response) {
          paymentPart.response = payment.response
        }

        totalPaid += amount
        //Yuvraj, have a check here
        if (payment.method.type == CONSTANTS.LOYALTY) {
          /*if (parseFloat(rootState.customer.customerLoyalty.card.balance) > 0) {
            order.loyalty_customer = {
              balance: rootState.customer.customerLoyalty.card.balance,
              redeemed_amount_value: rootState.checkoutForm.loyaltyAmount,
            }
          }*/
          if (!order.customer) order.customer = rootState.customer.customerId
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
        'takeaway-place-order',
        'carhop-place-order',
        'carhop-update-order',
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
      discount.rate = Num.round(discount.rate).toFixed(2)
      discount.price = Num.round(discount.price).toFixed(2)
      discount.tax = Num.round(discount.tax).toFixed(2)
      return discount
    })

    order.order_surcharges = order.order_surcharges.map(surcharge => {
      surcharge.rate = surcharge.rate
        ? Num.round(surcharge.rate).toFixed(2)
        : surcharge.rate
      surcharge.price = Num.round(surcharge.price).toFixed(2)
      surcharge.tax = Num.round(surcharge.tax).toFixed(2)
      surcharge.tax_rate = surcharge.tax_rate
        ? Num.round(surcharge.tax_rate).toFixed(2)
        : surcharge.tax_rate
      return surcharge
    })

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

    order.tip_amount = Num.round(order.tip_amount).toFixed(2)

    order.total_paid = Num.round(totalPaid).toFixed(2)
    //if (order.delivery_surcharge) {
    order.delivery_surcharge = Num.round(order.delivery_surcharge).toFixed(2)
    //}

    /*
    Note: if coming from split order, means order was paid partially and
    for remaining items a new order is being created, but this new
    order should be silent, it should retain the previous change amount
    otherwise it ll be overwritten with empty
    for split order actually two order calls ll be placed, first one ll
    not contain route split order and otherone (creating new order) ll have
    route split order, ignore it
    */

    let changedAmount =
      totalPaid - (orderData.balanceDue + parseFloat(order.tip_amount))
    if (changedAmount < 0) {
      changedAmount = 0
    }
    if (state.orderCreationSource === 'splitOrder') {
      //to do
    } else {
      commit(mutation.SET_CHANGED_AMOUNT, changedAmount)
    }

    order.amount_changed = Num.round(changedAmount).toFixed(2)

    return Promise.resolve(order)
  },

  addItemsToOrder(
    { rootState, dispatch, state, rootGetters },
    { order, action }
  ) {
    order.items = []
    let item_discounts = []
    let itemModifiers = []
    rootState.order.items.forEach(oitem => {
      let item = null
      //reset modifiers
      // commit(mutation.ITEM_MODIFIERS_COLLECTION, false)
      if (rootState.order.splitBill || rootState.order.selectItemsToMove) {
        if (action === 'dine-in-place-order') {
          //place order
          /* !oitem.split condition added in top because when we move items after placed not selected item, again place selected item its become empty*/
          if (!oitem.split && oitem.paid === false) {
            item = oitem
          }
          if (
            oitem.split &&
            oitem.paid === false &&
            !rootState.dinein.moveItemTableId
          ) {
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
        if (typeof item.no !== 'undefined' && item.no > -1) {
          item['kitchen_invoice'] = 0
        } else {
          item['kitchen_invoice'] = 1
        }
        let orderItem = {
          name: item.name,
          entity_id: item._id,
          no: item.orderIndex,
          status: 'in-progress',
          //itemTax.undiscountedTax is without modifiers
          tax: item.tax,
          item_serving_time: item.item_serving_time,
          //barcode needs to be printed on invoice
          barcode: item.barcode,
          price: item.netPrice,
          qty: item.quantity || 1,
          note: item.note,
          originalItem: item,
          kitchen_invoice: item['kitchen_invoice'],
          type: item.item_type || 'regular',
          for_combo: false,
        }
        //add store id with item if available
        if (item.store_id) {
          orderItem.store_id = item.store_id
        }

        if (item.measurement_unit) {
          orderItem.measurement_unit = item.measurement_unit
        }

        if (item.measurement_weight) {
          orderItem.qty = 1
          orderItem.measurement_weight = item.measurement_weight
        }

        if (item.unit_price) {
          orderItem.unit_price = item.unit_price
          orderItem.unit_tax = item.unit_tax
        }

        //we are sending item price and modifier prices separtely but sending
        //item discount as total of both discounts
        // eslint-disable-next-line no-console
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

          if (item.store_id) {
            itemDiscount.store_id = item.store_id
          }
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
            let modifierEntity = {
              entity_id: modifier.modifierId,
              for_item: item.orderIndex,
              price: modifier.price,
              tax: modifier.tax,
              name: modifier.name,
              qty: item.quantity,
              type: modifier.type,
            }
            if (modifier.store_id) {
              modifierEntity.store_id = modifier.store_id
            }
            itemModifiers.push(modifierEntity)
          })
          //get all modifiers by modifier ids attached to item
        }

        order.items.push(orderItem)
      }
    })

    order.item_discounts = item_discounts.map(itemDiscount => {
      let discountData = {
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

      if (itemDiscount.store_id) {
        discountData.store_id = itemDiscount.store_id
      }

      return discountData
    })

    order.item_modifiers = itemModifiers

    return dispatch('orderItemsHook', order)
  },

  injectDineInItemsData({ rootState }, order) {
    let orderCovers = []
    order.items = order.items.map(oitem => {
      let itemCover =
        oitem.originalItem && oitem.originalItem.coverNo
          ? oitem.originalItem.coverNo
          : rootState.dinein.selectedCover._id
      let itemCoverName =
        oitem.originalItem && oitem.originalItem.cover_name
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

  injectCarHopItemsData({ state }, order) {
    // eslint-disable-next-line no-console
    console.log(state.order)
    if (typeof order.items !== 'undefined') {
      order.items = order.items.map(oitem => {
        oitem.kitchen_invoice = 1
        return oitem
      })
    }
    return Promise.resolve(order)
  },

  orderItemsHook({ rootState, dispatch }, order) {
    return new Promise(resolve => {
      dispatch('prepareComboItems', order).then(order => {
        if (rootState.order.orderType.OTApi === CONSTANTS.ORDER_TYPE_DINE_IN) {
          dispatch('injectDineInItemsData', order).then(() => resolve(order))
        } else {
          resolve(order)
        }
      })
    })
  },

  prepareComboItems({ rootGetters }, order) {
    return new Promise(resolve => {
      //prepare combo items here
      let comboItems = []
      let comboItemsModifiers = []
      let latestOrderIndex = rootGetters['order/orderIndex']

      order.items.forEach(item => {
        //item is combo here
        if (item.type == CONSTANTS.COMBO_ITEM_TYPE) {
          //get items from combo and prepare them as checkout
          const itemsInCombo = rootGetters['combo/find_combo_items'](
            item.originalItem
          )

          let qtys = 0
          itemsInCombo.forEach(itemInCombo => {
            let qty = itemInCombo.quantity || 1
            qtys += qty
          })

          const perItemPrice = Num.round(item.price / qtys)
          const perItemTax = Num.round(item.tax / qtys)

          itemsInCombo.forEach(itemInCombo => {
            let orderItem = {
              name: itemInCombo.name,
              entity_id: itemInCombo._id,
              no: latestOrderIndex,
              status: 'in-progress',
              //itemTax.undiscountedTax is without modifiers
              price: perItemPrice,
              tax: perItemTax,
              qty: itemInCombo.quantity || 1,
              note: '',
              kitchen_invoice: 0,
              type: itemInCombo.item_type || 'regular',
              for_combo: item.no,
              store_id: item.store_id,
            }
            comboItems.push(orderItem)
            //set modifiers
            let modifiersForItemInCombo = rootGetters[
              'combo/find_combo_item_modifiers'
            ](item.originalItem, itemInCombo)
            modifiersForItemInCombo.forEach(modifier => {
              let newModifier = {
                entity_id: modifier._id,
                price: 0,
                tax: 0,
                name: modifier.name,
                qty: itemInCombo.quantity || 1,
                type: modifier.type,
                store_id: item.store_id,
                for_item: latestOrderIndex,
              }
              comboItemsModifiers.push(newModifier)
            })

            latestOrderIndex++
          })
          //fix last item price
          const itemsPrices = perItemPrice * qtys
          const itemsTaxes = perItemTax * qtys

          // change main item price
          // item.price = itemsPrices
          // item.tax = itemsTaxes

          // change sub items price
          // if price diff is 0.1 and qty is 3, there ll be mismatch
          const priceDiff = item.price - itemsPrices
          const taxDiff = item.tax - itemsTaxes

          const lastItem = comboItems[comboItems.length - 1]
          if (lastItem.qty > 1) {
            //decrease quantity of last item by 1
            //create a new 1 item and adjust price there
            let newLastItem = { ...lastItem }
            comboItems[comboItems.length - 1].qty =
              comboItems[comboItems.length - 1].qty - 1
            //add new item
            newLastItem.qty = 1
            newLastItem.no = newLastItem.no + 1
            comboItems.push(newLastItem)
          }

          comboItems[comboItems.length - 1].price += priceDiff

          comboItems[comboItems.length - 1].tax += taxDiff
        }
      })

      order.items = [...order.items, ...comboItems]
      order.item_modifiers = [...order.item_modifiers, ...comboItemsModifiers]
      resolve(order)
    })
  },
  pay({ commit, getters, rootGetters, rootState, dispatch }, { action, data }) {
    return new Promise((resolve, reject) => {
      commit('category/IS_UP_SELLING_MODIFY', true, { root: true })
      commit(mutation.SET_PAYMENT_ACTION, action)
      dispatch('validateEvent', { action: action, data: data })
        .then(() => {
          dispatch('validatePayment', action)
            .then(() => {
              //send order for payment
              let order = {}
              const orderPlacementTime = rootState.order.startTime
              let past_order_history = []
              if (
                rootState.order.orderType.OTApi == CONSTANTS.ORDER_TYPE_DINE_IN
              ) {
                past_order_history = rootState.order.selectedOrder
                  ? rootState.order.selectedOrder.item.order_action_history
                  : []
              }
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
                  assigned_to: rootState.auth.userDetails.item._id,
                  customer: !rootState.isBrandHasDeliveryOrder
                    ? rootState.customer.customerId
                    : '',
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
                  order_action_history: past_order_history,
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
              if (rootState.customer.customer) {
                order.customer = rootState.customer.customer._id
              }
              if (rootGetters['auth/multistore']) {
                order.multi_store = true
              }

              //if order was created by split bill (new order with unpaid items), don't print KOT
              if (data && data['route'] === 'splitOrder') {
                order['skip_kot_print'] = 1
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
                // order.future_order = 1
                order.future_order_datetime = rootState.order.futureOrder
              }
              //carhop_ready_0: order not ready yet 1 means order ready show notification with bell
              if (
                rootGetters['order/orderType'] === CONSTANTS.ORDER_TYPE_CARHOP
              ) {
                order.carhop_ready = false
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

              let action_order = !action ? 'create_order' : action
              // let order_actions = {action: action_order, date_time: orderPlacementTime, order: JSON.stringify(order)}
              // order.order_action_history.push(order_actions)

              dispatch('addItemsToOrder', {
                order: order,
                action: action,
              }).then(order => {
                dispatch('preOrderHook', { action: action, order: order })
                  .then(order => {
                    dispatch('paymentsHook', {
                      order: order,
                      action: action,
                      data: data,
                    }).then(order => {
                      //remove unwanted data
                      order.items = order.items.map(item => {
                        delete item.originalItem
                        return item
                      })
                      let empty_old_order_action = Object.assign({}, order)
                      empty_old_order_action.order_action_history = []
                      if (
                        rootState.order.orderType.OTApi ==
                        CONSTANTS.ORDER_TYPE_DINE_IN
                      ) {
                        let order_actions = {
                          action: action_order,
                          date_time: orderPlacementTime,
                          order: compressToBase64(
                            JSON.stringify(empty_old_order_action)
                          ),
                        }
                        if (order.order_action_history.length) {
                          // let lastOrderUpdate = order.order_action_history[order.order_action_history.length - 1]
                          let firstTimeOrderPlacement =
                            order.order_action_history[0]
                          let difference_in_order = CompareData.findDiffString(
                            decompressFromBase64(firstTimeOrderPlacement.order),
                            JSON.stringify(empty_old_order_action)
                          )
                          // let difference_in_order_remove_item = CompareData.findDiffString(JSON.stringify(empty_old_order_action), decompressFromBase64(firstTimeOrderPlacement.order))
                          if (difference_in_order.length > 50) {
                            order_actions.order = compressToBase64(
                              JSON.stringify(difference_in_order)
                            )
                            order.order_action_history.push(order_actions)
                          } /*else if (difference_in_order_remove_item.length > 50) {
                          order_actions.order = compressToBase64(JSON.stringify(difference_in_order_remove_item))
                          order.order_action_history.push(order_actions)
                        }*/
                        } else {
                          order.order_action_history.push(order_actions)
                        }
                      }
                      /*Need to check difference in two stringingfy before push in history (can generate with superwise password (findDiffString*/
                      // let decomp = JSON.parse(decompressFromBase64(order_actions.order))
                      // console.log(decomp, 'decomp')
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
    // dispatch('transactionOrders/getTransactionOrders', null, {
    //   root: true,
    // })
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

    //fix modify hold order
    let selOrder = rootState.order.selectedOrder
    if (selOrder) {
      selOrder = selOrder.item
    } else {
      selOrder = rootState.order.newOrder
    }

    //while modifying order keep origin cashier id to idenfity orders later
    if (selOrder) {
      if (selOrder.cashier_id) {
        order.cashier_id = selOrder.cashier_id
        order.assigned_to = selOrder.cashier_id
      } else if (selOrder.order_history) {
        const history = OrderHelper.lookup(
          selOrder,
          'order_history',
          'name',
          'ORDER_HISTORY_TYPE_RECORD_NEW'
        )
        if (history) {
          order.cashier_id = history.user
          if (!order.assigned_to) {
            order.assigned_to = history.user
          }
        }
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

  createDineOrder(
    { dispatch, commit, getters, rootGetters, state, rootState },
    action
  ) {
    return new Promise(resolve => {
      OrderService.saveOrder(state.order)
        .then(response => {
          if (response.data.status === 'ok') {
            commit('order/SET_ORDER_ID', response.data.id, { root: true })
            commit('SET_ORDER_NUMBER', response.data.order_no)
            commit(
              'LOAYLTY_EARN_POINTS',
              response.data.loyalty_cards_with_points
            )
            //we are not printing so reset manually here
            let msg = rootGetters['location/_t']('Dinein Order has been paid')
            if (action === 'dine-in-place-order') {
              if (getters.complete) {
                //after split paid we create a new order with remaining items so at end
                //it will reach to this add/create dine in method and show split pay msg
                msg = rootGetters['location/_t']('Dinein Order has been placed')
                commit('SPLITED_ITEM', false)
              } else {
                commit('SPLITED_ITEM', true)
                if (rootState.order.selectItemsToMove) {
                  msg = rootGetters['location/_t'](
                    'Selected item(s) are moved to another table.'
                  )
                } else {
                  msg = rootGetters['location/_t'](
                    'Payment done for selected item(s).'
                  )
                }
              }
              //Invoice APP API Call with Custom Request JSON
              if (!state.dineInSplitedItems) {
                dispatch(
                  'printingServer/printingServerInvoiceRaw',
                  state.order,
                  {
                    root: true,
                  }
                )
              }

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
    { action, data, route }
  ) {
    if (action === 'dine-in-order-preview') {
      return new Promise(resolve => {
        commit(mutation.PRINT, true)
        resolve()
      })
    }
    return new Promise((resolve, reject) => {
      dispatch('getModifyOrder').then(order => {
        let msg = 'Dinein order has been placed.'
        if (route === 'updateOrder') {
          order = { ...order, ...data }
          msg = 'Dinein order has been updated'
        }
        //delete order.order_system_status
        delete order.new_real_transition_order_no
        //delete order.real_created_datetime
        OrderService.updateOrderItems(order, rootState.order.orderId)
          .then(response => {
            if (response.data.status === 'ok') {
              let msgStr = rootGetters['location/_t'](msg)
              const selectedCovers = rootState.dinein.selectedCover

              if (
                ['dine-in-place-order', 'modify-backend-order'].includes(
                  action
                ) &&
                rootState.checkoutForm.action !== 'pay'
              ) {
                msgStr = rootGetters['location/_t'](
                  'Dinein order has been updated.'
                )

                dispatch('createModifyOrderItemList')
                //'modify-backend-order' means order was updated
                commit(mutation.SET_ROUTE, { name: 'Dinein' })
                dispatch('reset', true)
                commit(mutation.PRINT, false)
                commit('order/CLEAR_SELECTED_ORDER', null, { root: true })
                if (!getters.complete) {
                  if (
                    rootState.dinein.moveItemTableId &&
                    rootState.order.selectItemsToMove
                  ) {
                    dispatch(
                      'dinein/newReservationForMovingItems',
                      rootState.dinein.moveItemTableId,
                      { root: true }
                    ).then(() => {
                      dispatch('splitOrder', {
                        action: action,
                        data: { selectedCovers: selectedCovers },
                      }).then(() => resolve())
                    })
                  }
                } else {
                  resolve()
                }
              } else {
                //order paid
                msgStr = rootGetters['location/_t'](
                  'Dinein order has been Paid.'
                )
                commit(
                  'SET_ORDER_NUMBER',
                  rootState.order.selectedOrder.item.order_no
                )
                /* Commented because twice in IOS*/
                /*dispatch('printingServer/printingServerInvoiceRaw', state.order, {
                  root: true,
                })*/
                commit('checkout/SET_PAYMENT_ACTION', 'modify-dine-in-order', {
                  root: true,
                })
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
                    /*dispatch('injectDineInItemsData', order).then(order => {
                      order.items = order.items.map(item => {
                        delete item.originalItem
                        return item
                      })
                      dispatch('printingServer/printingServerInvoiceRaw', order, {
                        root: true,
                      })
                    })*/
                    // if (!rootState.order.selectItemsToMove) {
                    // }
                    if (!getters.complete) {
                      dispatch('splitOrder', {
                        action: action,
                        data: { selectedCovers: selectedCovers },
                      }).then(() => resolve())
                    } else {
                      commit('order/CLEAR_SELECTED_ORDER', null, { root: true })
                      commit(mutation.SET_ROUTE, { name: 'Dinein' })
                    }
                  })
                  //if splitted once
                }
                // console.log(state.order, order, 'both are same')
                let dt = rootState.auth.deviceType
                let isIOS = dt.osType
                if (isIOS || window.PrintHandle != null) {
                  dispatch('printingServer/printingServerInvoiceRaw', order, {
                    root: true,
                  })
                } else {
                  commit(mutation.PRINT, true)
                }
                resolve()
              }
              if (!rootState.order.selectItemsToMove) {
                commit(
                  'checkoutForm/SET_MSG',
                  { result: '', message: msgStr },
                  {
                    root: true,
                  }
                )
                dispatch('dinein/getBookedTablesOnClick', true, { root: true })
              }
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
          type: item.item_type,
          for_combo:
            item.item_type === CONSTANTS.COMBO_ITEM_TYPE
              ? item.orderIndex
              : false,
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

  createModifyOrderItemListCarHop({ rootState, state, dispatch }) {
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
      dispatch('injectCarHopItemsData', order).then(order => {
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

  createModifyOrderItemListTakeaway({ rootState, state, dispatch }) {
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
      dispatch('injectTakeawayData', order).then(order => {
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

  modifyCarhopOrder(
    { dispatch, rootState, rootGetters, commit },
    { action = false, data = false }
  ) {
    return new Promise(resolve => {
      dispatch('getModifyOrder').then(order => {
        //delete order.order_system_status
        //delete order.real_created_datetime
        delete order.new_real_transition_order_no
        if (action && data) {
          order = { ...order, ...data }
        }
        OrderService.updateOrderItems(order, rootState.order.orderId)
          .then(response => {
            if (response.data.status === 'ok') {
              let msgStr = rootGetters['location/_t'](
                'Carhop order has been Updated'
              )

              commit(
                'SET_ORDER_NUMBER',
                rootState.order.selectedOrder.item.order_no
              )
              dispatch(
                'setToken',
                rootState.order.selectedOrder.item.token_number
              ) //order paid
              if (
                rootState.checkoutForm.action === 'pay' &&
                (action === 'modify-backend-order' || !action)
              ) {
                msgStr = rootGetters['location/_t'](
                  'Carhop order has been Paid'
                )
                commit(mutation.PRINT, true)
              }

              let dt = rootState.auth.deviceType
              let isIOS = dt.osType
              if (isIOS) {
                if (rootState.checkoutForm.action === 'add') {
                  dispatch('createModifyOrderItemListCarHop')
                }
              } else {
                let newItems = []
                rootState.order.items.forEach(item => {
                  /*if (typeof item.no === 'undefined')*/ {
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
                  rootState.order.selectedOrder.item.items = newItems.map(
                    item => {
                      delete item.originalItem
                      return item
                    }
                  )
                }
                //Invoice APP API Call with Custom Request JSON
                let checkout_order = rootState.checkout.order
                let selected_order = rootState.order.selectedOrder.item
                let updated_order = Object.assign(
                  selected_order,
                  checkout_order
                )
                dispatch(
                  'printingServer/printingServerInvoiceRaw',
                  updated_order,
                  {
                    root: true,
                  }
                )
                commit('checkout/SET_PAYMENT_ACTION', 'carhop-modify-order', {
                  root: true,
                })
              }
              commit('order/CLEAR_SELECTED_ORDER', null, { root: true })
              commit(
                'checkoutForm/SET_MSG',
                { result: '', message: msgStr },
                {
                  root: true,
                }
              )
              commit('order/CLEAR_SELECTED_ORDER', null, { root: true })
              commit(mutation.SET_ROUTE, { name: 'CarhopOrders' })
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

  modifyTakeawayOrder(
    { dispatch, rootState, rootGetters, commit },
    { action = false, data = false }
  ) {
    return new Promise(resolve => {
      dispatch('getModifyOrder').then(order => {
        //delete order.order_system_status
        //delete order.real_created_datetime
        delete order.new_real_transition_order_no
        if (action && data) {
          order = { ...order, ...data }
        }
        OrderService.updateOrderItems(order, rootState.order.orderId)
          .then(response => {
            if (response.data.status === 'ok') {
              let msgStr = rootGetters['location/_t'](
                'Takeaway order has been Updated'
              )
              if (rootState.order.selectedOrder) {
                commit(
                  'SET_ORDER_NUMBER',
                  rootState.order.selectedOrder.item.order_no
                )
                dispatch(
                  'setToken',
                  rootState.order.selectedOrder.item.token_number
                ) //order paid
              }
              if (
                rootState.checkoutForm.action === 'pay' &&
                (action === 'modify-backend-order' || !action)
              ) {
                msgStr = rootGetters['location/_t'](
                  'Takeaway order has been Paid'
                )
                commit(mutation.PRINT, true)
              }

              let dt = rootState.auth.deviceType
              let isIOS = dt.osType
              if (isIOS) {
                if (rootState.checkoutForm.action === 'add') {
                  dispatch('createModifyOrderItemListTakeaway')
                }
              } else {
                let newItems = []
                rootState.order.items.forEach(item => {
                  /*if (typeof item.no === 'undefined')*/ {
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
                if (newItems.length && rootState.order.selectedOrder) {
                  rootState.order.selectedOrder.item.items = newItems.map(
                    item => {
                      delete item.originalItem
                      return item
                    }
                  )
                }
                //Invoice APP API Call with Custom Request JSON
                let checkout_order = rootState.checkout.order
                let selected_order = rootState.order.selectedOrder.item
                let updated_order = Object.assign(
                  selected_order,
                  checkout_order
                )
                dispatch(
                  'printingServer/printingServerInvoiceRaw',
                  updated_order,
                  {
                    root: true,
                  }
                )
                commit('checkout/SET_PAYMENT_ACTION', 'takeaway-modify-order', {
                  root: true,
                })
              }
              commit('order/CLEAR_SELECTED_ORDER', null, { root: true })
              commit(
                'checkoutForm/SET_MSG',
                { result: '', message: msgStr },
                { root: true }
              )
              commit(mutation.SET_ROUTE, { name: 'TakeawayOrders' })
              // router.replace({ name: 'TakeawayOrders' })
              let orderStatus = {
                collected: 'no',
                dataRelated: 'new-Collections',
                orderStatus: 'in-progress',
                pageId: 'takeaway_new',
                section: 'takeaway',
                title: 'WAITING FOR COLLECTION',
              }
              commit('deliveryManager/LIST_TYPE', orderStatus.title)
              commit('deliveryManager/SECTION', orderStatus.section)
              dispatch('deliveryManager/updateDMOrderStatus', orderStatus)
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

  modifyBackendOrder(
    { dispatch, rootState, rootGetters, commit },
    { action, data }
  ) {
    if (rootState.order.orderSource !== 'backend') {
      if (rootGetters['order/orderType'] === CONSTANTS.ORDER_TYPE_DINE_IN) {
        return dispatch('modifyDineOrder', {
          action: action,
          data: data,
          route: 'updateOrder',
        })
      }
    }
    if (rootState.order.orderSource !== 'backend') {
      if (rootGetters['order/orderType'] === CONSTANTS.ORDER_TYPE_CARHOP) {
        return dispatch('modifyCarhopOrder', {
          action: action,
          data: data,
        })
      }
      if (rootGetters['order/orderType'] === CONSTANTS.ORDER_TYPE_TAKEAWAY) {
        return dispatch('modifyTakeawayOrder', {
          action: action,
          data: data,
        })
      }
    }
    return new Promise((resolve, reject) => {
      dispatch('getModifyOrder').then(order => {
        order = { ...order, ...data }
        OrderService.modifyOrder(order, rootState.order.orderId)
          .then(response => {
            if (response.data.status === 'ok') {
              commit('order/SET_ORDER_ID', rootState.order.orderId, {
                root: true,
              })
              if (response.data.order_no) {
                commit('SET_ORDER_NUMBER', response.data.order_no)
              } else {
                commit('SET_ORDER_NUMBER', rootState.order.orderData.order_no)
              }
              dispatch('setToken', response.data.token_number)
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
  setToken({ commit }, tokenNumber) {
    if (typeof tokenNumber != 'undefined' && tokenNumber != '') {
      commit('SET_TOKEN_NUMBER', tokenNumber)
      localStorage.setItem('token_number', ++tokenNumber)
    }
  },
  createWalkinOrder({ state, dispatch, commit, rootState, rootGetters }) {
    return new Promise(resolve => {
      OrderService.saveOrder(state.order)
        .then(response => {
          if (response.data.status === 'ok') {
            commit('order/SET_ORDER_ID', response.data.id, { root: true })
            commit('SET_ORDER_NUMBER', response.data.order_no)
            commit(
              'LOAYLTY_EARN_POINTS',
              response.data.loyalty_cards_with_points
            )
            dispatch('setToken', response.data.token_number)
            const msg = rootGetters['location/_t']('Order placed Successfully')
            dispatch('setMessage', {
              result: 'success',
              msg: msg,
            }).then(() => {
              if (
                rootGetters['order/orderType'] === CONSTANTS.ORDER_TYPE_TAKEAWAY
              ) {
                commit(mutation.SET_ROUTE, { name: 'TakeawayOrders' })
              }
              resolve(response.data)
              commit(mutation.PRINT, true)
              // dispatch('iosWebviewPrintAction', { orderData: state.order })
            })
          } else {
            dispatch('handleSystemErrors', response).then(() => resolve())
          }
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.log(error)
          dispatch('handleRejectedResponse', {
            response: error,
            offline: true,
          })
            .then(() => {
              if (
                rootGetters['location/isTokenManager'] &&
                !rootState.sync.online
              ) {
                dispatch('setToken', state.order.token_number)
              }
              console.log(error, error.message, error.response, error.status, error.response.status)
              if (!error.response || error.response.status < 500) {
                commit(mutation.PRINT, true)
              }
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
            commit('deliveryManager/LIST_TYPE', 'New Orders', { root: true })
            commit('deliveryManager/SET_DM_ORDER_STATUS', 'in-progress', {
              root: true,
            })
            commit('deliveryManager/SET_DM_PAGE_ID', 'home_delivery_new', {
              root: true,
            })
            const msg = rootGetters['location/_t']('Order placed Successfully')
            dispatch('setMessage', {
              result: 'success',
              msg: msg,
            }).then(() => {
              /*delivery manager redirection stop working than I add route here*/
              commit(mutation.SET_ROUTE, { name: 'DeliveryManager' })
              resolve(response.data)
              commit(mutation.PRINT, true)
              // dispatch('iosWebviewPrintAction', { orderData: state.order })
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
            commit(
              'LOAYLTY_EARN_POINTS',
              response.data.loyalty_cards_with_points
            )
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
    let unpaidItems = ''
    if (rootState.order.selectItemsToMove) {
      unpaidItems = rootState.order.items.filter(item => item.split === true)
    } else {
      unpaidItems = rootState.order.items.filter(item => item.paid === false)
    }

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
    commit('ORDER_CREATION_SOURCE', 'splitOrder')

    return new Promise((resolve, reject) => {
      dispatch('pay', {
        action: 'dine-in-place-order',
        data: { route: 'splitOrder' },
      })
        .then(newOrder => {
          if (newOrder && newOrder.id) {
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
          }
          commit('order/SET_SPLIT_BILL', false, { root: true })
        })
        .catch(error => reject(error))
    })
  },
  createCarhopOrder(
    { dispatch, commit, rootGetters, state, rootState },
    // eslint-disable-next-line no-unused-vars
    action
  ) {
    return new Promise(resolve => {
      OrderService.saveOrder(state.order)
        .then(response => {
          if (response.data.status === 'ok') {
            commit('order/SET_ORDER_ID', response.data.id, { root: true })
            commit('SET_ORDER_NUMBER', response.data.order_no)
            commit(
              'LOAYLTY_EARN_POINTS',
              response.data.loyalty_cards_with_points
            )
            //we are not printing so reset manually here
            dispatch('setToken', response.data.token_number)
            let msg = rootGetters['location/_t']('Carhop Order has been placed')
            commit('checkout/SET_PAYMENT_ACTION', 'carhop-place-order', {
              root: true,
            })
            if (rootState.checkoutForm.action === 'pay') {
              msg = rootGetters['location/_t']('Carhop Order has been Paid')
              commit(mutation.PRINT, true)
            } else {
              //Invoice APP API Call with Custom Request JSON
              dispatch('printingServer/printingServerInvoiceRaw', state.order, {
                root: true,
              })
              dispatch('reset')
            }
            commit(mutation.SET_ROUTE, { name: 'CarhopOrders' })
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
            offline: true,
          })
            .then(() => {
              resolve()
              dispatch('reset')
            })
            .catch(() => resolve())
        })
    })
  },

  handleSystemErrors({ dispatch, rootState }, response) {
    let error = ''
    if (response.data) {
      if (response.data.status == 'form_errors') {
        for (let i in response.data.form_errors) {
          if (typeof response.data.form_errors[i] === 'string') {
            error += ' ' + response.data.form_errors[i]
          } else {
            response.data.form_errors[i].forEach(err => (error += ' ' + err))
          }
        }
        /*let past_order_history = rootState.order.selectedOrder ? rootState.order.selectedOrder.item.order_action_history : []
        if(past_order_history.length > 1) past_order_history.pop()*/
      } else {
        error =
          typeof response.data.error !== 'undefined'
            ? response.data.error
            : response.data.message
      }
    } else {
      error = response
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
    }
    if (!error.response || !error.response.status || error.response.status != 401) {  
      return dispatch('setMessage', {
        result: 'error',
        msg: error.message || error,
        desc: (error.response && error.response.data) ? error.response.data : error
      })
    }
  },
  handleRejectedResponse({ dispatch }, { response, offline = false }) {
    // eslint-disable-next-line no-console
    console.log(response, typeof response, response.message, response.status)
    if (
      offline &&
      (response.message === 'Network Error' ||
        JSON.stringify(response).match('Network Error'))
    ) {
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
    if (err_msg) {
      dispatch('setMessage', {
        result: 'error',
        msg: err_msg,
      })
    } else {
      return dispatch('handleSystemErrors', response)
    }

    return Promise.reject(err_msg)
  },
  handleNetworkError({ rootState, rootGetters, commit }) {
    let msg = 'System is offline. '
    if (
      [CONSTANTS.ORDER_TYPE_WALKIN, CONSTANTS.ORDER_TYPE_CALL_CENTER].includes(
        rootState.order.orderType.OTApi
      )
    ) {
      msg += 'Order is queued for sending later'
    } else {
      msg += 'Order can not be placed.'
    }
    let errorMsg = rootGetters['location/_t'](msg)
    commit(
      'checkoutForm/SET_MSG',
      { result: '', message: errorMsg },
      {
        root: true,
      }
    )
    return Promise.resolve()
  },
  setMessage({ commit }, { result, msg = '', desc = '' }) {
    commit(
      'checkoutForm/SET_MSG',
      { message: msg, result: result, desc: desc },
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
          return dispatch('modifyDineOrder', { action: action, data: data })
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
        return dispatch('modifyCarhopOrder', { action: action, data: false })
      }
    } else if (
      rootState.order.orderType.OTApi === CONSTANTS.ORDER_TYPE_TAKEAWAY
    ) {
      if (!rootState.order.orderId) {
        return dispatch('createWalkinOrder', action)
      } else {
        return dispatch('modifyTakeawayOrder', { action: action, data: false })
      }
    } else {
      return dispatch('createWalkinOrder')
    }
  },

  generateInvoice({ commit }) {
    //don't actually generate invoice, invoice is generated by PRINT state which
    //is set by update/create functions internally, here we only do things which are
    //not related to any invoice printing, like REDIRECTION if no inovice needed, for
    // example update (NOT MODIFY) dine in order
    //AT THIS TIME ORDER HAS BEEN RESET SO WE DON'T HAVE ANY ORDER DATA EXCEPT ROUTE
    commit('context/SET_ROUTE', state.route, { root: true })
    /*after set context route reset route from here*/
    commit(mutation.SET_ROUTE, null)
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
      dispatch('combo/reset', true, { root: true })
      dispatch('customer/reset', true, { root: true })
      dispatch('location/reset', {}, { root: true })
      commit('dinein/RESET_MOVE_ITEMS', {}, { root: true })
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
    let orderData = { ...order }
    orderData.windows_app = false
    if (window.PrintHandle != null) {
      orderData.windows_app = true
    }
    state.order = orderData
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
  [mutation.SET_TOKEN_NUMBER](state, tokenNumber) {
    state.tokenNumber = tokenNumber
    let order = { ...state.order }
    order.tokenNumber = state.tokenNumber
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
  [mutation.SET_ROUTE](state, route) {
    state.route = route
  },
  ['ORDER_CREATION_SOURCE'](state, route) {
    state.orderCreationSource = route
  },
  ['LOAYLTY_EARN_POINTS'](state, loyalty_points) {
    state.loaylty_earn_points = loyalty_points || []
    let order = { ...state.order }
    order.loaylty_earn_points = state.loaylty_earn_points
    state.order = order
  },
  ['SPLITED_ITEM'](state, splitItems) {
    state.dineInSplitedItems = splitItems
  },
  [mutation.ORDER_ITEM](state, orderItemsPayload) {
    console.log(orderItemsPayload, 'orderItemsPayload')
    state.orderItemsPayload = orderItemsPayload
  },
  /*[mutation.ITEM_MODIFIERS_COLLECTION](state, itemModifiers) {
    if (!itemModifiers) {
      state.itemModifiersCollection = []
    } else {
      state.itemModifiersCollection.push(itemModifiers)
    }
  },*/
  /*[mutation.ORDER_ITEM_DISCOUNT_MODIFIERS_COLLECTOR](state, collection) {
    if (!collection) {
      state.orderItemDiscountModifiersCollector.modifiers = []
      state.orderItemDiscountModifiersCollector.discount = []
    } else {
      state.itemModifiersCollection.modifiers.push(collection.modifiers)
      state.itemModifiersCollection.discount.push(collection.discount)
    }
  },*/
  [mutation.RESET](state, full = true) {
    state.paidAmount = 0
    state.loaylty_earn_points = []
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

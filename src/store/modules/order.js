/*eslint-disable no-console*/
/*
or example tax for an item is 2.467 
suppose quantity is 3
2.467 * 3 = 7.401

but if round it before adding
2.47 * 3 = 7.41 

It is 7.41 - 7.40 = 0.01

Both have difference of 0.01 that can have a huge impact as we grow in orders 

badr, 12:02 PM
yes but you should not charge 7.41 
you should charge 7.40

*/
import * as mutation from './order/mutation-types'
import OrderService from '../../services/data/OrderService'
import * as CONST from '@/constants'
import Num from '@/plugins/helpers/Num.js'

const DISCOUNT_ORDER_ERROR_TOTAL =
  "Discount can't be greater than total amount of order."

// initial state
const state = {
  items: [],
  item: false,
  errors: '',
  orderType: { OTview: 'Walk In', OTApi: 'walk_in' },
  orderNote: '',
  cancellationReason: {},
  onlineOrders: false,
  futureOrder: false,
  referral: false,
  selectedOrder: false,
  orderId: null,
  // pastOrder: false,
  orderStatus: null,
  cartType: 'new',
}

// getters
const getters = {
  item: state => state.item,

  netPrice: () => item => {
    const netPrice =
      item.value /
      ((100 + (item.originalTax ? item.originalTax : item.tax_sum)) / 100)
    return Num.round(netPrice)
  },

  grossPrice: () => item => {
    if (!item.value) item.value = 0
    return Num.round(item.value)
  },

  orderTotal: (state, getters, rootState, rootGetters) => {
    //discount is already subtracted from tax in tax.js
    let amount =
      getters.subTotal +
      rootGetters['tax/totalTax'] +
      rootGetters['surcharge/surcharge'] -
      rootGetters['discount/orderDiscountWithoutTax']

    if (amount) {
      return amount.toFixed(2)
    }
    return 0
  },

  subTotal: () => {
    return state.items.reduce((total, item) => {
      console.log(
        'item gross price ',
        Num.round(item.grossPrice),
        ' quantity ',
        item.quantity
      )
      console.log(
        'item net price ',
        Num.round(item.netPrice),
        ' quantity ',
        item.quantity
      )
      return total + Num.round(item.netPrice) * item.quantity
    }, 0)
  },

  subTotalUndiscounted: () => {
    return state.items.reduce((total, item) => {
      return total + Num.round(item.undiscountedNetPrice) * item.quantity
    }, 0)
  },

  itemPrice: () => item => {
    return item.quantity * item.grossPrice
  },

  orderModifiers: () => item => {
    return item.modifiers.length
  },

  getLatestOnlineOrders: state => {
    if (state.onlineOrders) {
      return state.onlineOrders
    } else {
      if (
        localStorage.getItem('onlineOrders') != 'undefined' &&
        JSON.parse(localStorage.getItem('onlineOrders')) != null
      ) {
        return JSON.parse(localStorage.getItem('onlineOrders'))
      } else {
        return false
      }
    }
  },

  items: state => state.items,

  orderType: state => state.orderType.OTApi,
}

// actions
const actions = {
  addToOrder({ state, getters, commit, dispatch }, item) {
    commit('checkoutForm/RESET', 'process', { root: true })

    //item gross price is inclusive of tax
    item.grossPrice = getters.grossPrice(item)
    //net price is exclusive of tax, getter ll send unrounded price that is real one
    item.netPrice = getters.netPrice(item)

    item.undiscountedNetPriceWithoutModifiers = item.netPrice
    item.grossPriceWithoutModifiers = item.grossPrice
    item.netPriceWithoutModifiers = item.netPrice
    item.undiscountedGrossPriceWithoutModifiers =
      item.grossPriceWithoutModifiers
    item.undiscountedNetPriceWithoutModifiers = item.netPriceWithoutModifiers
    item.undiscountedGrossPrice = item.grossPrice
    item.undiscountedNetPrice = item.netPrice

    if (typeof item.orderIndex === 'undefined') {
      item.orderIndex = state.items.length
    }

    //this comes directly from the items menu without modifiers
    item.modifiable = false

    item.undiscountedGrossPrice = item.grossPrice
    item.undiscountedNetPrice = item.netPrice

    if (typeof item.quantity === 'undefined') {
      item.quantity = 1
    }

    commit(mutation.SET_ITEM, item)

    commit(mutation.ADD_ORDER_ITEM, state.item)

    dispatch('surchargeCalculation')
  },

  //this function re-adds an item to order if item is in edit mode, it just replaces exiting item in cart
  addModifierOrder(
    { commit, getters, rootState, dispatch, rootGetters },
    item
  ) {
    commit('checkoutForm/RESET', 'process', { root: true })

    return new Promise((resolve, reject) => {
      if (!item) {
        item = { ...rootState.modifier.item }
      }
      //this comes through the modifier popup
      item.grossPrice = getters.grossPrice(item)
      //getter will send un rounded value
      item.netPrice = getters.netPrice(item)
      if (typeof item.orderIndex === 'undefined') {
        item.orderIndex = state.items.length
      }
      item.modifiable = true

      commit(mutation.SET_ITEM, item)

      let itemModifierGroups = []
      let itemModifiers = []

      //adding modifers to item
      if (item.modifiers && !item.editMode) {
        /* ***********************************************/
        /*  ORDER COMING FROM HOLD ORDER                 */
        /* ***********************************************/
        const itemModifiersArray = rootGetters['modifier/itemModifiers'](
          item._id
        )
        //re check if modifiers still available for the item
        if (itemModifiersArray.length) {
          itemModifiersArray.forEach(modifierItem => {
            modifierItem.modifiers.forEach(modifier => {
              if (item.modifiers.includes(modifier._id)) {
                const subgroup = rootGetters['modifier/getModifierSubgroup'](
                  modifier._id
                )
                itemModifiers.push(modifier._id)
                itemModifierGroups.push({
                  groupId: subgroup._id,
                  itemId: item._id,
                  limit: subgroup.no_of_selection,
                  modifierId: modifier._id,
                  type: subgroup.no_of_selection > 1 ? 'checkbox' : 'radio',
                })
              }
            })
          })
        }
        //avoid cacthcing again in edit mode
      } else {
        /* ***********************************************/
        /*        New ORDER COMING CATALOG               */
        /* ***********************************************/

        const modifiers = rootGetters['orderForm/modifiers'].filter(
          modifier => modifier.itemId == item._id
        )

        let selectedModifeirGroups = []

        modifiers.forEach(modifier => {
          itemModifierGroups.push(modifier)
          selectedModifeirGroups.push(modifier.groupId)
        })

        //match modifiers with mandatory modifiers for this item, if not matched set error and return false
        const itemMandatoryModifierGroups = rootGetters[
          'modifier/itemMandatoryGroups'
        ](item._id)

        let mandatorySelected = true

        itemMandatoryModifierGroups.forEach(id => {
          if (!selectedModifeirGroups.includes(id)) {
            mandatorySelected = false
          }
        })

        if (mandatorySelected) {
          commit('orderForm/setError', false, {
            root: true,
          })
        } else {
          commit('orderForm/setError', 'Please select at least one item', {
            root: true,
          })
          reject()
          return false
        }

        modifiers.forEach(modifier => {
          if (Array.isArray(modifier.modifierId)) {
            itemModifiers.push(...modifier.modifierId)
          } else {
            itemModifiers.push(modifier.modifierId)
          }
        })
      }

      /*
        itemModifiers
          0:"5cfde3211578dd00215271d1"
          1:"5cfde3211578dd00215271d0"
        itemModifierGroups
          0:
            groupId:"5cfde3211578dd00215271c8"
            itemId:"5cfde31f1578dd0021527183"
            limit:81
            modifierId:"5cfde3211578dd00215271d1"
            type:"checkbox"
      */
      commit(mutation.ADD_MODIFIERS_TO_ITEM, {
        modifiers: itemModifiers,
        modifierGroups: itemModifierGroups,
      })

      //calculating item price based on modifiers selected
      let modifierPrice = 0
      //since we have just ids attached to item,
      //we need to consult modifier store for modifier data ie price

      const modifierSubgroups = rootGetters['modifier/itemModifiers'](item._id)
      let modifierTaxData = []
      modifierSubgroups.forEach(subgroup => {
        subgroup.modifiers.forEach(modifier => {
          if (item.modifiers.includes(modifier._id)) {
            modifierTaxData.push({
              itemId: item._id,
              modifierId: modifier._id,
              price: modifier.value ? parseFloat(modifier.value) : 0,
              tax: modifier.value
                ? Num.round((modifier.value * item.tax_sum) / 100)
                : 0,
            })
          }
        })
      })

      dispatch(
        'tax/setModifierTaxData',
        {
          orderIndex: item.orderIndex,
          modifiersTaxData: modifierTaxData,
        },
        { root: true }
      )

      modifierPrice = modifierTaxData.reduce((total, modifier) => {
        return total + modifier.price
      }, 0)

      //modifier price is without tax price, we need to implement tax on that
      const modifiersTax = Num.round(
        modifierTaxData.reduce((total, modifier) => {
          return total + modifier.tax
        }, 0)
      )

      //all below values are already rounded
      const itemGrossPrice = item.grossPrice + modifierPrice + modifiersTax

      //item net price (without tax ) + modifier price which is already without tax
      const itemNetPrice = item.netPrice + modifierPrice

      commit(mutation.ADD_MODIFIER_PRICE_TO_ITEM, {
        grossPrice: itemGrossPrice,
        netPrice: itemNetPrice,
      })

      if (!item.editMode) {
        //update current item with new modifiers

        //check if item exists with same signature
        /*
        let itemExists = -1

        state.items.forEach((orderItem, index) => {
          if (
            state.item._id == orderItem._id &&
            orderItem.modifiers.every(modifierId =>
              state.item.modifiers.includes(modifierId)
            ) &&
            orderItem.modifiers.length == state.item.modifiers.length
          ) {
            itemExists = index
          }
        })

        if (itemExists > -1) {
          commit(mutation.INCREMENT_ORDER_ITEM_QUANTITY, itemExists)
        } else {
          commit(mutation.ADD_ORDER_ITEM_WITH_MODIFIERS, state.item)
        }
        */
        let quantity = 0
        //coming through hold orders
        if (typeof item.quantity !== 'undefined') {
          quantity = item.quantity
        }
        if (!quantity) {
          quantity = rootState.orderForm.quantity || 1
        }
        commit(mutation.SET_QUANTITY, quantity)
        commit(mutation.ADD_ORDER_ITEM_WITH_MODIFIERS, state.item)
      } else {
        //edit mode
        //if the signature was different then modify modifiers,
        //as we are creating new item and attached modifiers again so its better to just
        //replace that item in state with existing item

        const quantity = rootState.orderForm.quantity || 1
        commit(mutation.SET_QUANTITY, quantity)

        commit(mutation.REPLACE_ORDER_ITEM, {
          item: state.item,
        })
      }

      dispatch('surchargeCalculation')
      //reset the modifier form
      commit('orderForm/clearSelection', null, { root: true })
      resolve()
    })
  },

  removeFromOrder({ commit, dispatch }, { item, index }) {
    commit('checkoutForm/RESET', 'process', { root: true })
    commit(mutation.SET_ITEM, item)
    commit(mutation.REMOVE_ORDER_ITEM, index)
    if (state.items.length) {
      commit(mutation.SET_ITEM, state.items[0])
    } else {
      commit(mutation.SET_ITEM, false)
    }

    if (state.items.length) {
      dispatch('surchargeCalculation')
    } else {
      //cart is empty remove the discounts
      dispatch('checkout/reset', null, { root: true })
    }
  },

  removeTax({ commit, state, rootState, dispatch }) {
    let item = { ...state.item }
    if (!item.originalTax) {
      item.originalTax = item.tax_sum
    }
    item.tax_sum = 0
    //replace item in cart
    commit(mutation.REPLACE_ORDER_ITEM, {
      item: item,
    })
    dispatch('surcharge/calculate', {}, { root: true }).then(() =>
      dispatch('tax/calculate', {}, { root: true }).then(() =>
        dispatch('recalculateItemPrices').then(() => {})
      )
    )

    //remove tax from modifier items
    item = { ...rootState.modifier.item }
    if (!item.originalTax) {
      item.originalTax = item.tax_sum
    }
    item.tax_sum = 0
    //replace item in cart
    commit('modifier/SET_ITEM', item, {
      root: true,
    })
  },
  setActiveItem({ commit, dispatch }, { orderItem, index }) {
    //get current item
    //this is fired by the items.vue
    let item = { ...state.items[index] }
    item.editMode = true
    item.quantity = orderItem.quantity
    item.netPrice = orderItem.netPrice
    item.orderIndex = index
    commit(mutation.SET_ITEM, item)

    // if (item.modifiable) {
    dispatch('orderForm/setItem', { item: item }, { root: true })
    dispatch('discount/setItem', { item: item }, { root: true })
    dispatch(
      'modifier/setActiveItem',
      { item: item },
      {
        root: true,
      }
    )
    // }
  },
  recalculateOrderTotals({ rootState, getters, rootGetters, dispatch }) {
    return new Promise((resolve, reject) => {
      const orderDiscount = rootState.discount.appliedOrderDiscount
      //let totalDiscount = 0
      if (orderDiscount) {
        let orderTotalDiscount = 0
        let taxTotalDiscount = 0
        let surchargeTotalDiscount = 0

        if (orderDiscount.include_surcharge) {
          //apply ontotal discount, apply on surcharge and its tax as well
          const subtotal = getters.subTotal
          const totalTax =
            rootGetters['tax/itemsTax'] + (rootState.tax.surchargeTax || 0)
          const totalSurcharge = rootGetters['surcharge/surcharge']

          if (orderDiscount.type === CONST.VALUE) {
            if (orderDiscount.value > subtotal + totalTax) {
              dispatch('discount/clearOrderDiscount', null, { root: true })
              reject(DISCOUNT_ORDER_ERROR_TOTAL)
            } else {
              orderTotalDiscount = orderDiscount.value

              const percentDiscountOnOrderTotalIncludingSurcharge =
                (orderTotalDiscount * 100) / (subtotal + totalSurcharge)

              taxTotalDiscount =
                (totalTax * percentDiscountOnOrderTotalIncludingSurcharge) / 100
              //when calculating percent discount on subtotal we include surcharge as well,
              //so don't need to calculate discount on surcharge again
              surchargeTotalDiscount = 0
              const discountData = {
                orderDiscount: orderTotalDiscount,
                taxDiscount: taxTotalDiscount,
                surchargeDiscount: surchargeTotalDiscount,
              }

              dispatch('discount/setOrderDiscount', discountData, {
                root: true,
              })

              resolve(discountData)
            }
          } else {
            orderTotalDiscount = (subtotal * orderDiscount.rate) / 100
            taxTotalDiscount = (totalTax * orderDiscount.rate) / 100
            surchargeTotalDiscount = (totalSurcharge * orderDiscount.rate) / 100

            const discountData = {
              orderDiscount: orderTotalDiscount,
              taxDiscount: taxTotalDiscount,
              surchargeDiscount: surchargeTotalDiscount,
            }

            dispatch('discount/setOrderDiscount', discountData, { root: true })

            resolve(discountData)
          }
        } else {
          //without surcharge
          //apply offtotal discount, don't calculate discount on surcharge
          const subtotal = getters.subTotal
          //we are not including surcharge tax in total tax for discount
          const totalTax = rootGetters['tax/itemsTax']
          //const totalSurcharge = rootGetters['surcharge/surcharge']
          if (orderDiscount.type === CONST.VALUE) {
            if (orderDiscount.value > subtotal + totalTax) {
              dispatch('discount/clearOrderDiscount', null, { root: true })
              reject(DISCOUNT_ORDER_ERROR_TOTAL)
            } else {
              const percentDiscountOnSubTotal =
                (orderDiscount.value * 100) / subtotal
              taxTotalDiscount = (totalTax * percentDiscountOnSubTotal) / 100
              surchargeTotalDiscount = 0

              const discountData = {
                orderDiscount: orderDiscount.value,
                taxDiscount: taxTotalDiscount,
                surchargeDiscount: surchargeTotalDiscount,
              }
              resolve(discountData)
              dispatch('discount/setOrderDiscount', discountData, {
                root: true,
              })
            }
          } else {
            orderTotalDiscount = (subtotal * orderDiscount.rate) / 100
            //const subtotalWithDiscount = subtotal - orderTotalDiscount
            taxTotalDiscount = (totalTax * orderDiscount.rate) / 100
            surchargeTotalDiscount = 0
            const discountData = {
              orderDiscount: orderTotalDiscount,
              taxDiscount: taxTotalDiscount,
              surchargeDiscount: surchargeTotalDiscount,
            }
            resolve(discountData)
            dispatch('discount/setOrderDiscount', discountData, { root: true })
          }
        }
      } else {
        resolve()
      }
    })
  },

  recalculateItemPrices({ commit, rootState, dispatch }) {
    return new Promise((resolve, reject) => {
      let itemsDiscount = 0
      let discountErrors = {}

      const newItems = state.items.map((stateItem, index) => {
        let item = { ...stateItem }
        const discount = rootState.discount.appliedItemDiscounts.find(
          discount => discount.item.orderIndex == index
        )

        if (discount) {
          let itemDiscountData = {
            orderIndex: index,
            id: discount.discount._id,
            name: discount.discount.name,
            type: discount.discount.type,
            rate: discount.discount.rate,
            value: discount.discount.value,
          }

          if (discount.discount.type === CONST.VALUE) {
            // NOTE: IF items are 2, per item discount should total discount / 2

            if (
              discount.discount.value >
              item.undiscountedNetPrice * item.quantity
            ) {
              //discount error
              item.discount = false
              item.grossPrice = item.undiscountedGrossPrice
              item.netPrice = item.undiscountedNetPrice

              discountErrors[index] = item
            } else {
              //add discount amount for record to show how much discount in total was applied
              itemsDiscount += discount.discount.value
              //apply discount here
              //decided to apply discount on post tax

              //divide discount on quantity to get discount applied per line item
              const discountPerItem = Num.round(
                discount.discount.value / item.quantity
              )

              //Decided to apply discount on after tax, that means when sending discount info we should send item discount and tax discount separately
              item.grossPrice = item.undiscountedGrossPrice - discountPerItem

              //calcualte ratio of discount applied and set same ratio for net price
              const percentDiscountAppliedOnGross =
                (discountPerItem / item.undiscountedGrossPrice) * 100
              const netPriceDiscount =
                (item.undiscountedNetPrice * percentDiscountAppliedOnGross) /
                100
              item.netPrice = item.undiscountedNetPrice - netPriceDiscount

              //Decided to apply discount on after tax, that means when sending discount info we should send item discount and tax discount separately
              item.grossPriceWithoutModifiers =
                item.undiscountedGrossPriceWithoutModifiers - discountPerItem

              //calcualte ratio of discount applied and set same ratio for net price
              const percentDiscountAppliedOnGrossWithoutModifiers =
                (discountPerItem /
                  item.undiscountedGrossPriceWithoutModifiers) *
                100
              const netPriceDiscountWithoutModifiers =
                (item.undiscountedNetPriceWithoutModifiers *
                  percentDiscountAppliedOnGrossWithoutModifiers) /
                100
              item.netPriceWithoutModifiers =
                item.undiscountedNetPriceWithoutModifiers -
                netPriceDiscountWithoutModifiers

              itemDiscountData.discount = netPriceDiscount
            }
          } else {
            if (item.undiscountedNetPrice * item.quantity > 0) {
              //discount error
              //percentage based discount, use discount.rate here, not discount.value
              //apply discount with modifier price
              const itemGrossDiscountAmount = Num.round(
                (item.undiscountedGrossPrice * discount.discount.rate) / 100
              )
              item.grossPrice = Num.round(
                item.undiscountedGrossPrice - itemGrossDiscountAmount
              )

              //item net discount amount should be calculated as item net price discount
              //  + modifier discount amount
              //apply discount on net price as well
              let itemNetDiscountAmount =
                (item.undiscountedNetPriceWithoutModifiers *
                  discount.discount.rate) /
                100

              const undiscountedModifiersNetAmount =
                item.undiscountedNetPrice -
                item.undiscountedNetPriceWithoutModifiers

              const modifierNetDiscountAmount = Num.round(
                (undiscountedModifiersNetAmount * discount.discount.rate) / 100
              )

              itemNetDiscountAmount =
                Num.round(itemNetDiscountAmount) + modifierNetDiscountAmount

              item.netPrice =
                item.undiscountedNetPrice - Num.round(itemNetDiscountAmount)

              //apply discount without modifier prices gross
              const itemGrossDiscountAmountWithoutModifiers =
                (item.undiscountedGrossPriceWithoutModifiers *
                  discount.discount.rate) /
                100

              item.grossPriceWithoutModifiers =
                item.undiscountedGrossPriceWithoutModifiers -
                itemGrossDiscountAmountWithoutModifiers

              //apply discount on net price as well
              const itemNetDiscountAmountWithoutModifiers =
                (item.undiscountedNetPriceWithoutModifiers *
                  discount.discount.rate) /
                100

              item.netPriceWithoutModifiers =
                item.undiscountedNetPriceWithoutModifiers -
                Num.round(itemNetDiscountAmountWithoutModifiers)

              itemsDiscount += Num.round(itemNetDiscountAmount)
              itemDiscountData.discount = Num.round(itemNetDiscountAmount)
            } else {
              item.discount = false
              item.grossPrice = item.undiscountedGrossPrice
              item.netPrice = item.undiscountedNetPrice
              discountErrors[item.orderIndex] = item
            }
          }

          if (
            Object.entries(discountErrors).length === 0 &&
            discountErrors.constructor === Object
          ) {
            item.discount = itemDiscountData
          }
        } else {
          //remove already applied discount
          item.discount = false
          item.grossPrice = item.undiscountedGrossPrice
          item.netPrice = item.undiscountedNetPrice
        }
        return item
      })

      dispatch(
        'discount/setItemsDiscountAmount',
        { discountAmount: itemsDiscount },
        { root: true }
      )

      commit(mutation.RE_SAVE_ITEMS, newItems)
      dispatch('surcharge/calculate', {}, { root: true }).then(() =>
        dispatch('tax/calculate', {}, { root: true })
      )
      if (
        Object.entries(discountErrors).length > 0 &&
        discountErrors.constructor === Object
      ) {
        reject(discountErrors)
        dispatch('discount/clearItemDiscount', discountErrors, { root: true })
      } else {
        resolve()
      }
    })
  },

  updateQuantity({ commit, dispatch }, quantity) {
    const itemQuantity = quantity || 1
    commit(mutation.UPDATE_ITEM_QUANTITY, itemQuantity)
    dispatch('surchargeCalculation')
  },

  surchargeCalculation({ rootState, dispatch }) {
    dispatch('surcharge/calculate', {}, { root: true }).then(() =>
      dispatch('tax/calculate', {}, { root: true }).then(() => {
        if (rootState.discount.appliedOrderDiscount) {
          dispatch('recalculateOrderTotals')
        } else {
          dispatch('recalculateItemPrices')
        }
      })
    )
  },

  reset({ commit }) {
    commit(mutation.RESET)
  },
  addOrderNote({ commit }, orderNote) {
    commit(mutation.SET_ORDER_NOTE, orderNote)
  },

  setOnlineOrders({ commit, rootState }, onlineOrderData) {
    // const params = [1, onlineOrderData.location_id]
    let orderDetail = ''
    // OrderService.fetchOnlineOrderDetails(...params).then(response => {
    //   orderDetail = response.data.orderDetails
    commit(mutation.ONLINE_ORDERS, {
      onlineOrders: onlineOrderData,
      locationId: rootState.location.location,
      orderDetails: orderDetail,
    })
    // })
  },

  /*getPastOrderDetails({ commit, rootState }, orderId) {
    const params = [orderId, rootState.location.location]
    OrderService.fetchOnlineOrderDetails(...params).then(response => {
      commit(mutation.PAST_ORDER_DETAILS, response.data.orderDetails)
    })
  },*/

  deliveryOrder({ commit, dispatch }, { referral, futureOrder }) {
    return new Promise((resolve, reject) => {
      commit(mutation.ORDER_TYPE, { OTview: 'Delivery', OTApi: 'call_center' })
      commit(mutation.SET_REFERRAL, referral)
      if (futureOrder != null) {
        commit(mutation.SET_FUTURE_ORDER, futureOrder)
      }
      dispatch('checkout/pay', {}, { root: true })
        .then(response => resolve(response))
        .catch(response => reject(response))
    })
  },

  updateOrderType({ commit, dispatch }, orderType) {
    commit(mutation.ORDER_TYPE, orderType)
    dispatch('surchargeCalculation')
  },

  addOrderToCart({ rootState, commit, dispatch }, order) {
    return new Promise(resolve => {
      dispatch('reset')
      commit(mutation.SET_ORDER_ID, order._id)

      order.items.forEach((orderItem, key) => {
        rootState.category.items.forEach(categoryItem => {
          let item = { ...categoryItem }
          if (orderItem.entity_id === categoryItem._id) {
            item.quantity = orderItem.qty
            let modifiers = []
            if (order.item_modifiers.length) {
              order.item_modifiers.forEach(modifier => {
                if (modifier.for_item === key) {
                  modifiers.push(modifier.entity_id)
                }
              })
            }
            if (modifiers.length) {
              item.modifiers = modifiers
              dispatch('modifier/assignModifiersToItem', item, {
                root: true,
              }).then(() => {
                dispatch('addModifierOrder', item)
              })
            } else {
              dispatch('addToOrder', item)
            }
          }
        })
      })

      resolve()
    })
  },

  addHoldOrder({ dispatch, commit }, order) {
    dispatch('addOrderToCart', order).then(() => {
      commit(mutation.ORDER_STATUS, CONST.ORDER_STATUS_ON_HOLD)
    })
  },

  addDeliveryOrder({ dispatch, commit }, orderData) {
    dispatch('addOrderToCart', orderData.item).then(() => {
      commit(mutation.ORDER_STATUS, CONST.ORDER_STATUS_IN_DELIVERY)
      commit(mutation.ORDER_TYPE, { OTview: 'Delivery', OTApi: 'call_center' })
    })
  },

  selectedOrderDetails({ commit }, orderId) {
    const params = ['orders', orderId, '']
    OrderService.getGlobalDetails(...params).then(response => {
      let orderDetails = {}
      OrderService.getModalDetails('brand_cancellation_reasons').then(
        responseData => {
          commit(mutation.SET_CANCELLATION_REASON, responseData.data.data)
        }
      )

      orderDetails.item = response.data.item
      orderDetails.customer = response.data.collected_data.customer
      orderDetails.lookups = response.data.collected_data.page_lookups
      orderDetails.store_name = response.data.collected_data.store_name
      orderDetails.invoice =
        response.data.collected_data.store_invoice_templates
      commit(mutation.SET_ORDER_DETAILS, orderDetails)
    })
  },
  removeOrder({ dispatch }, { order, orderType }) {
    let actionTrigger = orderType
    if (actionTrigger) {
      actionTrigger = 'delete_' + actionTrigger
    } else {
      actionTrigger = 'delete'
    }
    dispatch('updateOrderAction', { order, orderType, actionTrigger })
  },

  updateOrderAction({ dispatch }, { order, orderType, actionTrigger }) {
    if (actionTrigger === 'addToDriverBucket') {
      dispatch('deliveryManager/addOrderToDriverBucket', order, {
        root: true,
      })
    } else {
      let data = { driver: state.selectedDriver }
      OrderService.updateOrderAction(order._id, actionTrigger, data).then(
        response => {
          if (response.status == 200) {
            switch (orderType) {
              case 'hold':
                dispatch('holdOrders/remove', order, { root: true })
                break
              case 'call_center':
                dispatch(
                  'deliveryManager/fetchDMOrderDetail',
                  {},
                  { root: true }
                )
                break
            }
          }
        }
      )
    }
  },
  updateOrderCancelAction(
    { dispatch, commit },
    { order, orderType, actionTrigger, params }
  ) {
    OrderService.updateOrderAction(order.order._id, actionTrigger, params).then(
      response => {
        if (response.status == 200) {
          switch (orderType) {
            case 'hold':
              dispatch('holdOrders/remove', order, { root: true })
              break
            case 'call_center':
              commit(mutation.SET_ERRORS, response.data.form_errors)
              dispatch('deliveryManager/fetchDMOrderDetail', {}, { root: true })
              break
          }
        }
      }
    )
  },
}

function playSound(locationId, onlineOrders) {
  let nopromise = {
    catch: new Function(),
  }
  // onlineOrders.orders.forEach(order => {
  if (locationId == onlineOrders.location_id) {
    let onlineNewOrderAudioRing = new Audio(
      'https://int.erp-pos.com/sound/doorbell.ogg'
    )
    onlineNewOrderAudioRing.load()
    if (onlineOrders.orders && onlineOrders.orders.length) {
      onlineNewOrderAudioRing.addEventListener(
        'ended',
        function() {
          this.currentTime = 0
          ;(this.play() || nopromise).catch(function() {})
        },
        false
      )
      ;(onlineNewOrderAudioRing.play() || nopromise).catch(function() {})
    } else {
      onlineNewOrderAudioRing.pause()
      onlineNewOrderAudioRing.currentTime = 0
    }
  }
}

// mutations
const mutations = {
  [mutation.SET_ITEM](state, item) {
    state.item = item
  },
  [mutation.SET_ERRORS](state, item) {
    state.errors = item
  },

  [mutation.ADD_ORDER_ITEM](state, item) {
    item.modifiers = []
    state.items.push(item)
  },

  [mutation.ADD_ORDER_ITEM_WITH_MODIFIERS](state, item) {
    state.items.push(item)
  },

  [mutation.INCREMENT_ORDER_ITEM_QUANTITY](state, index) {
    //need to use array splice to make it reactive
    let orderItem = state.items[index]
    orderItem.quantity++
    state.items.splice(index, 1, orderItem)
  },

  [mutation.REMOVE_ORDER_ITEM](state, index) {
    state.items = state.items.filter(function(orderItem, key) {
      return key != index
    })
  },

  [mutation.REPLACE_ORDER_ITEM](state, { item }) {
    state.items.splice(item.orderIndex, 1, item)
  },

  [mutation.ADD_MODIFIERS_TO_ITEM](state, { modifiers, modifierGroups }) {
    state.item.modifiers = modifiers
    state.item.modifierGroups = modifierGroups
  },

  [mutation.ADD_MODIFIER_PRICE_TO_ITEM](state, { grossPrice, netPrice }) {
    state.item.grossPriceWithoutModifiers = state.item.grossPrice
    state.item.netPriceWithoutModifiers = state.item.netPrice
    state.item.undiscountedGrossPriceWithoutModifiers =
      state.item.grossPriceWithoutModifiers
    state.item.undiscountedNetPriceWithoutModifiers =
      state.item.netPriceWithoutModifiers

    state.item.grossPrice = grossPrice
    state.item.netPrice = netPrice
    state.item.undiscountedGrossPrice = state.item.grossPrice
    state.item.undiscountedNetPrice = state.item.netPrice
  },

  [mutation.SET_ITEM_TAX](state, tax) {
    state.item.tax = tax
  },

  [mutation.RE_SAVE_ITEMS](state, items) {
    state.items = items
  },

  [mutation.SET_QUANTITY](state, qty) {
    state.item.quantity = qty
  },

  [mutation.UPDATE_ITEM_QUANTITY](state, quantity) {
    const index = state.item.orderIndex
    let orderItem = state.items[index]
    orderItem.quantity = typeof quantity != 'undefined' ? quantity : 1
    state.items.splice(index, 1, orderItem)
  },

  [mutation.RESET](state) {
    state.items = []
    state.item = false
    state.orderStatus = null
    state.orderId = null
  },
  [mutation.SET_ORDER_NOTE](state, orderNote) {
    state.orderNote = orderNote
  },
  [mutation.ORDER_TYPE](state, orderType) {
    // state.orderType = orderType.charAt(0).toUpperCase() + orderType.slice(1)
    state.orderType = orderType
  },
  [mutation.SET_REFERRAL](state, referral) {
    state.referral = referral
  },
  [mutation.SET_FUTURE_ORDER](state, futureOrder) {
    state.futureOrder = futureOrder
  },
  [mutation.SET_ORDER_ID](state, id) {
    state.orderId = id
  },
  [mutation.ONLINE_ORDERS](state, { onlineOrders, locationId, orderDetails }) {
    localStorage.setItem('onlineOrders', JSON.stringify(orderDetails))
    state.onlineOrders = orderDetails
    playSound(locationId, onlineOrders)
  },
  [mutation.SET_ORDER_DETAILS](state, selectedOrderDetails) {
    state.selectedOrder = selectedOrderDetails
  },
  [mutation.SET_CANCELLATION_REASON](state, cancelationReason) {
    state.cancellationReason = cancelationReason
  },
  [mutation.ORDER_STATUS](state, status) {
    state.orderStatus = status
  },

  [mutation.SET_CART_TYPE](state, cartType) {
    state.cartType = cartType
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

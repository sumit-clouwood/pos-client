import * as mutation from './order/mutation-types'
import OrderService from '../../services/data/OrderService'

const DISCOUNT_ORDER_ERROR_TOTAL = 'Discount can\'t be greater than total amount of order.'

// initial state
const state = {
  items: [],
  item: false,
  orderType: 'Walk-in',
  orderNote: false,
  onlineOrders: false,
  futureOrder: false,
  referral: false,
  selectedOrder: false,
  // pastOrder: false,
}

// getters
const getters = {
  item: (state, getters, rootState) => {
    if (state.item) {
      const appLocale = rootState.location.locale
      let newItem = { ...state.item }
      newItem.name = newItem.item_name.find(
        locale => locale.language == appLocale
      ).name
      return newItem
    }
  },
  orderTotal: (state, getters, rootState, rootGetters) => {
    return (
      //discount is already subtracted from tax in tax.js
      getters.subTotal +
      rootGetters['tax/totalTax'] +
      rootGetters['surcharge/surcharge'] -
      rootGetters['discount/orderDiscountWithoutTax']
    )
  },

  subTotal: () => {
    return state.items.reduce((total, item) => {
      return total + item.price * item.quantity
    }, 0)
  },

  subTotalUndiscounted: () => {
    return state.items.reduce((total, item) => {
      return total + item.undiscountedPrice * item.quantity
    }, 0)
  },

  itemPrice: () => item => {
    return item.quantity * item.price
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

  items: (state, getters, rootState) => {
    const appLocale = rootState.location.locale
    return state.items.map(item => {
      let newItem = { ...item }
      newItem.name = newItem.item_name.find(
        locale => locale.language == appLocale
      ).name
      return newItem
    })
  },
}

// actions
const actions = {
  addToOrder({ state, commit, rootState, dispatch }, item) {
    //set item price based on location, for modifiers items it is already set in modifer store
    if (
      item.get_item_location_price.location_id == rootState.location.location
    ) {
      item.price = isNaN(
        parseFloat(item.get_item_location_price.menu_location_price)
      )
        ? 0
        : parseFloat(item.get_item_location_price.menu_location_price)
    } else {
      item.price = isNaN(parseFloat(item.item_price))
        ? 0
        : parseFloat(item.get_item_location_price.menu_location_price)
    }

    //this comes directly from the items menu without modifiers
    item.modifiable = false
    item.undiscountedPrice = item.price
    commit(mutation.SET_ITEM, item)

    const index = state.items.findIndex(
      orderItem => orderItem._id === state.item._id
    )
    if (index > -1) {
      commit(mutation.INCREMENT_ORDER_ITEM_QUANTITY, index)
    } else {
      commit(mutation.ADD_ORDER_ITEM, state.item)
    }

    dispatch('surcharge/calculate', {}, { root: true }).then(
      dispatch('tax/calculate', {}, { root: true }).then(() => {
        if (rootState.discount.appliedOrderDiscount) {
          dispatch('recalculateOrderTotals')
        } else {
          dispatch('recalculateItemPrices')
        }
      })
    )
  },

  removeFromOrder({ commit, dispatch, rootState }, { item, index }) {
    commit(mutation.SET_ITEM, item)
    commit(mutation.REMOVE_ORDER_ITEM, index)
    if (state.items.length) {
      commit(mutation.SET_ITEM, state.items[0])
    } else {
      commit(mutation.SET_ITEM, false)
    }

    if (state.items.length) {
      dispatch('surcharge/calculate', {}, { root: true }).then(
        dispatch('tax/calculate', {}, { root: true }).then(() => {
          if (rootState.discount.appliedOrderDiscount) {
            dispatch('recalculateOrderTotals')
          } else {
            dispatch('recalculateItemPrices')
          }
        })
      )
    } else {
      //cart is empty remove the discounts
      dispatch('checkout/reset', null, { root: true })
    }
  },

  addModifierOrder({ commit, rootState, dispatch, rootGetters }) {
    return new Promise((resolve, reject) => {
      let item = { ...rootState.modifier.item }

      //this comes through the modifier popup
      item.modifiable = true

      item.quantity = rootState.orderForm.quantity || 1

      commit(mutation.SET_ITEM, item)

      let itemModifierGroups = []
      let itemModifiers = []

      //adding modifers to item
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
        commit('orderForm/setError', 'Please select mandatory modifiers', {
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

      commit(mutation.ADD_MODIFIERS_TO_ITEM, {
        modifiers: itemModifiers,
        modifierGroups: itemModifierGroups,
      })

      //calculating item price based on modifiers selected
      let modifierPrice = 0
      //since we have just ids attached to item,
      //we need to consult modifier store for modifier data ie price

      rootState.modifier.itemModifiers.forEach(itemMod => {
        itemMod.modifiers.forEach(mod => {
          mod.get_modifier_sub_groups.forEach(subgroup => {
            subgroup.get_modifier_item_list.forEach(submod => {
              if (item.modifiers.includes(submod._id)) {
                modifierPrice += parseFloat(submod.price)
              }
            })
          })
        })
      })

      commit(mutation.ADD_MODIFIER_PRICE_TO_ITEM, modifierPrice)
      item.undiscountedPrice = item.price
      if (!item.editMode) {
        //update current item with new modifiers

        //check if item exists with same signature

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
      } else {
        //edit mode
        //if the signature was different then modify modifiers,
        //as we are creating new item and attached modifiers again so its better to just
        //replace that item in state with existing item
        commit(mutation.UPDATE_MODIFER_ORDER_ITEM, {
          item: state.item,
        })
      }

      dispatch('surcharge/calculate', {}, { root: true }).then(
        dispatch('tax/calculate', {}, { root: true }).then(() => {
          if (rootState.discount.appliedOrderDiscount) {
            dispatch('recalculateOrderTotals')
          } else {
            dispatch('recalculateItemPrices')
          }
        })
      )
      //reset the modifier form
      commit('orderForm/clearSelection', null, { root: true })
      resolve()
    })
  },

  setActiveItem({ commit, dispatch }, { orderItem, index }) {
    //get current item
    //this is fired by the items.vue
    let item = { ...state.items[index] }

    item.editMode = true
    item.quantity = orderItem.quantity
    item.orderIndex = index

    commit(mutation.SET_ITEM, item)

    if (item.modifiable) {
      dispatch(
        'modifier/setActiveItem',
        { item: item },
        {
          root: true,
        }
      )
    }
  },
  recalculateOrderTotals({ rootState, getters, rootGetters, dispatch }) {
    return new Promise((resolve, reject) => {
      const orderDiscount = rootState.discount.appliedOrderDiscount
      //let totalDiscount = 0
      if (orderDiscount) {
        let orderTotalDiscount = 0
        let taxTotalDiscount = 0
        let surchargeTotalDiscount = 0

        if (orderDiscount.discount.discountontotal) {
          //apply ontotal discount, apply on surcharge and its tax as well
          const subtotal = getters.subTotal
          const totalTax = rootState.tax.itemsTax + rootState.tax.surchargeTax
          const totalSurcharge = rootGetters['surcharge/surcharge']

          if (orderDiscount.discount.type == 'value') {
            if (orderDiscount.discount.rate > subtotal + totalTax) {
              dispatch('discount/clearOrderDiscount', null, { root: true })
              reject(DISCOUNT_ORDER_ERROR_TOTAL)
            } else {
              orderTotalDiscount = orderDiscount.discount.rate
              const percentDiscountOnSubTotal =
                (orderTotalDiscount * 100) / subtotal

              taxTotalDiscount = (totalTax * percentDiscountOnSubTotal) / 100
              surchargeTotalDiscount = 0
              resolve({
                orderDiscount: orderTotalDiscount,
                taxDiscount: taxTotalDiscount,
                surchargeDiscount: surchargeTotalDiscount,
              })
            }
          } else {
            orderTotalDiscount = (subtotal * orderDiscount.discount.rate) / 100
            taxTotalDiscount = (totalTax * orderDiscount.discount.rate) / 100
            surchargeTotalDiscount =
              (totalSurcharge * orderDiscount.discount.rate) / 100
            resolve({
              orderDiscount: orderTotalDiscount,
              taxDiscount: taxTotalDiscount,
              surchargeDiscount: surchargeTotalDiscount,
            })
          }
        } else {
          //apply offtotal discount, don't calculate discount on surcharge
          const subtotal = getters.subTotal
          //we are not including surcharge tax in total tax for discount
          const totalTax = rootState.tax.itemsTax
          //const totalSurcharge = rootGetters['surcharge/surcharge']
          if (orderDiscount.discount.type == 'value') {
            if (orderDiscount.discount.rate > subtotal + totalTax) {
              dispatch('discount/clearOrderDiscount', null, { root: true })
              reject(DISCOUNT_ORDER_ERROR_TOTAL)
            } else {
              orderTotalDiscount = orderDiscount.discount.rate
              const percentDiscountOnSubTotal =
                (orderTotalDiscount * 100) / subtotal
              taxTotalDiscount = (totalTax * percentDiscountOnSubTotal) / 100
              surchargeTotalDiscount = 0
              resolve({
                orderDiscount: orderTotalDiscount,
                taxDiscount: taxTotalDiscount,
                surchargeDiscount: surchargeTotalDiscount,
              })
            }
          } else {
            orderTotalDiscount = (subtotal * orderDiscount.discount.rate) / 100
            //const subtotalWithDiscount = subtotal - orderTotalDiscount
            taxTotalDiscount = (totalTax * orderDiscount.discount.rate) / 100
            surchargeTotalDiscount = 0
            resolve({
              orderDiscount: orderTotalDiscount,
              taxDiscount: taxTotalDiscount,
              surchargeDiscount: surchargeTotalDiscount,
            })
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
      let discountErrors = []

      const newItems = state.items.map((stateItem, index) => {
        let item = { ...stateItem }
        const discount = rootState.discount.appliedItemDiscounts.find(
          discount => discount.item.orderIndex == index
        )

        if (discount) {
          let itemDiscountData = {
            id: discount.discount._id,
            name: discount.discount.name,
            type: discount.discount.type,
            rate: discount.discount.rate,
          }

          if (discount.discount.type == 'value') {
            if (
              discount.discount.rate >
              item.undiscountedPrice * item.quantity
            ) {
              if (!discountErrors.includes(item._id)) {
                discountErrors.push(item._id)
              }
              item.discount = false
              item.price = item.undiscountedPrice
            } else {
              itemsDiscount += discount.discount.rate
              item.price =
                item.undiscountedPrice - discount.discount.rate / item.quantity
              itemDiscountData.discount = discount.discount.rate
            }
          } else {
            const calculated =
              (item.undiscountedPrice * discount.discount.rate) / 100

            item.price = item.undiscountedPrice - calculated

            itemsDiscount += calculated
            itemDiscountData.discount = calculated
          }

          if (!discountErrors.length) {
            item.discount = itemDiscountData
          }
        } else {
          //remove already applied discount
          item.discount = false
          item.price = item.undiscountedPrice
        }
        return item
      })

      dispatch(
        'discount/setItemsDiscountAmount',
        { discountAmount: itemsDiscount },
        { root: true }
      )

      commit(mutation.RE_SAVE_ITEMS, newItems)
      dispatch('surcharge/calculate', {}, { root: true }).then(
        dispatch('tax/calculate', {}, { root: true })
      )
      if (discountErrors.length) {
        reject(discountErrors)
        dispatch('discount/clearItemDiscount', discountErrors, { root: true })
      } else {
        resolve()
      }
    })
  },

  updateQuantity({ rootState, dispatch, commit }, quantity) {
    const itemQuantity = quantity || 1
    commit(mutation.UPDATE_ITEM_QUANTITY, itemQuantity)

    dispatch('surcharge/calculate', {}, { root: true }).then(
      dispatch('tax/calculate', {}, { root: true }).then(() => {
        if (rootState.discount.appliedOrderDiscount) {
          dispatch('recalculateOrderTotals')
        } else {
          dispatch('recalculateItemPrices')
        }
      })
    )
  },
  removeItemTax({ state, commit, dispatch, rootState }) {
    let item = { ...state.item }
    //remove tax information from the order and recalculate the tax
    item.removedTax = item.item_tax
    item.item_tax = false

    //splice item at index
    commit(mutation.REMOVE_ITEM_TAX, item)
    dispatch('tax/calculate', {}, { root: true }).then(() => {
      if (rootState.discount.appliedOrderDiscount) {
        dispatch('recalculateOrderTotals')
      } else {
        dispatch('recalculateItemPrices')
      }
    })
  },
  reset({ commit }) {
    commit(mutation.RESET)
  },
  addOrderNote({ commit }, orderNote) {
    commit(mutation.SET_ORDER_NOTE, orderNote)
    /* const params = [1, rootState.location.location]
    let orderDetail = ''
    OrderService.fetchOnlineOrderDetails(...params).then(response => {
      orderDetail = response.data.orderDetails
      commit(mutation.ONLINE_ORDERS, {
        onlineOrders: {},
        locationId: rootState.location.location,
        orderDetails: orderDetail,
      })
    })*/
  },

  setOnlineOrders({ commit, rootState }, onlineOrderData) {
    const params = [1, onlineOrderData.location_id]
    let orderDetail = ''
    OrderService.fetchOnlineOrderDetails(...params).then(response => {
      orderDetail = response.data.orderDetails
      commit(mutation.ONLINE_ORDERS, {
        onlineOrders: onlineOrderData,
        locationId: rootState.location.location,
        orderDetails: orderDetail,
      })
    })
  },

  getPastOrderDetails({ commit, rootState }, orderId) {
    const params = [orderId, rootState.location.location]
    OrderService.fetchOnlineOrderDetails(...params).then(response => {
      commit(mutation.PAST_ORDER_DETAILS, response.data.orderDetails)
    })
  },

  deliveryOrder({ commit, dispatch }, { referral, futureOrder }) {
    return new Promise((resolve, reject) => {
      commit(mutation.ORDER_TYPE, 'delivery')
      commit(mutation.SET_REFERRAL, referral)
      if (futureOrder != null) {
        commit(mutation.SET_FUTURE_ORDER, futureOrder)
      }
      dispatch('checkout/pay', {}, { root: true })
        .then(response => resolve(response))
        .catch(response => reject(response))
    })
  },

  updateOrderType({ commit }, orderType) {
    commit(mutation.ORDER_TYPE, orderType)
  },

  addHoldOrder({ rootState, dispatch }, holdOrders) {
    dispatch('reset')
    const allItems = rootState.category.items
    let getHoldOrderItems = []
    allItems.forEach(item => {
      holdOrders.item_ids.forEach(itemId => {
        if (itemId == item._id) {
          dispatch('addToOrder', item)
          getHoldOrderItems.push(item)
        }
      })
    })
  },

  selectedOrderDetails({ commit }, selectedOrderDetails) {
    commit(mutation.SET_ORDER_DETAILS, selectedOrderDetails.order)
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

  [mutation.ADD_ORDER_ITEM](state, item) {
    item.quantity = 1
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

  [mutation.UPDATE_MODIFER_ORDER_ITEM](state, { item }) {
    state.items.splice(item.orderIndex, 1, item)
  },

  [mutation.ADD_MODIFIERS_TO_ITEM](state, { modifiers, modifierGroups }) {
    state.item.modifiers = modifiers
    state.item.modifierGroups = modifierGroups
  },

  [mutation.ADD_MODIFIER_PRICE_TO_ITEM](state, modifierPrice) {
    const totalPrice = parseFloat(state.item.price) + parseFloat(modifierPrice)
    state.item.price = totalPrice
  },

  [mutation.SET_ITEM_TAX](state, tax) {
    state.item.tax = tax
  },

  [mutation.RE_SAVE_ITEMS](state, items) {
    state.items = items
  },

  [mutation.UPDATE_ITEM_QUANTITY](state, quantity) {
    const index = state.item.orderIndex
    let orderItem = state.items[index]
    orderItem.quantity = quantity
    state.items.splice(index, 1, orderItem)
  },
  [mutation.REMOVE_ITEM_TAX](state, item) {
    state.items.splice(item.orderIndex, 1, item)
  },
  [mutation.RESET](state) {
    state.items = []
    state.item = false
    //state.orderType = 'Walk-in'
  },
  [mutation.SET_ORDER_NOTE](state, orderNote) {
    state.orderNote = orderNote
  },
  [mutation.ORDER_TYPE](state, orderType) {
    state.orderType = orderType
  },
  [mutation.SET_REFERRAL](state, referral) {
    state.referral = referral
  },
  [mutation.SET_FUTURE_ORDER](state, futureOrder) {
    state.futureOrder = futureOrder
  },
  [mutation.ONLINE_ORDERS](state, { onlineOrders, locationId, orderDetails }) {
    localStorage.setItem('onlineOrders', JSON.stringify(orderDetails))
    state.onlineOrders = orderDetails
    playSound(locationId, onlineOrders)
  },
  [mutation.SET_ORDER_DETAILS](state, selectedOrderDetails) {
    state.selectedOrder = selectedOrderDetails
  },
  /*[mutation.PAST_ORDER_DETAILS](state, pastOrder) {
    state.selectedOrder = pastOrder
    // $('#past-order').modal('toggle')
  },*/
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

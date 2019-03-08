import * as mutation from './order/mutation-types'

// initial state
const state = {
  items: [],
  item: false,
  orderType: 'Walk-in',
}

// getters
const getters = {
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
}

// actions
const actions = {
  addToOrder({ state, commit, rootState, dispatch }, item) {
    //set item price based on location, for modifiers items it is already set in modifer store
    if (
      item.get_item_location_price.location_id == rootState.location.location
    ) {
      item.price = parseFloat(item.get_item_location_price.menu_location_price)
    } else {
      item.price = parseFloat(item.item_price)
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

    if (!state.items.length) {
      //cart is empty remove the discounts
      commit('discount/CLEAR_ORDER_DISCOUNT', null, { root: true })
      commit('discount/CLEAR_ITEM_DISCOUNT', null, { root: true })
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

  addModifierOrder({ commit, rootState, dispatch }) {
    let item = { ...rootState.modifier.item }

    //this comes through the modifier popup
    item.modifiable = true
    item.undiscountedPrice = item.price
    item.quantity = rootState.orderForm.quantity || 1

    commit(mutation.SET_ITEM, item)

    let itemModifierGroups = []
    let itemModifiers = []

    //adding modifers to item
    const modifiers = rootState.orderForm.modifiers.filter(
      modifier => modifier.itemId == item._id
    )
    modifiers.forEach(modifier => {
      itemModifierGroups.push(modifier)

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
  },

  setActiveItem({ commit, dispatch }, { orderItem, index }) {
    //get current item
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
  recalculateOrderTotals({ rootState, getters, dispatch, rootGetters }) {
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
          orderTotalDiscount = orderDiscount.discount.rate
          const percentDiscountOnSubTotal =
            (orderTotalDiscount * 100) / subtotal

          taxTotalDiscount = (totalTax * percentDiscountOnSubTotal) / 100
          surchargeTotalDiscount = 0
        } else {
          orderTotalDiscount = (subtotal * orderDiscount.discount.rate) / 100
          taxTotalDiscount = (totalTax * orderDiscount.discount.rate) / 100
          surchargeTotalDiscount =
            (totalSurcharge * orderDiscount.discount.rate) / 100
        }
      } else {
        //apply offtotal discount, don't calculate discount on surcharge
        const subtotal = getters.subTotal
        //we are not including surcharge tax in total tax for discount
        const totalTax = rootState.tax.itemsTax
        //const totalSurcharge = rootGetters['surcharge/surcharge']
        if (orderDiscount.discount.type == 'value') {
          orderTotalDiscount = orderDiscount.discount.rate
          const percentDiscountOnSubTotal =
            (orderTotalDiscount * 100) / subtotal
          taxTotalDiscount = (totalTax * percentDiscountOnSubTotal) / 100
          surchargeTotalDiscount = 0
        } else {
          orderTotalDiscount = (subtotal * orderDiscount.discount.rate) / 100
          //const subtotalWithDiscount = subtotal - orderTotalDiscount
          taxTotalDiscount = (totalTax * orderDiscount.discount.rate) / 100
          surchargeTotalDiscount = 0
        }
      }

      dispatch(
        'discount/setOrderDiscount',
        {
          orderDiscount: orderTotalDiscount,
          taxDiscount: taxTotalDiscount,
          surchargeDiscount: surchargeTotalDiscount,
        },
        { root: true }
      )
    }
  },

  recalculateItemPrices({ commit, rootState, dispatch }) {
    let itemsDiscount = 0
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
          itemsDiscount += discount.discount.rate * item.quantity
          item.price = item.undiscountedPrice - discount.discount.rate
          itemDiscountData.discount = discount.discount.rate
        } else {
          const calculated =
            (item.undiscountedPrice * discount.discount.rate) / 100

          item.price = item.undiscountedPrice - calculated

          itemsDiscount += calculated * item.quantity
          itemDiscountData.discount = calculated
        }

        item.discount = itemDiscountData
      } else {
        //remove already applied discount
        item.discount = false
        item.price = item.undiscountedPrice
        itemsDiscount = 0
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
    const totalPrice = state.item.price + modifierPrice
    state.item.price = parseFloat(totalPrice)
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
    state.orderType = 'Walk-in'
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

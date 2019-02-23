import * as mutation from './order/mutation-types'

// initial state
const state = {
  items: [],
  item: {},
}

// getters
const getters = {
  orderTotal: () => {
    return state.items.reduce((total, item) => {
      return total + item.price * item.quantity
    }, 0)
  },

  subTotal: () => {
    return state.items.reduce((total, item) => {
      return total + item.price * item.quantity
    }, 0)
  },

  itemPrice: () => item => {
    return item.quantity * item.price
  },

  orderModifiers: () => item => {
    return item.modifiers.length
  },

  orderSurcharge: () => {},
  orderTax: () => {},
  orderDiscount: () => {},
}

// actions
const actions = {
  addToOrder({ state, commit, rootState }, item) {
    //set item price based on location, for modifiers items it is already set in modifer store
    if (
      item.get_item_location_price.location_id == rootState.location.location
    ) {
      item.price = parseFloat(item.get_item_location_price.menu_location_price)
    } else {
      item.price = parseFloat(item.item_price)
    }

    commit(mutation.SET_ITEM, item)

    const index = state.items.findIndex(
      orderItem => orderItem._id === state.item._id
    )
    if (index > -1) {
      commit(mutation.INCREMENT_ORDER_ITEM_QUANTITY, index)
    } else {
      commit(mutation.ADD_ORDER_ITEM, state.item)
    }
  },

  removeFromOrder({ commit }, item) {
    commit(mutation.SET_ITEM, item)
    commit(mutation.REMOVE_ORDER_ITEM, item)
    commit(mutation.SET_ITEM, state.items[0])
  },

  addModifierOrder({ commit, rootState }) {
    let itemModifiers = []
    let item = { ...rootState.modifier.item }
    const modifiers = rootState.orderForm.modifiers.filter(
      modifier => modifier.itemId == item._id
    )
    modifiers.forEach(modifier => {
      if (Array.isArray(modifier.modifierId)) {
        itemModifiers.push(...modifier.modifierId)
      } else {
        itemModifiers.push(modifier.modifierId)
      }
    })
    item.modifiers = itemModifiers
    //add modifier prices to item price
    let modifierPrice = 0

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

    item.price = parseFloat(item.price) + modifierPrice

    commit(mutation.SET_ITEM, item)

    //check if item exists with same signature
    const orderItems = state.items.filter(
      orderItem => orderItem._id === state.item._id
    )

    let itemExists = -1

    if (orderItems.length) {
      orderItems.forEach((orderItem, index) => {
        if (
          orderItem.modifiers.every(modifierId =>
            state.item.modifiers.includes(modifierId)
          ) &&
          orderItem.modifiers.length == state.item.modifiers.length
        ) {
          itemExists = index
        }
      })
    }

    if (itemExists > -1) {
      commit(mutation.INCREMENT_ORDER_ITEM_QUANTITY, itemExists)
    } else {
      commit(mutation.ADD_ORDER_ITEM, state.item)
    }
  },
}

// mutations
const mutations = {
  [mutation.SET_ITEM](state, item) {
    state.item = item
  },

  [mutation.ADD_ORDER_ITEM](state, item) {
    item.quantity = 1
    if (!item.modifiers) {
      item.modifiers = []
    }

    state.items.push(item)
  },

  [mutation.INCREMENT_ORDER_ITEM_QUANTITY](state, index) {
    //need to use array splice to make it reactive
    let orderItem = state.items[index]
    orderItem.quantity++
    state.items.splice(index, 1, orderItem)
  },

  [mutation.REMOVE_ORDER_ITEM](state, item) {
    state.items = state.items.filter(function(orderItem) {
      return orderItem._id != item._id
    })
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

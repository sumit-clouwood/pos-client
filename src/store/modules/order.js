import * as mutation from './order/mutation-types'

// initial state
const state = {
  items: [],
  item: {},
  selectedModifiers: [],
  errorBit: false,
  //only for maintaining checkbox state
  selectedModifierIds: [],
  selectedModifierOptions: [],
}

// getters
const getters = {
  orderTotal: () => {
    return state.items.reduce((total, item) => {
      return total + item.item_price * item.quantity
    }, 0)
  },

  subTotal: () => {
    return state.items.reduce((total, item) => {
      return total + item.item_price * item.quantity
    }, 0)
  },

  itemPrice: () => item => {
    return item.quantity * item.item_price
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
  addToOrder({ commit, state }, item) {
    //set item price based on location
    commit(mutation.SET_ITEM, item)

    const orderItem = state.items.find(
      orderItem => orderItem._id === state.item._id
    )
    if (orderItem) {
      commit(mutation.INCREMENT_ORDER_ITEM_QUANTITY, orderItem._id)
    } else {
      commit(mutation.ADD_ORDER_ITEM, state.item)
    }
  },

  removeFromOrder({ commit }, item) {
    commit(mutation.SET_ITEM, item)
    commit(mutation.REMOVE_ORDER_ITEM, item)
    commit(mutation.SET_ITEM, state.items[0])
  },

  selectItemModifiers({ commit, rootState }, { modifier, itemId }) {
    const item = state.selectedModifiers.find(item => item.itemId == itemId)

    if (!item) {
      commit(mutation.SELECT_ITEM_MODIFIER, {
        modifier: modifier,
        itemId: itemId,
      })
    } else {
      //toggle: if modifier already exists then remove it, otherwise add it
      const selectedModifierIndex = item.modifiers.findIndex(
        mod => mod._id == modifier._id
      )
      if (selectedModifierIndex === -1) {
        //if limit reached throw error
        let itemModifierLimit = 0

        rootState.modifier.itemModifiers.forEach(item =>
          item.itemId == itemId
            ? item.modifiers.forEach(mod =>
                mod.get_modifier_sub_groups.forEach(submod =>
                  submod.get_modifier_item_list.forEach(submodItem =>
                    submodItem._id == modifier._id
                      ? (itemModifierLimit = submod.noofselection)
                      : ''
                  )
                )
              )
            : ''
        )
        if (item.modifiers.length == parseInt(itemModifierLimit)) {
          commit(
            mutation.SET_ERROR_BIT,
            `You can not add more than ${itemModifierLimit} addons`
          )
          commit(mutation.REMOVE_MODIFIER_ID, modifier._id)
        } else {
          commit(mutation.APPEND_MODIFIER_SELECTION, {
            modifier: modifier,
            itemId: itemId,
          })
        }
      } else {
        commit(mutation.UNSELECT_ITEM_MODIFIER, {
          modifierIndex: selectedModifierIndex,
          itemId: itemId,
        })
        commit(mutation.SET_ERROR_BIT, false)
      }
    }
  },

  clearItem() {
    //used when we close popup without adding item to cart, to clear all selected modifiers
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

  [mutation.INCREMENT_ORDER_ITEM_QUANTITY](state, itemId) {
    //need to use array splice to make it reactive
    let orderItem = state.items.find(item => item._id == itemId)
    orderItem.quantity++
    const index = state.items.findIndex(item => item._id == itemId)
    state.items.splice(index, 1, orderItem)
  },

  [mutation.REMOVE_ORDER_ITEM](state, item) {
    state.items = state.items.filter(function(orderItem) {
      return orderItem._id != item._id
    })
  },

  //[1 => [mod1, mod2]]
  [mutation.SELECT_ITEM_MODIFIER](state, { modifier, itemId }) {
    state.selectedModifiers.push({ itemId: itemId, modifiers: [modifier] })
  },

  [mutation.APPEND_MODIFIER_SELECTION](state, { modifier, itemId }) {
    const selectedModifiers = state.selectedModifiers.map(item => {
      if (item.itemId == itemId) {
        item.modifiers.push(modifier)
      }
      return item
    })

    state.selectedModifiers = selectedModifiers
  },

  [mutation.UNSELECT_ITEM_MODIFIER](state, { modifierIndex, itemId }) {
    const selectedModifiers = state.selectedModifiers.map(item => {
      if (item.itemId == itemId) {
        item.modifiers.splice(modifierIndex, 1)
      }
      return item
    })
    state.selectedModifiers = selectedModifiers
  },

  [mutation.SET_ERROR_BIT](state, error) {
    state.errorBit = error
  },
  //only for maintaining checkbox state
  [mutation.SELECT_MODIFIER_ID](state, modifierIds) {
    state.selectedModifierIds = modifierIds
  },

  [mutation.SELECT_MODIFIER_OPTIONS](state, modifierIds) {
    state.selectedModifierOptions = modifierIds
  },

  [mutation.REMOVE_MODIFIER_ID](state, modifierId) {
    state.selectedModifierIds.splice(
      state.selectedModifierIds.findIndex(key => key == modifierId),
      1
    )
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

const state = {
  currentCombo: {},
  currentComboSection: undefined,
  currentComboSelectedItems: {},
  currentComboSelectedItem: {},
  currentComboSelectedModifiers: undefined,
}
const actions = {
  selectModifiers({ getters, rootGetters, dispatch, commit }) {
    commit('SET_CURRENT_COMBO_SELECTED_MODIFIERS', {
      itemId: getters.current_combo_selected_item,
      modifiers: rootGetters['orderForm/modifiers'],
    })
    dispatch('orderForm/clearSelection', null, { root: true })
  },
  addToCart({ getters, dispatch }) {
    //add current combo to cart
    if (getters.current_combo_selected_modifiers) {
      //add modifier order
    } else {
      //add simple order
    }
    dispatch('order/addItemToCart')
  },
}
const getters = {
  current_combo: state => state.currentCombo,
  current_combo_section: state => {
    if (state.currentComboSection) {
      return state.currentComboSection
    }
    if (state.currentCombo && state.currentCombo.combo_items) {
      return state.currentCombo.combo_items[0]
    }
  },
  current_combo_items: (state, getters, rootState, rootGetters) => {
    if (!getters.current_combo_section) {
      return false
    }
    let items = []
    getters.current_combo_section.for_items.forEach(itemId => {
      const item = rootGetters['category/itemById'](itemId)
      if (item) {
        items.push(item)
      }
    })
    return items
  },
  current_combo_selected_items: state => state.currentComboSelectedItems,
  current_combo_selected_item: state => state.currentComboSelectedItem,
  current_combo_selected_modifiers: state =>
    state.currentComboSelectedModifiers,
  current_combo_item_modifiers: (state, getters) => item => {
    if (getters.current_combo_selected_modifiers) {
      return getters.current_combo_selected_modifiers[item._id]
    }
  },
}
const mutations = {
  SET_CURRENT_COMBO(state, combo) {
    state.currentCombo = combo
  },
  SET_CURRENT_COMBO_SECTION(state, comboSection) {
    state.currentComboSection = comboSection
  },
  // contains ids instead of full item
  SET_CURRENT_COMBO_SELECTED_ITEMS(state, items) {
    state.currentComboSelectedItems = items
  },
  // contains item id instead of full item
  SET_CURRENT_COMBO_SELECTED_ITEM(state, item) {
    state.currentComboSelectedItem = item
  },
  SET_CURRENT_COMBO_SELECTED_MODIFIERS(state, { itemId, modifiers }) {
    state.currentComboSelectedModifiers[itemId] = modifiers
  },
}

export default {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
}

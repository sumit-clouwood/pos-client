/* eslint-disable no-console */
const state = {
  currentCombo: undefined,
  currentOrderCombo: undefined,
  currentComboSection: undefined,
  currentComboSelectedItems: {},
  currentComboSelectedItem: undefined,
  currentComboSelectedModifiers: undefined,
  errors: {},
  msg: '',
}
const actions = {
  selectModifiers({ getters, rootGetters, commit }) {
    commit('SET_CURRENT_COMBO_SELECTED_MODIFIERS', {
      item: getters.current_combo_selected_item,
      modifiers: rootGetters['orderForm/modifiers'],
    })
  },
  reset({ commit }) {
    commit('RESET')
    commit('orderForm/clearSelection', null, { root: true })
  },
  setItem({ commit }, { item }) {
    console.log('current combo', item)
    let newItem = { ...item }
    newItem.editMode = true
    commit('SET_CURRENT_COMBO', newItem)
    commit('SET_CURRENT_ORDER_COMBO', newItem)
    commit('SET_CURRENT_COMBO_SELECTED_ITEMS', newItem.selectedItems)
  },
  setOrderComboItem({ commit, getters, dispatch }, item) {
    commit('SET_CURRENT_COMBO_SELECTED_ITEM', item)
    dispatch('modifier/setItem', item, { root: true })
    const combo = getters.current_combo
    const modifiers = combo.selectedModifiersRaw
    commit(
      'orderForm/restoreModifiersCtrls',
      { checkboxes: modifiers.checkboxes, radios: modifiers.radios },
      {
        root: true,
      }
    )
  },
  setError({ commit, getters }, error) {
    commit('SET_ERROR', {
      sectionId: getters.current_combo_section._id['$oid'],
      error: error,
    })
  },
  clearError({ commit }) {
    commit('SET_ERRORS', {})
  },
  validate_combo_items: ({ state, getters, commit, rootGetters }) => {
    let errors = {}
    let sectionItems = {}
    getters.current_combo.combo_items.forEach(section => {
      section.for_items.forEach(itemId => {
        if (state.currentComboSelectedItems[itemId]) {
          if (!sectionItems[section._id['$oid']]) {
            sectionItems[section._id['$oid']] = {
              items: [],
              qty: section.qty,
              name: section.name,
            }
          }
          sectionItems[section._id['$oid']].items.push(itemId)
        }
      })
    })
    getters.current_combo.combo_items.forEach(originalSection => {
      const section = sectionItems[originalSection._id['$oid']]
      if (!section || section.items.length != originalSection.qty) {
        errors[originalSection._id['$oid']] = rootGetters['location/_t'](
          `Please select ${originalSection.qty} item(s) from ${originalSection.name}`
        )
      }
    })

    commit('SET_ERRORS', errors)
  },
}
const getters = {
  current_combo: state => state.currentCombo,
  current_order_combo: state => state.currentOrderCombo,
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
  find_combo_items: (state, getters, rootState, rootGetters) => combo => {
    let items = []
    for (const itemId in combo.selectedItems) {
      const item = rootGetters['category/itemById'](itemId)
      if (item) {
        items.push(item)
      }
    }
    return items
  },
  find_combo_item_modifiers: (state, getters, rootState, rootGetters) => (
    combo,
    item
  ) => {
    let modifiers = []
    if (combo.selectedModifiers && combo.selectedModifiers[item._id]) {
      const selectedModifiers = combo.selectedModifiers[item._id]
      selectedModifiers.forEach(selectedModifier => {
        const modifier = rootGetters['modifier/findModifier'](
          selectedModifier.modifierId,
          item
        )
        if (modifier) {
          modifiers.push(modifier)
        }
      })
    }
    return modifiers
  },
  current_combo_selected_items: state => state.currentComboSelectedItems,
  current_combo_selected_item: state => state.currentComboSelectedItem,
  current_combo_selected_modifiers: state =>
    state.currentComboSelectedModifiers,
  combo_msg: state => state.msg,
  combo_error: (state, getters) => {
    if (!getters.combo_errors) {
      return ''
    }
    let error = ''
    for (const sectionId in getters.combo_errors) {
      if (!error && getters.combo_errors[sectionId]) {
        error = getters.combo_errors[sectionId]
      }
    }
    return error
  },
  combo_errors: state => {
    return Object.keys(state.errors).length === 0 &&
      state.errors.constructor === Object
      ? false
      : state.errors
  },

  order_item: (state, getters, rootState, rootGetters) => {
    const item = { ...getters.current_combo }
    item.selectedItems = getters.current_combo_selected_items
    item.selectedModifiers = getters.current_combo_selected_modifiers
    item.selectedModifiersRaw = {
      checkboxes: rootState.orderForm.checkboxes,
      radios: rootState.orderForm.radios,
    }

    //set combo pricing based on selected modifiers
    let netPrice = item.value / ((100 + item.tax_sum) / 100)
    if (item.selectedModifiers) {
      //combo contains modifiers
      //get price of each modifier and add to current price
      let modifiersPrice = 0
      for (const itemId in item.selectedModifiers) {
        const modifiers = item.selectedModifiers[itemId]
        modifiers.forEach(selectedModifier => {
          const modifier = rootGetters['modifier/findModifier'](
            selectedModifier.modifierId,
            item
          )
          modifiersPrice += modifier.value
        })
      }
      netPrice += modifiersPrice
    }
    //apply tax again
    netPrice += netPrice * item.tax_sum * 0.01
    //set per item price here associate it with item so we wouldn't need to
    //re calculate it
    item.value = netPrice
    return item
  },
}
const mutations = {
  SET_CURRENT_COMBO(state, combo) {
    state.currentCombo = combo
  },
  SET_CURRENT_COMBO_SECTION(state, comboSection) {
    state.currentComboSection = comboSection
  },
  SET_CURRENT_ORDER_COMBO(state, item) {
    state.currentOrderCombo = item
  },
  // contains ids instead of full item
  SET_CURRENT_COMBO_SELECTED_ITEMS(state, items) {
    state.currentComboSelectedItems = items || {}
  },
  // contains item id instead of full item
  SET_CURRENT_COMBO_SELECTED_ITEM(state, item) {
    state.currentComboSelectedItem = item
  },
  SET_ERROR(state, { sectionId, error }) {
    let errors = { ...state.errors }
    errors[sectionId] = error
    state.errors = errors
  },
  SET_MSG(state, msg) {
    state.msg = msg
  },
  SET_ERRORS(state, errors) {
    state.errors = errors
  },
  SET_CURRENT_COMBO_SELECTED_MODIFIERS(state, { item, modifiers }) {
    if (!state.currentComboSelectedModifiers) {
      state.currentComboSelectedModifiers = {}
    }
    state.currentComboSelectedModifiers[item._id] = modifiers
  },
  RESET(state, full = false) {
    state.currentCombo = undefined
    state.currentComboSelectedItems = {}
    state.currentComboSection = undefined
    state.currentComboSelectedItem = undefined
    state.currentComboSelectedModifiers = undefined
    state.errors = {}
    state.msg = ''
    if (full) {
      state.currentOrderCombo = undefined
    }
  },
}

export default {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
}

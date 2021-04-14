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
    const item = getters.current_combo_selected_item

    return new Promise((resolve, reject) => {
      const modifiers = rootGetters['orderForm/modifiers'].filter(
        modifier => modifier.itemId == item._id
      )

      let selectedModifierGroups = []
      let itemModifierGroups = []

      modifiers.forEach(modifier => {
        itemModifierGroups.push(modifier)
        selectedModifierGroups.push(modifier.groupId)
      })

      //match modifiers with mandatory modifiers for this item, if not matched set error and return false
      const itemMandatoryModifierGroups = rootGetters[
        'modifier/itemMandatoryGroups'
      ](item._id)

      let mandatorySelected = true

      itemMandatoryModifierGroups.forEach(id => {
        if (!selectedModifierGroups.includes(id)) {
          mandatorySelected = false
        }
      })

      if (mandatorySelected) {
        commit('orderForm/setError', false, {
          root: true,
        })
        commit('SET_CURRENT_COMBO_SELECTED_MODIFIERS', {
          item: item,
          modifiers: rootGetters['orderForm/modifiers'].filter(
            selectedModifier => selectedModifier.itemId == item._id
          ),
        })
        resolve()
      } else {
        commit('orderForm/setError', 'Please select at least one item', {
          root: true,
        })
        reject()
      }
    })
  },
  reset({ commit }, option) {
    commit('RESET', option)
    commit('orderForm/clearSelection', null, { root: true })
  },
  //set item while updating in cart
  setItem({ commit, dispatch, rootGetters }, { item }) {
    console.log('current combo', item)
    let newItem = { ...item }
    newItem.editMode = true
    commit('SET_CURRENT_COMBO', newItem)
    commit('SET_CURRENT_ORDER_COMBO', newItem)
    commit('SET_CURRENT_COMBO_SELECTED_ITEMS', newItem.selectedItems)

    let modifiers = []
    for (const itemId in item.selectedItems) {
      for (const modItemId in item.selectedModifiers) {
        if (modItemId == itemId) {
          const itemModifiers = item.selectedModifiers[itemId]

          /*
          groupId: "5dbc5e8ff11bad3f95662ea2"
          itemId: "5da2d458b82fe55b01336b97"
          modifierId: "5dbc5eb5ef34bd74571152d2"
          type: "radio"

          groupId: "5e577459d454ff15b93b4a53"
          itemId: "5da2d458b82fe55b01336b8b"
          limit: 5
          modifierId: "5e5774bec81c0f0f1d715944"
          type: "checkbox"
          */
          itemModifiers.forEach(modifier => {
            modifiers.push(modifier)
          })
          const catalogItem = rootGetters['category/itemById'](itemId)

          commit('SET_CURRENT_COMBO_SELECTED_MODIFIERS', {
            item: catalogItem,
            modifiers: itemModifiers,
          })
        }
      }
    }
    dispatch('orderForm/populateSelection', modifiers, {
      root: true,
    })

    //add modifiers to combo
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
    //sections
    getters.current_combo.combo_items.forEach(section => {
      //section items
      section.for_items.forEach(itemId => {
        //check if itemId exists in current combo selection
        if (state.currentComboSelectedItems[itemId]) {
          //prepare data structure if not already created
          if (!sectionItems[section._id['$oid']]) {
            sectionItems[section._id['$oid']] = {
              items: [],
              qty: section.qty,
              name: section.name,
            }
          }
          //push item id to section items
          sectionItems[section._id['$oid']].items.push({
            itemId: itemId,
            qty: state.currentComboSelectedItems[itemId],
          })
        }
      })
    })
    //sections
    getters.current_combo.combo_items.forEach(originalSection => {
      //get section from the selected items
      const section = sectionItems[originalSection._id['$oid']]
      //get total qty of section items
      let qty = 0
      if (section) {
        section.items.forEach(itm => (qty += itm.qty))
      }

      if (!section || qty != originalSection.qty) {
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
      const item = { ...rootGetters['category/itemById'](itemId) }
      if (item) {
        item.quantity = combo.selectedItems[itemId]
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
  current_combo_selected_items: state => {
    //return only those which has true value
    let trueSelection = {}
    for (const i in state.currentComboSelectedItems) {
      if (state.currentComboSelectedItems[i] !== false) {
        trueSelection[i] = state.currentComboSelectedItems[i]
      }
    }
    return trueSelection
  },
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
    //get combo item net price as item.value contains with tax value
    let netPrice = item.value / ((100 + item.tax_sum) / 100)

    //modifiers prices are additional prices, so for example if item quantity is 3 and 1 modifier selected with price
    //that means 3 modifiers are added with that item. so 3x price ll be added.
    //while adding modifier price, get the quantity of the item for which that modifier was added
    //multiply that item quantity with modifier price.

    if (item.selectedModifiers) {
      //combo contains modifiers
      //get price of each modifier and add to current price
      let modifiersPrice = 0
      for (const itemId in item.selectedModifiers) {
        const selectedItemQuantity = item.selectedItems[itemId]
        const modifiers = item.selectedModifiers[itemId]
        modifiers.forEach(selectedModifier => {
          const modifier = rootGetters['modifier/findModifier'](
            selectedModifier.modifierId,
            item
          )
          //modifier quantity is relative to item quantity
          modifiersPrice += modifier.value * selectedItemQuantity
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

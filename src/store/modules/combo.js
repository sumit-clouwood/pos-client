const state = {
  currentCombo: {},
  currentComboSection: undefined,
  currentComboSelectedItems: {},
}
const actions = {}
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
}
const mutations = {
  SET_CURRENT_COMBO(state, combo) {
    state.currentCombo = combo
  },
  SET_CURRENT_COMBO_SECTION(state, comboSection) {
    state.currentComboSection = comboSection
  },
  SET_CURRENT_COMBO_SELECTED_ITEMS(state, items) {
    state.currentComboSelectedItems = items
  },
}

export default {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
}

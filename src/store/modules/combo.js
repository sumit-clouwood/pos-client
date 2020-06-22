const state = {
  currentCombo: undefined,
  currentComboSection: undefined,
  currentComboSelectedItems: undefined,
}
const actions = {}
const getters = {
  current_combo: state => state.currentCombo,
  current_combo_section: state =>
    state.currentComboSection || state.currentCombo.combo_items[0],
  current_combo_items: (state, getters) =>
    getters.current_combo_section.for_items,
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

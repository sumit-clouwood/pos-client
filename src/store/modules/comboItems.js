const state = {
  currentCombo: undefined,
  currentComboSection: undefined,
}
const actions = {}
const getters = {
  current_combo: state => state.currentCombo,
}
const mutations = {
  SET_CURRENT_COMBO(state, combo) {
    state.currentCombo = combo
  },
  SET_CURRENT_COMBO_SECTION(state, comboSection) {
    state.currentComboSection = comboSection
  },
}

export default {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
}

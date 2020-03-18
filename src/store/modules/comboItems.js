import * as mutation from './combo/mutation-types'

const state = {
  comboItemsList: false,
  selectedItemContainer: false,
  subItems: false,
}

const actions = {
  findItemById({ state, rootState, commit }) {
    let items = []
    rootState.category.items.forEach(item => {
      if (state.selectedItemContainer.for_items.includes(item._id)) {
        items.push(item)
      }
    })
    commit(mutation.SUB_ITEM_LIST, items)
  },
}

const getters = {
  comboItemName: state => {
    if (state.comboItemsList) {
      return state.comboItemsList.name
    }
    return ''
  },
}

const mutations = {
  [mutation.SET_COMBO_ITEMS](state, comboItems) {
    state.comboItemsList = comboItems
  },
  [mutation.SET_SELECTED_ITEM_DATA](state, selectedItemContainer) {
    state.selectedItemContainer = selectedItemContainer
  },
  [mutation.SUB_ITEM_LIST](state, subItems) {
    state.subItems = subItems
  },
}

export default {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
}

import * as mutation from './combo/mutation-types'

const state = {
  comboItemsList: false,
  selectedItemContainer: false,
  subItems: false,
}

const actions = {
  findItemById({ state, rootState, commit }) {
    let items = []
    // return getters.rawItems.find(item => item._id === id)
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
  /*findItemById: (state, rootState) => id => {
    // return getters.rawItems.find(item => item._id === id)
    state.selectedItemContainer.for_items.filter(id => {

    })
  },*/
}

const mutations = {
  [mutation.SET_COMBO_ITEMS](state, comboItems) {
    state.comboItemsList = comboItems
  },
  [mutation.SET_SELECTED_ITEM_DATA](state, selectedItemContainer) {
    state.selectedItemContainer = selectedItemContainer
  },
  [mutation.SUB_ITEM_LIST](state, subItems) {
    // eslint-disable-next-line no-console
    console.log(subItems)
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

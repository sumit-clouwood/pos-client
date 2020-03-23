import * as mutation from './combo/mutation-types'

const state = {
  comboItemsList: false,
  selectedItemContainer: false,
  subItems: false,
  errorMessage: '',
  activeComboItems: {},
}

const actions = {
  findItemById({ state, rootState, rootGetters, commit }) {
    let items = []
    rootState.category.items.forEach(item => {
      if (state.selectedItemContainer.for_items.includes(item._id)) {
        items.push(item)
      }
    })
    if (rootGetters['auth/multistore']) {
      let multistoreItems =
        rootState.category.multistoreItems[rootState.context.storeId]
      multistoreItems.forEach(item => {
        if (state.selectedItemContainer.for_items.includes(item._id)) {
          items.push(item)
        }
      })
    }
    commit(mutation.SUB_ITEM_LIST, items)
  },
}

const getters = {
  getItemIds: state => {
    let items = []
    if (state.comboItemsList) {
      state.comboItemsList.combo_items.map(item => {
        let currentItemObject = {}
        currentItemObject[item._id.$oid] = []
        items.push(currentItemObject)
      })
    }
    return items
  },
  comboItemName: state => {
    if (state.comboItemsList) {
      return state.comboItemsList.name
    }
    return ''
  },
  limitOfSelectingItems: state => {
    if (state.selectedItemContainer) {
      return state.selectedItemContainer.qty
    }
    return 1
  },
  /*
  [
      {
        itemId:[
        {item1},
        {item2}
      ]
    },
      itemId:[
        {
          {item1},
          {item2}
        }
      ]
  ]
  */
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
  [mutation.SET_ERROR_MESSAGE](state, errorMessage) {
    state.errorMessage = errorMessage
  },
  [mutation.ACTIVE_COMBO_ITEMS](state, activeComboItems) {
    state.activeComboItems = activeComboItems
    // eslint-disable-next-line no-console
    console.log(state.activeComboItems, 'state.activeComboItems')
  },
}

export default {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
}

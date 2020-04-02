import * as mutation from './combo/mutation-types'
import Num from '@/plugins/helpers/Num.js'

const state = {
  comboItemsList: false,
  selectedItemContainer: false,
  subItems: false,
  errorMessage: '',
  activeComboItems: {},
  setModifiersItem: [],
  orderIndex: 0,
  forCombo: 1,
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
  setModifiers({ commit }, item) {
    return new Promise(resolve => {
      commit(mutation.SET_MODIFIERS, item)
      resolve()
    })
  },
  updateOrderIndex({ commit, rootGetters, state }) {
    let orderIndex = state.orderIndex
    if (state.orderIndex === 0) {
      orderIndex = rootGetters['order/orderIndex'] + state.orderIndex
    }
    // eslint-disable-next-line no-console
    console.log(orderIndex, 'orderIndex', rootGetters['order/orderIndex'])
    commit(mutation.SET_ORDER_INDEX, orderIndex)
  },
  reset({ commit }) {
    commit(mutation.RESET)
  },
}

const getters = {
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
  getItemPrice: (state, getters, rootState) => item => {
    let priceAvailability = item.price_availability
    let storeId = rootState.context.storeId
    let price = priceAvailability.stores.find(store => store.param === storeId)
    return price.value || 0
  },
  setItemPrice: (state, getters) => addedItem => {
    let itemPrice = 0
    state.comboItemsList.combo_items.forEach(item => {
      if (item.for_items.includes(addedItem._id)) {
        let itemTotalPrice = getters.getItemPrice(item)
        itemPrice = parseInt(itemTotalPrice) / item.qty
      }
    })
    return itemPrice
  },
  updateItemPriceTax: (state, getters, rootState, rootGetters) => item => {
    let qty = item.quantity || 1
    // eslint-disable-next-line no-console
    console.log(state.comboItemsList, 'comboItemsListcomboItemsList')
    item.orderIndex = state.orderIndex
    item.for_combo = state.forCombo
    item.tax_sum = state.comboItemsList.tax_sum
    item.value = parseInt(getters.setItemPrice(item)) * qty
    item.grossPrice = rootGetters['order/grossPrice'](item)
    item.netPrice = rootGetters['order/netPrice'](item)
    // item.grossPrice = rootGetters['order/itemGrossPrice'](item)
    // item.netPrice = rootGetters['order/itemNetPrice'](item)
    item.tax = Num.round(item.grossPrice - item.netPrice)
    return item
    /*activeItem.tax = this.$store
      .dispatch(
        'order/prepareItemTax',
        {
          item: activeItem,
          type: null,
        },
        { root: true }
      )
      .then(item => item.tax)*/
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
  [mutation.SET_ERROR_MESSAGE](state, errorMessage) {
    state.errorMessage = errorMessage
  },
  [mutation.ACTIVE_COMBO_ITEMS](state, activeComboItems) {
    state.activeComboItems = activeComboItems
  },
  [mutation.SET_MODIFIERS](state, setModifiersItem) {
    state.setModifiersItem.push({ ...setModifiersItem })
  },
  [mutation.SET_ORDER_INDEX](state, orderIndex) {
    state.orderIndex = orderIndex + 1
  },
  [mutation.SET_FOR_COMBO](state, comboItemIndex) {
    state.forCombo = comboItemIndex
    // state.forCombo = state.forCombo + 1
  },
  [mutation.RESET](state) {
    state.forCombo = 1
  },
}

export default {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
}

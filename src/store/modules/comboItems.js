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
  forCombo: 0, // set this to 0 initially
  selectedContainerLength: 0,
  modifingItem: false,
  additionalComboValue: 0,
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
    if (orderIndex === 0) {
      orderIndex = parseInt(rootGetters['order/orderIndex']) + orderIndex
    }
    // eslint-disable-next-line no-console
    console.log(orderIndex, 'orderIndex', rootGetters['order/orderIndex'])
    commit(mutation.SET_ORDER_INDEX, orderIndex)
  },
  reset({ commit }) {
    commit(mutation.RESET)
  },
  setAdditionalComboPrice({ commit }, items) {
    let price = 0
    items.forEach(item => {
      price += item.additional_combo_value || 0
    })
    commit(mutation.ADDITIONAL_COMBO_VALUE, price)
  },
}

const getters = {
  /*additionalComboPrice: state => {
    let price = 0
    /!*state.activeComboItems.forEach(item => {
      price += parseFloat(item.additional_combo_value)
    })*!/
    return price
  },*/
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
    let currentStore = rootState.location.store
    let price = priceAvailability.stores.find(
      store => store.param === currentStore._id
    )
    //If item price not found in stores, then check in countries
    if (!price) {
      price = priceAvailability.countries.find(
        store => store.param === currentStore.country
      )
    }
    //TODO: Find item price from city as wells
    return price ? price.value : 0
  },
  setItemPrice: (state, getters) => addedItem => {
    let itemPrice = 0
    state.comboItemsList.combo_items.forEach(item => {
      if (item.for_items.includes(addedItem._id)) {
        let itemTotalPrice = getters.getItemPrice(item)
        /*getters.fixDecimalValue({
          itemTotalPrice: itemTotalPrice,
          item: item,
        })*/
        itemPrice = parseInt(itemTotalPrice) / item.qty
      }
    })
    return itemPrice
  },
  priceSettlement: (state, getters, rootState) => activeItemModifiers => {
    let subItemNetPrice = 0
    let subItemTax = 0
    let pickItemPriceSettlement = false
    activeItemModifiers.forEach(item => {
      subItemNetPrice += item.netPrice
      subItemTax += item.tax
      pickItemPriceSettlement = item
    })
    let setMainItem = getters.updateItemPriceTax(state.comboItemsList)
    // eslint-disable-next-line no-console
    console.log(
      rootState.order.item,
      'rootState',
      setMainItem,
      state.comboItemsList
    )
    if (subItemNetPrice < setMainItem.netPrice) {
      activeItemModifiers.splice(
        activeItemModifiers.indexOf(pickItemPriceSettlement),
        1
      )
      // here we are checking if combo item price is 100 and there are 3 items only.
      // we need to set all three item price and tax according to 100
      // so we will update remaining amount .1 to ast item
      let differencePrice = setMainItem.netPrice - subItemNetPrice
      let differenceTax = setMainItem.tax - subItemTax
      pickItemPriceSettlement.netPrice = Num.round(
        pickItemPriceSettlement.netPrice + differencePrice
      )
      pickItemPriceSettlement.tax = Num.round(
        pickItemPriceSettlement.tax + differenceTax
      )
      /*if (subItemTax < setMainItem.tax) {
        pickItemforPriceSettelment.tax = Num.round(
            pickItemforPriceSettelment.tax + differenceTax
        )
      } else {
        pickItemforPriceSettelment.tax = Num.round(
          pickItemforPriceSettelment.tax - differenceTax
        )
      }*/
      activeItemModifiers.push(pickItemPriceSettlement)
    }
    return activeItemModifiers
  },
  updateItemPriceTax: (state, getters, rootState, rootGetters) => item => {
    if (item.item_type !== 'combo_item') {
      let qty = item.quantity || 1
      item.orderIndex = state.orderIndex
      item.for_combo = state.forCombo
      item.tax_sum = state.comboItemsList.tax_sum
      let itemPrice =
        parseFloat(getters.setItemPrice(item)) + item.additional_combo_value ||
        0
      item.value = itemPrice * qty
    } else {
      item.value = item.value + state.additionalComboValue
    }
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
  },
  [mutation.RESET](state) {
    state.comboItemsList = false
    state.selectedItemContainer = false
    state.subItems = false
    state.errorMessage = ''
    state.activeComboItems = {}
    state.setModifiersItem = []
    state.orderIndex = 0
    state.forCombo = 0
    state.selectedContainerLength = 0
    state.modifingItem = false
  },
  [mutation.CONTAINER_SELECTED_LENGTH](state, selectedContainerLength) {
    state.selectedContainerLength = selectedContainerLength
  },
  [mutation.MODIFING_SELECTED_ITEM](state, modifingItem) {
    state.modifingItem = modifingItem
  },
  [mutation.ADDITIONAL_COMBO_VALUE](state, additionalComboValue) {
    state.additionalComboValue = additionalComboValue
  },
}

export default {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
}

import * as mutation from './discount/mutation-types'
import DiscountService from '@/services/data/DiscountService'
const DISCOUNT_ITEM_ERROR = "Discount can't be greater than item price."

// initial state
const state = {
  //hold data fetched from api
  orderDiscounts: [],
  itemDiscounts: [],
  //used only for maintaining checked states
  currentActiveItemDiscount: false,
  currentActiveOrderDiscount: false,
  //holds applied disocunts for items
  appliedItemDiscounts: [],
  //holds applied discount on order
  appliedOrderDiscount: false,
  //items discount calculated
  itemsDiscountAmount: 0,
  //order discount calculated
  orderDiscountAmount: 0,
  //Tax discount
  taxDiscountAmount: 0,
  //Discount on surcharge
  surchargeDiscountAmount: 0,
  //error msg
  orderError: false,
  itemError: false,
  errorCode: 0,
}

// getters
const getters = {
  orderDiscountWithoutTax: state =>
    //discount is already subtracted from tax in tax.js
    state.orderDiscountAmount + state.surchargeDiscountAmount,

  activeItemDiscountId: state =>
    state.currentActiveItemDiscount
      ? state.currentActiveItemDiscount._id
      : false,

  activeOrderDiscountId: state =>
    state.currentActiveOrderDiscount
      ? state.currentActiveOrderDiscount._id
      : false,

  isActiveItemDiscount: (state, getters, rootState) => discountId => {
    return (
      state.appliedItemDiscounts.findIndex(
        discount =>
          discount.discount._id == discountId &&
          discount.item.orderIndex == rootState.order.item.orderIndex
      ) > -1
    )
  },

  itemDiscounts: (state, getters, rootState) => {
    return state.itemDiscounts.data.filter(function(q) {
      if (q[rootState.order.orderType.OTApi]) {
        return q
      }
    })
  },

  orderDiscounts: (state, getters, rootState) => {
    return state.orderDiscounts.data.filter(
      discount => discount[rootState.order.orderType.OTApi]
    )
  },
}

// actions
const actions = {
  async fetchAll({ commit }) {
    const [orderDiscounts, itemDiscounts] = await Promise.all([
      DiscountService.fetchOrderDiscounts(),
      DiscountService.fetchItemDiscounts(),
    ])

    commit(mutation.SET_ORDER_DISCOUNTS, orderDiscounts)
    commit(mutation.SET_ITEM_DISCOUNTS, itemDiscounts)
  },

  validateOrderDiscounts({ commit, state, rootState }) {
    let errorMsg = false
    if (rootState.order.items.length < 1) {
      errorMsg =
        'Please add some item(s) to cart before applying order discount.'
    } else if (state.appliedItemDiscounts.length) {
      //item level discount already applied reject it
      errorMsg =
        'Please remove item level discount(s) first to apply order discount.'
    }
    commit(mutation.SET_ORDER_ERROR, errorMsg)
  },

  validateItemDiscounts({ commit, state }) {
    if (state.appliedOrderDiscount) {
      //order level discount already applied reject it
      const errorMsg =
        'Please remove order discount first to apply item discount.'
      commit(mutation.SET_ITEM_ERROR, errorMsg)
    }
  },

  applyItemDiscount({ commit, rootState, dispatch }) {
    return new Promise((resolve, reject) => {
      commit(mutation.CLEAR_ORDER_DISCOUNT)
      if (state.currentActiveItemDiscount) {
        commit(mutation.APPLY_ITEM_DISCOUNT, {
          item: rootState.order.item,
          discount: {
            _id: state.currentActiveItemDiscount._id,
            type: state.currentActiveItemDiscount.type,
            rate: state.currentActiveItemDiscount.rate,
            value: state.currentActiveItemDiscount.value,
            name: state.currentActiveItemDiscount.name,
          },
        })
      }
      //remove discounts if there was previously applied but now unset
      dispatch('order/recalculateItemPrices', {}, { root: true })
        .then(() => resolve())
        .catch(errors => {
          commit(mutation.SET_ITEM_ERROR, DISCOUNT_ITEM_ERROR)
          commit(mutation.SET_ERROR_CODE, 7)
          commit(mutation.CLEAR_ITEM_DISCOUNT, errors)
          reject(errors)
        })
    })
  },

  removeItemDiscount({ commit, rootState, dispatch }) {
    const item = rootState.order.item
    commit(mutation.REMOVE_ITEM_DISCOUNT, item)
    dispatch('order/recalculateItemPrices', {}, { root: true })
  },

  applyOrderDiscount({ commit, rootState, dispatch }) {
    return new Promise((resolve, reject) => {
      commit(mutation.CLEAR_ITEM_DISCOUNT)
      if (state.currentActiveOrderDiscount) {
        commit(mutation.APPLY_ORDER_DISCOUNT, {
          item: rootState.order.item,
          discount: state.currentActiveOrderDiscount,
        })

        dispatch('order/recalculateOrderTotals', {}, { root: true })
          .then(response => {
            dispatch('setOrderDiscount', response)
            resolve()
          })
          .catch(error => {
            commit(mutation.CLEAR_ORDER_DISCOUNT)
            commit(mutation.SET_ORDER_ERROR, error)
            commit(mutation.SET_ERROR_CODE, 2)
            reject(error)
          })
      } else {
        commit(mutation.CLEAR_ORDER_DISCOUNT)
        resolve()
      }
    })
  },

  clearOrderDiscount({ commit }) {
    commit(mutation.CLEAR_ORDER_DISCOUNT)
  },

  clearItemDiscount({ commit }, erroredDiscounts) {
    commit(mutation.CLEAR_ITEM_DISCOUNT, erroredDiscounts)
  },

  selectItemDiscount({ state, commit, dispatch }, discount) {
    if (discount._id === state.currentActiveItemDiscount._id) {
      dispatch('clearItemDiscount')
    } else {
      commit(mutation.SET_ACTIVE_ITEM_DISCOUNT, discount)
    }
  },
  selectOrderDiscount({ commit }, discount) {
    if (state.currentActiveOrderDiscount == discount) {
      commit(mutation.REMOVE_ORDER_DISCOUNT)
    } else {
      commit(mutation.SET_ACTIVE_ORDER_DISCOUNT, discount)
    }
  },
  setItemsDiscountAmount({ commit }, discount) {
    commit(mutation.SET_ITEMS_DISCOUNT_AMOUNT, discount.discountAmount)
  },

  setOrderDiscount(
    { commit },
    { orderDiscount, taxDiscount, surchargeDiscount }
  ) {
    commit(mutation.SET_ORDER_DISCOUNT_AMOUNT, orderDiscount)
    commit(mutation.SET_TAX_DISCOUNT_AMOUNT, taxDiscount)
    commit(mutation.SET_SURCHARGE_DISCOUNT_AMOUNT, surchargeDiscount)
  },
  reset({ commit }) {
    commit(mutation.RESET)
  },
}

// mutations
const mutations = {
  [mutation.SET_ORDER_DISCOUNTS](state, orderDiscounts) {
    state.orderDiscounts = orderDiscounts.data
  },
  [mutation.SET_ITEM_DISCOUNTS](state, itemDiscounts) {
    state.itemDiscounts = itemDiscounts.data
  },
  [mutation.SET_ACTIVE_ITEM_DISCOUNT](state, discount) {
    state.currentActiveItemDiscount = discount
  },
  [mutation.SET_ACTIVE_ORDER_DISCOUNT](state, discount) {
    state.currentActiveOrderDiscount = discount
  },
  [mutation.SET_ITEMS_DISCOUNT_AMOUNT](state, discount) {
    state.itemsDiscountAmount = discount
  },
  [mutation.SET_ORDER_ERROR](state, errorMsg) {
    state.orderError = errorMsg
  },
  [mutation.SET_ITEM_ERROR](state, errorMsg) {
    state.itemError = errorMsg
  },
  [mutation.SET_ERROR_CODE](state, code) {
    state.errorCode = code
  },
  [mutation.REMOVE_ORDER_DISCOUNT](state) {
    state.currentActiveOrderDiscount = false
  },
  [mutation.APPLY_ITEM_DISCOUNT](state, { item, discount }) {
    let discounts = state.appliedItemDiscounts.filter(
      discount => discount.item.orderIndex != item.orderIndex
    )
    discounts.push({
      item: {
        orderIndex: item.orderIndex,
        _id: item._id,
      },
      discount: discount,
    })

    state.appliedItemDiscounts = discounts
  },
  [mutation.APPLY_ORDER_DISCOUNT](state, { item, discount }) {
    state.appliedOrderDiscount = {
      item: {
        orderIndex: item.orderIndex,
        _id: item._id,
      },
      discount: discount,
    }
  },

  [mutation.SET_ORDER_DISCOUNT_AMOUNT](state, discount) {
    state.orderDiscountAmount = discount
  },
  [mutation.SET_TAX_DISCOUNT_AMOUNT](state, discount) {
    state.taxDiscountAmount = discount
  },
  [mutation.SET_SURCHARGE_DISCOUNT_AMOUNT](state, discount) {
    state.surchargeDiscountAmount = discount
  },
  [mutation.CLEAR_ITEM_DISCOUNT](state, erroredDiscounts) {
    if (erroredDiscounts && erroredDiscounts.length) {
      const filteredDiscounts = state.appliedItemDiscounts.filter(discount => {
        return !erroredDiscounts.includes(discount.item._id)
      })
      state.appliedItemDiscounts = filteredDiscounts
    } else {
      state.appliedItemDiscounts = []
      state.itemsDiscountAmount = 0
    }
    state.currentActiveItemDiscount = false
  },
  [mutation.REMOVE_ITEM_DISCOUNT](state, item) {
    let discounts = state.appliedItemDiscounts.filter(
      discount => discount.item.orderIndex != item.orderIndex
    )
    state.appliedItemDiscounts = discounts
    state.currentActiveItemDiscount = false
  },
  [mutation.CLEAR_ORDER_DISCOUNT](state) {
    state.orderDiscountAmount = 0
    state.surchargeDiscountAmount = 0
    state.taxDiscountAmount = 0
    state.appliedOrderDiscount = false
    state.currentActiveOrderDiscount = false
  },
  [mutation.RESET](state) {
    state.currentActiveItemDiscount = false
    state.currentActiveOrderDiscount = false
    state.appliedItemDiscounts = []
    state.appliedOrderDiscount = false
    state.itemsDiscountAmount = 0
    state.orderDiscountAmount = 0
    state.taxDiscountAmount = 0
    state.surchargeDiscountAmount = 0
    state.error = false
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

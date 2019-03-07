import * as mutation from './discount/mutation-types'
import DiscountService from '@/services/data/DiscountService'

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
  TaxDiscountAmount: 0,
  //Discount on surcharge
  surchargeDiscountAmount: 0,
  //error msg
  error: false,
}

// getters
const getters = {
  orderDiscountWithoutTax: state =>
    //discount is already subtracted from tax in tax.js
    state.orderDiscountAmount + state.surchargeDiscountAmount,

  activeItemDiscountId: state =>
    state.currentActiveItemDiscount
      ? state.currentActiveItemDiscount.item_discount_id
      : false,

  activeOrderDiscountId: state =>
    state.currentActiveOrderDiscount
      ? state.currentActiveOrderDiscount.discount_id
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
    let activeDiscounts = []

    if (state.itemDiscounts.data) {
      state.itemDiscounts.data.forEach(discount => {
        const orderTypes = discount.enable_for.split(',')
        if (
          orderTypes.findIndex(
            orderType => orderType == rootState.order.orderType
          ) > -1
        ) {
          const discountValidDate = new Date(discount.date_until)
          const discountStartDate = new Date(discount.date_from)
          if (
            discountStartDate.getTime() <= rootState.sync.today.getTime() &&
            discountValidDate.getTime() >= rootState.sync.today.getTime()
          ) {
            const scheduledDays = discount.discount_schedule.split(',')
            if (
              scheduledDays.findIndex(
                day =>
                  day == rootState.sync.weekDays[discountValidDate.getDay()]
              ) > -1
            ) {
              activeDiscounts.push(discount)
            }
          }
        }
      })
    }
    return activeDiscounts
  },

  orderDiscounts: (state, getters, rootState) => {
    const activeDiscounts = []

    if (state.orderDiscounts.data) {
      state.orderDiscounts.data.forEach(discount => {
        const orderTypes = discount.enable_for.split(',')
        if (
          orderTypes.findIndex(
            orderType => orderType == rootState.order.orderType
          ) > -1
        ) {
          const discountValidDate = new Date(discount.date_until)
          const discountStartDate = new Date(discount.date_from)

          if (
            discountStartDate.getTime() <= rootState.sync.today.getTime() &&
            discountValidDate.getTime() >= rootState.sync.today.getTime()
          ) {
            const scheduledDays = discount.discount_schedule.split(',')
            if (
              scheduledDays.findIndex(
                day =>
                  day == rootState.sync.weekDays[discountValidDate.getDay()]
              ) > -1
            ) {
              activeDiscounts.push(discount)
            }
          }
        }
      })
    }
    return activeDiscounts
  },
}

// actions
const actions = {
  async fetchAll({ commit, rootState }) {
    const params = [
      rootState.location.location,
      rootState.sync.date,
      rootState.sync.compress,
    ]
    const [orderDiscounts, itemDiscounts] = await Promise.all([
      DiscountService.fetchOrderDiscounts(...params),
      DiscountService.fetchItemDiscounts(...params),
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
    commit(mutation.SET_ERROR, errorMsg)
  },

  validateItemDiscounts({ commit, state }) {
    if (state.appliedOrderDiscount) {
      //order level discount already applied reject it
      const errorMsg =
        'Please remove order discount first to apply item discount.'
      commit(mutation.SET_ERROR, errorMsg)
    }
  },

  applyItemDiscount({ commit, rootState, dispatch }) {
    commit(mutation.CLEAR_ORDER_DISCOUNT)
    commit(mutation.APPLY_ITEM_DISCOUNT, {
      item: rootState.order.item,
      discount: {
        _id: state.currentActiveItemDiscount.item_discount_id,
        type: state.currentActiveItemDiscount.type,
        rate: state.currentActiveItemDiscount.rate,
        name: state.currentActiveItemDiscount.name,
      },
    })

    dispatch('order/recalculateItemPrices', {}, { root: true })
  },

  removeItemDiscount({ commit, rootState, dispatch }) {
    const item = rootState.order.item
    commit(mutation.REMOVE_ITEM_DISCOUNT, item)
    dispatch('order/recalculateItemPrices', {}, { root: true })
  },

  applyOrderDiscount({ commit, rootState, dispatch }) {
    commit(mutation.CLEAR_ITEM_DISCOUNT)
    if (state.currentActiveOrderDiscount) {
      commit(mutation.APPLY_ORDER_DISCOUNT, {
        item: rootState.order.item,
        discount: state.currentActiveOrderDiscount,
      })
    }
    dispatch('order/recalculateOrderTotals', {}, { root: true })
  },

  selectItemDiscount({ commit }, discount) {
    commit(mutation.SET_ACTIVE_ITEM_DISCOUNT, discount)
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
  [mutation.SET_ERROR](state, errorMsg) {
    state.error = errorMsg
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
    state.TaxDiscountAmount = discount
  },
  [mutation.SET_SURCHARGE_DISCOUNT_AMOUNT](state, discount) {
    state.surchargeDiscountAmount = discount
  },
  [mutation.CLEAR_ITEM_DISCOUNT](state) {
    state.appliedItemDiscounts = []
    state.itemsDiscountAmount = 0
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
    state.TaxDiscountAmount = 0
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
    state.TaxDiscountAmount = 0
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

import * as mutation from './discount/mutation-types'
import DiscountService from '@/services/data/DiscountService'

// initial state
const state = {
  orderDiscounts: [],
  itemDiscounts: [],
  appliedItemDiscounts: [],
  currentActiveDiscount: false,
  itemsDiscountAmount: 0,
  orderDiscountAmount: 0,
}

// getters
const getters = {
  discount: () => state.itemsDiscountAmount + state.orderDiscountAmount,
  activeDiscountId: () => state.currentActiveDiscount.item_discount_id,
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
    if (state.itemDiscounts.data) {
      return state.itemDiscounts.data.map(discount => {
        const orderTypes = discount.enable_for.split(',')
        if (
          orderTypes.findIndex(
            orderType => orderType == rootState.order.orderType
          ) > -1
        ) {
          const discountValidDate = new Date(discount.date_until)
          if (discountValidDate.getTime() >= rootState.sync.today.getTime()) {
            const scheduledDays = discount.discount_schedule.split(',')
            if (
              scheduledDays.findIndex(
                day =>
                  day == rootState.sync.weekDays[discountValidDate.getDay()]
              ) > -1
            ) {
              return discount
            }
          }
        }
      })
    } else {
      return []
    }
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

  applyItemDiscount({ commit, rootState, dispatch }) {
    commit(mutation.APPLY_ITEM_DISCOUNT, {
      item: rootState.order.item,
      discount: {
        _id: state.currentActiveDiscount.item_discount_id,
        type: state.currentActiveDiscount.type,
        rate: state.currentActiveDiscount.rate,
      },
    })

    dispatch('order/recalculatePrices', {}, { root: true })
  },

  selectDiscount({ commit }, discount) {
    commit(mutation.SET_ACTIVE_DISCOUNT, discount)
  },
  setItemsDiscountAmount({ commit }, discount) {
    commit(mutation.SET_ITEMS_DISCOUNT_AMOUNT, discount.discountAmount)
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
  [mutation.SET_ACTIVE_DISCOUNT](state, discount) {
    state.currentActiveDiscount = discount
  },
  [mutation.SET_ITEMS_DISCOUNT_AMOUNT](state, discount) {
    state.itemsDiscountAmount = discount
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
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

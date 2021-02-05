import * as mutation from './discount/mutation-types'
import DiscountService from '@/services/data/DiscountService'
import Availability from '@/plugins/helpers/Availability.js'
import MultistoreHelper from '@/plugins/helpers/Multistore.js'
import * as CONST from '@/constants'
//const DISCOUNT_ITEM_ERROR = "Item discount can't be applied."

// initial state
const state = {
  //hold data fetched from api
  multistoreOrderDiscounts: {},
  multistoreItemDiscounts: {},
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
  taxDiscountAmount: state => {
    return state.taxDiscountAmount
  },
  orderDiscountWithoutTax: state => {
    //discount is already subtracted from tax in tax.js
    return state.orderDiscountAmount + state.surchargeDiscountAmount
  },

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

  itemDiscounts: (state, getters, rootState, rootGetters) => {
    let itemDiscounts = state.itemDiscounts
    if (rootGetters['auth/multistore']) {
      const storeId = rootState.order.item
        ? rootState.order.item.store_id
        : rootState.context.storeId
      itemDiscounts = state.multistoreItemDiscounts[storeId]
    }
    if (!itemDiscounts) {
      return []
    }

    return itemDiscounts.filter(discount => {
      if (discount[rootState.order.orderType.OTApi]) {
        if (discount.for_items.includes(rootState.order.item._id)) {
          return Availability.available(
            discount,
            rootState.location.timezoneString
          )
        }
      }
    })
  },

  //problem:
  //there are 3 multi stores, user just loaded one, in that case we are missing data of other two stores
  //how we ll find common in that case?
  //solutions:
  //1- load all the data in loop (call same api with different stores multiple time)
  //2- backend provides us an api to load all into one api
  //Note: api ll get only available discounts for each store, so we don't need to filter them base on
  //      availability explicitly
  orderDiscounts: (state, getters, rootState, rootGetters) => {
    let orderDiscounts = state.orderDiscounts

    if (rootGetters['auth/multistore']) {
      //get common discounts across multistores
      orderDiscounts = MultistoreHelper.filter(
        state.multistoreOrderDiscounts,
        '_id'
      )
    }

    if (!orderDiscounts) {
      return []
    }

    return orderDiscounts.filter(discount => {
      if (discount[rootState.order.orderType.OTApi]) {
        return Availability.available(
          discount,
          rootState.location.timezoneString
        )
      }
    })
  },
  orderDiscount: (state, getters) => discountId => {
    return getters.orderDiscounts.find(discount => discount._id == discountId)
  },

  getOrderDiscountItemAmount: (
    state,
    getters,
    rootState,
    rootGetters
  ) => item => {
    let items = rootGetters['order/items']
    let net_discount_on_order =
      parseFloat(getters.taxDiscountAmount) +
      parseFloat(getters.orderDiscountWithoutTax)
    let sub_total = rootGetters['order/subTotalWithTaxes']
    let order_discounts = (net_discount_on_order * 100) / sub_total
    let item_amount = 0
    if (items.length > 0) {
      item_amount =
        (item.value * item.quantity * parseFloat(100 - order_discounts)) / 100
      return item_amount
    } else {
      return item_amount
    }
    /*if (items.length > 0) {
      let discount_for_single_item = parseFloat(discount_amount) / items.length
      return (
        item.value * item.quantity - discount_for_single_item * item.quantity
      )
    } else {
      return 0
    }*/
    /*order discount: 100*/
    /* total item/ 100*/
  },
  itemDiscount: (state, getters) => discountId => {
    return getters.itemDiscounts.find(discount => discount._id == discountId)
  },
}

// actions
const actions = {
  async fetchAll({ commit, rootState, rootGetters }, storeId = null) {
    const [orderDiscounts, itemDiscounts] = await Promise.all([
      DiscountService.fetchOrderDiscounts(storeId),
      DiscountService.fetchItemDiscounts(storeId),
    ])

    commit(mutation.SET_DISCOUNTS, {
      orderDiscounts: orderDiscounts.data.data,
      itemDiscounts: itemDiscounts.data.data,
      multistore: storeId
        ? storeId
        : rootGetters['auth/multistore']
        ? rootState.context.storeId
        : false,
    })
  },
  fetchMultistore({ rootState, dispatch }, stores) {
    //don't repeat in case storeId is provided otherwise it ll just loop in
    //load discounts for all stores both item and order
    stores.forEach(storeId => {
      //skip current store
      if (storeId !== rootState.context.storeId) {
        dispatch('fetchAll', storeId)
      }
    })
  },

  reindexItemDiscounts({ commit }, items) {
    const newAppliedItemDiscounts = state.appliedItemDiscounts.map(
      itemDiscount => {
        items.forEach(orderItem => {
          if (orderItem.oldIndex === itemDiscount.item.orderIndex) {
            itemDiscount.item.orderIndex = orderItem.orderIndex
          }
        })
        return itemDiscount
      }
    )
    commit(mutation.REPLACE_ITEM_DISCOUNTS, newAppliedItemDiscounts)
  },
  applyItemDiscount({ commit, state, rootState, rootGetters, dispatch }) {
    commit('checkoutForm/RESET', 'process', { root: true })
    return new Promise((resolve, reject) => {
      //add extra layer of validation which is handled on component level though
      if (state.appliedOrderDiscount) {
        commit(mutation.SET_ITEM_ERROR, CONST.DISCOUNT_ITEM_ERROR_ORDER)
        reject(CONST.DISCOUNT_ITEM_ERROR_ORDER)
      } else {
        commit(mutation.CLEAR_ORDER_DISCOUNT)
        if (state.currentActiveItemDiscount) {
          let itemDiscountData = {
            item: rootState.order.item,
            discount: {
              _id: state.currentActiveItemDiscount._id,
              type: state.currentActiveItemDiscount.type,
              rate: state.currentActiveItemDiscount.rate,
              value: state.currentActiveItemDiscount.value,
              name: state.currentActiveItemDiscount.name,
            },
          }

          if (rootGetters['auth/multistore']) {
            itemDiscountData.discount.store_id = rootState.context.storeId
          }
          commit(mutation.APPLY_ITEM_DISCOUNT, itemDiscountData)
        } else {
          dispatch('removeItemDiscount')
        }
        //remove discounts if there was previously applied but now unset
        dispatch('order/recalculateItemPrices', {}, { root: true })
          .then(() => {
            resolve()
          })
          .catch(errors => {
            for (let itemId in errors) {
              const item = errors[itemId]
              if (item.undiscountedNetPrice <= 0) {
                commit(mutation.SET_ITEM_ERROR, CONST.DISCOUNT_ITEM_ERROR_FREE)
              } else {
                if (typeof item.msg !== 'undefined') {
                  commit(mutation.SET_ITEM_ERROR, item.msg)
                } else {
                  commit(
                    mutation.SET_ITEM_ERROR,
                    CONST.DISCOUNT_ITEM_ERROR_GREATER
                  )
                }
              }
            }
            commit(mutation.SET_ERROR_CODE, 7)
            commit(mutation.CLEAR_ITEM_DISCOUNT, errors)
            reject(errors)
          })
      }
    })
  },

  removeItemDiscount({ commit, rootState, dispatch }) {
    const item = rootState.order.item
    commit(mutation.REMOVE_ITEM_DISCOUNT, item)
    dispatch('order/recalculateItemPrices', {}, { root: true })
  },

  applyOrderDiscount({ commit, state, rootState, dispatch }) {
    commit('checkoutForm/RESET', 'process', { root: true })
    commit(mutation.SET_ORDER_ERROR, false)

    return new Promise((resolve, reject) => {
      //add extra layer of validation which is handled on component level though
      if (rootState.order.items.length < 1) {
        reject(CONST.DISCOUNT_ORDER_ERROR_ITEM)
        commit(mutation.SET_ORDER_ERROR, CONST.DISCOUNT_ORDER_ERROR_ITEM)
      } else if (state.appliedItemDiscounts.length) {
        //item level discount already applied reject it
        reject(CONST.DISCOUNT_ORDER_ERROR_ITEM_DISCOUNT)
        commit(
          mutation.SET_ORDER_ERROR,
          CONST.DISCOUNT_ORDER_ERROR_ITEM_DISCOUNT
        )
      } else {
        commit(mutation.CLEAR_ITEM_DISCOUNT)
        if (state.currentActiveOrderDiscount) {
          commit(
            mutation.APPLY_ORDER_DISCOUNT,
            state.currentActiveOrderDiscount
          )

          dispatch('order/recalculateOrderTotals', {}, { root: true })
            .then(response => {
              resolve(response)
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
      }
    })
  },

  clearOrderDiscount({ commit }) {
    commit(mutation.CLEAR_ORDER_DISCOUNT)
  },

  clearItemDiscount({ commit }, erroredDiscounts) {
    commit(mutation.CLEAR_ITEM_DISCOUNT, erroredDiscounts)
  },

  selectItemDiscount({ state, commit }, discount) {
    if (discount._id === state.currentActiveItemDiscount._id) {
      commit(mutation.SET_ACTIVE_ITEM_DISCOUNT, false)
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
  // setItemsDiscountAmount({ commit }, discount) {
  //   commit(mutation.SET_ITEMS_DISCOUNT_AMOUNT, discount.discountAmount)
  // },

  setOrderDiscount(
    { commit },
    { orderDiscount, taxDiscount, surchargeDiscount }
  ) {
    commit(mutation.SET_ORDER_DISCOUNT_AMOUNT, orderDiscount)
    commit(mutation.SET_TAX_DISCOUNT_AMOUNT, taxDiscount)
    commit(mutation.SET_SURCHARGE_DISCOUNT_AMOUNT, surchargeDiscount)
  },

  setItem({ state, commit }, { item }) {
    const discount = state.appliedItemDiscounts.find(
      discount => discount.item.orderIndex == item.orderIndex
    )
    if (discount) {
      commit(mutation.SET_ACTIVE_ITEM_DISCOUNT, discount.discount)
    }
  },

  reset({ commit }) {
    commit(mutation.RESET)
  },
}

// mutations
const mutations = {
  [mutation.SET_DISCOUNTS](
    state,
    { orderDiscounts, itemDiscounts, multistore }
  ) {
    if (multistore) {
      state.multistoreOrderDiscounts = {
        ...state.multistoreOrderDiscounts,
        [multistore]: orderDiscounts,
      }
      state.multistoreItemDiscounts = {
        ...state.multistoreItemDiscounts,
        [multistore]: itemDiscounts,
      }
    } else {
      state.orderDiscounts = orderDiscounts
      state.itemDiscounts = itemDiscounts
    }
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
  [mutation.REPLACE_ITEM_DISCOUNTS](state, discounts) {
    state.appliedItemDiscounts = discounts
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
  [mutation.APPLY_ORDER_DISCOUNT](state, discount) {
    state.appliedOrderDiscount = discount
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
    if (erroredDiscounts) {
      const filteredDiscounts = state.appliedItemDiscounts.filter(discount => {
        let keep = true
        for (let orderIndex in erroredDiscounts) {
          if (parseInt(orderIndex) === discount.item.orderIndex) {
            keep = false
          }
        }
        return keep
      })
      state.appliedItemDiscounts = filteredDiscounts
    } else {
      state.appliedItemDiscounts = []
      state.itemsDiscountAmount = 0
    }
    state.currentActiveItemDiscount = false
  },
  [mutation.REMOVE_ITEM_DISCOUNT](state, item) {
    let discounts = state.appliedItemDiscounts.filter(discount => {
      return discount.item.orderIndex != item.orderIndex
    })
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
    state.multistoreItemDiscounts = {}
    state.multistoreOrderDiscounts = {}
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

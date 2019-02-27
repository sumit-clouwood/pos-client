import * as mutation from './discount/mutation-types';
import DiscountService from '@/services/data/DiscountService';

// initial state
const state = {
  orderDiscounts: [],
  itemDiscounts: []
};

// getters
const getters = {
  discount: () => 0
};

// actions
const actions = {
  async fetchAll({ commit, rootState }) {
    const params = [
      rootState.location.location,
      rootState.sync.date,
      rootState.sync.compress
    ];
    const [orderDiscounts, itemDiscounts] = await Promise.all([
      DiscountService.fetchOrderDiscounts(...params),
      DiscountService.fetchItemDiscounts(...params)
    ]);

    commit(mutation.SET_ORDER_DISCOUNTS, orderDiscounts);
    commit(mutation.SET_ITEM_DISCOUNTS, itemDiscounts);
  }
};

// mutations
const mutations = {
  [mutation.SET_ORDER_DISCOUNTS](state, orderDiscounts) {
    state.orderDiscounts = orderDiscounts.data;
  },
  [mutation.SET_ITEM_DISCOUNTS](state, itemDiscounts) {
    state.itemDiscounts = itemDiscounts.data;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};

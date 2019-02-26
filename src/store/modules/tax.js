import * as mutation from "./tax/mutation-types";
// initial state
const state = {
  itemsTax: 0,
  surchargeTax: 0
};

// getters
const getters = {
  totalTax: state => state.itemsTax + state.surchargeTax,

  calculateItemTax: () => item => {
    let taxAmount = 0;
    item.item_tax.forEach(tax => {
      taxAmount += (item.price * item.quantity * tax.get_item_tax.rate) / 100;
      //tax.get_item_tax.name
    });
    return taxAmount;
  }
};

// actions
const actions = {
  calculate({ commit, getters, rootState }) {
    let taxAmount = 0;
    rootState.order.items.forEach(item => {
      if (item.item_tax) {
        taxAmount += getters.calculateItemTax(item);
      }
    });

    commit(mutation.SET_TAX, taxAmount);
  }
};

// mutations
const mutations = {
  [mutation.SET_TAX](state, tax) {
    state.itemsTax = tax;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};

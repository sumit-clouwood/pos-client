import * as mutation from './tax/mutation-types';
// initial state
const state = {
  itemsTax: 0,
  surchargeTax: 0
};

// getters
const getters = {
  totalTax: state => state.itemsTax + state.surchargeTax
};

// actions
const actions = {
  calculate({ commit, rootState }) {
    const itemsTax = rootState.order.items.reduce((totalTax, item) => {
      if (item.item_tax) {
        return (
          totalTax +
          item.item_tax.reduce((total, tax) => {
            return (
              total + (item.price * item.quantity * tax.get_item_tax.rate) / 100
            );
          }, 0)
        );
      } else {
        return totalTax + 0;
      }
    }, 0);

    commit(mutation.SET_ITEMS_TAX, itemsTax);

    const surchargeTax = rootState.surcharge.surcharges.reduce(
      (totalTax, surcharge) => {
        if (surcharge.surcharge_is_taxable) {
          return (
            totalTax +
            surcharge.surcharge_taxable_rate_info.reduce((taxAmount, tax) => {
              return taxAmount + (surcharge.rate * tax.rate) / 100;
            }, 0)
          );
        } else {
          return totalTax;
        }
      },
      0
    );

    commit(mutation.SET_SURCHARGE_TAX, surchargeTax);
  }
};

// mutations
const mutations = {
  [mutation.SET_ITEMS_TAX](state, tax) {
    state.itemsTax = tax;
  },
  [mutation.SET_SURCHARGE_TAX](state, tax) {
    state.surchargeTax = tax;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};

import * as mutation from "./tax/mutation-types";
import TaxService from "@/services/data/TaxService";
// init state
const state = {
  taxData: 0,
  taxAmount: 0
};

const getters = {};

const actions = {
  async fetchAll({ commit, rootState }) {
    const params = [
      rootState.location.location,
      "2019-02-20",
      rootState.sync.compress
    ];
    TaxService.fetchAll(...params).then(response => {
      commit(mutation.TAX_AMOUNT, response);
      commit(mutation.TAX_DETAILS, response);
    });
  }
};

const mutations = {
  [mutation.TAX_AMOUNT](state, itemTaxAmount) {
    state.taxAmount = itemTaxAmount;
  },
  [mutation.TAX_DETAILS](state, taxData) {
    state.taxData = taxData;
  }
};

export default {
  namespace: true,
  state,
  getters,
  mutations,
  actions
};

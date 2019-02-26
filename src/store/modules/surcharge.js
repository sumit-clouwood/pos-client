import SurchargeService from "@/services/data/SurchargeService";
import * as mutation from "./surcharge/mutation-types";

const state = {
  surcharges: [],
  surcharge: {}
};

const getters = {
  calculateTax: () => surcharges => {
    let surchargeTaxAmount = 0;
    if (surcharges.length) {
      surcharges.forEach(tax => {
        if (tax.tax != "undefined") {
          surchargeTaxAmount += (tax.rate * tax.tax) / 100;
        }
      });
    }
    return surchargeTaxAmount;
  },
  calculateSurchargeAmount: () => (surcharges, subTotal) => {
    let surchargeAmount = 0;
    if (surcharges.length) {
      surcharges.forEach(surcharge => {
        if (surcharge.type === "value") {
          surchargeAmount += surcharge.rate;
        } else {
          surchargeAmount +=
            (parseFloat(subTotal) * parseFloat(surcharge.rate)) / 100;
        }
      });
    }
    return surchargeAmount;
  }
};

const actions = {
  fetchAll({ commit, rootState }) {
    let surchargeDetails = [];
    const params = [
      rootState.location.location,
      // rootState.sync.date,
      "",
      rootState.sync.compress
    ];
    SurchargeService.fetchAll(...params).then(response => {
      // commit(mutation.SET_SURCHARGES, response.data.data);

      if (response.data.data.length) {
        response.data.data.forEach(surcharge =>
          surchargeDetails.push({
            type: surcharge.type,
            value: surcharge.rate,
            tax:
              surcharge.surcharge_is_taxable === 1
                ? surcharge.surcharge_taxable_rate_info[0].rate
                : 0
          })
        );
      }
      commit(mutation.SET_SURCHARGES, surchargeDetails);
    });
  },

  calculateSurchargeTax({ commit, getters }) {
    let taxAmount = 0;
    taxAmount = parseFloat(getters.calculateTax(state.surcharges));
    commit(mutation.SET_SURCHARGE_TAX, taxAmount);
    return taxAmount;
  },

  calculateSurcharge({ commit, getters, rootState }) {
    let surchargeAmount = 0;
    surchargeAmount =
      rootState.subTotal > 0
        ? parseFloat(
            getters.calculateSurchargeAmount(
              state.surcharges,
              rootState.subTotal
            )
          )
        : 0;
    commit(mutation.SET_SURCHARGE_VALUE, surchargeAmount);
    return surchargeAmount;
  }
};

const mutations = {
  [mutation.SET_SURCHARGE_VALUE](state, surchargeValue) {
    state.surcharge.surcharge_value = surchargeValue;
  },

  [mutation.SET_SURCHARGE_TAX](state, surchargeTax) {
    state.surcharge.surcharge_tax = surchargeTax;
  },

  [mutation.SET_SURCHARGES](state, surcharges) {
    state.surcharges = surcharges;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};

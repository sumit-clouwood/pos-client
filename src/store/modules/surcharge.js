import SurchargeService from "@/services/data/SurchargeService";
import * as mutation from "./surcharge/mutation-types";

const state = {
  surcharges: [],
  surcharge: {}
};

const getters = {};

const actions = {
  fetchAll({ commit, rootState }) {
    // let surchargeValue = 0;
    // let surchargeTax = 0;
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
        response.data.data.forEach(
          surcharge =>
            surchargeDetails.push({
              type: surcharge.type,
              value: surcharge.rate,
              tax:
                surcharge.surcharge_is_taxable === 1
                  ? surcharge.surcharge_taxable_rate_info[0].rate
                  : 0
            })
          // surcharge.type === "value"
          //   ? (surchargeValue += parseFloat(surcharge.rate))
          //   : (surchargeValue = 0),
          // state.surcharges.push()
        );
        // surchargeValue = response.data.data.reduce(
        //   (surcharge, surchargeValue) =>
        //     surcharge.type === "value"
        //       ? (surchargeValue += parseFloat(surcharge.rate))
        //       : (surchargeValue += 1)
        // );
      }
      commit(mutation.SET_SURCHARGES, surchargeDetails);
      // commit(mutation.SET_SURCHARGE_VALUE, surchargeValue);

      // if (surchargeValue > 0) {
      //   surchargeTax = response.data.data.reduce(
      //     (surchargeTax, surcharge) =>
      //       surchargeTax +
      //       parseFloat(surcharge.surcharge_taxable_rate_info[0].rate),
      //     0
      //   );
      // }
      // commit(mutation.SET_SURCHARGE_TAX, surchargeTax);
    });
  }
};

const mutations = {
  // [mutation.SET_SURCHARGE_VALUE](state, surchargeValue) {
  //   state.surcharge.surcharge_value = surchargeValue;
  // },
  //
  // [mutation.SET_SURCHARGE_TAX](state, surchargeTax) {
  //   state.surcharge.surcharge_tax = surchargeTax;
  // },

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

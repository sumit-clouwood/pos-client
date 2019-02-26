import * as mutation from "./customer/mutation-types";
import customerList from "@/services/data/CustomerService";

const state = {
  customerList: [],
  customers: {}
};
const getters = {};
const actions = {
  fetchAll({ commit, rootState }) {
    const params = [
      rootState.location.location,
      "" /*search*/,
      11 /*page*/,
      "" /*all*/,
      "" /*validate*/,
      rootState.sync.date,
      rootState.sync.compress,
      10 /*per page entry*/
    ];
    customerList.fetchAll(...params).then(response => {
      if (response.data.data.length) {
        commit(mutation.CUSTOMER_LIST, response.data.data);
      }
    });
  }
};
const mutations = {};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};

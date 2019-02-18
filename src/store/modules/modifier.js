import ModifierService from "@/services/data/ModifierService";
import * as mutation from "./modifier/mutation-types";

// initial state
const state = {
  all: []
};

// getters, computed properties
const getters = {};

// actions, often async
const actions = {
  async fetchAll({ commit, rootState }) {
    const params = [rootState.location.location, rootState.sync.compress];
    ModifierService.fetchAll(...params).then(response => {
      commit(mutation.SET_MODIFIERS, response.data);
    });
  }
};

// mutations
//state should be only changed through mutation and these are synchronous
const mutations = {
  [mutation.SET_MODIFIERS](state, modifiers) {
    state.all = modifiers;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};

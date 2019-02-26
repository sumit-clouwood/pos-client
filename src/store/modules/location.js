import * as mutation from "./location/mutation-types";

// initial state
const state = {
  location: false,
  locationIds: [],
  locationName: "",
  currency: "AED"
};

// getters
const getters = {
  rawPrice: () => price => (price > 0 ? price : 0),
  formatPrice: state => price =>
    state.currency +
    " " +
    (Math.round((parseFloat(price) + 0.00001) * 100) / 100).toFixed(2)
};

// actions
const actions = {
  setLocation({ commit }, userData) {
    commit(mutation.SET_LOCATION, userData.location_id);
    commit(mutation.SET_FRANCHISE_CODE, userData.franchies_code);
  },
  setLocations({ commit }, userData) {
    commit(mutation.SET_LOCATIONS, userData.locations);
    commit(mutation.SET_FRANCHISE_CODE, userData.franchies_code);
  }
};

// mutations
const mutations = {
  [mutation.SET_LOCATION](state, location) {
    state.location = location;
  },
  /*[mutation.SET_LOCATIONS](state, location_id) {
        state.locationIds = location_id
    },*/
  [mutation.SET_FRANCHISE_CODE](state, franchise_code) {
    state.locationName = franchise_code;
  },

  [mutation.SET_CURRENCY](state, currency) {
    state.currency = currency;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};

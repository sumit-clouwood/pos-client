// initial state
const state = {
  //date: '2019-02-06',
  date: "",
  compress: false
};

// getters
const getters = {};

// actions
const actions = {};

// mutations
const mutations = {
  updateSyncDate(state, date) {
    state.date = date;
  },

  updateCompress(state, isCompress) {
    state.compress = isCompress;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};

import DataService from '@/services/DataService'
import * as mutation from "./user/mutation-types";

// initial state
const state = {
  token: null,
  userDetails: null
};

// getters
const getters = {};

// actions
const actions = {
  auth ({ commit }) {
    return new Promise((resolve, reject) => {
      DataService.auth(process.env).then(response => {
        commit('setToken', response.data.token);
        commit(mutation.SET_USER_DETAILS, response.data.data);
        DataService.applyMiddleWare(state.token);
        response.data.token ? resolve(response) : reject()
      })
    })    
  }
};

// mutations
const mutations = {
  setToken (state, token) {
    state.token = token
  },

  refreshToken (state, { token }) {
    state.token = token
  },

  [mutation.SET_USER_DETAILS] (state, details) {
    state.userDetails= details
  }

};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
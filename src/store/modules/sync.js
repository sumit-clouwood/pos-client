// initial state
const state = {
  //date: '2019-02-06',
  compress: false,
  loaded: false,
  online: true,
  idb: null,
  idbVersion: 1,
}

// getters
const getters = {}

// actions
const actions = {}

// mutations
const mutations = {
  updateSyncDate(state, date) {
    state.date = date
  },

  updateCompress(state, isCompress) {
    state.compress = isCompress
  },

  status(state, status) {
    state.online = status
  },

  loaded(state, loaded) {
    state.loaded = loaded
  },

  setIdbVersion(state, version) {
    state.idbVersion = version
  },
  setIdb(state, handle) {
    state.idb = handle
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

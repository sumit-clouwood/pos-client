// initial state
import * as CONST from '@/constants'
import { dispatch } from 'd3'
const state = {
  //date: '2019-02-06',
  compress: false,
  loaded: false,
  online: true,
  idb: null,
  idbVersion: 1,
  reloaded: false,
  appUpdateNotification: false,
  cacheFirst: false,
  backgroundSync: false,
  offlineSync: false,

  modules: {
    store: CONST.LOADING_STATUS_LOADING,
    catalog: CONST.LOADING_STATUS_LOADING,
    modifiers: CONST.LOADING_STATUS_LOADING,
    // surcharges: CONST.LOADING_STATUS_LOADING,
    // discounts: CONST.LOADING_STATUS_LOADING,
    // payment_types: CONST.LOADING_STATUS_LOADING,
    // announcements: CONST.LOADING_STATUS_LOADING,
    // customers: CONST.LOADING_STATUS_LOADING,
  },
}

// getters
const getters = {}

// actions
const actions = {
  offlineSync({ commit, dispatch }, status) {
    commit('updateOfflineSync', status)
    if (status === 'done') {
      dispatch('dinein/fetchAll', { silent: true }, { root: true })
    }
  },
}

// mutations
const mutations = {
  updateLoading(state, { key, status }) {
    state.modules[key] = status
  },
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
  reload(state, val) {
    state.reloaded = val
  },
  setAppUpdateNotification(state, val) {
    state.appUpdateNotification = val
  },
  reset(state) {
    state.modules.store = CONST.LOADING_STATUS_LOADING
    state.modules.catalog = CONST.LOADING_STATUS_LOADING
    state.modules.modifiers = CONST.LOADING_STATUS_LOADING
  },
  updateOfflineSync(state, status) {
    state.offlineSync = status
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

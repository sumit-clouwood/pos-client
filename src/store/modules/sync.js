// initial state
import * as CONST from '@/constants'
//import workflow from '../../plugins/helpers/workflow'
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
  lastFetch: 0,
  offlineSync: false,
  isLoading: false,
  loading_store: false,
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
const getters = {
  lastFetch: state => fmt => {
    const seconds = (new Date().getTime() - state.lastFetch) / 1000
    switch (fmt) {
      case 'm':
        return seconds / 60
      case 'h':
        return seconds / 60 / 60
      case 'd':
        return seconds / 60 / 60 / 24
      default:
        return seconds
    }
  },
  loadingData: state => state.isLoading,
  loaded: state => state.loaded,
}

// actions
const actions = {
  // eslint-disable-next-line no-unused-vars
  offlineSync({ commit, dispatch }, status) {
    commit('updateOfflineSync', status)
    if (status === 'done') {
      //this ll call dine in apis every time when offlien sync is done, offline sync happens every 60 mins
      // that means every 60 mins these dinein apis ll be called, that needs to be optimized.
      //dispatch('dinein/fetchAll', { silent: true }, { root: true })
    }
  },
  setLoader({ commit }, payload) {
    commit('SET_IS_LOADING', payload)
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
  lastFetch(state) {
    state.lastFetch = new Date().getTime()
  },
  updateOfflineSync(state, status) {
    state.offlineSync = status
  },
  SET_IS_LOADING(state, payload) {
    state.isLoading = payload
  },
  loading_store(state, status) {
    state.loading_store = status
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

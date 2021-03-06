// initial state
import * as mutation from './context/mutation-types'
import DataService from '@/services/DataService'

const state = {
  brandId: process.env.VUE_APP_BRAND_ID,
  storeId: process.env.VUE_APP_STORE_ID,
  brand: null,
  store: null,
  multiStores: null,
  selectedStore: false,
  storesLength: 1,
  currentRoute: null,
  availableModules: null,
  currentStore: undefined,
}

// getters
const getters = {
  current_store: state => state.currentStore,
  isStoreSelected(state) {
    return state.selectedStore
  },
  multipleStores: state => {
    return state.multiStores
  },
  haveMultipleStores: state => {
    return state.storesLength > 1
  },
  store: state => {
    if (state.brandId) {
      if (state.storeId) {
        return `/${state.brandId}/${state.storeId}`
      }
      return `/${state.brandId}`
    } else {
      return ''
    }
  },
  brand: state => {
    if (state.brandId) {
      return `/${state.brandId}`
    } else {
      return ''
    }
  },
  brand_id: state => state.brandId,
  store_id: state => state.storeId,

  storeName: state => storeId =>
    state.multiStores.find(store => store._id == storeId).name,
}

// actions
const actions = {
  updateContext({ getters }) {
    DataService.setContext({
      store: getters.store,
      brand: getters.brand,
    })
  },

  getStoresByGroupID({ state, commit, rootState }, groupId) {
    let availableGroups = rootState.auth.availableStoreGroups.find(
      group => group._id == groupId
    )
    let groupStores = []
    if (availableGroups.group_stores) {
      state.multiStores.forEach(store => {
        if (availableGroups.group_stores.includes(store._id)) {
          groupStores.push(store)
        }
      })
    }
    localStorage.setItem('groupStores', JSON.stringify(groupStores))
    commit('SET_MULTI_STORES', groupStores)
  },
  setBrandContext({ dispatch, commit }, brandId) {
    commit('SET_BRAND_ID', brandId)
    localStorage.setItem('brand_id', brandId)
    dispatch('updateContext')
  },
  setStoreContext({ dispatch, commit }, storeId) {
    commit('SET_STORE_ID', storeId)
    localStorage.setItem('store_id', storeId)
    dispatch('updateContext')
  },
  setBrandStoreContext({ dispatch }, { brandId, storeId }) {
    dispatch('setBrandContext', brandId)
    dispatch('setStoreContext', storeId)
  },
}

// mutations
const mutations = {
  [mutation.SET_BRAND_ID](state, brandId) {
    state.brandId = brandId
  },
  [mutation.SET_STORE_ID](state, storeId) {
    state.storeId = storeId
  },
  [mutation.SET_BRAND](state, brand) {
    state.brand = brand
  },
  [mutation.SET_STORE](state, store) {
    state.store = store
  },
  [mutation.SET_ROUTE](state, any) {
    state.currentRoute = any
  },
  [mutation.RESET](state, data) {
    //don't reset brand in any case
    // if (data && data.preserve && data.preserve.includes('brand_id')) {
    //   //preserve brand
    // } else {
    //   state.brand = null
    //   state.brandId = null
    // }
    if (data && data.preserve && data.preserve.includes('store_id')) {
      //preserve brand
    } else {
      state.store = null
      state.storeId = null
    }
    state.multiStores = null
    state.selectedStore = false
    state.storesLength = 1
    state.currentRoute = null
    state.availableModules = null
  },
  [mutation.SET_MULTI_STORES](state, multiStores) {
    state.multiStores = multiStores
  },
  [mutation.SET_AVAILABLE_MODULES](state, availableModules) {
    state.availableModules = availableModules
  },
  [mutation.SET_STORES_LENGTH](state, storeLength) {
    state.storesLength = storeLength
  },
  SET_CURRENT_STORE(state, store) {
    state.currentStore = store
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

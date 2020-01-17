// initial state
import * as mutation from './context/mutation-types'

const state = {
  brandId: process.env.VUE_APP_BRAND_ID,
  storeId: process.env.VUE_APP_STORE_ID,
  brand: null,
  store: null,
  multiStores: null,
  selectedStore: false,
  storesLength: 1,
}

// getters
const getters = {
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
  storeName: state => storeId =>
    state.multiStores.find(store => store._id == storeId).name,
}

// actions
const actions = {}

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
  [mutation.RESET](state) {
    state.store = null
    state.brand = null
    state.storeId = null
    state.brandId = null
  },
  [mutation.SET_MULTI_STORES](state, multiStores) {
    state.multiStores = multiStores
  },
  [mutation.SET_STORES_LENGTH](state, storeLength) {
    state.storesLength = storeLength
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

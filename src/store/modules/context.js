// initial state
import * as mutation from './context/mutation-types'

const state = {
  brandId: '5cdd23301578dd001855bf4e',
  storeId: '5cdd23471578dd001855c04c',
  brand: null,
  store: null,
}

// getters
const getters = {
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
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

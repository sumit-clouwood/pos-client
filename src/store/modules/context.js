// initial state
import * as mutation from './context/mutation-types'

const state = {
  brandId: '5ce27947ef76a0108d2a265b',
  storeId: '5ce27959ef76a0108d2a27ff',
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

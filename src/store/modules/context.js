// initial state
import * as mutation from './context/mutation-types'

const state = {
  brandId: '5cbee24d7573c20016721652',
  storeId: '5cbee2697573c200167218cb',
  brand: null,
  store: null,
}

// getters
const getters = {
  url: state => {
    if (state.brandId) {
      if (state.storeId) {
        return `/${state.brandId}/${state.storeId}`
      }
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

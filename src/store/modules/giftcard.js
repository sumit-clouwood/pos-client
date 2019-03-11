import GiftCardService from '@/services/data/GiftCardService'
import * as mutation from './giftcard/mutation-types'

// initial state
const state = {
  giftcards: [],
  customerGiftcards: [],
  giftcard: false,
}

// getters
const getters = {
  find: state => code => state.giftcards.data.find(gc => gc.gift_code == code),
}

// actions
const actions = {
  async fetchAll({ commit, rootState }) {
    const params = [rootState.location.location, rootState.sync.compress]

    const giftcards = await GiftCardService.fetchAll(...params)
    commit(mutation.SET_GIFT_CARDS, giftcards.data)
  },

  setCustomerGiftCards({ commit }, giftcards) {
    commit(mutation.SET_CUSTOMER_GIFT_CARDS, giftcards)
  },
}

// mutations
const mutations = {
  [mutation.SET_GIFT_CARDS](state, giftcards) {
    state.giftcards = giftcards
  },
  [mutation.SET_CUSTOMER_GIFT_CARDS](state, giftcards) {
    state.customerGiftcards = giftcards
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

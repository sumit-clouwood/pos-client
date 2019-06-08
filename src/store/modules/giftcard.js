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
    return new Promise((resolve, reject) => {
      const params = [rootState.location.location, rootState.sync.compress]

      GiftCardService.fetchAll(...params)
        .then(response => {
          commit(mutation.SET_GIFT_CARDS, response.data)
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  },

  setCustomerGiftCards({ commit }, giftcards) {
    commit(mutation.SET_CUSTOMER_GIFT_CARDS, giftcards)
  },

  apply({ commit, dispatch }, { code, amount }) {
    return new Promise((resolve, reject) => {
      dispatch('fetchAll')
        .then(() => {
          const card = state.giftcards.data.find(
            card => card.gift_card_code === code
          )
          if (card) {
            if (card.remaining_amount >= amount) {
              //get customer name by customer id
              dispatch('customer/fetchSelectedCustomer', card.customer, {
                root: true,
              })
                .then(customer => {
                  card.customerName = customer.name
                  card.customerPhone = customer.phone_number
                  commit(mutation.SET_GIFT_CARD, card)
                  resolve(card)
                })
                .catch(error => reject(error))
            } else {
              reject(`Available giftcard amount is lesser than ${amount}`)
            }
          } else {
            reject('No matching gift card found.')
          }
        })
        .catch(error => reject(error))
    })
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
  [mutation.SET_GIFT_CARD](state, giftcard) {
    state.giftcard = giftcard
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

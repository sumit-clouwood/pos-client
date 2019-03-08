import SurchargeService from '@/services/data/SurchargeService'
import * as mutation from './surcharge/mutation-types'

const state = {
  surcharges: [],
  surchargeAmounts: [],
}

const getters = {
  surcharge: state => {
    return state.surchargeAmounts.reduce((total, surcharge) => {
      return total + surcharge.amount
    }, 0)
  },
}

const actions = {
  calculate({ commit, rootGetters }) {
    return new Promise(resolve => {
      //look for order level discount before going furhter ;)
      const subtotal = rootGetters['order/subTotal']
      let totalSurcharges = []
      if (subtotal && state.surcharges.length) {
        state.surcharges.forEach(surcharge => {
          let applidSurcharge = {
            id: surcharge._id,
            amount: surcharge.rate,
            tax: surcharge.surcharge_is_taxable
              ? surcharge.surcharge_taxable_rate_info
              : false,
          }

          if (surcharge.type.toLowerCase() !== 'value') {
            applidSurcharge.amount = (subtotal * surcharge.rate) / 100
          }

          totalSurcharges.push(applidSurcharge)
        })
      }

      commit(mutation.SET_SURCHARGE_AMOUNT, totalSurcharges)
      resolve()
    })
  },

  fetchAll({ commit, rootState }) {
    const params = [
      rootState.location.location,
      rootState.sync.date,
      rootState.sync.compress,
    ]

    SurchargeService.fetchAll(...params).then(response => {
      if (response.data.data.length) {
        commit(mutation.SET_SURCHARGES, response.data.data)
      }
    })
  },
  reset({ commit }) {
    commit(mutation.RESET)
  },
}

const mutations = {
  [mutation.SET_SURCHARGES](state, surcharges) {
    state.surcharges = surcharges
  },
  [mutation.SET_SURCHARGE_AMOUNT](state, amount) {
    state.surchargeAmounts = amount
  },
  [mutation.RESET](state) {
    state.surchargeAmounts = []
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

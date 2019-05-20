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
            tax: surcharge.taxable
              ? surcharge.surcharge_taxable_rate_info
              : false,
          }

          if (surcharge.type.toLowerCase() === 'percentage') {
            applidSurcharge.amount = (subtotal * surcharge.rate) / 100
          }

          totalSurcharges.push(applidSurcharge)
        })
      }

      commit(mutation.SET_SURCHARGE_AMOUNT, totalSurcharges)
      resolve()
    })
  },

  fetchAll({ commit }) {
    SurchargeService.fetchAll().then(response => {
      if (response.data.data.length) {
        commit(mutation.SET_SURCHARGES, response.data.data)
      }
    })
  },

  // using this function for hold order
  /*setSurcharges({ commit, dispatch }, surcharges) {
    console.log(surcharges)
    commit(mutation.SET_SURCHARGES, surcharges)
    dispatch('calculate')
  },*/
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

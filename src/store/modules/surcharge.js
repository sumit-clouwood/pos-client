import SurchargeService from '@/services/data/SurchargeService'
import * as mutation from './surcharge/mutation-types'
import * as CONST from '@/constants'

const state = {
  surcharges: [],
  surchargeAmounts: [],
}

const getters = {
  tax: () => surcharge => {
    if (surcharge.type === CONST.VALUE) {
      const beforeTax = surcharge.value / ((100 + surcharge.tax_sum) / 100)
      return surcharge.value - beforeTax
    }
  },
  surcharge: state => {
    return state.surchargeAmounts.reduce((total, surcharge) => {
      return total + surcharge.amount
    }, 0)
  },
}

const actions = {
  calculate({ commit, getters, rootGetters, rootState }) {
    return new Promise(resolve => {
      //look for order level discount before going furhter ;)
      const subtotal = rootGetters['order/subTotal']
      const undiscountedSubtotal = rootGetters['order/subTotalUndiscounted']
      let totalSurcharges = []
      if (subtotal && state.surcharges.length) {
        state.surcharges.forEach(surcharge => {
          if (surcharge[rootState.order.orderType]) {
            let applidSurcharge = {
              id: surcharge._id,
              amount: surcharge.value,
              tax: getters.tax(surcharge),
              undiscountedTax: getters.tax(surcharge),
            }

            if (surcharge.type === CONST.PERCENTAGE) {
              applidSurcharge.amount = (subtotal * surcharge.rate) / 100
              applidSurcharge.tax =
                (applidSurcharge.amount * surcharge.tax_sum) / 100

              applidSurcharge.undiscountedAmount =
                (undiscountedSubtotal * surcharge.rate) / 100
              applidSurcharge.undiscountedTax =
                (applidSurcharge.undiscountedAmount * surcharge.tax_sum) / 100
            }

            totalSurcharges.push(applidSurcharge)
          }
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

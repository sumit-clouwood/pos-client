import SurchargeService from '@/services/data/SurchargeService'
import * as mutation from './surcharge/mutation-types'
import * as CONST from '@/constants'
import Num from '@/plugins/helpers/Num.js'

const state = {
  surcharges: [],
  surchargeAmounts: [],
}

const getters = {
  totalTax: (state, getters, rootState, rootGetters) => {
    if (rootGetters['auth/multistore']) {
      return 0
    }
    return state.surchargeAmounts.reduce((tax, surcharge) => {
      return tax + surcharge.tax
    }, 0)
  },

  tax: (state, getters, rootState, rootGetters) => surcharge => {
    if (rootGetters['auth/multistore']) {
      return 0
    }
    if (surcharge.type === CONST.VALUE) {
      const beforeTax = surcharge.value / ((100 + surcharge.tax_sum) / 100)
      return surcharge.value - beforeTax
    }
  },
  surcharge: (state, getters, rootState, rootGetters) => {
    if (rootGetters['auth/multistore']) {
      return 0
    }
    return state.surchargeAmounts.reduce((total, surcharge) => {
      return total + Num.round(surcharge.amount)
    }, 0)
  },
  surcharges: (state, getters, rootState, rootGetters) => {
    if (rootGetters['auth/multistore']) {
      return []
    }
    return state.surcharges.filter(
      surcharge => surcharge[rootState.order.orderType.OTApi] === true
    )
  },
}

const actions = {
  calculate({ commit, getters, rootGetters }) {
    return new Promise(resolve => {
      //look for order level discount before going furhter ;)
      const subtotal = rootGetters['order/subTotal']
      let totalSurcharges = []
      //If total surcharges exists.
      if (subtotal) {
        //Loop all valid surcharges to calculate individual.
        getters.surcharges.forEach(surcharge => {
          //Assign variables if Surcharge type is value.
          let applidSurcharge = {
            id: surcharge._id,
            amount: surcharge.value,
            tax: Num.round(getters.tax(surcharge)),
            undiscountedTax: Num.round(getters.tax(surcharge)),
          }
          //Assign variables if Surcharge type is percentage.
          if (surcharge.type === CONST.PERCENTAGE) {
            applidSurcharge.amount = Num.round(
              (subtotal * surcharge.rate) / 100
            )

            applidSurcharge.tax = Num.round(
              (applidSurcharge.amount * surcharge.tax_sum) / 100
            )
          }
          totalSurcharges.push(applidSurcharge)
        })
      }
      commit(mutation.SET_SURCHARGE_AMOUNT, totalSurcharges)
      resolve()
    })
  },
  removeSurcharge({ dispatch }) {
    dispatch('reset')
    dispatch('order/surchargeCalculation')
    dispatch('fetchAll')
  },
  fetchAll({ commit, rootState }) {
    SurchargeService.fetchAll(rootState.order.orderType.OTApi).then(
      response => {
        //If Surcharges available for location.
        if (response.data.data.length) {
          commit(mutation.SET_SURCHARGES, response.data.data)
        }
      }
    )
  },

  // using this function for hold order
  /*setSurcharges({ commit, dispatch }, surcharges) {
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
  [mutation.RESET](state, full = false) {
    //full used only when logout
    if (full) {
      state.surcharges = []
    }
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

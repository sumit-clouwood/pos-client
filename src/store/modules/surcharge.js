import SurchargeService from '@/services/data/SurchargeService'
import * as mutation from './surcharge/mutation-types'
import * as CONST from '@/constants'
import Num from '@/plugins/helpers/Num.js'

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
      //If total surcharges exists.
      if (subtotal && state.surcharges.length) {
        //filter surcharges with order type and country specific
        let allSurcharges = state.surcharges.filter(function(q) {
          if (
            q.availability.incl.countries.includes(
              rootState.location.store.country
            ) ||
            (q.availability.incl.stores.includes(rootState.context.storeId) &&
              q[rootState.order.orderType.OTApi] === true)
          ) {
            return q
          }
        })
        //If filtered surcharges count more than zero
        if (allSurcharges.length > 0) {
          //Loop all valid surcharges to calculate individual.
          allSurcharges.forEach(surcharge => {
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

              applidSurcharge.undiscountedAmount = Num.round(
                (undiscountedSubtotal * surcharge.rate) / 100
              )
              applidSurcharge.undiscountedTax = Num.round(
                (applidSurcharge.undiscountedAmount * surcharge.tax_sum) / 100
              )
            }
            totalSurcharges.push(applidSurcharge)
          })
        }
      }
      commit(mutation.SET_SURCHARGE_AMOUNT, totalSurcharges)
      resolve()
    })
  },

  fetchAll({ commit }) {
    SurchargeService.fetchAll().then(response => {
      //If Surcharges available for location.
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

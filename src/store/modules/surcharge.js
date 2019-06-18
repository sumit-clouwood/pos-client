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
      //If total surcharges exists.
      if (subtotal && state.surcharges.length) {
        //filter surcharges with order type and country specific
        let allSurcharges = state.surcharges.filter(function(q) {
          if (
            q.availability.incl.countries.includes(
              rootState.location.store.country
            ) &&
            q[rootState.order.orderType.OTApi] === true
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
              tax: getters.tax(surcharge),
              undiscountedTax: getters.tax(surcharge),
            }
            //Assign variables if Surcharge type is percentage.
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
          })
        }
      }
      commit(mutation.SET_SURCHARGE_AMOUNT, totalSurcharges)
      resolve()
    })
  },

  fetchAll({ commit, rootState }) {
    SurchargeService.fetchAll().then(response => {
      //If Surcharges avialable for location.
      if (response.data.data.length) {
        //Filter all surcharges by Country specific
        let data = response.data.data.filter(function(q) {
          if (
            q.availability.incl.countries.includes(
              rootState.location.store.country
            )
          ) {
            return q
          }
        })
        commit(mutation.SET_SURCHARGES, data)
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

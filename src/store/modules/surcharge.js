import SurchargeService from '@/services/data/SurchargeService'
import * as mutation from './surcharge/mutation-types'

const state = {
  surcharges: [],
  surchargeAmount: 0,
}

const getters = {}

const actions = {
  calculate({ commit, rootGetters }) {
    const subtotal = rootGetters['order/subTotal']
    let totalSurcharge = 0
    if (subtotal && state.surcharges.length) {
      totalSurcharge = state.surcharges.reduce((surchargeTotal, surchage) => {
        return (
          surchargeTotal +
          (surchage.type.toLowerCase() === 'value'
            ? surchage.rate
            : (subtotal * surchage.rate) / 100)
        )
      }, 0)
    }

    commit(mutation.SET_SURCHARGE_AMOUNT, totalSurcharge)
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
}

const mutations = {
  [mutation.SET_SURCHARGES](state, surcharges) {
    state.surcharges = surcharges
  },
  [mutation.SET_SURCHARGE_AMOUNT](state, amount) {
    state.surchargeAmount = amount
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

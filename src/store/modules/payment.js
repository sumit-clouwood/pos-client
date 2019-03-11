import PaymentService from '@/services/data/PaymentService'
import * as mutation from './payment/mutation-types'

// initial state
const state = {
  methods: [],
}

// getters
const getters = {
  methods: state => (state.methods.data ? state.methods.data : []),
}

// actions
const actions = {
  async fetchAll({ commit, rootState }) {
    const params = [
      rootState.location.location,
      rootState.sync.date,
      rootState.sync.compress,
    ]

    const paymentMethods = await PaymentService.fetchMethods(...params)
    commit(mutation.SET_METHODS, paymentMethods.data)
    const activeMethod = state.methods.data.find(method => method.is_cash === 1)
    commit('checkoutForm/setMethod', activeMethod, { root: true })
  },
}

// mutations
const mutations = {
  [mutation.SET_METHODS](state, methods) {
    state.methods = methods
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

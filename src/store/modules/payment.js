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
  async fetchAll({ commit }) {
    const paymentMethods = await PaymentService.fetchMethods()
    commit(mutation.SET_METHODS, paymentMethods.data)

    let activeMethod = state.methods.data.find(method => method.is_cash === 1)
    if (!activeMethod) {
      activeMethod = state.methods.data[0]
    }
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

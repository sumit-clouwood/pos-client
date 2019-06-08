import PaymentService from '@/services/data/PaymentService'
import * as mutation from './payment/mutation-types'
import * as CONST from '@/constants'

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
  async fetchAll({ commit, rootGetters }) {
    const paymentMethods = await PaymentService.fetchMethods()

    let methods = []
    paymentMethods.data.data.forEach(method => {
      if (method.item_status) {
        switch (method.name) {
          case CONST.GIFT_CARD:
            if (rootGetters['modules/enabled'](CONST.MODULE_GIFT_CARDS)) {
              methods.push(method)
            }
            break
          case CONST.LOYALTY:
            if (rootGetters['modules/enabled'](CONST.MODULE_LOYALTY)) {
              methods.push(method)
            }
            break

          default:
            methods.push(method)
        }
      }
    })

    paymentMethods.data = methods
    commit(mutation.SET_METHODS, paymentMethods)
    commit('checkoutForm/setMethod', state.methods.data[0], { root: true })
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

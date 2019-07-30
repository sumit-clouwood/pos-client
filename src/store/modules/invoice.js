import InvoiceService from '@/services/data/InvoiceService'
import * as mutation from './invoice/mutation-types'

// initial state
const state = {
  templateHtml: null,
  rules: [],
}

// getters
const getters = {
  templateId: (state, getters, rootState) => {
    if (state.rules.count) {
      let templateId = null
      state.rules.data.forEach(rule => {
        if (
          [
            rootState.order.orderType.OTApi + '_made',
            rootState.order.orderType.OTApi + '_pays',
            rootState.order.orderType.OTApi + '_requests',
          ].includes(rule.when)
        ) {
          templateId = rule.invoice_template
        }
      })
      return templateId
    }
  },
  templateHtml: state => {
    return state.templateHtml ? state.templateHtml.data : null
  },
}

// actions
const actions = {
  async printRules({ commit }) {
    const rules = await InvoiceService.fetchPrintRules()
    commit(mutation.SET_RULES, rules.data)
  },
  async fetchTemplate({ commit }, { orderId, templateId }) {
    const templateHtml = await InvoiceService.fetchTemplate(orderId, templateId)
    commit(mutation.SET_TEMPLATE_HTML, templateHtml)
  },
}

// mutations
const mutations = {
  [mutation.SET_TEMPLATE_HTML](state, templateHtml) {
    state.templateHtml = templateHtml
  },
  [mutation.SET_RULES](state, rules) {
    state.rules = rules
  },
  [mutation.RESET](state) {
    state.templateHtml = null
    state.rules = []
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

import InvoiceService from '@/services/data/InvoiceService'
import * as mutation from './invoice/mutation-types'

// initial state
const state = {
  templates: false,
  rules: [],
}

// getters
const getters = {
  rule: (state, getters, rootState) => {
    return state, getters, rootState
  },
  tpl: (state, getters, rootState) => {
    return state, getters, rootState
  },
  //logo: state => state.,
}

// actions
const actions = {
  async fetchAll({ commit }) {
    const [rules, templates] = await Promise.all([
      InvoiceService.fetchPrintRules(),
      InvoiceService.fetchTemplates(),
    ])

    commit(mutation.SET_TEMPLATES, templates.data)
    if (rules.data.status === 1) {
      commit(mutation.SET_RULES, rules.data)
    }
  },
  async printRules({ commit }) {
    const rules = await InvoiceService.fetchPrintRules()
    commit(mutation.SET_RULES, rules.data)
  },
}

// mutations
const mutations = {
  [mutation.SET_TEMPLATES](state, templates) {
    state.templates = templates
  },
  [mutation.SET_RULES](state, rules) {
    state.rules = rules
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

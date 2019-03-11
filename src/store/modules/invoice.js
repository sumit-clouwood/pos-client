import InvoiceService from '@/services/data/InvoiceService'
import * as mutation from './invoice/mutation-types'

// initial state
const state = {
  templates: [],
}

// getters
const getters = {}

// actions
const actions = {
  async fetchAll({ commit, rootState }) {
    const params = [rootState.location.location]

    const templates = await InvoiceService.fetchTemplates(...params)
    commit(mutation.SET_TEMPLATES, templates.data)
  },
}

// mutations
const mutations = {
  [mutation.SET_TEMPLATES](state, templates) {
    state.templates = templates
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

import InvoiceService from '@/services/data/InvoiceService'
import * as mutation from './invoice/mutation-types'

// initial state
const state = {
  templates: null,
  rules: null,
  templateId: null,
}

// getters
const getters = {
  template: (state, getters, rootState) => {
    if (state.rules && typeof state.rules.data !== 'undefined') {
      let templateId = null
      if (state.templateId) {
        //template id already selected
        templateId = state.templateId
      } else {
        state.rules.data.data.forEach(rule => {
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
      }

      if (state.templates && state.templates.data) {
        if (templateId) {
          return state.templates.data.data.find(
            template => template._id == templateId
          )
        } else {
          return state.templates.data.data[0]
        }
      }
    }
  },
}

// actions
const actions = {
  async printRules({ commit }) {
    const rules = await InvoiceService.fetchPrintRules()
    commit(mutation.SET_RULES, rules)
  },

  async fetchTemplates({ commit }) {
    const templates = await InvoiceService.fetchTemplates()
    commit('SET_PRINT_TEMPLATES', templates)
  },

  setTemplateId({ commit }, templateId) {
    commit(mutation.SET_TEMPLATE_ID, templateId)
  },
  // async fetchTemplate({ commit }, { orderId, templateId }) {
  //   const templateHtml = await InvoiceService.fetchTemplate(orderId, templateId)
  //   commit(mutation.SET_TEMPLATE_HTML, templateHtml)
  // },
}

// mutations
const mutations = {
  // [mutation.SET_TEMPLATE_HTML](state, templateHtml) {
  //   state.templateHtml = templateHtml
  // },
  // [mutation.SET_TEMPLATE](state, template) {
  //   state.template = template
  // },
  [mutation.SET_PRINT_TEMPLATES](state, templates) {
    state.templates = templates
  },
  [mutation.SET_RULES](state, rules) {
    state.rules = rules
  },
  [mutation.RESET](state) {
    state.rules = null
    state.templates = null
    state.templateId = null
  },
  [mutation.SET_TEMPLATE_ID](state, templateId) {
    state.templateId = templateId
  },
  // [mutation.RESET](state) {
  //   state.templateHtml = null
  //   state.rules = []
  // },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

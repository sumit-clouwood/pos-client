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
    if (!state.rules.data) return false

    const ruleType =
      rootState.order.orderType == 'Walk-in'
        ? 'walk_in_rule'
        : rootState.order.orderType
    return state.rules.data.find(rule => {
      if (rule[ruleType]) {
        return true
      }
    })[ruleType]
  },
  tpl: (state, getters, rootState) => {
    if (!state.templates) {
      return false
    }
    const orderType = rootState.order.orderType
    let templates = ''
    switch (orderType) {
    case 'Walk-in':
      templates = state.templates.data['walkin']
      break
    default:
      templates = state.templates.data['default_template']
      break
    }

    if (getters.rule.template) {
      const templateId = getters.rule.template[0][0]
      const template = templates.find(template => template._id == templateId)
      const defaultTemplate = state.templates.data['default_template'][0]
      let en = state.templates.data.english_labels.find(
        label => label._id == templateId
      )
      if (!en) {
        en = state.templates.data.english_labels[0]
      }

      let foreignLang = false
      if (
        template.language != 'en_US' ||
        rootState.location.selectedSortcode !== 'en_US'
      ) {
        foreignLang = true
      }

      return { template, defaultTemplate, en, foreignLang }
    }
  },
  logo: state => state.templates.company_logo,
}

// actions
const actions = {
  async fetchAll({ commit, rootState }) {
    const params = [
      rootState.location.location,
      rootState.order.orderType == 'Walk-in'
        ? 'walkin'
        : rootState.order.orderType,
      rootState.location.selectedSortcode,
    ]

    const [templates, rules] = await Promise.all([
      InvoiceService.fetchTemplates(...params),
      InvoiceService.fetchPrintRules(...params),
    ])

    commit(mutation.SET_TEMPLATES, templates.data)
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

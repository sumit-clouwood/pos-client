import InvoiceService from '@/services/data/InvoiceService'
import * as mutation from './invoice/mutation-types'

// initial state
const state = {
  templates: null,
  rules: null,
  templateId: null,
  printerConfig: false,
}

// getters
const getters = {
  template: (state, getters, rootState) => {
    if (state.rules && typeof state.rules.data !== 'undefined') {
      let templateId = null
      if (
        state.templateId &&
        state.templates.data.data.some(template => template._id == templateId)
      ) {
        //template id already selected
        templateId = state.templateId
      } else {
        if (typeof state.rules.data.data == 'undefined') return false
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
  async printRules({ commit, dispatch }) {
    const rules = await InvoiceService.fetchPrintRules()
    commit(mutation.SET_RULES, rules)
    dispatch('getAllPrinters')
  },

  getAllPrinters({ commit }) {
    /*InvoiceService.getPrinters().then(response => {
      commit(mutation.SET_PRINTERS, response.data)
    })*/
    if (window.PrintHandle != null) {
      window.PrintHandle.GetAllPrinters(function(data) {
        let dataObj = JSON.parse(data)
        this.printers = dataObj.printerlist
        let printerSetting = {
          printers: dataObj.printerlist,
          is_kot: dataObj.printbykot,
          printCopies: dataObj.printcopies,
        }
        commit(mutation.SET_PRINTERS, printerSetting)
        /*dataObj.printbykot
        dataObj.printcopies*/
      })
    }
  },
  async fetchTemplates({ commit }) {
    const templates = await InvoiceService.fetchTemplates()
    commit('SET_PRINT_TEMPLATES', templates)
  },
  setPrinterConfigurationKey() {
    //This is  a uiwebview
    const urlParams = new URLSearchParams(window.location.search)
    urlParams.set('printersetting', Math.floor(Math.random() * 100 + 1))
    window.location.search = urlParams
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
  [mutation.SET_PRINTERS](state, printers) {
    state.printerConfig = printers
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

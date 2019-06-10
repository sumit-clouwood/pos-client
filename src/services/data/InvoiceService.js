import DataService from '@/services/DataService'

export default {
  fetchTemplates() {
    return DataService.get(
      `/model/store_invoice_templates?ascending=1&orderBy=name`
    )
  },

  fetchPrintRules() {
    return DataService.get(
      `/model/store_printing_rules?ascending=1&orderBy=name`
    )
  },
}

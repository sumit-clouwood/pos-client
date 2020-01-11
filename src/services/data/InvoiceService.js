import DataService from '@/services/DataService'

export default {
  fetchTemplates() {
    return DataService.get(`/model/store_invoice_templates`)
    //http://127.0.0.1:8000/api/5cfde2881578dd0021526b89/5cfde2b41578dd0021526d0a/model/store_invoice_templates/id/5cfde2bf1578dd0021526d4e/view_print_html
  },

  fetchPrintRules() {
    return DataService.get(
      `/model/store_printing_rules?ascending=1&orderBy=name`
    )
  },
}

import DataService from '@/services/DataService'

export default {
  fetchTemplates(printRuleId) {
    return DataService.get(
      `/model/store_invoice_templates/id/${printRuleId}/edit`
    )
  },

  fetchPrintRules() {
    return DataService.getCacheable(
      // `/api/auth/get-invoice-print-rules/?location_id=${locationId}&order_type=${orderType}&language=${language}`
      `/model/store_invoice_templates?ascending=1&byColumn=0&orderBy=name`
    )
  },
}

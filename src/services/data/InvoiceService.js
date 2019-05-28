import DataService from '@/services/DataService'

export default {
  fetchTemplates() {
    return DataService.get(
      `/model/store_invoice_templates?ascending=1&byColumn=0&orderBy=name`
    )
  },

  fetchPrintRules(...[locationId, orderType, language]) {
    return DataService.getCacheable(
      `/api/auth/get-invoice-print-rules/?location_id=${locationId}&order_type=${orderType}&language=${language}`
    )
  },
}

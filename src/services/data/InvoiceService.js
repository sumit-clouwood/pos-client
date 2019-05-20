import DataService from '@/services/DataService'

export default {
  fetchTemplates() {
    return DataService.getCacheable(
      `/model/store_invoice_template?ascending=1&byColumn=0&orderBy=name`,
      'brand'
    )
  },

  fetchPrintRules(...[locationId, orderType, language]) {
    return DataService.getCacheable(
      `/api/auth/get-invoice-print-rules/?location_id=${locationId}&order_type=${orderType}&language=${language}`
    )
  },
}

import DataService from '@/services/DataService'

export default {
  fetchTemplates() {
    return DataService.getCacheable(
      `/model/store_invoice_template?ascending=1&byColumn=0&orderBy=name`,
      'brand'
    )
  },

  fetchPrintRules() {
    return DataService.getCacheable(
      // `/api/auth/get-invoice-print-rules/?location_id=${locationId}&order_type=${orderType}&language=${language}`
      `/model/store_invoice_templates?page_id=store_invoice_templates_main_tbl&query=&limit=10&ascending=1&page=1&byColumn=0&orderBy=title_label`
    )
  },
}

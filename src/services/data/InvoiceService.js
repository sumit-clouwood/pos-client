import DataService from '@/services/DataService'

export default {
  fetchTemplates(locationId) {
    return DataService.getCacheable(
      `/api/auth/invoice-list/?location_id=${locationId}`
    )
  },

  fetchPrintRules(...[locationId, orderType, language]) {
    return DataService.getCacheable(
      `/api/auth/get-invoice-print-rules/?location_id=${locationId}&order_type=${orderType}&language=${language}`
    )
  },
}

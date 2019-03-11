import DataService from '@/services/DataService'

export default {
  fetchTemplates(locationId) {
    return DataService.get(`/api/auth/invoice-list/?location_id=${locationId}`)
  },

  fetchPrintRules(...[locationId, orderType, language]) {
    return DataService.get(
      `/api/auth/get-invoice-print-rules/?location_id=${locationId}&order_type=${orderType}&language=${language}`
    )
  },
}

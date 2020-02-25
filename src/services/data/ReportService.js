import DataService from '@/services/DataService'

export default {
  fetchBusinessSummery(data) {
    return DataService.post('/model/orders/get_store_business_summary', data)
  },
}

import DataService from '@/services/DataService'

export default {
  fetchMethods() {
    return DataService.get(
      `/model/brand_payment_types?byColumn=0&item_status=true`
    )
  },
}

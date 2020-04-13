import DataService from '@/services/DataService'

export default {
  fetchMethods() {
    return DataService.get(
      `/model/brand_payment_types?no_limit=true&byColumn=0&item_status=true`
    )
  },
}

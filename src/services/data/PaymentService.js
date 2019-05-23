import DataService from '@/services/DataService'

export default {
  fetchMethods() {
    return DataService.getCacheable(
      `/model/brand_payment_types?ascending=1&byColumn=0&orderBy=name&status=true`,
      'brand'
    )
  },
}

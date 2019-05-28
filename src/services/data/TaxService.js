import DataService from '@/services/DataService'

export default {
  fetchAll() {
    return DataService.get(
      `/model/brand_tax_rates?ascending=1&byColumn=0&orderBy=name`
    )
  },
}

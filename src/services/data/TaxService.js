import DataService from '@/services/DataService'

export default {
  fetchAll() {
    return DataService.get(
      `/model/brand_tax_rates?ascending=1&byColumn=0&orderBy=name`
    )
  },
  fetchOpenItemTaxes() {
    return DataService.get(
      `/model/brand_tax_rates/get_open_items_tax?ascending=1&byColumn=0`,
      null,
      false
    )
  },
}

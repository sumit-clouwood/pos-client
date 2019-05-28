import DataService from '@/services/DataService'

export default {
  fetchItemDiscounts() {
    return DataService.get(
      `/model/brand_item_discounts?ascending=1&byColumn=0&orderBy=name`
    )
  },

  fetchOrderDiscounts() {
    return DataService.get(
      `/model/brand_order_discounts?ascending=1&byColumn=0&orderBy=name`
    )
  },
}

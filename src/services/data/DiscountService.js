import DataService from '@/services/DataService'

export default {
  fetchItemDiscounts() {
    return DataService.getT(
      `/model/brand_item_discounts?ascending=1&orderBy=name&byColumn=0&limit=99999`
    )
  },

  fetchOrderDiscounts() {
    return DataService.getT(
      `/model/brand_order_discounts?ascending=1&orderBy=name&byColumn=0&limit=99999`
    )
  },
}

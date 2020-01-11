import DataService from '@/services/DataService'

export default {
  fetchItemDiscounts(orderType) {
    return DataService.getT(
      `/model/brand_item_discounts?ascending=1&orderBy=name&byColumn=1&${orderType}=true&limit=99999`
    )
  },

  fetchOrderDiscounts(orderType) {
    return DataService.getT(
      `/model/brand_order_discounts?ascending=1&orderBy=name&byColumn=1&${orderType}=true&limit=99999`
    )
  },
}

import DataService from '@/services/DataService'

export default {
  fetchItemDiscounts(storeId = null) {
    const apiUrl = `/model/brand_item_discounts?ascending=1&orderBy=name&byColumn=0&limit=99999`
    if (storeId) {
      return DataService.getT(`/${storeId}${apiUrl}`, 'brand')
    }
    return DataService.getT(apiUrl)
  },

  fetchOrderDiscounts(storeId = null) {
    const apiUrl = `/model/brand_order_discounts?ascending=1&orderBy=name&byColumn=0&limit=99999`
    if (storeId) {
      return DataService.getT(`/${storeId}${apiUrl}`, 'brand')
    }
    return DataService.getT(apiUrl)
  },
}

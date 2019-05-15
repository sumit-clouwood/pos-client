import DataService from '@/services/DataService'

export default {
  fetchItemDiscounts(...[locationId, lastSyncDate, isCompress]) {
    return DataService.getCacheable(
      `/api/auth/getAll/itemDiscount/?location_id=${locationId}&last_sync_date=${lastSyncDate}&is_compress=${isCompress}`
    )
  },

  fetchOrderDiscounts() {
    return DataService.get(
      `/model/brand_order_discount?ascending=1&byColumn=0&orderBy=name`
    )
  },
}

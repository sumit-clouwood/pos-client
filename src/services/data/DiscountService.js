import DataService from '@/services/DataService'

export default {
  fetchItemDiscounts(...[locationId, lastSyncDate, isCompress]) {
    return DataService.getCacheable(
      `/api/auth/getAll/itemDiscount/?location_id=${locationId}&last_sync_date=${lastSyncDate}&is_compress=${isCompress}`
    )
  },

  fetchOrderDiscounts(...[locationId, lastSyncDate, isCompress]) {
    return DataService.getCacheable(
      `/api/auth/getAll/orderDiscount/?location_id=${locationId}&last_sync_date=${lastSyncDate}&is_compress=${isCompress}`
    )
  },
}

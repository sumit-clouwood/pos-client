import DataService from '@/services/DataService'

export default {
  fetchAll(...[locationId, isCompress]) {
    return DataService.getCacheable(
      //`/api/auth/get/gift/cards?location_id=${locationId}&last_sync_date=${lastSyncDate}&is_compress=${isCompress}`
      `/api/auth/get/gift/cards?location_id=${locationId}&is_compress=${isCompress}`
    )
  },
}

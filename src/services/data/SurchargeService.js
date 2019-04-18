import DataService from '@/services/DataService'

export default {
  fetchAll(...[locationId, lastSyncDate, isCompress]) {
    return DataService.getCacheable(
      `/api/auth/getAll/surcharge/?location_id=${locationId}&last_sync_date=${lastSyncDate}&is_compress=${isCompress}`
    )
  },
}

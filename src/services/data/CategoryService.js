import DataService from '@/services/DataService'

export default {
  fetchAll(...[locationId, lastSyncDate, isCompress]) {
    return DataService.get(
      `/api/auth/getallitems/?location_id=${locationId}&last_sync_date=${lastSyncDate}&is_compress=${isCompress}`
    )
  },
}

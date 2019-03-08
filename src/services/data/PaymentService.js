import DataService from '@/services/DataService'

export default {
  fetchMethods(...[locationId, lastSyncDate, isCompress]) {
    return DataService.get(
      `/api/auth/get/Payment/Type/?location_id=${locationId}&last_sync_date=${lastSyncDate}&is_compress=${isCompress}`
    )
  },
}

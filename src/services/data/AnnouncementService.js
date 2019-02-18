import DataService from '@/services/DataService'

export default {
  fetchAll(...[staffId, lastSyncDate]) {
    return DataService.get(
      `/api/auth/get/Announcement?staff_id=${staffId}&last_sync_date=${lastSyncDate}`
    )
  },
}

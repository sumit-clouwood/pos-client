import DataService from '@/services/DataService'

export default {
  fetchAll () {
    return DataService.get(`/api/auth/getallitems/?location_id={location_id}&last_sync_date={last_sync_date}&is_compress={is_compress}`)
  }
}
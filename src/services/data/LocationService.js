import DataService from '@/services/DataService'

export default {
  //Get country,city,location and drivers data by location id .
  getLocationData(...[locationId, staff]) {
    return DataService.get(
      // Commented because need last sync date in format if pass time it would not get location information
      // `/api/auth/locationdetails/?location_id=${locationId}&staff=${staff}&last_sync_date=${lastSyncDate}&time=${time}`
      `/api/auth/locationdetails/?location_id=${locationId}&staff=${staff}`
    )
  },
}

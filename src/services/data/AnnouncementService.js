import DataService from '@/services/DataService'

export default {
  fetchAll(roleId, date) {
    return DataService.get(
      `/model/brand_announcements?page_id=brand_announcements_main_tbl&query=&limit=10&ascending=1&page=1&byColumn=1&orderBy=announcement&role=${roleId}&from_date=${date}~lte&to_date=${date}~gte`
      // `/model/brand_announcements?page_id=brand_announcements_main_tbl&query=&limit=10&ascending=1&page=1&byColumn=1&orderBy=announcement&role=${roleId}`
    )
  },
}

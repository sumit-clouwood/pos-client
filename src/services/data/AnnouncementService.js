import DataService from '@/services/DataService'

export default {
  fetchAll(roleId) {
    return DataService.get(
      `/model/brand_announcements?page_id=brand_announcements_main_tbl&query=&limit=10&ascending=1&page=1&byColumn=1&orderBy=announcement&brand_role=${roleId}`
    )
  },
}

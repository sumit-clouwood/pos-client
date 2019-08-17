import DataService from '@/services/DataService'

export default {
  dineInOrders() {
    return DataService.get(`/model/dine_in_orders`)
  },

  dineAreas() {
    return DataService.get(
      `/model/dine_in_area?page_id=dinning_section&query=&limit=99999999&ascending=1&page=1&byColumn=0&orderBy=priority`
    )
  },

  dineTables() {
    return DataService.get(`/model/dine_in_tables`)
  },
}

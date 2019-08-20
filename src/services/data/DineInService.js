import DataService from '@/services/DataService'

export default {
  dineInRunningOrders() {
    return DataService.get(
      `/model/reservations?page_id=running_orders&query=&limit=10&ascending=1&page=1`
    )
  },
  dineInCompleteOrders() {
    return DataService.get(
      `/model/reservations?page_id=reservations_main_tbl&query=&limit=10&ascending=1&page=1&byColumn=1&status=completed`
    )
  },

  dineAreas() {
    return DataService.get(
      `/model/dine_in_area?page_id=dinning_section&query=&limit=99999999&ascending=1&page=1&byColumn=0&orderBy=priority`
    )
  },

  dineTables() {
    return DataService.get(`/model/dine_in_tables?byColumn=1&item_status=true`)
  },
}

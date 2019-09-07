import DataService from '@/services/DataService'

export default {
  dineInRunningOrders(page, limit) {
    return DataService.get(
      `/model/reservations?page_id=running_orders&query=&limit=${limit}&ascending=1&page=${page}`
    )
  },
  dineInCompleteOrders(page, limit) {
    return DataService.get(
      `/model/reservations?page_id=reservations_main_tbl&query=&limit=${limit}&ascending=1&page=${page}&byColumn=1&status=completed`
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

  waitingLists() {
    return DataService.get(
      `/model/waiting_lists?page_id=waiting_lists_main_tbl&query=&limit=10&ascending=1&page=1&byColumn=0&orderBy=start_date`
    )
  },

  waitingListsAdd() {
    return DataService.post(`/model/waiting_lists/add`)
  },

  waitingListsOperation(id, operation) {
    //edit, delete
    return DataService.post(`/model/waiting_lists/id/${id}/${operation}`)
  },

  moveWaitingToReservation(data) {
    // waiting_lint_id: id, table_id: id
    return DataService.post(
      `/model/reservations/move_waiting_to_reservation`,
      data
    )
  },

  updateReservationStatus(reservationId, status) {
    return DataService.post(
      // dine_in_order_finished` /dine_in_about_to_finish /cancelled_reservation
      `/model/reservations/id/${reservationId}/${status}`
    )
  },

  dineInCovers() {
    return DataService.get(
      `/model/brand_dine_in_covers?page_id=brand_dine_in_covers_main_tbl&query=&limit=10&ascending=1&page=1&byColumn=0&orderBy=priority`,
      'brand'
    )
  },

  getAllBookedTables() {
    return DataService.get(
      '/model/reservations?page_id=tables_reserved&page=1&limit=999999'
    )
  },
  reservationOperation(data, action) {
    // action: add, move_waiting_to_reservation
    return DataService.post(`/model/reservations/${action}`, data)
  },
}

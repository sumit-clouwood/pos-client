import DataService from '@/services/DataService'

export default {
  getDMOrderDetails(
    ...[query, limit, orderBy, orderStatus, page, pageId, storeId]
  ) {
    return DataService.get(
      `/model/orders?page_id=${pageId}&query=${query}&limit=${limit}&ascending=1&page=${page}&byColumn=0&orderBy=${orderBy}&order_status=${orderStatus}&store_id=${storeId}`,
      'brand'
    )
  },

  getUsers() {
    return DataService.get('/model/users?no_limit=true', 'brand')
  },

  getCancelReasons() {
    return DataService.get(
      'model/brand_cancellation_reasons?no_limit=true',
      'brand'
    )
  },
}

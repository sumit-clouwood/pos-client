import DataService from '@/services/DataService'
import DateTime from '@/mixins/DateTime'
import Store from '@/store'

export default {
  fetchOrders(orderStatus, page = 1, limit = 10, userId = '', orderBy = '') {
    const currentDate = DateTime.getPreviousDayUTCDate()
    let datequery = '&start_date=' + currentDate + '~gte'
    if (orderStatus === 'running') {
      datequery = ''
    }
    const storeId = Store.state.location.store._id

    return DataService.get(
      `/model/orders?&limit=${limit}&ascending=1&page=${page}&byColumn=1&cashier_id=${userId}&orderBy=${orderBy}&order_status=${orderStatus}&order_system_status=normal&order_type=carhop&store_id=${storeId}${datequery}`
    )
  },
}

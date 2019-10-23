import DataService from '@/services/DataService'
import DateTime from '@/mixins/DateTime'
import Store from '@/store'

export default {
  fetchOrders(orderStatus, page = 1, limit = 10, orderBy = '') {
    const currentDate = DateTime.getPreviousDayUTCDate()
    const storeId = Store.state.location.store._id

    return DataService.get(
      `/model/orders?&limit=${limit}&ascending=1&page=${page}&byColumn=1&orderBy=${orderBy}&order_status=${orderStatus}&order_type=carhop&store_id=${storeId}&start_date=${currentDate}~gte`
    )
  },
}

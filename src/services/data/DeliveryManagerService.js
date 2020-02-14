import DataService from '@/services/DataService'
import DateTime from '@/mixins/DateTime'

export default {
  getDMOrderDetails(...[query, limit, orderBy, page, pageId, storeId]) {
    let currentDate = DateTime.getPreviousDayUTCDate()
    return DataService.getLive(
      `/model/orders?page_id=${pageId}&query=${query}&limit=${limit}&ascending=1&page=${page}&byColumn=0&orderBy=${orderBy}&store_id=${storeId}&store_date=${currentDate}~gte`
    )
  },

  getUsers(roleId) {
    return DataService.getLive(
      `/model/users?no_limit=true&byColumn=0&brand_role=${roleId}`
    )
  },

  getGlobalDetails(model) {
    return DataService.getLive(`/model/${model}?no_limit=true`, 'brand')
  },

  assignOrdersToDriver(driverId, orderIds) {
    return DataService.post('/model/orders/assign_driver', {
      driver: driverId,
      orders: orderIds,
    })
  },
}

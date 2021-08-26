import DataService from '@/services/DataService'
import DateTime from '@/mixins/DateTime'

export default {
  getDMOrderDetails(...[query, limit, orderBy, page, pageId, storeId]) {
    let currentDate = DateTime.getPreviousDayUTCDate()
    let get_online_dinein = ''
    if (pageId === 'home_delivery_acceptance') {
      // set_order_type = '&order_type=online'
      get_online_dinein = '&online_dinein=1'
    }
    return DataService.get(
      `/model/orders?page_id=${pageId}&query=${query}&limit=${limit}&ascending=1&page=${page}&byColumn=0&orderBy=${orderBy}&store_id=${storeId}&store_date=${currentDate}~gte${get_online_dinein}`
    )
  },

  getUsers(roleId) {
    return DataService.get(
      `/model/users?no_limit=true&byColumn=0&brand_role=${roleId}`
    )
  },
  getDeliveryServices(brand_id) {
    return DataService.get(
      `/model/orders/get_drivers?brand_id=${brand_id}`,
      null,
      false
    )
  },
  getGlobalDetails(model) {
    return DataService.get(`/model/${model}?no_limit=true`, 'brand')
  },

  assignOrdersToDriver(driverId, orderIds) {
    return DataService.post('/model/orders/assign_driver', {
      driver: driverId,
      orders: orderIds,
    })
  },
}

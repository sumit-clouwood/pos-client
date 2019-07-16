import DataService from '@/services/DataService'

export default {
  getDMOrderDetails(
    // eslint-disable-next-line no-unused-vars
    ...[query, limit, orderBy, orderStatus, page, pageId, storeId]
  ) {
    return DataService.get(
      `/model/orders?page_id=${pageId}&query=${query}&limit=${limit}&ascending=1&page=${page}&byColumn=0&orderBy=${orderBy}&store_id=${storeId}`
    )
  },

  getUsers(roleId) {
    return DataService.get(
      `/model/users?no_limit=true&byColumn=0&brand_role=${roleId}`
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

import DataService from '@/services/DataService'

export default {
  getDMOrderCount(...[location_id, order_status]) {
    return DataService.get(
      `/auth/deliveryManager/get/order/?location_id=${location_id}&order_status=${order_status}`
    )
  },

  getDMOrderDetails(
    ...[query, limit, orderBy, orderStatus, page, pageId, storeId]
  ) {
    return DataService.get(
      `/model/orders?page_id=${pageId}&query=${query}&limit=${limit}&ascending=1&page=${page}&byColumn=0&orderBy=${orderBy}&order_status=${orderStatus}&store_id=${storeId}`
    )
  },

  getUsers(roleId) {
    return DataService.get(
      `/model/users?no_limit=true&byColumn=0&brand_role=${roleId}`
    )
  },

  getRoles() {
    return DataService.get('/model/brand_roles?no_limit=true')
  },

  dispatchOrders(...[location_id, is_pagination, pageSize, pageNumber]) {
    return DataService.get(
      `/auth/deliveryManager/dispatch/screen/?location_id=${location_id}&is_pagination=${is_pagination}&pagesize=${pageSize}&pagenumber=${pageNumber}`
    )
  },

  updateTakeAwayOrder(...[location_id, order_id]) {
    return DataService.get(
      `/auth/order/dispatch/collected?location_id=${location_id}&order_id=${order_id}`
    )
  },

  getMoreOrders(...[location_id, driver_id]) {
    return DataService.get(
      `/auth/deliveryManager/delivered/showData?driver_id=${driver_id}&location_id=${location_id}`
    )
  },

  assignDriverToOrder(...[location_id, order_id, driver_id, timestamp]) {
    return DataService.post(
      `/auth/deliveryManager/assign/driver/?location_id=${location_id}&order_id=${order_id}&driver_id=${driver_id}&timestamp=${timestamp}`
    )
  },

  // updateOrder available in OrderService: api/auth/deliveryManager/update/order?location_id={location_id}&order_status={order_status}&order_id={order_id}&order_type={order_type}&timestamp={timestamp}
}

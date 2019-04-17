import DataService from '@/services/DataService'

export default {
  getDMOrderCount(...[location_id, order_status]) {
    return DataService.get(
      `/api/auth/deliveryManager/get/order/?location_id=${location_id}&order_status=${order_status}`
    )
  },

  getDMOrderDetails(...[location_id, order_status, collected]) {
    return DataService.get(
      `/api/auth/deliveryManager/get/order/detail?location_id=${location_id}&order_status=${order_status}&collected=${collected}&source=new-pos`
    )
  },
  getDispatchScreenOrders(...[location_id]) {
    return DataService.get(
      `/api/auth/deliveryManager/dispatch/screen/?location_id=${location_id}`
    )
  },

  updateTakeAwayOrder(...[location_id, order_id]) {
    return DataService.get(
      `/api/auth/order/dispatch/collected?location_id=${location_id}&order_id=${order_id}`
    )
  },

  getMoreOrders(...[location_id, driver_id]) {
    return DataService.get(
      `api/auth/deliveryManager/delivered/showData?driver_id=${driver_id}&location_id=${location_id}`
    )
  },

  assignDriverToOrder(...[location_id, order_id, driver_id, timestamp]) {
    return DataService.post(
      `/api/auth/deliveryManager/assign/driver/?location_id=${location_id}&order_id=${order_id}&driver_id=${driver_id}&timestamp=${timestamp}`
    )
  },

  // updateOrder available in OrderService: api/auth/deliveryManager/update/order?location_id={location_id}&order_status={order_status}&order_id={order_id}&order_type={order_type}&timestamp={timestamp}
}

import DataService from '@/services/DataService'

export default {
  ordersCountByStatus(...[locationId, orderStatus]) {
    return DataService.get(
      `/api/auth/deliveryManager/get/order/?location_id=${locationId}&order_status=${orderStatus}`
    )
  },

  getOrdersByStatus(...[locationId, orderStatus, collected]) {
    return DataService.get(
      `/api/auth/deliveryManager/get/order/detail?location_id=${locationId}&order_status=${orderStatus}&collected=${collected}`
    )
  },

  getDispatchScreenOrders(locationId) {
    return DataService.get(
      `/api/auth/deliveryManager/dispatch/screen/?location_id=${locationId}`
    )
  },

  //Get country,city,location and drivers data by location id .
  getLocationData(...[locationId, staff, lastSyncDate, time]) {
    return DataService.get(
      `/api/auth/locationdetails/?location_id=${locationId}&staff=${staff}&last_sync_date=${lastSyncDate}&time=${time}`
    )
  },

  getGiftCards(...[locationId, lastSyncDate, isCompress]) {
    return DataService.get(
      `/api/auth/get/gift/cards?location_id=${locationId}&last_sync_date=${lastSyncDate}&is_compress=${isCompress}`
    )
  },
}

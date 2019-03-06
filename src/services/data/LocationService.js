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
  getLocationData(...[locationId, staff]) {
    return DataService.get(
      // Commented because need last sync date in format if pass time it would not get location information
      // `/api/auth/locationdetails/?location_id=${locationId}&staff=${staff}&last_sync_date=${lastSyncDate}&time=${time}`
      `/api/auth/locationdetails/?location_id=${locationId}&staff=${staff}`
    )
  },
}

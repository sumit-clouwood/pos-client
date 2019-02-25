import DataService from "@/services/DataService";

export default {
  saveOrder(...[locationId, lastSyncDate, isCompress]) {
    return DataService.post(
      `/api/auth/order/SaveOrder/itemDiscount/?location_id=${locationId}&last_sync_date=${lastSyncDate}&is_compress=${isCompress}`
    );
  },

  deleteOrder(orderId) {
    return DataService.get(`/api/auth/order/deleteOrder/?&order_id=${orderId}`);
  },

  fetchOrder(...[orderId, lastSyncDate]) {
    return DataService.get(
      `/api/auth/order/details?order_id=${orderId}&last_sync_date=${lastSyncDate}`
    );
  },

  updateOrder(...[locationId, orderStatus, orderId, orderType, timestamp]) {
    return DataService.post(
      `/api/auth/deliveryManager/update/order?location_id=${locationId}&order_status=${orderStatus}&order_id=${orderId}&order_type=${orderType}&timestamp=${timestamp}`
    );
  }
};

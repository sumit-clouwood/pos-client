import DataService from "@/services/DataService";

export default {
  assignDriver(...[locationId, orderId, driverId]) {
    return DataService.post(
      `/api/auth/deliveryManager/assign/driver/?location_id=${locationId}&order_id=${orderId}&driver_id=${driverId}`
    );
  }
};

import DataService from "@/services/DataService";

export default {
  fetchAll(locationId) {
    return DataService.get(
      `/api/auth/get-invoice-list/?location_id=${locationId}`
    );
  },

  fetchPrintRules(...[locationId, orderType, language]) {
    return DataService.get(
      `/api/auth/get-invoice-print-rules/?location_id=${locationId}&order_type=${orderType}&language=${language}`
    );
  }
};

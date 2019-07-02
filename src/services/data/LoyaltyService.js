/* eslint-disable no-console */
import DataService from "@/services/DataService";

export default {
  checkLoyaltyLocation(locationId) {
    return DataService.get(
      `/auth/get/loyalty/points?location_id=${locationId}`
    );
  },

  searchCustomer(searchTerm) {
    return DataService.get(`/auth/search-customers?search_query=${searchTerm}`);
  }
};

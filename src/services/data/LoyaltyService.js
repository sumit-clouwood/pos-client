/* eslint-disable no-console */
import DataService from '@/services/DataService'

export default {
  checkLoyaltyLocation(locationId) {
    return DataService.get(
      `/api/auth/get/loyalty/points?location_id=${locationId}`
    )
  },

  /*  //location_id, customer_id, redeemed_amount_value, balance, balance_due, total_balance
  applyLoyalty(loyaltyDetails) {
    return DataService.post('/api/auth/apply/loyalty', loyaltyDetails)
  },

  //customer_id, location_id
  verifyCustomerLoyaltyPoints(customerDetails) {
    return DataService.post('/api/auth/apply/loyalty', customerDetails)
  },*/

  searchCustomer(searchTerm) {
    return DataService.get(
      `/api/auth/search-customers?search_query=${searchTerm}`
    )
  },
}

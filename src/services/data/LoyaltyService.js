/* eslint-disable no-console */
// import DataService from '@/services/DataService'

export default {
  checkLoyaltyLocation(locationId) {
      alert(locationId)
    // return DataService.get(`/auth/get/loyalty/points?location_id=${locationId}`)
    return DataService.get('/model/brand_loyalty_programs' +
        '?query=&limit=100&ascending=1&page=1&byColumn=0&orderBy=name&page_id=brand_loyalty_programs_main_tbl', 'brand')
  },

  searchCustomer(searchTerm) {
    return DataService.get(`/auth/search-customers?search_query=${searchTerm}`)
  },
}
/*https://web-stg.dimspos.com/api/5d9f2254d355b82f1543bd82/model/brand_loyalty_programs
?query=&limit=100&ascending=1&page=1&byColumn=0&orderBy=name&page_id=brand_loyalty_programs_main_tbl*/
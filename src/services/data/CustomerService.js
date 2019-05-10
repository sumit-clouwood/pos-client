import DataService from '@/services/DataService'

export default {
  createCustomer(newCustomerDetails) {
    //set context to brand only
    return DataService.post('/api/auth/crm/create/Customer', newCustomerDetails)
  },

  createAddress(newAddressDetails) {
    return DataService.post(
      '/api/auth/crm/create/NewCustomerAddress',
      newAddressDetails
    )
  },
  //get the customer along with all previous orders and other required info
  fetchCustomer(customerId) {
    return DataService.get(`/model/brand_customers/id/${customerId}`, 'brand')
  },

  customerGroupList() {
    return DataService.get('/model/brand_customer_group?no_limit=true', 'brand')
  },

  //get customer addresses
  /*getCustomerDetails(...[customerIds, locationId]) {
    return DataService.get(
      `/api/auth/crm/get/CustomerList/?location_id=${locationId}&customer_id=${customerIds}`
    )
  },*/

  customerList(...[stores, query, page, orderBy, perPage]) {
    return DataService.get(
      `/model/brand_customers?page_id=brand_customers_main_tbl&query=&limit=${perPage}&ascending=0&page=${page}&query=${query}&byColumn=0&store_id=&stores=${stores}&ascending=0&byColumn=0&orderBy=${orderBy}`,
      'brand'

      // `/api/auth/pos/customerList?location_id=${locationId}&search=${search}&page_size=${perpage}&page_number=${page}&origin=${origin}&validate=${validate}&last_sync_date=${lastSyncDate}&is_compress=${isCompress}`
    )
  },

  addNote(...[customerId, cashierId, notes]) {
    return DataService.post(
      `/api/auth/crm/create/CustomerNotes?customer_id=${customerId}&cashier_id=${cashierId}&notes=${notes}`
    )
  },

  fetchGiftCards(...[customerId, locationId]) {
    return DataService.get(
      `/api/auth/crm/get/CustomerDetails/?customer_id=${customerId}&location_id=${locationId}`
    )
  },
}

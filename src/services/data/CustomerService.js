import DataService from '@/services/DataService'

export default {
  createCustomer(newCustomerDetails) {
    //set context to brand only
    return DataService.post(
      '/model/brand_customers/add',
      newCustomerDetails,
      'brand'
    )
  },

  createAddress(newAddressDetails, customer_id) {
    return DataService.post(
      `/model/customer_address/add?parent_id=${customer_id}`,
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
  fetchDeliveryAreas(query) {
    return DataService.get(
      `/model/brand_store_delivery_areas?query=${query}`,
      'brand'
    )
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

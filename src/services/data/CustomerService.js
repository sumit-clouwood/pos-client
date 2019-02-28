import DataService from '@/services/DataService'

export default {
  createCustomer() {
    return DataService.post('/api/auth/crm/create/Customer')
  },

  fetchCustomer(...[customerId, locationId]) {
    return DataService.get(
      `/api/auth/crm/get/CustomerDetails/?customer_id=${customerId}&location_id=${locationId}`
    )
  },

  customerGroupList(...[lastSyncDate, isCompress]) {
    return DataService.get(
      `/api/auth/crm/get/CustomerGroupList/?&last_sync_date=${lastSyncDate}&is_compress=${isCompress}`
    )
  },

  /*customerList(
    ...[
      locationId,
      search,
      page,
      all,
      validate,
      lastSyncDate,
      isCompress,
      perpage,
    ]
  ) {
    return DataService.get(
      `/api/auth/crm/get/CustomerList/?location_id=${locationId}&search=${search}&perpage=${perpage}&page=${page}&all=${all}&validate=${validate}&last_sync_date=${lastSyncDate}&is_compress=${isCompress}`
    )
  },*/
  customerList(
    ...[
      locationId,
      search,
      page,
      origin,
      validate,
      lastSyncDate,
      isCompress,
      perpage,
    ]
  ) {
    return DataService.get(
      `/api/auth/pos/customerList?location_id=${locationId}&search=${search}&page_size=${perpage}&page_number=${page}&origin=${origin}&validate=${validate}&last_sync_date=${lastSyncDate}&is_compress=${isCompress}`
    )
  },

  addNote(...[customerId, cashierId, notes]) {
    return DataService.post(
      `/api/auth/crm/create/CustomerNotes?customer_id=${customerId}&cashier_id=${cashierId}&notes=${notes}`
    )
  },
}

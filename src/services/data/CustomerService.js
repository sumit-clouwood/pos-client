import DataService from '@/services/DataService'

export default {
  globalCreate(data, customer_id, model) {
    let parentId = customer_id ? `?parent_id=${customer_id}` : ''
    return DataService.post(`/model/${model}/add${parentId}`, data, 'brand')
  },
  globalUpdate(id, customer_id, model, action, data) {
    let parentId = customer_id ? `?parent_id=${customer_id}` : ''
    return DataService.post(
      `/model/${model}/id/${id}/${action}${parentId}`,
      data,
      'brand'
    )
  },
  globalEdit(id, customer_id, model, action) {
    let parentId = customer_id ? `?parent_id=${customer_id}` : ''
    return DataService.get(
      `/model/${model}/id/${id}/${action}${parentId}`,
      'brand'
    )
  },
  //get the customer along with all previous orders and other required info
  fetchCustomer(customerId) {
    return DataService.get(`/model/brand_customers/id/${customerId}`, 'brand')
  },

  customerGroupList() {
    return DataService.get(
      '/model/brand_customer_groups?no_limit=true',
      'brand'
    )
  },
  fetchDeliveryAreas(query) {
    return DataService.get(
      `/model/brand_store_delivery_areas?query=${query}`,
      'brand'
    )
  },

  customerList(...[stores, query, page, orderBy, perPage]) {
    // eslint-disable-next-line no-console
    console.log(stores)
    return DataService.get(
      `/model/brand_customers?page_id=main_crm_list&query=${query}&limit=${perPage}&ascending=0&page=${page}&byColumn=0&store_id=&ascending=0&byColumn=0&orderBy=${orderBy}`,
      'brand'
    )
  },

  /*fetchGiftCards(...[customerId, locationId]) {
    return DataService.get(
      `/api/auth/crm/get/CustomerDetails/?customer_id=${customerId}&location_id=${locationId}`
    )
  },*/
}

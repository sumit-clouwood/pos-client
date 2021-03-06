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
    if (customerId !== null) {
      return DataService.get(`/model/brand_customers/id/${customerId}`, 'brand')
    }
  },

  fetchCRMFields() {
    return DataService.get(
      `/model/brand_crm_fields?limit=100&ascending=1&page=1&byColumn=0&orderBy=group&page_id=brand_crm_fields_main_tbl`,
      'brand'
    )
  },
  customerBuildings() {
    return DataService.get(
      `/model/brand_customers/get_customer_buildings`,
      'brand'
    )
  },

  customerGroupList() {
    return DataService.get(
      '/model/brand_customer_groups?no_limit=true',
      'brand'
    )
  },
  fetchDeliveryAreas(query, storeId = false) {
    /*return DataService.get(
      `/model/store_level_delivery_areas?page_id=store_level_delivery_areas_main_tbl&query=${query}&item_status=true&byColumn=1&limit=9999`
    )*/
    const apiUrl = `/model/new_style_store_delivery_areas?query=${query}&item_status=true&byColumn=1&no_limit=true`
    if (storeId) {
      return DataService.getT(`/${storeId}${apiUrl}`, 'brand')
    }
    return DataService.get(apiUrl)
  },

  customerList(...[stores, query, page, orderBy, perPage, pageId]) {
    return DataService.get(
      `/model/brand_customers?page_id=${pageId}&query=${query}&limit=${perPage}&ascending=0&page=${page}&byColumn=0&orderBy=${orderBy}&stores=${stores}`,
      'brand'
    )
  },
  creditCustomer(customerId) {
    return DataService.get(
      `/model/orders?query=&limit=100&ascending=0&page=1&byColumn=1&orderBy=real_created_datetime&page_id=store_orders&credit=true&customer=${customerId}`
    )
  },
}

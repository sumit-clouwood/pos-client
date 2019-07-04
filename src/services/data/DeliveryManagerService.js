import DataService from '@/services/DataService'

export default {
  getDMOrderDetails(
    ...[query, limit, orderBy, orderStatus, page, pageId, storeId]
  ) {
    return DataService.get(
      `/model/orders?page_id=${pageId}&query=${query}&limit=${limit}&ascending=1&page=${page}&byColumn=0&orderBy=${orderBy}&order_status=${orderStatus}&store_id=${storeId}`
    )
  },

  getUsers(roleId) {
    return DataService.get(
      `/model/users?no_limit=true&byColumn=0&brand_role=${roleId}`
    )
  },

  getGlobalDetails(model) {
    return DataService.get(`/model/${model}?no_limit=true`, 'brand')
  },

  getRoles() {
    return DataService.get('/model/brand_roles?no_limit=true')
  },
}

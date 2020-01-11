import DataService from '@/services/DataService'

export default {
  fetchAll(orderType) {
    return DataService.get(
      `/model/brand_additional_surcharges?ascending=1&orderBy=name&byColumn=1&${orderType}=true`
    )
  },
}

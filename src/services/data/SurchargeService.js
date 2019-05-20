import DataService from '@/services/DataService'

export default {
  fetchAll() {
    return DataService.get(
      `/model/brand_additional_surcharges?ascending=1&page=1&byColumn=0&orderBy=name`,
      'brand'
    )
  },
}

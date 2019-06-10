import DataService from '@/services/DataService'

export default {
  fetchAll() {
    return DataService.get(
      `/model/brand_additional_surcharges?ascending=1&orderBy=name`
    )
  },
}

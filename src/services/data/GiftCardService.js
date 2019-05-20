import DataService from '@/services/DataService'

export default {
  fetchAll() {
    return DataService.get(
      `/model/brand_gift_card_and_vouchers?ascending=1&byColumn=0&orderBy=name`,
      'brand'
    )
  },
}

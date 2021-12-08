import DataService from '@/services/DataService'

export default {
  //Get country,city,location and drivers data by location id . ?lang=ru-RU

  getReferrals() {
    return DataService.get(
      '/model/brand_referrals?page_id=brand_referrals_main_tbl&query=&limit=999&ascending=1&page=1&byColumn=0&item_status=true&orderBy=referral_name'
    )
  },
  getMeasurementUnits() {
    return DataService.get(
      '/model/brand_measurement_units?page_id=brand_measurement_units_main_tbl&query=&limit=10&ascending=1&page=1&byColumn=0&orderBy=unit',
      'brand'
    )
  },
  userDetails(userId) {
    // return DataService.get(`/model/brand_users/id/${userId}`, 'brand')
    return DataService.get(`/model/users/id/${userId}`, false)
  },
}

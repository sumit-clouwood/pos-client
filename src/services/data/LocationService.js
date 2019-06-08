import DataService from '@/services/DataService'

export default {
  //Get country,city,location and drivers data by location id . ?lang=ru-RU
  getLocationData() {
    //const language = typeof lang != 'undefined' ? '&lang=' + lang : ''
    return DataService.getT(
      '/ui_menu?translations_needed=1&menu_needed=false',
      'brand' //+ language
    )
  },
  getReferrals() {
    return DataService.get(
      '/model/brand_referrals?page_id=brand_referrals_main_tbl&query=&limit=10&ascending=1&page=1&byColumn=0&orderBy=referral_name'
    )
  },
}

import DataService from '@/services/DataService'

export default {
  //Get country,city,location and drivers data by location id . ?lang=ru-RU
  getLocationData(lang) {
    const language = typeof lang != 'undefined' ? '&lang=' + lang : ''
    return DataService.get(
      '/ui_menu?translations_needed=1&menu_needed=false' + language
    )
  },
}

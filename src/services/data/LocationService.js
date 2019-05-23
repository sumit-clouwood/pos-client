import DataService from '@/services/DataService'

export default {
  //Get country,city,location and drivers data by location id .
  getLocationData() {
    return DataService.get('/ui_menu?translations_needed=1&menu_needed=false')
  },
}

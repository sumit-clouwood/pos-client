import DataService from '@/services/DataService'

export default {
  getBrand(option) {
    return DataService.getT('/ui_menu?menu_needed=false', option)
  },
}

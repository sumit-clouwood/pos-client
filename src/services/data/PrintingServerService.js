import DataService from '@/services/DataService'

export default {
  allKitchenSectionsItems() {
    return DataService.getT(
      '/model/kitchens/get_kitchen_menu_items?item_status=true'
    )
  },
  allKitchenServers() {
    return DataService.get(
      '/model/store_print_servers?page_id=store_print_servers_main_tbl&byColumn=1&query=&limit=99999999&page=1'
    )
  },
}

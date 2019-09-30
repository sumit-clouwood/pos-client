import DataService from '@/services/DataService'

export default {
  categories() {
    return DataService.getT(
      '/model/brand_item_categories?ascending=1&byColumn=1&orderBy=priority&no_limit=true&shown_pos=true&item_status=true'
    )
  },
  subcategories() {
    return DataService.getT(
      '/model/brand_item_sub_categories?ascending=1&byColumn=0&orderBy=priority&no_limit=true&shown_pos=true&item_status=true'
    )
  },
  items() {
    return DataService.getT(
      '/model/brand_menu_items?ascending=1&byColumn=0&orderBy=priority&no_limit=true&shown_pos=true&item_status=true'
    )
  },
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

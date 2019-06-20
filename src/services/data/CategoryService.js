import DataService from '@/services/DataService'

export default {
  categories() {
    return DataService.getT(
      '/model/brand_item_categories?ascending=1&byColumn=1&orderBy=name&no_limit=true&shown_pos=true&item_status=true'
    )
  },
  subcategories() {
    return DataService.getT(
      '/model/brand_item_sub_categories?ascending=1&byColumn=0&orderBy=name&no_limit=true&shown_pos=true&item_status=true'
    )
  },
  items() {
    return DataService.getT(
      '/model/brand_menu_items?ascending=1&byColumn=0&orderBy=name&no_limit=true&shown_pos=true&item_status=true'
    )
  },
}

import DataService from '@/services/DataService'

export default {
  categories() {
    return DataService.get(
      '/model/brand_item_categories?ascending=1&byColumn=0&orderBy=name&no_limit=true'
    )
  },
  subcategories() {
    return DataService.get(
      '/model/brand_item_sub_categories?ascending=1&byColumn=0&orderBy=name&no_limit=true'
    )
  },
  items() {
    return DataService.get(
      '/model/brand_menu_items?ascending=1&byColumn=0&orderBy=name&no_limit=true'
    )
  },
}

import DataService from '@/services/DataService'

export default {
  categories() {
    return DataService.get(
      `/model/item_category?ascending=1&byColumn=0&orderBy=name&no_limit=true`
    )
  },
  subcategories() {
    return DataService.get(
      `/model/item_sub_category?ascending=1&byColumn=0&orderBy=name&no_limit=true`
    )
  },
  items() {
    return DataService.get(
      `/model/menu_items?ascending=1&byColumn=0&orderBy=name&no_limit=true`
    )
  },
}

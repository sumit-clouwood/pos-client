import DataService from '@/services/DataService'

export default {
  modifiers() {
    return DataService.get(
      `/model/brand_item_modifiers?ascending=1&byColumn=0&orderBy=priority&no_limit=true`
    )
  },
  groups() {
    return DataService.get(
      `/model/brand_item_modifiers_group?no_limit=true&ascending=1&byColumn=0&orderBy=priority&shown_pos=true&item_status=true`
    )
  },
  subgroups() {
    return DataService.get(
      `/model/brand_item_modifiers_sub_group?no_limit=true&ascending=1&byColumn=0&orderBy=priority&shown_pos=true&item_status=true`
    )
  },
  foodIcons() {
    return DataService.get(`/model/brand_food_icons?no_limit=true`, 'brand')
  },
}

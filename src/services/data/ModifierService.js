import DataService from '@/services/DataService'

export default {
  modifiers() {
    return DataService.get(
      `/model/brand_item_modifiers?ascending=1&byColumn=0&orderBy=name&no_limit=true`
    )
  },
  groups() {
    return DataService.get(
      `/model/brand_item_modifiers_group?no_limit=true&ascending=1&byColumn=0&orderBy=name`
    )
  },
  subgroups() {
    return DataService.get(
      `/model/brand_item_modifiers_sub_group?no_limit=true&ascending=1&byColumn=0&orderBy=modifier_sub_group`
    )
  },
}

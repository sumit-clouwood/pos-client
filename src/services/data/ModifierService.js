import DataService from '@/services/DataService'

export default {
  modifiers(storeId = null) {
    const apiUrl = `/model/brand_item_modifiers?ascending=1&byColumn=1&orderBy=priority&no_limit=true&shown_pos=true`
    if (storeId) {
      return DataService.getT(`/${storeId}${apiUrl}`, 'brand')
    }
    return DataService.get(apiUrl)
  },
  groups(storeId = null) {
    const apiUrl = `/model/brand_item_modifiers_group?no_limit=true&ascending=1&byColumn=0&orderBy=priority&shown_pos=true&item_status=true`
    if (storeId) {
      return DataService.getT(`/${storeId}${apiUrl}`, 'brand')
    }
    return DataService.get(apiUrl)
  },
  subgroups(storeId = null) {
    const apiUrl = `/model/brand_item_modifiers_sub_group?no_limit=true&ascending=1&byColumn=0&orderBy=priority&shown_pos=true&item_status=true`
    if (storeId) {
      return DataService.getT(`/${storeId}${apiUrl}`, 'brand')
    }
    return DataService.get(apiUrl)
  },
  // foodIcons() {
  //   return DataService.get(`/model/brand_food_icons?no_limit=true`, 'brand')
  // },
}

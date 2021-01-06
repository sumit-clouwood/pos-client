import DataService from '@/services/DataService'

export default {
  categories(storeId) {
    const apiUrl = `/model/brand_item_categories?ascending=1&byColumn=1&orderBy=priority&no_limit=true&shown_pos=true&item_status=true`
    if (storeId) {
      return DataService.getT(`/${storeId}${apiUrl}`, 'brand')
    }
    return DataService.getT(apiUrl)
  },
  subcategories(storeId) {
    const apiUrl = `/model/brand_item_sub_categories?ascending=1&byColumn=0&orderBy=priority&no_limit=true&shown_pos=true&item_status=true`
    if (storeId) {
      return DataService.getT(`/${storeId}${apiUrl}`, 'brand')
    }
    return DataService.getT(apiUrl)
  },
  items(storeId) {
    const apiUrl = `/model/brand_menu_items?ascending=1&byColumn=0&orderBy=priority&no_limit=true&shown_pos=true&item_status=true`
    if (storeId) {
      return DataService.getT(`/${storeId}${apiUrl}`, 'brand')
    }
    return DataService.getT(apiUrl)
  },
  loadMeasurementUnits(storeId) {
    const apiUrl = '/model/brand_scale_units?no_limit=true'
    if (storeId) {
      return DataService.getT(`/${storeId}${apiUrl}`, 'brand')
    }
    return DataService.getT(apiUrl)
  },
}

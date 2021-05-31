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
  loadItemsPreparingTime() {
    const apiUrl = `/model/brand_kitchen_item_settings?query=&limit=100&ascending=1&page=1&byColumn=0&orderBy=created_at&page_id=brand_kds_item_settings&no_limit=true`
    return DataService.getT(apiUrl, 'brand')
  },
  loadMeasurementUnits(storeId) {
    const apiUrl = '/model/brand_scale_units?no_limit=true'
    if (storeId) {
      return DataService.getT(`/${storeId}${apiUrl}`, 'brand')
    }
    return DataService.getT(apiUrl)
  },
}

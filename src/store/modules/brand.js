/* eslint-disable no-console */
import BrandService from '@/services/data/BrandService'

// initial state
const getDefaults = () => ({
  brandData: undefined,
  availableStores: undefined,
})

const state = getDefaults()

// actions
const actions = {
  async getBrandData({ commit, rootGetters }, forceReload = false) {
    if (
      !forceReload &&
      state.brandData &&
      state.brandData.data.store &&
      rootGetters['context/store_id'] === state.brandData.data.store._id
    ) {
      //api versions already set for this store so need to set again
      return Promise.resolve(state.brandData)
    }
    const brandData = await BrandService.getBrand()
    commit('SET_BRAND_DATA', brandData)
    //SET EXPLICILITY BECAUSE WE MUTATE AVAILABLE STORES FROM 3 PLACE, 1. LOGIN, 2. PIN LOGIN, 3. UI_MENU
    // SO WE CAN USE THIS MUTATOR TO MUTATE FROM ANY OF ABOVE 3
    //set available stores only if not already set from user, i.e used refresh screen
    if (state.availableStores === undefined) {
      commit('SET_AVAILABLE_STORES', brandData.data.available_stores)
    }
    return brandData
  },
  async loadBrand({ dispatch }) {
    const brandData = await dispatch('getBrandData')
    return brandData
  },
}
// getters
const getters = {
  brandData: state => (state.brandData ? state.brandData.data : {}),
  availableModules: (state, getters) => getters.brandData.available_modules,
  enabledModules: (state, getters) => getters.brandData.enabled_modules,
  availableStores: state => {
    return state.availableStores || []
  },
  hasMultiStores: (state, getters) => getters.availableStores.length > 1,
  multiStores: (state, getters, rootState, rootGetters) => {
    if (rootGetters['context/currentStoreGroupId']) {
      return getters.getStoresByGroupID(
        rootGetters['context/currentStoreGroupId']
      )
    }
    return getters.hasMultiStores ? getters.availableStores : []
  },
  brand: (state, getters) => getters.brandData.brand,
  availableStoreGroups: (state, getters) =>
    getters.brandData.available_store_groups,
  store: (state, getters) => {
    if (getters.brandData.store) {
      return getters.brandData.store
    } else if (getters.brandData.available_stores) {
      return getters.brandData.available_stores[0]
    }
  },
  location: (state, getters) => (getters.store ? getters.store.address : ''),
  currency: (state, getters) => (getters.store ? getters.store.currency : ''),
  permissions: (state, getters) => getters.brandData.menu,
  langDirection: (state, getters) => getters.brandData.direction,
  translations: (state, getters) => getters.brandData.translations,
  languages: (state, getters) => getters.brandData.available_lang,
  mulitstoreIds: (state, getters) =>
    getters.multiStores.map(store => store._id),
  getStoresByGroupID: (state, getters) => groupId => {
    let selectedGroup = getters.availableStoreGroups.find(
      group => group._id == groupId
    )
    let groupStores = []
    if (selectedGroup && selectedGroup.group_stores) {
      getters.multiStores.forEach(store => {
        if (selectedGroup.group_stores.includes(store._id)) {
          groupStores.push(store)
        }
      })
    }
    return groupStores
  },
  startingTokenNumber: (state, getters) => getters.store.token_starting_number,
  storeOpeningHours: (state, getters) => getters.store.open_hours,
  bgImage: (state, getters) =>
    getters.brand ? getters.brand.brand_background : '',
  permitted: (state, getters) => (pageId, parentId) => {
    typeof parentId == 'undefined' ? null : parentId
    if (getters.permissions) {
      let routeMenus = getters.permissions.filter(
        permission =>
          permission.meta.parent_id == parentId && permission.page_id == pageId
      )
      let getChildren = routeMenus
      if (routeMenus.length) {
        if (routeMenus[0].type == 'BlockMenuPage') {
          getChildren = getters.permissions.filter(
            permission => permission.meta.parent_id == routeMenus[0].page_id
          )
        }
      }
      return getChildren.length
    }
    return false
  },
}

// mutations
const mutations = {
  SET_BRAND_DATA: (state, data) => (state.brandData = data),
  SET_AVAILABLE_STORES: (state, data) => {
    state.availableStores = data
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

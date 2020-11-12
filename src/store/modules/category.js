/*eslint-disable no-console*/
import CategoryService from '@/services/data/CategoryService'
import * as mutation from './category/mutation-types'
import * as CONSTANTS from '@/constants'
// initial state
const state = {
  categoryImagePath: '',
  subcategoryImagePath: '',
  itemImagePath: '',
  category: {},
  categories: [],
  subcategories: [],
  items: [],
  multistoreCategories: {},
  multistoreSubcategories: {},
  multistoreItems: {},
  subcategory: null,
  categoryItems: [],
  subcategoryItems: [],
  item: null,
  taxData: [],
  taxAmount: {},
  Items: {},
  searchTerm: '',
  barcode: false,
  upSelling: [],
  isUpSellingModify: false,
  upSellingParentItem: false,
}

// getters, computed properties
const getters = {
  categories: (state, getters, rootState, rootGetters) => {
    let categories = state.categories
    if (rootGetters['auth/multistore']) {
      categories = state.multistoreCategories[rootState.context.storeId]
    }
    return categories || []
  },
  subcategories: (state, getters, rootState, rootGetters) => {
    if (typeof state.category !== 'undefined') {
      let subcategories = state.subcategories
      if (rootGetters['auth/multistore']) {
        subcategories = state.multistoreSubcategories[rootState.context.storeId]
      }
      if (subcategories) {
        return subcategories.filter(
          subcategory =>
            subcategory[CONSTANTS.REFERENCE_FIELD_SUBCATEGORY_TO_CATEGORY] ===
            state.category[CONSTANTS.REFERENCE_FIELD_CATEGORY_TO_SUBCATEGORY]
        )
      }
    }
    return []
  },
  categoryItems: (state, getters, rootState, rootGetters) => {
    let items = state.items
    if (rootGetters['auth/multistore']) {
      items = state.multistoreItems[rootState.context.storeId]
    }

    if (items && items.length) {
      let category = state.category || state.categories[0]

      return items.filter(
        item =>
          item[CONSTANTS.REFERENCE_FIELD_ITEM_TO_CATEGORY] ===
            category[CONSTANTS.REFERENCE_FIELD_CATEGORY_TO_ITEM] &&
          !item[CONSTANTS.REFERENCE_FIELD_ITEM_TO_SUBCATEGORY]
      )
    }
  },
  subcategoryItems: (state, getters, rootState, rootGetters) => {
    if (!state.subcategory) return []
    let items = state.items
    if (rootGetters['auth/multistore']) {
      items = state.multistoreItems[rootState.context.storeId]
    }
    return (
      items &&
      items.filter(
        item =>
          item[CONSTANTS.REFERENCE_FIELD_ITEM_TO_CATEGORY] ===
            state.category[CONSTANTS.REFERENCE_FIELD_CATEGORY_TO_ITEM] &&
          item[CONSTANTS.REFERENCE_FIELD_ITEM_TO_SUBCATEGORY] ===
            state.subcategory[CONSTANTS.REFERENCE_FIELD_SUBCATEGORY_TO_ITEM]
      )
    )
  },
  items: (state, getters) => {
    if (state.searchTerm) {
      const searchKey = state.searchTerm.toLowerCase()
      return getters.rawItems.filter(
        item =>
          (item.barcode && item.barcode.toLowerCase().match(searchKey)) ||
          (item.item_code && item.item_code.toLowerCase().match(searchKey)) ||
          (item.name && item.name.toLowerCase().match(searchKey))
      )
    }
    let items = []
    const categoryItems = getters.categoryItems
    const subcategoryItems = getters.subcategoryItems
    if (categoryItems && categoryItems.length) {
      items = categoryItems
    }
    if (subcategoryItems && subcategoryItems.length) {
      items = categoryItems.concat(subcategoryItems)
    }

    return items
  },
  itemByCode: (state, getters) => itemCode => {
    return getters.rawItems.find(item => item.barcode === itemCode)
  },
  itemById: (state, getters) => itemId => {
    return getters.rawItems.find(item => item._id === itemId)
  },
  findItem: (state, getters) => (itemToFind, key, map) => {
    return getters.rawItems.find(item => item[map] === itemToFind[key])
  },
  rawItems: (state, getters, rootState, rootGetters) => {
    if (rootGetters['auth/multistore']) {
      return state.multistoreItems[rootState.context.storeId]
    }
    return state.items
  },
  getImages: (state, getters) => {
    //for caching
    let images = []

    getters.categories.forEach(category => {
      images.push(category.category_image)
    })
    getters.subcategories.forEach(subcat => {
      images.push(subcat.sub_category_image)
    })

    getters.items.forEach(item => {
      images.push(item.image)
    })
    return images
  },
}

// actions, often async
const actions = {
  fetchAll(
    { commit, dispatch, getters, rootState, rootGetters },
    storeId = null
  ) {
    return new Promise((resolve, reject) => {
      CategoryService.categories(storeId)
        .then(response => {
          commit(mutation.SET_CATEGORIES, {
            categories: response.data.data,
            multistore: storeId
              ? storeId
              : rootGetters['auth/multistore']
              ? rootState.context.storeId
              : false,
          })
          //continue loading other stuff
          CategoryService.subcategories(storeId).then(response => {
            commit(mutation.SET_SUBCATEGORIES, {
              subcategories: response.data.data,
              multistore: storeId
                ? storeId
                : rootGetters['auth/multistore']
                ? rootState.context.storeId
                : false,
            })
            CategoryService.items(storeId).then(response => {
              let items = response.data.data
              //for multistore items we need to set store_id with item
              if (rootGetters['auth/multistore']) {
                items = items.map(item => {
                  item.store_id = storeId ? storeId : rootState.context.storeId
                  return item
                })
              }
              commit(mutation.SET_ITEMS, {
                items: items,
                multistore: storeId
                  ? storeId
                  : rootGetters['auth/multistore']
                  ? rootState.context.storeId
                  : false,
              })

              if (!rootState.sync.reloaded && !storeId) {
                const categories = getters.categories
                dispatch('browse', categories[0])
              }
              resolve()
            })
          })
          //Fetch all kitchens & Printing Servers on POS and save into states.
          dispatch('printingServer/fetchAllKitchens', {}, { root: true })
        })
        .catch(error => reject(error))
    })
  },

  fetchMultistore({ rootState, dispatch }, stores) {
    //don't repeat in case storeId is provided otherwise it ll just loop in
    //load discounts for all stores both item and order
    stores.forEach(storeId => {
      //skip current store
      if (storeId !== rootState.context.storeId) {
        dispatch('fetchAll', storeId)
      }
    })
  },

  //get subcategories and items based on main category
  browse({ commit, getters, dispatch }, category) {
    commit('updateSearchTerm', '')
    let subcategory = []
    commit(mutation.SET_CATEGORY, category)
    if (typeof getters.subcategories != 'undefined') {
      subcategory = getters.subcategories[0]
    }

    if (subcategory) {
      dispatch('subCategoryHendlerChange', null, { root: true })
    } else {
      dispatch('foodMenuHendlerChange', null, { root: true })
    }

    commit(mutation.SET_SUBCATEGORY, subcategory)
    //reload the ui
  },
  getItems({ commit }, subcategory) {
    commit('updateSearchTerm', '')
    commit(mutation.SET_SUBCATEGORY, subcategory)
  },
}
// mutations
//state should be only changed through mutation and these are synchronous
const mutations = {
  //using constant as function name
  [mutation.SET_CATEGORIES](state, { categories, multistore }) {
    if (multistore) {
      state.multistoreCategories = {
        ...state.multistoreCategories,
        [multistore]: categories,
      }
    } else {
      state.categories = categories
    }
  },

  [mutation.SET_CATEGORY](state, category) {
    state.category = category
    state.subcategory = null
  },

  [mutation.SET_SUBCATEGORIES](state, { subcategories, multistore }) {
    if (multistore) {
      state.multistoreSubcategories = {
        ...state.multistoreSubcategories,
        [multistore]: subcategories,
      }
    } else {
      state.subcategories = subcategories
    }
  },

  [mutation.SET_SUBCATEGORY](state, subcategory) {
    state.subcategory = subcategory
    state.item = null
  },

  [mutation.SET_ITEMS](state, { items, multistore }) {
    if (multistore) {
      state.multistoreItems = {
        ...state.multistoreItems,
        [multistore]: items,
      }
    } else {
      state.items = items
    }
    let upSelling = {}
    state.upSelling = []
    items.forEach(item => {
      if (item.is_upselling) {
        upSelling = {
          item: item,
          isUpSellilng: true,
          categories: item.upselling_categories,
        }
        state.upSelling.push(upSelling)
      }
      return []
    })
  },

  [mutation.SET_ITEM](state, item) {
    state.item = item
  },
  updateSearchTerm(state, term) {
    state.searchTerm = term
  },
  [mutation.IS_UP_SELLING_MODIFY](state, status) {
    state.isUpSellingModify = status
  },
  [mutation.UP_SELLING_PARENT_ITEM](state, item) {
    state.upSellingParentItem = item
  },
  [mutation.RESET](state) {
    state.categoryImagePath = ''
    state.subcategoryImagePath = ''
    state.searchTerm = ''
    state.itemImagePath = ''
    state.categories = []
    state.category = {}
    state.subcategories = []
    state.subcategory = null
    state.categoryItems = []
    state.subcategoryItems = []
    state.item = null
    state.items = []
    state.taxData = []
    state.taxAmount = {}
  },

  setBarcode(state, code) {
    state.barcode = code
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

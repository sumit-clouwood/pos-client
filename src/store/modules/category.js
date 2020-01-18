/*eslint-disable no-console*/
import CategoryService from '@/services/data/CategoryService'
import * as mutation from './category/mutation-types'
import * as CONSTANTS from '@/constants'
// initial state
const state = {
  categoryImagePath: '',
  subcategoryImagePath: '',
  searchItemTerm: '',
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
  searchItems: {},
  barcode: false,
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
  },
  categoryItems: (state, getters, rootState, rootGetters) => {
    let items = state.items
    if (rootGetters['auth/multistore']) {
      items = state.multistoreItems[rootState.context.storeId]
    }

    if (items) {
      return items.filter(
        item =>
          item[CONSTANTS.REFERENCE_FIELD_ITEM_TO_CATEGORY] ===
            state.category[CONSTANTS.REFERENCE_FIELD_CATEGORY_TO_ITEM] &&
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
    let items = []
    const categoryItems = getters.categoryItems
    const subcategoryItems = getters.subcategoryItems
    if (state.searchItemTerm) {
      items = state.searchItems
    } else {
      if (categoryItems.length) {
        items = categoryItems
      }
      if (subcategoryItems.length) {
        items = categoryItems.concat(subcategoryItems)
      }
    }
    return items
  },
  itemByCode: (state, getters) => itemCode => {
    return getters.items.find(
      item => item.item_code === itemCode || item.barcode === itemCode
    )
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
                  item.store_id = rootState.context.storeId
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
  collectSearchItems({ commit, state }, searchTerm) {
    let searchedItems = []
    state.searchItemTerm = ''
    if (searchTerm.length > 0) {
      state.searchItemTerm = searchTerm
      state.items.map(item => {
        if (item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) != -1) {
          searchedItems.push(item)
        }
      })
    }
    commit(mutation.SET_SEARCH_ITEMS, { items: searchedItems })
  },

  //get subcategories and items based on main category
  browse({ commit, getters, dispatch }, category) {
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
  },

  [mutation.SET_ITEM](state, item) {
    state.item = item
  },
  [mutation.RESET](state) {
    state.categoryImagePath = ''
    state.subcategoryImagePath = ''
    state.searchItemTerm = ''
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
    state.searchItems = {}
  },
  [mutation.SET_SEARCH_ITEMS](state, items) {
    if (items.items.length > 0) {
      state.searchItems = items.items
    } else {
      state.searchItems = {}
      state.item = null
    }
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

/*eslint-disable no-console*/
import CategoryService from '@/services/data/CategoryService'
import * as mutation from './category/mutation-types'
import * as CONSTANTS from '@/constants'
// initial state
const state = {
  categoryImagePath: '',
  subcategoryImagePath: '',
  itemImagePath: '',
  categories: [],
  category: {},
  subcategories: [],
  subcategory: null,
  categoryItems: [],
  subcategoryItems: [],
  item: null,
  items: [],
  taxData: [],
  taxAmount: {},
  searchItems: {},
}

// getters, computed properties
const getters = {
  categories: state => {
    return state.categories
  },
  subcategories: state => {
    if (typeof state.category != 'undefined') {
      return state.subcategories.filter(
        subcategory =>
          subcategory[CONSTANTS.REFERENCE_FIELD_SUBCATEGORY_TO_CATEGORY] ===
          state.category[CONSTANTS.REFERENCE_FIELD_CATEGORY_TO_SUBCATEGORY]
      )
    }
  },
  categoryItems: state => {
    return state.items.filter(
      item =>
        item[CONSTANTS.REFERENCE_FIELD_ITEM_TO_CATEGORY] ===
          state.category[CONSTANTS.REFERENCE_FIELD_CATEGORY_TO_ITEM] &&
        !item[CONSTANTS.REFERENCE_FIELD_ITEM_TO_SUBCATEGORY]
    )
  },
  subcategoryItems: state => {
    if (!state.subcategory) return []
    //Reset all search results if any category items are fetched
    state.searchItems = ''

    return state.items.filter(
      item =>
        item[CONSTANTS.REFERENCE_FIELD_ITEM_TO_CATEGORY] ===
          state.category[CONSTANTS.REFERENCE_FIELD_CATEGORY_TO_ITEM] &&
        item[CONSTANTS.REFERENCE_FIELD_ITEM_TO_SUBCATEGORY] ===
          state.subcategory[CONSTANTS.REFERENCE_FIELD_SUBCATEGORY_TO_ITEM]
    )
  },
  items: (state, getters) => {
    let items = []
    const categoryItems = getters.categoryItems
    const subcategoryItems = getters.subcategoryItems

    if (state.searchItems.length) {
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

  getImages() {
    //for caching
    let images = []

    state.categories.forEach(category => {
      images.push(category.category_image)
    })
    state.subcategories.forEach(subcat => {
      images.push(subcat.sub_category_image)
    })

    state.items.forEach(item => {
      images.push(item.image)
    })
    return images
  },
}

// actions, often async
const actions = {
  fetchAll({ commit, dispatch, rootState }) {
    return new Promise((resolve, reject) => {
      CategoryService.categories()
        .then(response => {
          commit(mutation.SET_CATEGORIES, response.data.data)
          //continue loading other stuff
          CategoryService.subcategories().then(response => {
            commit(mutation.SET_SUBCATEGORIES, response.data.data)
            CategoryService.items().then(response => {
              commit(mutation.SET_ITEMS, response.data.data)
              if (!rootState.sync.reloaded) {
                dispatch('browse', state.categories[0])
              }
              resolve()
            })
          })
        })
        .catch(error => reject(error))
    })
  },

  collectSearchItems({ commit, state }, searchTerm) {
    let searchedItems = []
    if (searchTerm.length > 0) {
      state.items.map(item => {
        if (item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) != -1) {
          searchedItems.push(item)
        }
      })
    }
    commit(mutation.SET_SEARCH_ITEMS, { items: searchedItems })
  },

  //get subcategories and items based on main category
  browse({ commit, getters }, category) {
    let subcategory = []
    commit(mutation.SET_CATEGORY, category)
    if (typeof getters.subcategories != 'undefined') {
      subcategory = getters.subcategories[0]
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
  [mutation.SET_CATEGORIES](state, categories) {
    state.categories = categories
  },

  [mutation.SET_CATEGORY](state, category) {
    state.category = category
    state.subcategory = null
  },

  [mutation.SET_SUBCATEGORIES](state, subcategories) {
    state.subcategories = subcategories
  },

  [mutation.SET_SUBCATEGORY](state, subcategory) {
    state.subcategory = subcategory
    state.item = null
  },

  [mutation.SET_ITEMS](state, items) {
    state.items = items
  },

  [mutation.SET_ITEM](state, item) {
    state.item = item
  },
  [mutation.SET_SEARCH_ITEMS](state, items) {
    if (items.items.length > 0) {
      state.searchItems = items.items
    } else {
      state.searchItems = {}
      state.item = null
    }
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

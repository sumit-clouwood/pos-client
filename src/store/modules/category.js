/*eslint-disable no-console*/
import CategoryService from '@/services/data/CategoryService'
import * as mutation from './category/mutation-types'
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
    return state.subcategories.filter(
      subcategory => subcategory.category === state.category.name
    )
  },
  categoryItems: state => {
    return state.items.filter(
      item => item.category === state.category.name && !item.sub_category
    )
  },
  subcategoryItems: state => {
    return state.items.filter(
      item =>
        item.category === state.category.name &&
        item.sub_category === state.subcategory.name
    )
  },
  items: (state, getters) => {
    let items = []
    const categoryItems = getters.categoryItems
    const subcategoryItems = getters.subcategoryItems

    if (state.searchItems.length) {
      items = state.searchItems
    } else if (categoryItems.length) {
      items = categoryItems
    } else if (subcategoryItems.length) {
      items = subcategoryItems
    }
    return items
  },

  getImages() {
    //for caching
    //document.getElementsByTagName('a')[0].__vue__.$store.state
    let images = []

    state.categories.forEach(category => {
      images.push(category.category_image)
    })
    state.subcategories.forEach(subcat => {
      images.push(subcat.sub_category_image)
    })
    return images
  },
}

// actions, often async
const actions = {
  fetchAll({ commit }) {
    return new Promise((resolve, reject) => {
      CategoryService.categories()
        .then(response => {
          commit(mutation.SET_CATEGORIES, response.data.data)
          commit(mutation.SET_CATEGORY, state.categories[0])
          //continue loading other stuff
          CategoryService.subcategories().then(response => {
            commit(mutation.SET_SUBCATEGORIES, response.data.data)
            commit(mutation.SET_SUBCATEGORY, state.subcategories[0])
            CategoryService.items().then(response => {
              commit(mutation.SET_ITEMS, response.data.data)
              resolve()
            })
          })
        })
        .catch(error => reject(error))
    })
  },

  //get subcategories and items based on main category
  browse({ commit, getters }, category) {
    commit(mutation.SET_CATEGORY, category)
    commit(mutation.SET_SUBCATEGORY, getters.subcategories[0])
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
  },

  [mutation.SET_SUBCATEGORIES](state, subcategories) {
    state.subcategories = subcategories
  },

  [mutation.SET_SUBCATEGORY](state, subcategory) {
    state.subcategory = subcategory
  },

  [mutation.SET_ITEMS](state, items) {
    state.items = items
  },

  [mutation.SET_ITEM](state, item) {
    state.item = item
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

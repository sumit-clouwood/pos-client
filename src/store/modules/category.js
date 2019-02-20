import CategoryService from '@/services/data/CategoryService'
import * as mutation from './category/mutation-types'

// initial state
const state = {
  categoryImagePath: '',
  subcategoryImagePath: '',
  itemImagePath: '',

  all: [],
  category: {},
  subcategories: [],
  subcategory: {},
  categoryItems: [],
  subcategoryItems: [],
  item: {},
}

// getters, computed properties
const getters = {
  categoryImage: state => imageSrc => state.categoryImagePath + imageSrc,
  subcategoryImage: state => imageSrc => state.subcategoryImagePath + imageSrc,
  itemImage: state => imageSrc => state.itemImagePath + imageSrc,

  items: state =>
    state.categoryItems.length ? state.categoryItems : state.subcategoryItems,
}

// actions, often async
const actions = {
  async fetchAll({ commit, rootState }) {
    const params = [
      rootState.location.location,
      rootState.sync.date,
      rootState.sync.compress,
    ]
    CategoryService.fetchAll(...params).then(response => {
      commit(
        mutation.SET_CATEGORY_IMG_PATH,
        response.data.data.itemCategoryImagePath
      )
      commit(
        mutation.SET_SUBCATEGORY_IMG_PATH,
        response.data.data.itemSubcategoryImagePath
      )
      commit(mutation.SET_ITEM_IMG_PATH, response.data.data.itemImagePath)

      commit(mutation.SET_CATEGORIES, response.data.data.menu_data)
      if (state.all) {
        commit(mutation.SET_CATEGORY, state.all[0])
        commit(mutation.SET_SUBCATEGORIES, state.category.get_sub_category)
        commit(mutation.SET_SUBCATEGORY, state.subcategories[0])
        commit(mutation.SET_CATEGORY_ITEMS, state.category.get_category_product)
        if (state.subcategory) {
          commit(
            mutation.SET_SUBCATEGORY_ITEMS,
            state.subcategory.get_sub_category_product
          )
        }
      }
    })
  },

  //get subcategories and items based on main category
  browse({ commit, state }, item) {
    commit(mutation.SET_CATEGORY, item)

    const subcategories = state.all.find(
      category => category._id == state.category._id
    ).get_sub_category

    commit(mutation.SET_SUBCATEGORIES, subcategories)
    commit(mutation.SET_SUBCATEGORY, state.subcategories[0])
    commit(mutation.SET_CATEGORY_ITEMS, state.category.get_category_product)
    if (state.subcategory) {
      commit(
        mutation.SET_SUBCATEGORY_ITEMS,
        state.subcategory.get_sub_category_product
      )
    }
  },
  //get items on subcategory click
  getItems({ commit, state }, item) {
    const subcategory = state.subcategories.find(
      category => category._id == item._id
    )
    commit(mutation.SET_SUBCATEGORY, subcategory)
    commit(
      mutation.SET_SUBCATEGORY_ITEMS,
      state.subcategory.get_sub_category_product
    )
  },
}

// mutations
//state should be only changed through mutation and these are synchronous
const mutations = {
  //using constant as function name
  [mutation.SET_CATEGORIES](state, categories) {
    state.all = categories
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

  [mutation.SET_CATEGORY_ITEMS](state, items) {
    state.categoryItems = items
  },

  [mutation.SET_SUBCATEGORY_ITEMS](state, items) {
    state.subcategoryItems = items
  },

  [mutation.SET_CATEGORY_IMG_PATH](state, path) {
    state.categoryImagePath = path
  },

  [mutation.SET_SUBCATEGORY_IMG_PATH](state, path) {
    state.subcategoryImagePath = path
  },

  [mutation.SET_ITEM_IMG_PATH](state, path) {
    state.itemImagePath = path
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

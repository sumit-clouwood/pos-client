import CategoryService from '@/services/data/CategoryService'
import {SET_CATEGORIES, SET_SUBCATEGORIES, SET_SUBCATEGORY, SET_CATEGORY, SET_ITEM_IMG_PATH, 
  SET_CATEGORY_IMG_PATH, SET_SUBCATEGORY_IMG_PATH, SET_CATEGORY_ITEMS, SET_SUBCATEGORY_ITEMS} from './category/mutation-types'

// initial state
const state = {
  categoryImagePath : '',
  subcategoryImagePath : '',
  itemImagePath : '',
  
  all : [],
  category : {},
  subcategories : [],
  subcategory : {},
  categoryItems : [],
  subcategoryItems : []
}

// getters, computed properties 
const getters = {
  categoryImage : (state) => (imageSrc) => (state.categoryImagePath + imageSrc),
  subcategoryImage : (state) => (imageSrc) => (state.subcategoryImagePath + imageSrc),
  itemImage : (state) => (imageSrc) => (state.itemImagePath + imageSrc),

  items : (state) => state.categoryItems.length ? state.categoryItems : state.subcategoryItems
}

// actions, often async
const actions = {
  
  async fetchAll( {commit, rootState} ) {
    const params = [rootState.location.location, rootState.sync.date, rootState.sync.compress]
    CategoryService.fetchAll(...params).then(response => {

      commit(SET_CATEGORY_IMG_PATH, response.data.data.itemCategoryImagePath )
      commit(SET_SUBCATEGORY_IMG_PATH, response.data.data.itemSubcategoryImagePath )
      commit(SET_ITEM_IMG_PATH, response.data.data.itemImagePath )
      
      commit(SET_CATEGORIES, response.data.data.menu_data )
      commit(SET_CATEGORY, state.all[0])
      commit(SET_SUBCATEGORIES, state.category.get_sub_category )
      commit(SET_SUBCATEGORY, state.subcategories[0])
      commit(SET_CATEGORY_ITEMS, state.category.get_category_product) 
      if (state.subcategory) {
        commit(SET_SUBCATEGORY_ITEMS, state.subcategory.get_sub_category_product )
      }
    })
  },

  //get subcategories and items based on main category
  browse({ commit, state }, item) {
    const subcategories = state.all.find(category => category._id == item._id).get_sub_category;
    commit(SET_SUBCATEGORIES, subcategories);
    commit(SET_SUBCATEGORY, state.subcategories[0])
    commit(SET_CATEGORY_ITEMS, state.category.get_category_product) 
    if (state.subcategory) {
      commit(SET_SUBCATEGORY_ITEMS, state.subcategory.get_sub_category_product )
    }
  },
  //get items on subcategory click
  getItems({ commit, state }, item) {
    const subcategory = state.subcategories.find(category => category._id == item._id);
    commit(SET_SUBCATEGORY, subcategory)
    commit(SET_SUBCATEGORY_ITEMS, state.subcategory.get_sub_category_product )  
  }

}

// mutations
//state should be only changed through mutation and these are synchronous
const mutations = {

  //using constant as function name
  [SET_CATEGORIES] (state, categories) {
    state.all = categories
  },

  [SET_CATEGORY] (state, category) {
    state.category = category
  },

  [SET_SUBCATEGORIES] (state, subcategories) {
    state.subcategories = subcategories
  },
  
  [SET_SUBCATEGORY] (state, subcategory) {
    state.subcategory = subcategory
  },

  [SET_CATEGORY_ITEMS] (state, items ) {
    state.categoryItems = items
  },

  [SET_SUBCATEGORY_ITEMS] (state, items ) {
    state.subcategoryItems = items
  },

  [SET_CATEGORY_IMG_PATH] (state,  path ) {
    state.categoryImagePath = path
  },

  [SET_SUBCATEGORY_IMG_PATH] (state,  path ) {
    state.subcategoryImagePath = path
  },

  [SET_ITEM_IMG_PATH] (state,  path ) {
    state.itemImagePath = path
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
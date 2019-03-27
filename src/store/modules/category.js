/*eslint-disable no-console*/
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
  categoryImage: state => imageSrc => state.categoryImagePath + imageSrc,
  subcategoryImage: state => imageSrc => state.subcategoryImagePath + imageSrc,
  itemImage: state => imageSrc => state.itemImagePath + imageSrc,

  menu: (state, getters, rootState) => {
    const appLocale = rootState.location.locale
    return state.all.map(category => {
      let newCategory = { ...category }
      newCategory.name = newCategory.cat_name.find(
        locale => locale.language == appLocale
      ).name
      return newCategory
    })
  },
  subcategories: (state, getters, rootState) => {
    const appLocale = rootState.location.locale
    return state.subcategories.map(category => {
      let newCategory = { ...category }
      newCategory.name = newCategory.subcategory_name.find(
        locale => locale.language == appLocale
      ).name
      return newCategory
    })
  },
  items: (state, getters, rootState) => {
    const appLocale = rootState.location.locale
    const items = state.searchItems.length
      ? state.searchItems
      : state.categoryItems.length
      ? state.categoryItems
      : state.subcategoryItems
    return items.map(item => {
      let newItem = { ...item }
      let itemName = newItem.item_name.find(
        locale => locale.language == appLocale
      )
      //fallback if no translation found
      if (!itemName) {
        itemName = newItem.item_name[0]
      }
      newItem.name = itemName ? itemName.name : 'No name'
      return newItem
    })
  },

  selectedCategory: (state, getters, rootState) => {
    const appLocale = rootState.location.locale
    let newCategory = { ...state.category }
    newCategory.name = newCategory.cat_name.find(
      locale => locale.language == appLocale
    ).name
    return newCategory
  },
  selectedSubCategory: (state, getters, rootState) => {
    const appLocale = rootState.location.locale
    if (state.subcategory) {
      let newCategory = { ...state.subcategory }
      newCategory.name = newCategory.subcategory_name.find(
        locale => locale.language == appLocale
      ).name
      return newCategory
    }
  },
  selectedItem: (state, getters, rootState) => {
    const appLocale = rootState.location.locale
    if (state.item) {
      let newItem = { ...state.item }
      newItem.name = newItem.item_name.find(
        locale => locale.language == appLocale
      ).name
      return newItem
    }
  },
  getImages() {
    //for caching
    //document.getElementsByTagName('a')[0].__vue__.$store.state
    let images = []
    const categoryImagePath = state.categoryImagePath
    const subcategoryImagePath = state.subcategoryImagePath
    const itemImagePath = state.itemImagePath

    state.all.forEach(category => {
      images.push(categoryImagePath + category.category_image)
      if (category.get_category_product.length) {
        category.get_category_product.forEach(item => {
          images.push(itemImagePath + item.item_image)
        })
      }
      category.get_sub_category.forEach(subcat => {
        images.push(subcategoryImagePath + subcat.sub_category_image)
        subcat.get_sub_category_product.forEach(item => {
          images.push(itemImagePath + item.item_image)
        })
      })
    })
    return images
  },
}

// actions, often async
const actions = {
  fetchAll({ commit, rootState }) {
    return new Promise((resolve, reject) => {
      const params = [
        rootState.location.location,
        rootState.sync.date,
        rootState.sync.compress,
      ]
      CategoryService.fetchAll(...params)
        .then(response => {
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
            commit(
              mutation.SET_CATEGORY_ITEMS,
              state.category.get_category_product
            )
            if (state.subcategory) {
              commit(
                mutation.SET_SUBCATEGORY_ITEMS,
                state.subcategory.get_sub_category_product
              )
            }
            // if (state.subcategory.get_sub_category_product) {
            //   commit(
            //     mutation.TAX_DETAILS,
            //     state.subcategory.get_sub_category_product[0].item_tax
            //   );
            //   commit(
            //     mutation.ITEM_TAX_AMOUNT,
            //     state.subcategory.get_sub_category_product[0].item_tax[0].tax_amount
            //   );
            // }
          }

          resolve(
            response.data ? (response.data.error ? response.data : true) : true
          )
        })
        .catch(error => reject(error))
    })
  },

  //get subcategories and items based on main category
  browse({ commit, state }, item) {
    //reset all
    commit(mutation.SET_SUBCATEGORIES, [])
    commit(mutation.SET_SUBCATEGORY, null)
    commit(mutation.SET_CATEGORY_ITEMS, [])
    commit(mutation.SET_SUBCATEGORY_ITEMS, [])

    //apply new selected
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
    commit(mutation.SET_SEARCH_ITEMS, '')
    const subcategory = state.subcategories.find(
      category => category._id == item._id
    )
    commit(mutation.SET_SUBCATEGORY, subcategory)
    commit(
      mutation.SET_SUBCATEGORY_ITEMS,
      state.subcategory.get_sub_category_product
    )
  },

  collectSearchItems({ commit, state, rootState }, searchTerm) {
    const defaultLanguage = rootState.location.selectedSortcode
    let searchedItems = []
    state.items.map(item => {
      item.item_name.forEach(getByLanguage => {
        if (
          getByLanguage.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !=
            -1 &&
          defaultLanguage == getByLanguage.language
        ) {
          searchedItems.push(item)
        }
      })
    })
    commit(mutation.SET_SEARCH_ITEMS, searchedItems)
  },
}
// mutations
//state should be only changed through mutation and these are synchronous
const mutations = {
  //using constant as function name
  [mutation.SET_CATEGORIES](state, categories) {
    state.all = categories

    let allItems = []
    categories.forEach(category => {
      category.get_sub_category.forEach(subCategory => {
        subCategory.get_sub_category_product.forEach(item => {
          allItems.push(item)
        })
      })
    })
    state.items = allItems
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
  [mutation.SET_SEARCH_ITEMS](state, searchedItems) {
    state.searchItems = searchedItems
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

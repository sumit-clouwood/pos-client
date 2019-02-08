import CategoryService from '@/services/data/CategoryService'

// initial state
const state = {
  all: [],
  subcategory : [],
  items : []
}

// getters, computed properties 
const getters = {
  //maincategoreis function, accepts state and getters as param and returns categories
  //access it as store.getters.maincategories
  maincategories: state => {
    return state.all     
  },

  categoryCount: (state, getters) => {
    return getters.maincategories.length
  },

  //usage: store.getters.getTodoById(2)
  categoryById : (state) => (id) => {
    return state.all.find(cateogry => cateogry.id === id)
  }
}

// actions
const actions = {
  // fetchAll ({ commit }) {
  //   CategoryService.fetchAll(categories => {
  //     commit('setCategories', categories)
  //   })
  // }
  async fetchAll( {commit, rootState} ) {
    const params = [rootState.location.location, rootState.sync.date, rootState.sync.compress]
    commit('setCategories', await CategoryService.fetchAll(...params))
  },

  browse(commit, rootState, item) {
    const subCategories = state.categories.find(category => category._id = item._id);
    commit('setSubcategories', subCategories);
  }

}

// mutations
//state should be only changed through mutation
const mutations = {
  setCategories (state, response) {
    state.all = response.data.data.menu_data
  },
  
  setSubcategories (state, subcategories) {
    state.subcategory = subcategories
  },

  browseCategory (state, { maincategory }) {
    const category = state.all.find(cateogry => maincategory.id === cateogry.id)
    return category;
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
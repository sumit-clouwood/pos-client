import CategoryService from '@/services/data/CategoryService'

// initial state
const state = {
  all: []
}

// getters, computed properties 
const getters = {
  //maincategoreis function, accepts state and getters as param and returns categories
  //access it as store.getters.maincategories
  maincategories: state => {
    return state.all.filter(category => category.id)     
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
  fetchAll ({ commit }) {
    CategoryService.fetchAll(categories => {
      commit('setCategories', categories)
    })
  }
}

// mutations
//state should be only changed through mutation
const mutations = {
  setCategories (state, categories) {
    state.all = categories
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
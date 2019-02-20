import ModifierService from '@/services/data/ModifierService'
import * as mutation from './modifier/mutation-types'

// initial state
const state = {
  imagePath: '',
  all: [],
  item: false,
  itemModifiers: [],
}

// getters, computed properties
const getters = {
  hasModifiers: (state, getters, rootState) => item => {
    return state.all.some(modifier => {
      if (modifier.itemIds.length) {
        //find in itemids
        return modifier.itemIds.some(itemId => itemId === item._id)
      } else if (modifier.item_subcategory.length) {
        //find in subcategory
        return modifier.item_subcategory.some(
          subcatId => subcatId === rootState.category.subcategory._id
        )
      } else {
        //find in category
        return modifier.item_category.some(
          catId => catId === rootState.category._id
        )
      }
    })
  },

  imagePath: state => imagePath => state.imagePath + imagePath,
  locationPrice: (state, getters, rootState) => item => {
    return item.item_location_price[rootState.location.location]
  },
  //get modifiers specific to item id from current modifiers list
  itemModifiers: state => itemId =>
    state.itemModifiers.find(obj => obj.itemId == itemId),
}

// actions, often async
const actions = {
  async fetchAll({ commit, rootState }) {
    const params = [rootState.location.location, rootState.sync.compress]
    ModifierService.fetchAll(...params).then(response => {
      commit(mutation.SET_MODIFIERS, response.data.data.modifierDetails)
      commit(mutation.SET_IMAGE_PATH, response.data.data.image_path)
    })
  },

  //find modifiers from all specific to current item and push to current list
  setModifierItem({ commit, rootState }, item) {
    //set location based pricing
    if (
      item.get_item_location_price.location_id == rootState.location.location
    ) {
      item.price = item.get_item_location_price.menu_location_price
    } else {
      item.price = item.item_price
    }
    commit(mutation.SET_ITEM, item)

    //commit item modifier only if it was not already in the list
    if (!state.itemModifiers.find(obj => obj.itemId == item._id)) {
      //1. search current item Id in all modifiers which have itemIds
      //2. 1 not matched and search current subcategory Id in all modifiers which have subcategoryIds but don't have itemIds
      //3. 2 not matched and search current category id in all modifiers which have categoryIds but don't have subcategory or itemIds

      const modifiers = state.all.filter(modifier => {
        if (modifier.itemIds.length) {
          //find in itemids
          return modifier.itemIds.find(itemId => itemId === item._id)
        } else if (modifier.item_subcategory.length) {
          //find in subcategory
          return modifier.item_subcategory.find(
            subcatId => subcatId === rootState.category.subcategory._id
          )
        } else {
          //find in category
          return modifier.item_category.find(
            catId => catId === rootState.category._id
          )
        }
      })

      //change modifiers to get location based pricing
      const upatedModifiers = modifiers.map(modifier => {
        const groups = modifier.get_modifier_sub_groups.map(group => {
          const modifierItemList = group.get_modifier_item_list.map(mod => {
            mod.price =
              mod.item_location_price[rootState.location.location] ||
              mod.item_price
            return mod
          })
          group.get_modifier_item_list = modifierItemList
          return group
        })
        modifier.get_modifier_sub_groups = groups
        return modifier
      })

      //use updated modifiers
      commit(mutation.SET_ITEM_MODIFIERS, {
        itemId: item._id,
        modifiers: upatedModifiers,
      })
    }
  },
}

// mutations
//state should be only changed through mutation and these are synchronous
const mutations = {
  [mutation.SET_MODIFIERS](state, modifiers) {
    state.all = modifiers
  },

  [mutation.SET_IMAGE_PATH](state, path) {
    state.imagePath = path
  },

  [mutation.SET_ITEM](state, item) {
    state.item = item
  },

  [mutation.SET_ITEM_MODIFIERS](state, { itemId, modifiers }) {
    state.itemModifiers.push({ itemId: itemId, modifiers: modifiers })
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

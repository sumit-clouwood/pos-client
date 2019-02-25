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
  findModifier: () => modifierId => {
    let modifier = {}
    state.itemModifiers.forEach(item => {
      item.modifiers.forEach(mod => {
        mod.get_modifier_sub_groups.forEach(subgroup => {
          subgroup.get_modifier_item_list.forEach(submod => {
            if (submod._id == modifierId) {
              modifier = submod
            }
          })
        })
      })
    })
    return modifier
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

  setActiveItem({ commit, dispatch }, { orderItem, index }) {
    //get item from item modifiers and show all the modifiers attached with that item
    //create new item to replace existing one
    const modifierItem = state.itemModifiers.find(
      item => item.itemId == orderItem._id
    )
    let item = { ...modifierItem.item }
    item.editMode = true
    item.quantity = orderItem.quantity
    item.orderIndex = index
    commit(mutation.SET_ITEM, item)
    //formstate should contain only those fiels which are selected by this order item

    dispatch('orderForm/populateSelection', orderItem.modifierGroups, {
      root: true,
    })
  },

  //find modifiers from all specific to current item and push to current list
  setModifierItem({ commit, rootState, dispatch }, item) {
    //clear modifiers selection
    dispatch('orderForm/clearSelection', [], { root: true })
    //set location based pricing for an item (not modifier) as this item ll be used in order
    //this price needs to be shown in popup
    if (
      item.get_item_location_price.location_id == rootState.location.location
    ) {
      item.price = item.get_item_location_price.menu_location_price
    } else {
      item.price = item.item_price
    }

    //we are going to show a popup for new item (not for an item already added to cart)
    item.editMode = false

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

            //calculate tax for the modifiers ll be done in order store because we add modifier price to item price and then calculate tax
            return mod
          })
          //do not mutate original state
          let newGroup = { ...group }
          newGroup.get_modifier_item_list = modifierItemList
          return newGroup
        })
        //do not mutate original state
        let newModifier = { ...modifier }
        newModifier.get_modifier_sub_groups = groups
        return newModifier
      })

      //use updated modifiers
      commit(mutation.SET_ITEM_MODIFIERS, {
        itemId: item._id,
        modifiers: upatedModifiers,
        item: item,
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

  [mutation.SET_ITEM_MODIFIERS](state, { itemId, modifiers, item }) {
    state.itemModifiers.push({
      itemId: itemId,
      modifiers: modifiers,
      item: item,
    })
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

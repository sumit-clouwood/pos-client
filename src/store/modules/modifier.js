import ModifierService from '@/services/data/ModifierService'
import * as mutation from './modifier/mutation-types'
import * as CONSTANTS from '@/constants'

// initial state
const state = {
  groups: [],
  subgroups: [],
  modifiers: [],

  item: false,
  itemModifiers: [],
}

// getters, computed properties
const getters = {
  hasModifiers: state => item => {
    return state.groups.some(group => {
      return group.for_items.includes(
        item[CONSTANTS.REFERENCE_FIELD_ITEM_TO_MODIFIER_GROUP]
      )
    })
  },
  groups: state => item => {
    return state.groups.filter(group =>
      group.for_items.includes(
        item[CONSTANTS.REFERENCE_FIELD_ITEM_TO_MODIFIER_GROUP]
      )
    )
  },
  subgroups: state => group => {
    return state.subgroups.filter(subgroup =>
      subgroup.modifier_group.includes(
        group[CONSTANTS.REFERENCE_FIELD_MODIFIER_GROUP_TO_SUBGROUP]
      )
    )
  },
  //modifiers fetch from the groups
  modifiers: (state, getters) => item => {
    let groupedModifiers = {}
    //create subgroup and push to modifiers after attaching modifiers to that subgroup
    const groups = getters.groups(item)

    groups.forEach(group => {
      const subgroups = getters.subgroups(group)

      subgroups.forEach(subgroup => {
        groupedModifiers[subgroup._id] = {}
        groupedModifiers[subgroup._id]['subgroup'] = subgroup
        groupedModifiers[subgroup._id]['modifiers'] = {}

        const modifiers = state.modifiers.filter(
          modifier =>
            modifier.modifier_group ===
              group[CONSTANTS.REFERENCE_FIELD_MODIFIER_GROUP_TO_MODIFIER] &&
            modifier.modifier_sub_group ===
              subgroup[CONSTANTS.REFERENCE_FIELD_MODIFIER_SUBGROUP_TO_MODIDIER]
        )

        if (modifiers && modifiers.length) {
          modifiers.forEach(modifier => {
            groupedModifiers[subgroup._id]['modifiers'][modifier._id] = modifier
          })
        }
      })
    })

    return groupedModifiers
  },

  findModifier: state => modifierId => {
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

  //get modifiers specific to item id from current modifiers list not from groups
  itemModifiers: state => itemId => {
    let subgroups = []
    const item = state.itemModifiers.find(obj => obj.itemId == itemId)
    for (let subgroupId in item.modifiers) {
      let subgroup = item.modifiers[subgroupId].subgroup
      subgroup.modifiers = []
      let submodifiers = item.modifiers[subgroupId].modifiers
      for (let submodId in submodifiers) {
        subgroup.modifiers.push(submodifiers[submodId])
      }

      if (subgroup.modifiers.length) {
        subgroups.push(subgroup)
      }
    }
    return subgroups
  },

  //get mandatory modifiers specific to item id from current modifiers list
  itemMandatoryGroups: state => itemId => {
    let mandatoryModifierGroups = []
    const allModifiers = state.itemModifiers.find(obj => obj.itemId == itemId)
    allModifiers.modifiers.forEach(modifier => {
      modifier.get_modifier_sub_groups.forEach(subgroup => {
        if (subgroup.type === 'mandatory') {
          mandatoryModifierGroups.push(subgroup._id)
        }
      })
    })
    return mandatoryModifierGroups
  },

  /* for prefetch only */
  getImages: state => {
    let images = []

    state.all.forEach(item => {
      item.get_modifier_sub_groups.forEach(subgroup => {
        subgroup.get_modifier_item_list.forEach(submod => {
          images.push(state.imagePath + submod.imageName)
        })
      })
    })
    return images
  },
}

// actions, often async
const actions = {
  async fetchAll({ commit }) {
    const [groups, subgroups, modifiers] = await Promise.all([
      ModifierService.groups(),
      ModifierService.subgroups(),
      ModifierService.modifiers(),
    ])

    commit(mutation.SET_MODIFIER_GROUPS, groups.data.data)
    commit(mutation.SET_MODIFIER_SUBGROUPS, subgroups.data.data)
    commit(mutation.SET_MODIFIERS, modifiers.data.data)
  },

  //active item and index already been set to order.item
  setActiveItem({ commit, dispatch, rootState }) {
    //pop needs all modifiers available for this item so we need to fetch modifier from modifeir store
    //but first we need to get active order so we can find exact item from modifiers

    const orderItem = rootState.order.item
    const modifierItem = state.itemModifiers.find(
      item => item.itemId == orderItem._id
    )

    //make a copy of item
    let item = { ...modifierItem.item }

    //copy properties from active order/item
    item.editMode = orderItem.editMode
    item.quantity = orderItem.quantity
    item.orderIndex = orderItem.orderIndex
    item.modifiable = orderItem.modifiable

    //set current item with modifiers in modifer store
    commit(mutation.SET_ITEM, item)

    //formstate should contain only those fiels which are selected by this order item
    dispatch('orderForm/populateSelection', orderItem.modifierGroups, {
      root: true,
    })
  },

  //find modifiers from all specific to current item and push to current list [item[0].modifiers]
  //this function is not yet adding item to order but just showing modifiers for selection here once modifiers are selected then click on button ll add it to order
  assignModifiersToItem({ commit, getters }, item) {
    item.editMode = false
    commit(mutation.SET_ITEM, item)

    //commit item modifier only if it was not already in the list
    if (!state.itemModifiers.find(obj => obj.itemId == item._id)) {
      //use updated modifiers
      const modifiers = getters.modifiers(item)
      commit(mutation.SET_ITEM_MODIFIERS, {
        itemId: item._id,
        modifiers: modifiers,
        item: item,
      })
    }
  },
}

// mutations
//state should be only changed through mutation and these are synchronous
const mutations = {
  [mutation.SET_MODIFIER_GROUPS](state, modifierGroups) {
    state.groups = modifierGroups
  },
  [mutation.SET_MODIFIER_SUBGROUPS](state, modifierSubgroups) {
    state.subgroups = modifierSubgroups
  },
  [mutation.SET_MODIFIERS](state, modifiers) {
    state.modifiers = modifiers
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

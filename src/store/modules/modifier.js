/* eslint-disable no-console*/
import ModifierService from '@/services/data/ModifierService'
import * as mutation from './modifier/mutation-types'

// initial state
const state = {
  groups: [],
  subgroups: [],
  modifiers: [],

  multistoreGroups: {},
  multistoreSubgroups: {},
  multistoreModifiers: {},

  itemModifiers: [],
  multistoreItemModifiers: {},

  foodIcons: [],
  item: false,
}

// getters, computed properties
const getters = {
  //before item click there is no itemModifiers data available so get it direclty from groups
  hasModifiers: (state, getters, rootState, rootGetters) => item => {
    let groups = state.groups
    if (rootGetters['auth/multistore']) {
      groups = state.multistoreGroups[item.store_id]
    }
    return (
      groups &&
      groups.some(group => {
        if (group.for_items.includes(item._id)) {
          //check its subgroups if active
          const subgroups = getters.subgroups(group, item)
          if (subgroups.length) {
            //check if any of the subgroup has modifiers
            let subgroupHasModifiers = false

            subgroups.forEach(subgroup => {
              const modifiers = getters
                .rawModifiers(item)
                .filter(
                  modifier =>
                    modifier.modifier_group === group._id &&
                    modifier.modifier_sub_group === subgroup._id
                )
              if (modifiers.length) {
                subgroupHasModifiers = true
              }
            })
            return subgroupHasModifiers
          }
        }
        return false
      })
    )
  },

  groups: (state, getters, rootState, rootGetters) => item => {
    let groups = state.groups
    if (rootGetters['auth/multistore']) {
      groups = state.multistoreGroups[item.store_id]
    }
    if (!groups) {
      return []
    }

    return groups.filter(group => group.for_items.includes(item._id))
  },
  subgroups: (state, getters, rootState, rootGetters) => (group, item) => {
    let subgroups = state.subgroups
    if (rootGetters['auth/multistore']) {
      subgroups = state.multistoreSubgroups[item.store_id]
    }
    if (!subgroups) {
      return []
    }

    return subgroups.filter(subgroup =>
      subgroup.modifier_group.includes(group._id)
    )
  },
  rawModifiers: (state, getters, rootState, rootGetters) => item => {
    let modifiers = state.modifiers
    if (rootGetters['auth/multistore']) {
      modifiers = state.multistoreModifiers[item.store_id]
    }
    return modifiers
  },

  //modifiers fetch from the groups
  modifiers: (state, getters) => item => {
    let groupedModifiers = {}
    //create subgroup and push to modifiers after attaching modifiers to that subgroup
    const groups = getters.groups(item)

    groups.forEach(group => {
      const subgroups = getters.subgroups(group, item)

      subgroups.forEach(subgroup => {
        groupedModifiers[subgroup._id] = {}
        groupedModifiers[subgroup._id]['subgroup'] = subgroup
        groupedModifiers[subgroup._id]['modifiers'] = {}

        const modifiers = getters
          .rawModifiers(item)
          .filter(
            modifier =>
              modifier.modifier_group === group._id &&
              modifier.modifier_sub_group === subgroup._id
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

  findModifier: (state, getters, rootState, rootGetters) => (
    modifierId,
    item
  ) => {
    let modifier = {}

    if (
      rootGetters['auth/multistore'] &&
      typeof state.multistoreItemModifiers[item.store_id] !== 'undefined'
    ) {
      const stateModifiers = state.multistoreItemModifiers[item.store_id]
      stateModifiers.forEach(entity => {
        const itemModifierSubgroups = getters.multistoreItemModifiers(
          entity.itemId,
          item
        )
        itemModifierSubgroups.forEach(subgroup => {
          subgroup.modifiers.forEach(submod => {
            if (submod._id == modifierId) {
              submod.type = subgroup.item_type
              modifier = submod
            }
          })
        })
      })
    } else {
      state.itemModifiers.forEach(entity => {
        const itemModifierSubgroups = getters.itemModifiers(entity.itemId)
        itemModifierSubgroups.forEach(subgroup => {
          subgroup.modifiers.forEach(submod => {
            if (submod._id == modifierId) {
              submod.type = subgroup.item_type
              modifier = submod
            }
          })
        })
      })
    }

    return modifier
  },

  getModifierSubgroup: (state, getters) => modifierId => {
    let modifier = {}
    getters.stateItemModifiers.forEach(item => {
      const itemModifierSubgroups = getters.itemModifiers(item.itemId)
      itemModifierSubgroups.forEach(subgroup => {
        subgroup.modifiers.forEach(submod => {
          if (submod._id == modifierId) {
            modifier = subgroup
          }
        })
      })
    })
    return modifier
  },

  //get modifiers specific to item id from current modifiers list not from groups
  //this getter is used in rendering
  itemModifiers: (state, getters) => itemId => {
    const item = getters.stateItemModifiers.find(obj => obj.itemId == itemId)
    let subgroups = []
    if (item) {
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
    }
    return subgroups
  },
  multistoreItemModifiers: state => (itemId, entity) => {
    const item = state.multistoreItemModifiers[entity.store_id].find(
      obj => obj.itemId == itemId
    )
    let subgroups = []
    if (item) {
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
    }
    return subgroups
  },

  //get mandatory modifiers specific to item id from current modifiers list
  itemMandatoryGroups: (state, getters) => itemId => {
    let mandatoryModifierGroups = []
    const subgroups = getters.itemModifiers(itemId)
    if (subgroups) {
      subgroups.forEach(subgroup => {
        if (subgroup.item_type === 'mandatory') {
          mandatoryModifierGroups.push(subgroup._id)
        }
      })
    }
    return mandatoryModifierGroups
  },

  /* for prefetch only */
  getImages: (state, getters) => {
    let images = []
    getters.stateItemModifiers.forEach(item => {
      const itemModifierSubgroups = getters.itemModifiers(item.itemId)
      itemModifierSubgroups.forEach(subgroup => {
        subgroup.modifiers.forEach(submod => {
          images.push(submod.item_modifier_image)
        })
      })
    })

    return state ? images : []
  },

  //dont' calcualte just return based on state
  stateItemModifiers: (state, getters, rootState, rootGetters) => {
    let modifiers = state.itemModifiers
    if (rootGetters['auth/multistore']) {
      //we have 3 places where item modifiers are being used
      //1. catalog
      //2. order/cart (includes modify order)
      //3. invoice
      //make sure every one is setting state of item for modifier
      if (state.item) {
        modifiers = state.multistoreItemModifiers[state.item.store_id]
      }
    }
    return modifiers || []
  },
}

// actions, often async
const actions = {
  fetchAll({ commit, rootState, rootGetters }, storeId = null) {
    return new Promise(async resolve => {
      const [groups, subgroups, modifiers, foodIcons] = await Promise.all([
        ModifierService.groups(storeId),
        ModifierService.subgroups(storeId),
        ModifierService.modifiers(storeId),
        ModifierService.foodIcons(),
      ])

      commit(mutation.SET_MODIFIERS, {
        groups: groups.data.data,
        subgroups: subgroups.data.data,
        modifiers: modifiers.data.data,
        foodIcons: foodIcons.data.data,
        multistore: storeId
          ? storeId
          : rootGetters['auth/multistore']
          ? rootState.context.storeId
          : false,
      })

      resolve()
    })
  },
  fetchMultistore({ rootState, dispatch }, stores) {
    //don't repeat in case storeId is provided otherwise it ll just loop in
    //load discounts for all stores both item and order
    stores.forEach(storeId => {
      //skip current store
      if (storeId !== rootState.context.storeId) {
        dispatch('fetchAll', storeId)
      }
    })
  },
  setItem({ commit }, item) {
    item.editMode = true
    commit(mutation.SET_ITEM, item)
  },
  //active item and index already been set to order.item
  setActiveItem({ commit, dispatch, rootState, rootGetters }) {
    //pop needs all modifiers available for this item so we need to fetch modifier from modifeir store
    //but first we need to get active order so we can find exact item from modifiers

    const orderItem = rootState.order.item
    let stateModifiers = state.itemModifiers

    if (rootGetters['auth/multistore']) {
      stateModifiers = state.multistoreModifiers[orderItem.store_id]
    }

    const modifierItem = stateModifiers.find(
      item => item.itemId == orderItem._id
    )
    let item = {}
    if (typeof modifierItem != 'undefined') {
      //make a copy of item
      item = { ...modifierItem.item }
      //copy properties from active order/item
      item.editMode = orderItem.editMode
      item.quantity = orderItem.quantity
      item.orderIndex = orderItem.orderIndex
      item.modifiable = orderItem.modifiable
      //formstate should contain only those fiels which are selected by this order item
    } else {
      item = orderItem
    }

    dispatch('orderForm/populateSelection', item.modifierGroups, {
      root: true,
    })
    //set current item with modifiers in modifer store
    commit(mutation.SET_ITEM, item)
  },

  //find modifiers from all specific to current item and push to current list [item[0].modifiers]
  //this function is not yet adding item to order but just showing modifiers for selection here once modifiers are selected then click on button ll add it to order
  assignModifiersToItem({ commit, getters, rootState, rootGetters }, item) {
    item.editMode = false
    commit(mutation.SET_ITEM, item)
    //commit item modifier only if it was not already in the list

    if (!getters.stateItemModifiers.find(obj => obj.itemId == item._id)) {
      //use updated modifiers
      const modifiers = getters.modifiers(item)

      commit(mutation.SET_ITEM_MODIFIERS, {
        itemId: item._id,
        modifiers: modifiers,
        item: item,
        multistore: rootGetters['auth/multistore']
          ? rootState.context.storeId
          : false,
      })
    }

    return Promise.resolve()
  },
}

// mutations
//state should be only changed through mutation and these are synchronous
const mutations = {
  [mutation.SET_MODIFIERS](
    state,
    { groups, subgroups, modifiers, foodIcons, multistore }
  ) {
    if (multistore) {
      state.multistoreGroups = {
        ...state.multistoreGroups,
        [multistore]: groups,
      }
      state.multistoreSubgroups = {
        ...state.multistoreSubgroups,
        [multistore]: subgroups,
      }
      state.multistoreModifiers = {
        ...state.multistoreModifiers,
        [multistore]: modifiers,
      }
    } else {
      state.groups = groups
      state.subgroups = subgroups
      state.modifiers = modifiers
    }
    state.foodIcons = foodIcons
  },

  [mutation.SET_ITEM](state, item) {
    state.item = item
  },
  /*UPDATE_ITEM(state, time) {
    let item = { ...state.item }
    item.item_serving_time = time
    state.item = item
  },*/
  [mutation.RESET](state) {
    state.groups = []
    state.subgroups = []
    state.modifiers = []
    state.item = false
    state.itemModifiers = []
    state.foodIcons = []

    state.multistoreGroups = {}
    state.multistoreSubgroups = {}
    state.multistoreModifiers = {}
    state.multistoreItemModifiers = {}
  },

  [mutation.SET_ITEM_MODIFIERS](
    state,
    { itemId, modifiers, item, multistore }
  ) {
    let modifiersData = {
      itemId: itemId,
      modifiers: modifiers,
      item: item,
    }
    if (multistore) {
      const storeModifiers = state.multistoreItemModifiers[multistore] || []
      storeModifiers.push(modifiersData)
      state.multistoreItemModifiers = {
        ...state.multistoreItemModifiers,
        [multistore]: storeModifiers,
      }
    } else {
      state.itemModifiers.push(modifiersData)
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

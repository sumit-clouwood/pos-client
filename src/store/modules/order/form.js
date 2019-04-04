/* eslint-disable no-console */
// initial state
const state = {
  error: false,
  quantity: 0,
  checkboxes: [],
  radios: {},
}

// getters
const getters = {
  quantity: (state, getters, rootState) => {
    return state.quantity || rootState.order.item.quantity || 1
  },
  modifiers: state => {
    let modifiers = []
    state.checkboxes.forEach(model => {
      modifiers.push({
        type: 'checkbox',
        itemId: model.itemId,
        modifierId: model.modifierId,
        groupId: model.groupId,
        limit: model.limit,
      })
    })

    for (let key in state.radios) {
      const model = state.radios[key]
      model &&
        modifiers.push({
          type: 'radio',
          itemId: model.itemId,
          modifierId: model.modifierId,
          groupId: model.groupId,
        })
    }

    return modifiers
  },
}

// actions
const actions = {
  updateRadios({ commit }, { itemId, modifierId, groupId, limit }) {
    commit('setRadios', {
      itemId: itemId,
      modifierId: modifierId,
      groupId: groupId,
      limit: limit,
    })
  },
  populateSelection({ commit }, modifierGroups) {
    commit('clearSelection')
    commit('populateSelection', modifierGroups)
  },
  clearSelection({ commit }) {
    commit('clearSelection')
  },
}

// mutations
const mutations = {
  setError(state, error) {
    state.error = error
  },

  clearError(state) {
    state.error = false
  },

  clearSelection(state) {
    state.checkboxes = []
    state.radios = {}
  },
  updateQuantity(state, quantity) {
    state.quantity = quantity
  },
  populateSelection(state, modifierGroups) {
    modifierGroups.forEach(model => {
      if (model.type === 'checkbox') {
        state.checkboxes.push(model)
      } else if (model.type === 'radio') {
        state.radios[model.groupId] = model
      }
    })
  },

  setCheckboxes(state, vmodel) {
    const oldState = state.checkboxes
    state.checkboxes = vmodel

    //check if modifier is in allowed limit
    state.error = false
    vmodel.forEach(model => {
      const addedModifiers = state.checkboxes.filter(
        cmodel =>
          cmodel.groupId == model.groupId && cmodel.itemId == model.itemId
      )

      if (addedModifiers.length > model.limit) {
        state.error = `Can not select more than ${
          model.limit
        } modifiers in this group`

        //reset to previous state
        state.checkboxes = oldState
      }
    })
  },
  setRadios(state, radios) {
    state.radios = radios
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

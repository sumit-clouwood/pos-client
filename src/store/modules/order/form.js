// initial state
const state = {
  modifiers: [],
  error: false,
}

// getters
const getters = {
  modifiers: state => modifierId => {
    let found = false
    state.modifiers.forEach(modifier => {
      if (modifier.modifierId == modifierId) {
        found = true
      } else if (Array.isArray(modifier.modifierId)) {
        modifier.modifierId.forEach(modifier_id => {
          if (modifier_id == modifierId) {
            found = true
          }
        })
      }
    })
    return found
  },
}

// actions
const actions = {
  updateOption({ commit }, { itemId, modifierId, groupId, limit }) {
    if (limit > 1) {
      //checkbox
      //modifers[itemId][groupId] = []
      commit('addMultiple', {
        itemId: itemId,
        modifierId: modifierId,
        groupId: groupId,
      })

      const modifier = state.modifiers.find(
        modifier => modifier.itemId == itemId && modifier.groupId == groupId
      )
      if (modifier && modifier.modifierId.length > limit) {
        commit('removeOption', {
          itemId: itemId,
          modifierId: modifierId,
          groupId: groupId,
        })
        commit('setError', `Cant select more than ${limit} addons`)
      } else {
        commit('setError', false)
      }
    } else {
      //radio
      //modifers[itemId][groupId] = radio
      commit('addSingle', {
        itemId: itemId,
        modifierId: modifierId,
        groupId: groupId,
      })
    }
  },

  populateSelection({ commit }, modifers) {
    commit('clearSelection', [])
    commit('populateSelection', modifers)
  },
}

// mutations
const mutations = {
  addSingle(state, { itemId, modifierId, groupId }) {
    const key = state.modifiers.findIndex(
      item => item.itemId == itemId && item.groupId == groupId
    )
    if (key > -1) {
      let modifier = state.modifiers.find(
        item => item.itemId == itemId && item.groupId == groupId
      )
      modifier.modifierId = modifierId
      state.modifiers.splice(key, 1, modifier)
    } else {
      state.modifiers.push({
        itemId: itemId,
        modifierId: modifierId,
        groupId: groupId,
      })
    }
  },
  addMultiple(state, { itemId, modifierId, groupId }) {
    //if already exists remove that
    const modifier = state.modifiers.find(
      modifier => modifier.itemId == itemId && modifier.groupId == groupId
    )

    if (modifier && modifier.modifierId.find(modId => modId == modifierId)) {
      const key = modifier.modifierId.findIndex(modId => modId == modifierId)
      modifier.modifierId.splice(key, 1)
    } else {
      const key = state.modifiers.findIndex(
        item => item.itemId == itemId && item.groupId == groupId
      )
      if (key > -1) {
        let modifier = state.modifiers.find(
          item => item.itemId == itemId && item.groupId == groupId
        )
        modifier.modifierId.push(modifierId)
        state.modifiers.splice(key, 1, modifier)
      } else {
        state.modifiers.push({
          itemId: itemId,
          modifierId: [modifierId],
          groupId: groupId,
        })
      }
    }
  },
  removeOption(state, { itemId, modifierId, groupId }) {
    const key = state.modifiers.findIndex(
      item => item.itemId == itemId && item.groupId == groupId
    )
    if (key > -1) {
      let modifier = state.modifiers.find(
        item => item.itemId == itemId && item.groupId == groupId
      )
      const index = modifier.modifierId.findIndex(modId => modId == modifierId)
      modifier.modifierId.splice(index, 1)
      state.modifiers.splice(key, 1, modifier)
    }
  },
  setError(state, error) {
    state.error = error
  },

  clearSelection(state, data) {
    state.modifiers = data
  },
  populateSelection() {},
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

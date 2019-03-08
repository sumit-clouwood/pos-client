import * as mutation from './announcement/mutation-types'
import AnnouncementService from '@/services/data/AnnouncementService'

const state = {
  announcements: {},
}

const actions = {
  fetchAll: function({ commit, rootState }) {
    const params = [rootState.auth.userDetails._id, rootState.sync.date]
    AnnouncementService.fetchAll(...params).then(response => {
      commit(mutation.SET_ANNOUNCEMENT, response.data)
    })
  },
}

const getters = {}

const mutations = {
  [mutation.SET_ANNOUNCEMENT](commit, announcements) {
    if (announcements.status != 0) {
      state.announcements = announcements.data
    }
  },
}

export default {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
}

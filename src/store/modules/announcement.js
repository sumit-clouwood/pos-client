import * as mutation from './announcement/mutation-types'
import AnnouncementService from '@/services/data/AnnouncementService'
const state = {
  announcements: false,
}

const actions = {
  fetchAll: function({ commit, rootGetters, rootState }) {
    let role = rootGetters['auth/getRole']('pos')
    if (role) {
      const params = [role._id, rootState.location.apiDate]
      AnnouncementService.fetchAll(...params).then(response => {
        commit(mutation.SET_ANNOUNCEMENT, response.data.data)
      })
    }
  },
}

const getters = {}

const mutations = {
  [mutation.SET_ANNOUNCEMENT](commit, announcements) {
    if (announcements) {
      let announcementsList = ''
      announcements.forEach(announcement => {
        announcementsList =
          announcementsList != ''
            ? announcementsList + '  |  ' + announcement.announcement
            : announcement.announcement
      })
      state.announcements = announcementsList
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

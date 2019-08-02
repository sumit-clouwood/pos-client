import * as mutation from './announcement/mutation-types'
import AnnouncementService from '@/services/data/AnnouncementService'
import dateTimeAPI from '@/plugins/helpers/DateTime.js'

const state = {
  announcements: false,
}

const actions = {
  fetchAll: function({ commit, rootGetters }) {
    // const params = [rootState.auth.userDetails._id, rootState.sync.date]
    let role = rootGetters['auth/getRole']('pos')
    if (role) {
      const params = [role._id, dateTimeAPI.DateAPI]
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

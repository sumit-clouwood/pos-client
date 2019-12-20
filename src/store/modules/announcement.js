import * as mutation from './announcement/mutation-types'
import AnnouncementService from '@/services/data/AnnouncementService'
import store from '@/store'

const state = {
  announcements: false,
}

const actions = {
  fetchAll: function({ commit, rootState }, userDetails) {
    let user = userDetails
    if (user && user.item) {
      const params = [user.item.brand_role, rootState.location.apiDate]
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
      let currentDate = new Date().toISOString().slice(0, 10)
      announcements.forEach(announcement => {
        announcement.role.forEach(role => {
          if (
            role == store.getters['auth/brandRoleId'] &&
            announcement.to_date >= currentDate
          ) {
            announcementsList =
              announcementsList != ''
                ? announcementsList + '  |  ' + announcement.announcement
                : announcement.announcement
          }
        })
      })
      state.announcements = announcementsList
    }
  },
  [mutation.RESET](state) {
    state.announcements = false
  },
}

export default {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
}

import * as mutation from './announcement/mutation-types'
import AnnouncementService from '@/services/data/AnnouncementService'
// import dateTimeAPI from '@/plugins/helpers/DateTime.js'

const state = {
  announcements: false,
  apiDate: '2019-08-03',
}

const actions = {
  fetchAll: function({ commit, rootGetters, dispatch, state }) {
    dispatch('formatDate')

    // const params = [rootState.auth.userDetails._id, rootState.sync.date]
    let role = rootGetters['auth/getRole']('pos')
    if (role) {
      // const params = [role._id, dateTimeAPI.DateAPI]
      const params = [role._id, state.apiDate]
      AnnouncementService.fetchAll(...params).then(response => {
        commit(mutation.SET_ANNOUNCEMENT, response.data.data)
      })
    }
  },
  formatDate: function() {
    let d = new Date(),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()

    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day
    // eslint-disable-next-line no-console
    console.log(year + '/' + month + '/' + day)
    // return year + '/' + month + '/' + day
    // return [year, month, day].join('-')
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

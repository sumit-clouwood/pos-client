import * as mutation from "./announcement/mutation-types";
import AnnouncementService from "@/services/data/AnnouncementService";

const state = {
  announcements: false
};

const actions = {
  fetchAll: function({ commit }) {
    // const params = [rootState.auth.userDetails._id, rootState.sync.date]
    AnnouncementService.fetchAll().then(response => {
      commit(mutation.SET_ANNOUNCEMENT, response.data.data);
    });
  }
};

const getters = {};

const mutations = {
  [mutation.SET_ANNOUNCEMENT](commit, announcements) {
    if (announcements) {
      let announcementsList = "";
      announcements.forEach(announcement => {
        announcementsList =
          announcementsList != ""
            ? announcementsList +
              "  |  " +
              announcement.announcement.toUpperCase()
            : announcement.announcement.toUpperCase();
      });
      state.announcements = announcementsList;
    }
  }
};

export default {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
};

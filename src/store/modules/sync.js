// initial state
const state = {
  //date: '2019-02-06',
  date: '',
  today: new Date(), //.toJSON().slice(0, 10),
  weekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  compress: false,
}

// getters
const getters = {}

// actions
const actions = {}

// mutations
const mutations = {
  updateSyncDate(state, date) {
    state.date = date
  },

  updateCompress(state, isCompress) {
    state.compress = isCompress
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

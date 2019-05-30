// initial state
const state = {
  //date: '2019-02-06',
  date: '',
  today: new Date(), //.toJSON().slice(0, 10),
  weekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  weekDaysFull: [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ],
  monthsFull: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  months: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ],
  compress: false,
  loaded: false,
  online: true,
  idb: null,
  idbVersion: 1,
}

// getters
const getters = {
  // todayDateFull: (state, rootGetters) =>
  todayDateFull: state =>
    //   Tuesday, 13 Oct 2017
    // rootGetters['location/_t'](state.weekDaysFull[state.today.getDay()]) +
    state.weekDaysFull[state.today.getDay()] +
    ', ' +
    state.today.getDate() +
    ' ' +
    state.months[state.today.getMonth()] +
    ' ' +
    state.today.getFullYear(),
}

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

  status(state, status) {
    state.online = status
  },

  loaded(state, loaded) {
    state.loaded = loaded
  },

  setIdbVersion(state, version) {
    state.idbVersion = version
  },
  setIdb(state, handle) {
    state.idb = handle
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

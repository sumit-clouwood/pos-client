import * as mutation from './location/mutation-types'
import LocationService from '@/services/data/LocationService'
// initial state
const state = {
  location: false,
  locationIds: [],
  locationName: '',
  currency: 'AED',
  locationData: {},
  deliveryAreas: {},
  language: 'English',
  locale: 'en_US',
  setTimeZone: 'Asia/Dubai',
}

// getters
const getters = {
  round: () => amount =>
    (Math.round((parseFloat(amount) + 0.00001) * 100) / 100).toFixed(2),
  rawPrice: () => price => (price > 0 ? price : 0),
  formatPrice: state => price => {
    if (!price) price = 0.0
    return (
      state.currency +
      ' ' +
      (Math.round((parseFloat(price) + 0.00001) * 100) / 100).toFixed(2)
    )
  },

  getDeliveryArea: state => areaId => {
    let area = ''
    state.deliveryAreas.forEach(deliveryArea => {
      if (areaId == deliveryArea._id) {
        area = deliveryArea.name
      }
    })
    return area
  },
}

// actions
const actions = {
  fetch({ state, commit, rootState }) {
    return new Promise((resolve, reject) => {
      const params = [
        state.location,
        1 /*Staff*/,
        1 /*Time*/,
        rootState.sync.compress,
      ]
      LocationService.getLocationData(...params)
        .then(response => {
          commit(mutation.SET_LOCATION_DATA, response.data.data)
          commit(mutation.SET_CURRENCY, response.data.data.currency_code)
          commit(mutation.SET_DELIVERY_AREAS, response.data.data.delivery_area)
          commit(mutation.SET_TIMEZONE, response.data.data.country_timezone)
          commit(
            mutation.SET_LANGUAGE,
            localStorage.getItem('locale') ||
              state.locationData.default_language[0].shortname
          )

          //We are setting franchise code as the location name so we can just go with that
          commit(mutation.SET_NAME, response.data.data.name)

          resolve(response.data.data)
          // commit(mutation.SET_CURRENCY, response.data.data.currency_symbol)
        })
        .catch(error => reject(error))
    })
  },
  setLocation({ commit, rootState }) {
    commit(mutation.SET_LOCATION, rootState.auth.userDetails.location_id)
    commit(
      mutation.SET_NAME,
      rootState.auth.userDetails.location_id.franchies_code
    )
  },
  setLocations({ commit, rootState }) {
    commit(mutation.SET_LOCATIONS, rootState.auth.userDetails.locations)
    commit(mutation.SET_NAME, rootState.auth.userDetails.franchies_code)
  },

  changeLanguage({ commit }, locale) {
    commit(mutation.SET_LANGUAGE, locale)
  },
}

// mutations
const mutations = {
  [mutation.SET_LOCATION](state, location) {
    state.location = location
  },
  /*[mutation.SET_LOCATIONS](state, location_id) {
        state.locationIds = location_id
    },*/
  [mutation.SET_NAME](state, franchise_code) {
    state.locationName = franchise_code
  },

  [mutation.SET_CURRENCY](state, currency) {
    state.currency = currency
  },
  [mutation.SET_LOCATION_DATA](state, locationDetails) {
    state.locationData = locationDetails
  },
  [mutation.SET_CURRENCY](state, currency) {
    state.currency = currency
  },
  [mutation.SET_DELIVERY_AREAS](state, delivery_area) {
    state.deliveryAreas = delivery_area
  },
  [mutation.SET_LANGUAGE](state, locale) {
    const language = state.locationData.languages.find(
      language => language.shortname === locale
    )

    state.locale = language.shortname
    state.language = language.language

    localStorage.setItem('locale', state.locale)
    localStorage.setItem('language', state.language)
  },

  [mutation.SET_TIMEZONE](state, timeZone) {
    state.setTimeZone = timeZone
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

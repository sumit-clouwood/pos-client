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
  selectedLanguage: 'en_US'
}

// getters
const getters = {
  round: () => amount =>
    (Math.round((parseFloat(amount) + 0.00001) * 100) / 100).toFixed(2),
  rawPrice: () => price => (price > 0 ? price : 0),
  formatPrice: state => price =>
    state.currency +
    ' ' +
    (Math.round((parseFloat(price) + 0.00001) * 100) / 100).toFixed(2),

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
  fetchAll({ commit, rootState }) {
    const params = [
      rootState.location.location,
      1 /*Staff*/,
      1 /*Time*/,
      rootState.sync.compress,
    ]
    LocationService.getLocationData(...params).then(response => {
      commit(mutation.SET_LOCATION_DATA, response.data.data)
      commit(mutation.SET_CURRENCY, response.data.data.currency_code)
      commit(mutation.SET_DELIVERY_AREAS, response.data.data.delivery_area)
      // commit(mutation.SET_CURRENCY, response.data.data.currency_symbol)
    })
  },
  setLocation({ commit }, userData) {
    commit(mutation.SET_LOCATION, userData.location_id)
    commit(mutation.SET_FRANCHISE_CODE, userData.franchies_code)
  },
  setLocations({ commit }, userData) {
    commit(mutation.SET_LOCATIONS, userData.locations)
    commit(mutation.SET_FRANCHISE_CODE, userData.franchies_code)
  },

  changeLanguage({ commit, dispatch }, selectedLanguage) {
    commit(mutation.SET_LANGUAGE,selectedLanguage)
    dispatch('fetchAll')
  }
}

// mutations
const mutations = {
  [mutation.SET_LOCATION](state, location) {
    state.location = location
  },
  /*[mutation.SET_LOCATIONS](state, location_id) {
        state.locationIds = location_id
    },*/
  [mutation.SET_FRANCHISE_CODE](state, franchise_code) {
    state.locationName = franchise_code
  },

  [mutation.SET_CURRENCY](state, currency) {
    state.currency = currency
  },
  [mutation.SET_LOCATION_DATA](state, locationDetails) {
    localStorage.setItem('selectedLanguage', state.selectedLanguage)
    state.locationData = locationDetails
  },
  [mutation.SET_CURRENCY](state, currency) {
    state.currency = currency
  },
  [mutation.SET_DELIVERY_AREAS](state, delivery_area) {
    state.deliveryAreas = delivery_area
  },
  [mutation.SET_LANGUAGE](state, selectedLanguage) {
    state.selectedLanguage = selectedLanguage
    localStorage.setItem('selectedLanguage',state.selectedLanguage)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

/* eslint-disable no-console */
import * as mutation from './location/mutation-types'
import LocationService from '@/services/data/LocationService'
// initial state
const state = {
  currency: 'AED',
  locale: 'en-US',
  timezone: 'Asia/Dubai',
  brand: null,
  store: null,
  avaialableLanguages: null,
  languageDirection: null,
  translations: null,
  location: null,
  setModal: '#manage-customer',
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
}

// actions
const actions = {
  fetch({ state, commit, rootState }) {
    return new Promise((resolve, reject) => {
      LocationService.getLocationData(rootState.context.storeId)
        .then(response => {
          commit(mutation.SET_STORE, response.data.store)
          commit(mutation.SET_BRAND, response.data.brand)
          commit(mutation.SET_LOCALE, response.data.lang)
          commit(mutation.SET_LANGUAGE_DIRECTION, response.data.direction)
          commit(mutation.SET_TRASLATIONS, response.data.translations)
          commit(mutation.SET_AVAILABLE_LANGUAGES, state.store.languages)
          commit(mutation.SET_LOCATION, state.store.address)
          commit(mutation.SET_CURRENCY, state.store.currency)
          commit(mutation.SET_TIMEZONE, state.store.timezone)

          let locale = state.locale

          if (localStorage.getItem('locale')) {
            locale = localStorage.getItem('locale')
          } else if (state.locationData.default_language) {
            locale = state.locationData.default_language
          }

          commit(mutation.SET_LOCALE, locale)

          //We are setting franchise code as the location name so we can just go with that

          resolve()
          // commit(mutation.SET_CURRENCY, response.data.data.currency_symbol)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  changeLanguage({ commit }, locale) {
    commit(mutation.SET_LOCALE, locale)
    localStorage.setItem('locale', locale)
  },

  updateModalSelectionDelivery({ commit }, modalSelection) {
    commit(mutation.SET_MODAL, modalSelection)
  },
}

// mutations
const mutations = {
  [mutation.SET_MODAL](state, setModal) {
    state.setModal = setModal
  },
  [mutation.SET_STORE](state, store) {
    state.store = store
  },
  [mutation.SET_BRAND](state, brand) {
    state.brand = brand
  },
  [mutation.SET_CURRENCY](state, currency) {
    state.currency = currency
  },
  [mutation.SET_LOCALE](state, locale) {
    state.locale = locale
  },
  [mutation.SET_LOCATION](state, location) {
    state.location = location
  },
  [mutation.SET_TIMEZONE](state, timezone) {
    state.timezone = timezone
  },
  [mutation.SET_AVAILABLE_LANGUAGES](state, languages) {
    state.avaialableLanguages = languages
  },
  [mutation.SET_LANGUAGE_DIRECTION](state, langDirection) {
    state.languageDirection = langDirection
  },
  [mutation.SET_TRASLATIONS](state, translations) {
    state.translations = translations
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

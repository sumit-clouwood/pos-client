/* eslint-disable no-console */
import * as mutation from './location/mutation-types'
import LocationService from '@/services/data/LocationService'
import Num from '@/plugins/helpers/Num'
// initial state
const state = {
  currency: 'AED',
  locale: 'en-US',
  timezone: 'Asia/Dubai',
  brand: null,
  store: null,
  availableLanguages: null,
  languageDirection: null,
  translations: null,
  location: null,
  setModal: '#manage-customer',
  referrals: false,
}

// getters
const getters = {
  formatPrice: state => price => {
    if (!price) price = 0.0
    return state.currency + ' ' + Num.round(price)
  },
  _t: state => str => {
    if (state.translations[str]) {
      console.log(state.translations[str] + 'trans')
      return state.translations[str]
    }
    console.log(state.translations[str] + ' no translation ' + str)
    return str
  },
}

// actions
const actions = {
  fetch({ state, commit, dispatch }) {
    return new Promise((resolve, reject) => {
      LocationService.getLocationData(state.locale)
        .then(response => {
          commit(mutation.SET_STORE, response.data.store)
          commit(mutation.SET_BRAND, response.data.brand)
          commit(mutation.SET_LOCALE, response.data.lang)
          commit(mutation.SET_LANGUAGE_DIRECTION, response.data.direction)
          commit(mutation.SET_TRASLATIONS, response.data.translations)
          commit(mutation.SET_AVAILABLE_LANGUAGES, response.data.available_lang)
          commit(mutation.SET_LOCATION, state.store.address)
          commit(mutation.SET_CURRENCY, state.store.currency)
          commit(mutation.SET_TIMEZONE, state.store.timezone)

          commit('modules/SET_ENABLED_MODULES', state.brand.enabled_modules, {
            root: true,
          })
          dispatch('referrals')
          let locale = state.locale
          if (localStorage.getItem('locale')) {
            locale = localStorage.getItem('locale')
          } else if (state.store.default_language) {
            locale = state.store.default_language
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
  referrals({ commit }) {
    LocationService.getReferrals().then(response => {
      commit(mutation.SET_REFERRALS, response.data.data)
    })
  },
  changeLanguage({ commit, dispatch }, locale) {
    commit(mutation.SET_LOCALE, locale)
    localStorage.setItem('locale', locale)
    dispatch('fetch')

    /*let direction = state.languageDirection
    document.body.style.direction = direction
    // Vue.prototype.$vuetify.rtl = direction == 'ltr' ? false : true
    document.body.classList.remove('body-ltr')
    document.body.classList.remove('body-rtl')
    document.body.classList.add('body-' + direction)*/
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
    state.availableLanguages = languages
  },
  [mutation.SET_LANGUAGE_DIRECTION](state, langDirection) {
    state.languageDirection = langDirection
  },
  [mutation.SET_TRASLATIONS](state, translations) {
    state.translations = translations
  },
  [mutation.SET_REFERRALS](state, referrals) {
    state.referrals = referrals
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

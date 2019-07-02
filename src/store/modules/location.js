/* eslint-disable no-console */
import * as mutation from './location/mutation-types'
import LocationService from '@/services/data/LocationService'
import Num from '@/plugins/helpers/Num'
import db from '@/services/network/DB'

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
  userDetails: false,
}

// getters
const getters = {
  formatPrice: state => price => {
    if (!price) price = 0.0
    return state.currency + ' ' + Num.round(price).toFixed(2)
  },
  _t: state => str => {
    if (state.translations[str]) {
      return state.translations[str]
    }
    return str
  },
  currency: state => state.currency
}

// actions
const actions = {
  fetch({ state, commit, dispatch, rootState }) {
    return new Promise((resolve, reject) => {
      LocationService.getLocationData()
        .then(storedata => {
          commit(mutation.SET_STORE, storedata.data.store)
          commit(mutation.SET_BRAND, storedata.data.brand)
          commit(mutation.SET_LANGUAGE_DIRECTION, storedata.data.direction)
          commit(mutation.SET_TRASLATIONS, storedata.data.translations)
          commit(
            mutation.SET_AVAILABLE_LANGUAGES,
            storedata.data.available_lang
          )

          commit(mutation.SET_LOCATION, state.store.address)
          commit(mutation.SET_CURRENCY, state.store.currency)
          commit(mutation.SET_TIMEZONE, state.brand.timezone)

          commit('modules/SET_ENABLED_MODULES', state.brand.enabled_modules, {
            root: true,
          })
          dispatch('referrals')
          dispatch('getUserDetails')
          //  else if (state.store.default_language) {
          //   locale = state.store.default_language
          // }
          // take out else part,as discussed with Alex language ll be dependent on cashier login

          LocationService.registerDevice(rootState.auth.deviceId).then(
            response => {
              const data = {
                id: 1,
                token: localStorage.getItem('token'),
                branch_n: state.store.branch_n,
                terminal_code: response.data.id,
              }
              db.getBucket('auth').then(bucket => {
                db.put(bucket, data)
              })
            }
          )
          resolve(state.locale)
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
  getUserDetails({ commit }) {
    if (localStorage.getItem('user') != null) {
      const user_id =
        localStorage.getItem('user').length > 0
          ? JSON.parse(localStorage.getItem('user')).user_id
          : false
      alert(user_id)
      if (user_id) {
        LocationService.userDetails(user_id).then(response => {
          commit(mutation.USER_DETAILS, response.data)
        })
      }
    }
  },
  changeLanguage({ commit }, locale) {
    commit(mutation.SET_LOCALE, locale)
    //dispatch('fetch')

    /*let direction = state.languageDirection
    document.body.style.direction = direction
    // Vue.prototype.$vuetify.rtl = direction == 'ltr' ? false : true
    document.body.classList.remove('body-ltr')
    document.body.classList.remove('body-rtl')
    document.body.classList.add('body-' + direction)*/
  },

  updateModalSelectionDelivery({ commit, rootState }, modalSelection) {
    commit(mutation.SET_MODAL, modalSelection)
    if (!rootState.customer.address && modalSelection != '#loyalty-payment') {
      commit(
        'checkoutForm/SET_MSG',
        { result: '', data: 'Please select one address' },
        {
          root: true,
        }
      )
    }
  },
  reset({ commit }) {
    commit(mutation.RESET)
  },
}

// mutations
const mutations = {
  [mutation.USER_DETAILS](state, userDetails) {
    state.userDetails = userDetails
  },
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
    localStorage.setItem('locale', locale)
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
  [mutation.RESET](state) {
    state.setModal = '#manage-customer'
    state.referrals = false
    state.userDetails = false
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

/* eslint-disable no-console */
import * as mutation from './location/mutation-types'
import LocationService from '@/services/data/LocationService'
import Num from '@/plugins/helpers/Num'
import db from '@/services/network/DB'
import TimezoneService from '@/services/data/TimezoneService'

// initial state
const state = {
  currency: 'AED',
  locale: 'en-US',
  timezone: 'Asia/Dubai',
  timezoneString: 'Asia/Dubai',
  brand: null,
  store: null,
  availableLanguages: null,
  languageDirection: null,
  translations: null,
  location: null,
  setModal: '#manage-customer',
  referrals: false,
  userShortDetails: false,
  permissions: false,
  apiDate: '',
}

// getters
const getters = {
  formatPrice: state => price => {
    if (!price) price = 0.0
    return state.currency + ' ' + Num.round(price, 2).toFixed(2)
  },

  permitted: state => (pageId, parentId) => {
    typeof parentId == 'undefined' ? null : parentId
    let routeMenus = state.permissions.filter(
      permission =>
        permission.meta.parent_id == parentId && permission.page_id == pageId
    )
    let getChildren = routeMenus
    if (routeMenus.length) {
      if (routeMenus[0].type == 'BlockMenuPage') {
        getChildren = state.permissions.filter(
          permission => permission.meta.parent_id == routeMenus[0].page_id
        )
      }
    }
    return getChildren.length
  },
  /*collectRouteMenu: state => {

  },*/
  _t: state => str => {
    if (state.translations[str]) {
      return state.translations[str]
    }
    return str
  },
  currency: state => state.currency,
  timezone: state => state.store.timezone,
  timezoneString: state => state.timezoneString,
}

// actions
const actions = {
  fetch({ state, commit, dispatch, rootState }) {
    dispatch('formatDate')
    return new Promise((resolve, reject) => {
      LocationService.getLocationData()
        .then(storedata => {
          commit(mutation.SET_STORE, storedata.data.store)
          commit(mutation.SET_BRAND, storedata.data.brand)
          commit(mutation.SET_PERMISSION, storedata.data.menu)
          commit(mutation.SET_LANGUAGE_DIRECTION, storedata.data.direction)
          commit(mutation.SET_TRASLATIONS, storedata.data.translations)
          commit(
            mutation.SET_AVAILABLE_LANGUAGES,
            storedata.data.available_lang
          )
          commit(mutation.SET_LOCATION, state.store.address)
          commit(mutation.SET_CURRENCY, state.store.currency)
          let userDetails = {}
          userDetails.username = storedata.data.username
          userDetails.userId = storedata.data.user_id
          userDetails.avatar = storedata.data.avatar
          commit(mutation.USER_SHORT_DETAILS, userDetails)

          TimezoneService.getTimezoneData(state.store.timezone)
            .then(timezoneData => {
              let timezoneName = timezoneData.data.item.name.split(' ')
              if (timezoneName[0] != undefined) {
                commit(mutation.SET_TIMEZONE_STRING, timezoneName[0])
              } else {
                commit(mutation.SET_TIMEZONE_STRING, 'Asia/Dubai')
              }
            })
            .catch(error => {
              reject(error)
            })

          commit('modules/SET_ENABLED_MODULES', state.brand.enabled_modules, {
            root: true,
          })
          dispatch('referrals')
          dispatch('auth/getUserDetails', storedata.data.user_id, {
            root: true,
          })
          // dispatch('getUserDetails', storedata.data.user_id)
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

  formatDate: function({ commit }) {
    let d = new Date(),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()
    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day
    let dateAPI = [year, month, day].join('-')
    commit(mutation.SET_DATE, dateAPI)
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
        { result: '', message: 'Please select one address' },
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
  [mutation.USER_SHORT_DETAILS](state, userDetails) {
    state.userShortDetails = userDetails
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
  [mutation.SET_PERMISSION](state, menu) {
    state.permissions = menu
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
  [mutation.SET_TIMEZONE_STRING](state, timezoneString) {
    state.timezoneString = timezoneString
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
    state.userShortDetails = false
  },
  [mutation.SET_DATE](state, dateAPI) {
    state.apiDate = dateAPI
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

/* eslint-disable no-console */
import * as mutation from './location/mutation-types'
import LocationService from '@/services/data/LocationService'
import DataService from '@/services/DataService'
import Num from '@/plugins/helpers/Num'
import db from '@/services/network/DB'
import TimezoneService from '@/services/data/TimezoneService'
import * as CONST from '@/constants'

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
  terminalCode: null,
  timezones: [],
}

// getters
const getters = {
  bgImage: state => (state.brand ? state.brand.brand_background : ''),
  formatPrice: state => price => {
    if (!price) price = 0.0
    return state.currency + ' ' + Num.round(price, 2).toFixed(2)
  },

  permitted: state => (pageId, parentId) => {
    typeof parentId == 'undefined' ? null : parentId
    if (state.permissions) {
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
    }
    return false
  },
  /*collectRouteMenu: state => {

  },*/
  _t: state => str => {
    if (state.translations && state.translations[str]) {
      return state.translations[str]
    }
    return str
  },
  currency: state => state.currency,
  timezone: state => (state.store ? state.store.timezone : null),
  timezoneString: state => state.timezoneString,
}

// actions
const actions = {
  //coming from login
  setContext({ state, commit, rootGetters }) {
    return new Promise(resolve => {
      LocationService.getLocationData().then(storedata => {
        commit(mutation.SET_BRAND, storedata.data.brand)

        if (storedata.data.store) {
          commit(mutation.SET_STORE, storedata.data.store)
        } else if (storedata.data.available_stores.length) {
          commit(mutation.SET_STORE, storedata.data.available_stores[0])
          const brand = storedata.data.available_brands.find(
            brand => brand._id == state.store.brand_id
          )
          if (brand) {
            commit(mutation.SET_BRAND, brand)
          }
        }

        if (state.store && state.store._id) {
          //set context as well
          commit('context/SET_BRAND_ID', state.brand._id, { root: true })
          commit('context/SET_STORE_ID', state.store._id, { root: true })

          localStorage.setItem('brand_id', state.brand._id)
          localStorage.setItem('store_id', state.store._id)

          DataService.setContext({
            brand: rootGetters['context/brand'],
            store: rootGetters['context/store'],
          })
        }

        resolve()
      })
    })
  },
  //got through brand/store
  fetch({ state, commit, dispatch, rootState, rootGetters }) {
    dispatch('formatDate')
    return new Promise((resolve, reject) => {
      LocationService.getLocationData()
        .then(storedata => {
          if (storedata.data.brand) {
            commit(mutation.SET_BRAND, storedata.data.brand)
          }

          commit(mutation.SET_PERMISSION, storedata.data.menu)
          commit(mutation.SET_LANGUAGE_DIRECTION, storedata.data.direction)
          commit(mutation.SET_TRASLATIONS, storedata.data.translations)
          if (!state.availableLanguages) {
            commit(
              mutation.SET_AVAILABLE_LANGUAGES,
              storedata.data.available_lang
            )
          }

          if (storedata.data.store) {
            commit(mutation.SET_STORE, storedata.data.store)
          }

          if (state.store && state.store._id) {
            //set context as well
            commit('context/SET_BRAND_ID', state.brand._id, { root: true })
            commit('context/SET_STORE_ID', state.store._id, { root: true })

            localStorage.setItem('brand_id', state.brand._id)
            localStorage.setItem('store_id', state.store._id)

            DataService.setContext({
              brand: rootGetters['context/brand'],
              store: rootGetters['context/store'],
            })
          } else {
            return reject('no store found in api data')
          }

          commit(mutation.SET_LOCATION, state.store.address)
          commit(mutation.SET_CURRENCY, state.store.currency)

          let userDetails = {}
          userDetails.username = storedata.data.username
          userDetails.userId = storedata.data.user_id
          userDetails.avatar = storedata.data.avatar
          commit(mutation.USER_SHORT_DETAILS, userDetails)

          TimezoneService.getTimezoneData(state.store.timezone).then(
            timezoneData => {
              commit(mutation.SET_TIMEZONES, timezoneData.data)
              const timezoneStr = state.timezones.data.find(
                timezone => timezone._id == state.store.timezone
              )
              if (timezoneStr) {
                const timezone = timezoneStr.name.replace(/\s+(GMT|GTM).*/g, '')
                commit(mutation.SET_TIMEZONE_STRING, timezone)
              }
            }
          )

          commit('modules/SET_ENABLED_MODULES', state.brand.enabled_modules, {
            root: true,
          })
          // dispatch('getUserDetails', storedata.data.user_id)
          //  else if (state.store.default_language) {
          //   locale = state.store.default_language
          // }
          // take out else part,as discussed with Alex language ll be dependent on cashier login

          if (!rootGetters['modules/enabled'](CONST.MODULE_POS)) {
            console.log('Point of sale not available.')
            reject('Point of sale not available.')
          } else {
            if (rootGetters['modules/enabled'](CONST.MODULE_CASHIER_APP)) {
              LocationService.registerDevice(rootState.auth.deviceId)
                .then(response => {
                  commit(mutation.SET_TERMINAL_CODE, response.data.id)
                  const data = {
                    id: 1,
                    token: localStorage.getItem('token'),
                    branch_n: state.store.branch_n,
                    terminal_code: state.terminalCode,
                  }
                  db.getBucket('auth')
                    .then(bucket => {
                      db.put(bucket, data)
                    })
                    .catch(error => {
                      reject(error)
                    })

                  resolve(state.locale)

                  dispatch('referrals')
                  dispatch('auth/getUserDetails', storedata.data.user_id, {
                    root: true,
                  })
                })
                .catch(error => {
                  console.log('device registration failed', error)
                  if (typeof error.data !== 'undefined') {
                    reject(error.data.error)
                  } else {
                    reject(
                      'Device registration not permitted for current login'
                    )
                  }
                })
            } else {
              console.log('Cashier apps not allowed')
              reject('Cashier apps not allowed')
            }
          }
          // commit(mutation.SET_CURRENCY, response.data.data.currency_symbol)
        })
        .catch(error => {
          //if refresh token faild log out user here
          console.log('refresh token failed, logout user', error)
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
  [mutation.SET_TIMEZONES](state, timezones) {
    state.timezones = timezones
  },
  [mutation.RESET](state, full = false) {
    state.setModal = '#manage-customer'
    state.userShortDetails = false

    if (full) {
      state.currency = 'AED'
      state.locale = 'en-US'
      state.timezone = 'Asia/Dubai'
      state.timezoneString = 'Asia/Dubai'
      state.brand = null
      state.store = null
      state.availableLanguages = null
      state.languageDirection = null
      state.translations = null
      state.location = null
      state.referrals = false
      state.permissions = false
      state.apiDate = ''
    }
  },
  [mutation.SET_DATE](state, dateAPI) {
    state.apiDate = dateAPI
  },
  [mutation.SET_TERMINAL_CODE](state, terminalCode) {
    state.terminalCode = terminalCode
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

/* eslint-disable no-console */
import * as mutation from './location/mutation-types'
import LocationService from '@/services/data/LocationService'
import DataService from '@/services/DataService'
import Num from '@/plugins/helpers/Num'
import db from '@/services/network/DB'
import TimezoneService from '@/services/data/TimezoneService'
import * as CONST from '@/constants'
import router from '../../router'
import moment from 'moment-timezone'
import { isObjectEmpty } from '@/util.js'
// initial state
const getDefaults = () => ({
  currency: 'AED',
  multiStoreIds: false,
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
  openHours: null,
  brandStores: false,
  jeeblyOrder: [],
  storeData: undefined,
})

const state = getDefaults()

// getters
const getters = {
  bgImage: state => (state.brand ? state.brand.brand_background : ''),
  formatPrice: state => price => {
    if (!price) price = 0.0
    return state.currency + ' ' + Num.round(price, 2).toFixed(2)
  },

  getReferral: state => id => {
    return state.referrals.find(referral => referral._id === id)
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
  isTokenManager: state => {
    if (state.store) {
      return state.store.token_manager
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
  // eslint-disable-next-line no-unused-vars
  setContext({ state, commit, rootGetters, dispatch }) {
    return new Promise((resolve, reject) => {
      LocationService.getLocationData().then(storedata => {
        if (!storedata.data || isObjectEmpty(storedata.data)) {
          return reject(
            `Sorry! current store doesn't belong to you. Please select correct store`
          )
        }
        let availabeStores = storedata.data.available_stores
        if (!router.currentRoute.params.store_id && availabeStores.length > 1) {
          commit('context/SET_STORES_LENGTH', availabeStores.length, {
            root: true,
          })
          commit('context/SET_MULTI_STORES', availabeStores, { root: true })
        }
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
        let path = storedata.data.start_path
        if (path != null) {
          if (availabeStores.length === 1) {
            if (CONST.POS_START_PATHS.includes(path)) {
              if (path === 'delivery_home') {
                path = 'delivery-manager'
              }
            } else {
              path = ''
            }

            let URL = path + rootGetters['context/store']
            router.replace(URL)
            //No need to call get userdetails again, we are already coming from login, where getuser details is already called
            // dispatch('auth/getUserDetails', storedata.data.user_id, {
            //   root: true,
            // })
          }
        } else {
          let currentURL = window.location.href
          if (currentURL.includes('/pos')) {
            if (
              router.currentRoute.params &&
              (!router.currentRoute.params.brand_id ||
                !router.currentRoute.params.store_id)
            ) {
              location.href = currentURL.split('/pos/')[0]
            }
          }
        }
        resolve()
      })
    })
  },
  getUIMenu({ commit }) {
    return new Promise((resolve, reject) => {
      LocationService.getLocationData()
        .then(updateAction => {
          if (updateAction.data.brand) {
            commit(mutation.SET_BRAND, updateAction.data.brand)
          }
          if (updateAction.data.store) {
            commit(mutation.SET_STORE, updateAction.data.store)
          }
          return resolve(true)
        })
        .catch(er => reject(er))
    })
  },
  updateTranslations({ commit }) {
    return new Promise((resolve, reject) => {
      LocationService.getLocationData()
        .then(uiMenu => {
          commit(mutation.SET_TRASLATIONS, uiMenu.data.translations)

          return resolve(true)
        })
        .catch(er => reject(er))
    })
  },
  //this function is called before pos load
  async getStore({ commit, dispatch, rootGetters, rootState }) {
    return new Promise((resolve, reject) => {
      LocationService.getLocationData()
        .then(response => {
          //check brand here
          commit('SET_BRAND', response.data.brand)
          commit('modules/SET_ENABLED_MODULES', state.brand.enabled_modules, {
            root: true,
          })

          if (!rootGetters['modules/enabled'](CONST.MODULE_POS)) {
            console.log('Point of sale not available.')
            return reject('Point of sale not available.')
          }

          if (rootGetters['modules/enabled'](CONST.MODULE_CASHIER_APP)) {
            console.log('Cashier apps not available.')
            return reject('Cashier apps not not available.')
          }

          //configure store
          commit('context/SET_CURRENT_STORE', response.data.store, {
            root: true,
          })
          commit('SET_STORE', response.data.store, { root: true })

          commit('SET_STORE_DATA', response)
          dispatch(
            'context/setBrandStoreContext',
            {
              brandId: response.data.brand._id,
              storeId: response.data.store._id,
            },
            { root: true }
          )

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

              // if user was already logged in, and refresh the browser,
              // in that case login api ll not hit and it ll not fetch the user details
              // so in that case we specifically  need to fetch the user details
              // hence we check user name here, if not found load customer details for current
              // store user
            })
            .catch(error => {
              console.log('device registration failed', error)
              if (typeof error.data !== 'undefined') {
                reject(error.data.error)
              } else {
                reject('Device registration not permitted for current login')
              }
            })
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  //this function is called when pos is loaded
  setupStore({ state, commit, dispatch, rootState, rootGetters }) {
    return new Promise(resolve => {
      const storedata = state.storeData
      dispatch('referrals')

      if (typeof storedata.data.available_stores !== 'undefined') {
        commit(
          'context/SET_AVAILABLE_MODULES',
          storedata.data.available_modules,
          {
            root: true,
          }
        )
        if (
          storedata.data.available_modules.includes(
            CONST.MODULE_MANUAL_ACCEPTANCE
          )
        ) {
          commit('deliveryManager/LIST_TYPE', 'Awaiting Acceptance', {
            root: true,
          })
        }
      }
      let availableStoreGroups = storedata.data.available_store_groups || false
      commit('auth/AVAILABLE_STORE_GROUPS', availableStoreGroups, {
        root: true,
      })

      let currentStore = storedata.data.store
      if (currentStore) {
        localStorage.setItem(
          'starting_token',
          currentStore.token_starting_number
        )
        commit('SET_OPEN_HOURS', currentStore.open_hours)
      }

      commit(mutation.SET_PERMISSION, storedata.data.menu)
      commit(mutation.SET_LANGUAGE_DIRECTION, storedata.data.direction)
      commit(mutation.SET_TRASLATIONS, storedata.data.translations)
      if (!state.availableLanguages) {
        commit(mutation.SET_AVAILABLE_LANGUAGES, storedata.data.available_lang)
      }

      commit(mutation.SET_LOCATION, state.store.address)
      commit(mutation.SET_CURRENCY, state.store.currency)
      let userDetails = {}
      userDetails.username = storedata.data.username
      userDetails.userId = storedata.data.user_id
      userDetails.avatar = storedata.data.avatar
      commit(mutation.USER_SHORT_DETAILS, userDetails)
      dispatch('timezone')

      let multiStoreIds = storedata.data.available_stores.map(
        store => store._id
      )
      let storeId = router.currentRoute.params.group_id || false
      if (storeId) {
        availableStoreGroups.find(group => {
          if (group._id === storeId) {
            multiStoreIds = group.group_stores
          }
        })
      }
      commit(mutation.MULTI_STORE_IDS, multiStoreIds)

      resolve({
        userDetails: rootState.auth.userDetails.item,
        stores: multiStoreIds,
        availableStoreGroups: availableStoreGroups,
      })
    })
  },
  timezone({ commit, state }) {
    TimezoneService.getTimezoneData(state.store.timezone).then(timezoneData => {
      commit(mutation.SET_TIMEZONES, timezoneData.data)
      const timezoneStr = state.timezones.data.find(
        timezone => timezone._id == state.store.timezone
      )
      if (timezoneStr) {
        const timezone = timezoneStr.name.replace(/\s+(GMT|GTM).*/g, '')
        commit(mutation.SET_TIMEZONE_STRING, timezone)
        if (!localStorage.getItem('token_reset_at')) {
          localStorage.setItem(
            'token_reset_at',
            moment()
              .tz(state.timezoneString)
              .format('YYYY-MM-DD')
          )
        }
      }
    })
  },
  referrals({ commit }) {
    LocationService.getReferrals().then(response => {
      commit(mutation.SET_REFERRALS, response.data.data)
      localStorage.setItem(
        'brand_referrals',
        JSON.stringify(response.data.data)
      )
    })
  },

  measurementUnits({ rootGetters, commit }) {
    if (rootGetters['sync/lastFetch']('h') > 12) {
      LocationService.getMeasurementUnits().then(response => {
        if (response && response.data) {
          commit('sync/lastFetch', null, { root: true })
          commit(mutation.SET_MEASUREMENT_UNITS, response.data)
        }
      })
    }
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
  //SET JUST RESPONSE.DATA.STORE
  [mutation.SET_STORE](state, store) {
    state.store = store
  },
  //SET RESPONSE
  SET_STORE_DATA(state, apiResponse) {
    state.storeData = apiResponse
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
    /*let referral = []
    referrals.find(ref => {
      if (typeof ref.name != 'undefined') {
        referral.push(ref)
      }
    })*/
    state.referrals = referrals
  },
  [mutation.SET_TIMEZONES](state, timezones) {
    state.timezones = timezones
  },
  [mutation.MULTI_STORE_IDS](state, multiStoreIds) {
    state.multiStoreIds = multiStoreIds
  },
  [mutation.RESET](state) {
    Object.assign(state, getDefaults())
  },
  [mutation.SET_DATE](state, dateAPI) {
    state.apiDate = dateAPI
  },
  [mutation.SET_OPEN_HOURS](state, openHours) {
    state.openHours = openHours
  },
  [mutation.SET_TERMINAL_CODE](state, terminalCode) {
    state.terminalCode = terminalCode
  },
  [mutation.SET_BRAND_STORES](state, brandStores) {
    state.brandStores = brandStores
  },
  [mutation.SET_ORDER_JEEBLY](state, data) {
    state.jeeblyOrder = data
    console.log(state.jeeblyOrder)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

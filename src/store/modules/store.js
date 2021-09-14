/* eslint-disable no-console */
import StoreService from '@/services/data/StoreService'
import DataService from '@/services/DataService'
import db from '@/services/network/DB'
import Fingerprint2 from 'fingerprintjs2'

// initial state
const getDefaults = () => ({
  apiVersions: undefined,
  apiDependencyVersions: undefined,
  locale: 'en-US',
  terminalCode: undefined,
  storePrerequisite: false,
})

const state = getDefaults()

// actions
const actions = {
  async getApiVersions({ commit }) {
    const versions = await StoreService.getApiVersions()

    commit(
      'SET_API_VERSIONS',
      Object.assign(
        {},
        versions.data.store_versions,
        versions.data.brand_versions,
        versions.data.global_versions
      )
    )
    commit('SET_API_DEPENDENCY_VERSIONS', versions.data.dep_tree)
  },
  loadStore({ rootGetters, dispatch, commit }) {
    return new Promise((resolve, reject) => {
      commit('SET_STORE_PREREQUISITE', false)

      //call versions and ui_menu api in parallel
      commit('sync/loaded', false, { root: true })
      dispatch('auth/resetModules', null, { root: true })
      Promise.all([
        dispatch('getApiVersions'),
        dispatch('location/fetch', null, { root: true }),
      ])
        .then(() => {
          console.log('brand loaded and versions fetched, loading open apis')
          dispatch('loadOpenApis').then(() => {
            commit('sync/loaded', true, { root: true })
            console.log('open apis loaded')
            resolve()
          })
          try {
            console.log('loading deffered apis')
            dispatch('defferedLoadOpenApis').finally(() => {
              dispatch('checkStorePrerequisite')

              console.log('deffered apis loaded')
            })
          } catch (error) {
            //inner level catch safe
            console.trace(error)
            reject(error)
          }
        })
        .catch(error => {
          dispatch('abortPos', {
            title: 'Brand failed to load.',
            description: error,
          })
          reject(error)
        })

      //try fetching user details if user id available, otherwise we ll get user info from ui_menu
      if (rootGetters['auth/userId']) {
        dispatch('auth/getUserDetails', rootGetters['auth/userId'], {
          root: true,
        })
      }
    })
  },

  loadOpenApis({ state, dispatch }) {
    DataService.setLang(state.locale)
    //no store prerequiste needed right now
    //call ui_menu
    return Promise.allSettled([
      dispatch('category/fetchAll', null, { root: true }),
      dispatch('payment/fetchAll', null, { root: true }),
      dispatch('modifier/fetchAll', null, { root: true }),
    ])
  },

  defferedLoadOpenApis({ dispatch }) {
    dispatch('location/timezone', null, { root: true })
    dispatch('surcharge/fetchAll', null, { root: true })
    dispatch('discount/fetchAll', null, { root: true })
    //in parallel check store requirements validations, subscription, terminal registration
    let promised = Promise.allSettled([
      Promise.all([
        dispatch('auth/fetchAllStoreUsers', null, { root: true }),
        dispatch('auth/fetchRoles', null, { root: true }),
      ]).then(() => {
        dispatch('auth/setRolesAndUsers', null, { root: true })
      }),
      //load delivery areas only from below customer
      dispatch('customer/fetchDeliveryArea', null, { root: true }),
      dispatch('customer/fetchCRMCustomerFields', null, { root: true }),

      dispatch('location/referrals', null, { root: true }),

      dispatch('invoice/printRules', null, { root: true }).then(() => {
        dispatch('invoice/fetchTemplates', null, { root: true })
      }),
    ]).catch(error => {
      console.trace(error)
    })

    dispatch('payment/setTranslations', null, { root: true })
    dispatch('category/getItemPreparingTime', null, { root: true })
    dispatch('printingServer/getKitchens', null, { root: true })
    //dispatch('announcement/fetchAll', state.auth.userDetails, { root: true })
    dispatch('printingServer/fetchAllKitchens', null, { root: true })
    dispatch('tax/openItemTaxes', null, { root: true })
    dispatch('dinein/fetchAll', null, { root: true })
    dispatch('customer/customerGroupList', null, { root: true })
    dispatch('category/fetchMeasurementUnits', null, { root: true })
    return promised
  },

  abortPos({ commit }, error) {
    //reset collections for orders
    commit('SET_STORE_PREREQUISITE', error)
  },
  async registerTerminal({ rootState, commit }, deviceId) {
    return new Promise((resolve, reject) => {
      console.log('registering terminal with id: ', deviceId)
      StoreService.registerDevice(deviceId)
        .then(response => {
          console.log(response)
          commit('SET_TERMINAL_CODE', response.data.id)
          const data = {
            id: 1,
            token: localStorage.getItem('token'),
            branch_n: rootState.location.store.branch_n,
            terminal_code: state.terminalCode,
          }
          console.log('resolving')
          resolve()
          db.getBucket('auth')
            .then(bucket => {
              db.put(bucket, data)
            })
            .catch(error => {
              reject(error)
            })
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
  },

  checkStorePrerequisite({ commit, dispatch }) {
    //register device
    dispatch('detectBrowser').then(browserId => {
      commit('auth/SET_DEVICE_CODE', browserId, { root: true })
      dispatch('registerTerminal', browserId)
        .then()
        .catch(error => {
          console.trace(error)
          dispatch('abortPos', {
            title: 'Device registration not allowed.',
            description: 'Please contact your store owner for access',
          })
        })
    })
    //check subscription
    StoreService.validateStoreSubscription()
      .then(response => {
        if (response.data && response.data.is_expired) {
          dispatch('abortPos', {
            title: 'Store subscription has been expired.',
            description: 'Please contact your store owner for access',
          })
        }
      })
      .catch(error => {
        dispatch('abortPos', {
          title: 'Store subscription has been expired.',
          description: error,
        })
      })
  },
  detectBrowser() {
    return new Promise(resolve => {
      const browserComponents = [
        'userAgent',
        'language',
        'deviceMemory',
        'hardwareConcurrency',
        'screenResolution',
        'availableScreenResolution',
        'timezoneOffset',
        'timezone',
        'indexedDb',
        'cpuClass',
        'platform',
        'canvas',
        'webgl',
        'webglVendorAndRenderer',
      ]
      setTimeout(function() {
        Fingerprint2.get(function(components) {
          const values = components.filter(component => {
            if (browserComponents.includes[component.key]) {
              return component.value
            }
          })
          const murmur = Fingerprint2.x64hash128(values.join(''), 31)
          resolve(murmur)
        })
      }, 10)
    })
  },
}
// getters
const getters = {
  all_core_versions: state => state.apiVersions,
  getVersion: (state, getters) => model => {
    let version = getters.findVersion(model)
    if (version) {
      version += ',' + getters.findDependencies(model)
    }
    return version
  },
  findVersion: (state, getters) => model => {
    var collection_remaps = {
      root_stores: 'stores',
      new_style_root_delivery_areas: 'new_style_store_delivery_areas',
      root_order_discounts: 'brand_order_discounts',
      brand_item_discounts: 'brand_item_discount',
    }
    var collection_id = collection_remaps[model] || model

    var ver = getters.all_core_versions
    if (ver && ver[collection_id] !== undefined) {
      return ver[collection_id]
    }
    return undefined
  },
  findDependencies: (state, getters) => collection_id => {
    let deps = []

    if (
      state.apiDependencyVersions &&
      state.apiDependencyVersions[collection_id]
    ) {
      state.apiDependencyVersions[collection_id]
        .sort()
        .forEach(depCollectionId => {
          const depVersion = getters.findVersion(depCollectionId)
          if (depVersion) {
            deps.push(
              depCollectionId + ',' + getters.findVersion(depCollectionId)
            )
          }
        })
    }
    return deps.length ? deps.join(',') : ''
  },
}

// mutations
const mutations = {
  SET_API_VERSIONS(state, payload) {
    state.apiVersions = payload
  },
  SET_API_DEPENDENCY_VERSIONS(state, payload) {
    state.apiDependencyVersions = payload
  },
  SET_TERMINAL_CODE(state, terminalCode) {
    state.terminalCode = terminalCode
  },
  SET_STORE_PREREQUISITE(state, value) {
    state.storePrerequisite = value
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

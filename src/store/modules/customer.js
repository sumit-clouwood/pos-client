import * as mutation from './customer/mutation-types'
import CustomerService from '@/services/data/CustomerService'
import LookupData from '@/plugins/helpers/LookupData'
import OrderService from '@/services/data/OrderService'
import MultistoreHelper from '@/plugins/helpers/Multistore.js'
import * as CONST from '@/constants'

const state = {
  customer_list: [],
  customer: false,
  crm_fields: undefined,
  all_crm_fields: [],
  mandatory_fields: [],
  multistore: false,
  multistoreDeliveryArea: {},
  customerId: null,
  customer_group: {},
  paginate: {},
  lastOrder: false,
  pastOrders: false,
  crm_address_fields: [],
  isBrandHasDeliveryOrder: true,
  // customerLastOrderDetails: false,
  pastOrdersPaginate: {},
  params: {
    page_number: 1,
    page_size: 10,
    query: '',
    past_order_page_number: 1,
  },
  responseInformation: { status: 0, message: '' },
  pageId: 'brand_customers_main_tbl',
  address: false,
  allOnlineAddress: false,
  offlineData: null,
  loading: false,
  customerLoading: false,
  error: false,
  loyalty: { card: false, details: false, points: false },
  deliveryAreas: false,
  fetchDeliveryAreas: false,
  editInformation: {},
  modalStatus: 'Add',
  lookups: false,
  buildingAreas: false,
}

const getters = {
  findDeliveryArea: state => areaId => {
    return state.fetchDeliveryAreas.find(
      deliveryArea => deliveryArea.delivery_area === areaId
    )
  },
  customer: state => {
    return state.customer
  },
  // Added this function if we need store Id again
  // eslint-disable-next-line no-unused-vars
  getDeliveryAreaStatus: (state, getters, rootState) => dArea => {
    // let storeId = rootState.context.storeId
    /*return dArea.stores.find(entity => {
      if (entity.entity_id == storeId && entity.item_status) {
        return true
      } else false
    });*/
    return dArea
  },
  selectedAddress: state => {
    if (state.address) {
      const addressId = state.address.delivery_area_id
      return state.customer.customer_addresses.find(
        address => address._id.$oid == addressId
      )
    }
  },
  checkDeliveryArea: () => (addressId, deliveryAreas) => {
    let areas = Object.values(deliveryAreas)
    return areas.find(area => {
      if (area.item_status && area.delivery_area === addressId) {
        return area
      }
    })
    /*if (typeof deliveryAreas[addressId] !== 'undefined') {
      const area = deliveryAreas[addressId]
      return area.item_status === true ? area : false
    }*/
    // return false
  },
  // eslint-disable-next-line no-unused-vars
  getDeliveryArea: state => addressId => {
    return addressId && addressId != '' ? addressId.split('|').join(', ') : 'NA'
  },
  getCustomerAddresses: (state, getters) => {
    if (state.customer && state.customer.customer_addresses) {
      let avilableCustomerAddress = state.customer.customer_addresses.map(
        address => {
          if (!address.delivery_area_id) {
            address.min_order_value = 0
            address.special_order_surcharge = 0
            return address
          }
          let checkDeliveryArea = getters.checkDeliveryArea(
            address.delivery_area_id,
            state.deliveryAreas
          )

          if (checkDeliveryArea) {
            address.min_order_value = checkDeliveryArea.min_order_value
            address.special_order_surcharge =
              checkDeliveryArea.special_order_surcharge

            return address
          }
        }
      )
      return avilableCustomerAddress
    }

    return []
  },
  deliveryAreaNames: state => {
    if (state.fetchDeliveryAreas) {
      let newAreas = []
      state.fetchDeliveryAreas.forEach(area => {
        let newArea = { ...area }
        newArea.delivery_area = newArea.delivery_area
          ? newArea.delivery_area.split('|').join(', ')
          : ''
        newAreas.push(newArea)
      })
      return newAreas
    }
    return state.fetchDeliveryAreas
    // return areaId ? areaId.split('|').join(', ') : ''
  },
  crmAddressFields: state => state.crm_address_fields,
  // eslint-disable-next-line no-unused-vars
  getElementByAreaId: state => (deliveryArea, element) => {
    if (deliveryArea) {
      let deliveryAreaArr = deliveryArea ? deliveryArea.split('|') : []
      return deliveryAreaArr[deliveryAreaArr.length - element]
    }
    return ''
  },
}
const actions = {
  setAddressForDelivery({ dispatch, commit }, { customerId, addressId }) {
    dispatch('fetchSelectedCustomer', customerId).then(() => {
      dispatch('setCustomerAddressById', addressId).then(() => {
        commit('location/SET_MODAL', '#order-confirmation', { root: true })
      })
    })
  },
  fetchCRMCustomerFields({ commit, dispatch }) {
    // return new Promise((resolve, reject) => {
    CustomerService.fetchCRMFields().then(response => {
      let fields_by_group = {
        GENERAL_INFORMATION: [],
        ADDITIONAL_INFORMATION: [],
        _ADDRESS: [],
      }
      let mandate_fields = []
      let all_fields = []
      if (response.data.data) {
        // eslint-disable-next-line no-debugger
        // debugger
        response.data.data.forEach(field => {
          all_fields[field.name_key] = ''
          if (field.name_key === 'delivery_area_id' && !field.item_status) {
            commit('IS_BRAND_HAS_DELIVERY_ORDER', false)
          }
          if (field.mandatory) mandate_fields.push(field)
          if (field.group === CONST.GENERAL_INFORMATION) {
            fields_by_group.GENERAL_INFORMATION.push(field)
          } else if (field.group === CONST.ADDITIONAL_INFORMATION) {
            fields_by_group.ADDITIONAL_INFORMATION.push(field)
          } else if (field.group === CONST.CUSTOMER_ADDRESS) {
            fields_by_group._ADDRESS.push(field)
          }
        })
        commit('SET_CUSTOMER_FIELDS', {
          group: fields_by_group,
          all_fields: all_fields,
        })
        commit('SET_CUSTOMER_MANDATORY_FIELDS', mandate_fields)
        dispatch('address_fields')
      }
    })
    // })
  },
  address_fields({ state, commit }) {
    let crm_fields = []
    if (state.crm_fields) {
      state.crm_fields['_ADDRESS'].forEach(field => {
        crm_fields[field.name_key] = ''
      })
    }
    commit('CRM_ADDRESS_FIELD', crm_fields)
  },
  fetchAllCustomers({ commit, dispatch }) {
    commit(mutation.FETCH_ALL, 'brand_customers_main_tbl')
    dispatch('fetchAll')
  },
  addCustomer({ dispatch, state }) {
    const params = [
      {
        // nearest_landmark: '',
        is_web_admin: false,
        ...state.all_crm_fields,
        // lat_lng_available: true,
        // location_coordinates: { lat: 0, lng: 0 },
        /*alternative_phone: '',
        phone_number: '',
        gender: 'undisclosed',
        birthday: '',
        customer_group: '',
        delivery_area_id: '',
        street: '',
        building: '',
        flat_number: '',
        email: '',*/
      },
    ]
    dispatch('setDefaultSettingsGlobalAddUpdate', ...params)
  },
  fetchAll({ commit, rootState, dispatch, state }) {
    commit(mutation.SET_LOADING, true)
    return new Promise((resolve, reject) => {
      const params = [
        rootState.context.storeId,
        state.params.query /*query*/,
        state.params.page_number /*page_number*/,
        'created_at',
        state.params.page_size /*page_size*/,
        state.pageId,
      ]

      CustomerService.customerList(...params)
        .then(response => {
          if (!isNaN(response.data.count)) {
            let totalPages = Math.ceil(
              parseInt(response.data.count) / parseInt(state.params.page_size)
            )
            commit(mutation.PAGINATE_DETAILS, totalPages)
            if (response.data.page_lookups) {
              commit(mutation.LAST_ORDERS, response.data.page_lookups.orders)
            }
            commit(mutation.CUSTOMER_LIST, response.data.data)
            resolve(response.data.data)
          } else {
            reject(response.data.data)
          }
          commit(mutation.SET_LOADING, false)
        })
        .catch(error => reject(error))
      //fetch customer deliver areas
      resolve()
      dispatch('fetchDeliveryArea', '')
      dispatch('fetchCRMCustomerFields')
      // get Customer Group
      CustomerService.customerGroupList().then(response => {
        commit(mutation.SET_CUSTOMER_GROUP, response.data.data)
      })
      CustomerService.customerBuildings().then(buildingAreas => {
        if (buildingAreas.data.data) {
          let obj = Object.values(buildingAreas.data.data)
          commit(mutation.BUILDING_AREA, obj)
        }
      })
    })
  },

  setPageNumber: function({ commit, dispatch }, pageNumber) {
    commit(mutation.SET_LOADING, true)
    commit(mutation.SET_CURRENT_PAGE_NO, pageNumber)
    dispatch('fetchAll').then(() => {
      commit(mutation.SET_LOADING, false)
    })
  },

  setPastOrderPageNumber: function({ commit, dispatch }, pageNumber) {
    commit(mutation.SET_PAST_ORDER_CURRENT_PAGE_NO, pageNumber)
    let customerId = state.customer._id
    dispatch('fetchSelectedCustomer', customerId)
  },
  getMorePastOrder({ commit, state }, pageNumber) {
    const params = [
      '',
      state.params.page_size,
      'real_created_datetime',
      '',
      pageNumber,
      'orders_main_tbl',
      '',
      state.customer._id,
    ]
    OrderService.getOrders(...params).then(response => {
      commit(mutation.PAST_ORDERS, response.data.data)
    })
  },
  searchCustomer: function({ commit, dispatch }, searchTerms) {
    return new Promise((resolve, reject) => {
      commit(mutation.CUSTOMER_LIST, [])
      commit(mutation.SET_LOADING, true)
      commit(mutation.SET_SEARCH_TERMS, searchTerms)
      dispatch('fetchAll')
        .then(response => {
          resolve(response)
        })
        .catch(error => reject(error, commit(mutation.SET_LOADING, false)))
        .finally(() => commit(mutation.SET_LOADING, false))
    })
  },

  addNote({ commit }, note) {
    if (typeof state.customer._id !== 'undefined') {
      let customerNote = { note: note }
      const params = [customerNote, state.customer._id, 'brand_customer_notes']
      CustomerService.globalCreate(...params).then(response => {
        commit(mutation.SET_RESPONSE_MESSAGES, response.data)
      })
    } else {
      alert('Customer not selected yet')
    }
  },

  fetchSelectedCustomer({ state, commit, dispatch, rootGetters }, customerId) {
    commit(mutation.SET_CUSTOMER_LOADING, true)
    dispatch('location/updateModalSelectionDelivery', '#loyalty-payment', {
      root: true,
    })
    return new Promise((resolve, reject) => {
      commit(mutation.SET_CUSTOMER_ID, customerId)
      if (customerId) {
        CustomerService.fetchCustomer(customerId)
          .then(response => {
            let totalPages = 0
            let totleOrders = false
            if (response.data.item && response.data.item.total_orders) {
              totleOrders = response.data.item.total_orders
            }

            if (totleOrders) {
              totalPages = Math.ceil(
                parseInt(response.data.item.total_orders) /
                  parseInt(state.params.page_size)
              )
            }
            commit(mutation.PAST_ORDER_PAGINATE_DETAILS, totalPages)
            if (response.data.collected_data) {
              commit(
                mutation.PAGE_LOOKUP,
                response.data.collected_data.page_lookups
              )
            }
            let loyalty = {},
              orderType = null,
              orderCurrency = null,
              orderAmount = null
            orderType = rootGetters['order/orderType']
            orderCurrency = rootGetters['location/currency']
            orderAmount = rootGetters['checkoutForm/orderTotal']

            if (response.data.collected_data) {
              loyalty.card = response.data.collected_data.loyalty_cards
            }
            loyalty.details = state.lookups.brand_loyalty_programs

            commit(mutation.LOYALTY, loyalty)
            commit(mutation.LOYALTY_FILTER, {
              loyalty,
              orderType,
              orderCurrency,
              orderAmount,
            })
            commit(mutation.SELECTED_CUSTOMER, {
              customerData: response.data.item,
              pastOrders: response.data.collected_data
                ? response.data.collected_data.orders
                : [],
              deliveryAreas: response.data.collected_data
                ? response.data.collected_data.page_lookups.delivery_areas._id
                : null,
            })
            commit(mutation.SET_CUSTOMER_LOADING, false)
            resolve(response.data.item)
          })
          .catch(error => reject(error))
      }
    })
  },
  resetCustomer({ commit, dispatch }) {
    let customerDetails = {}
    customerDetails.customerData = false
    customerDetails.deliveryAreas = false
    customerDetails.pastOrders = false
    commit(mutation.SELECTED_CUSTOMER, customerDetails)
    commit('order/SET_REFERRAL', false, { root: true })
    dispatch('reset', true)
  },
  selectedAddress({ commit, dispatch }, address) {
    //let deliveryArea = getters.findDeliveryArea(address.delivery_area_id)
    //const subtotal = rootGetters['order/subTotal']
    // if (deliveryArea.min_order_value > subtotal) {
    //   return Promise.reject(
    //     rootGetters['location/_t'](
    //       `Order amound should be grater than ${subtotal}`
    //     )
    //   )
    // } else {
    commit(mutation.SELECTED_CUSTOMER_ADDRESS, address)
    let orderType = { OTview: 'Delivery', OTApi: 'call_center' }
    return dispatch('order/updateOrderType', orderType, { root: true })
    //}
  },

  createAction({ commit, dispatch }, actionDetails) {
    return new Promise((resolve, reject) => {
      const params = [
        actionDetails.data,
        actionDetails.customer,
        actionDetails.model,
      ]
      CustomerService.globalCreate(...params)
        .then(response => {
          commit(mutation.SET_RESPONSE_MESSAGES, response.data)
          if (actionDetails.customer) {
            dispatch('fetchSelectedCustomer', actionDetails.customer)
          } else {
            dispatch('fetchAll')
          }
          if (
            typeof response.data.id != 'undefined' &&
            actionDetails.model === 'brand_customers'
          ) {
            let customerId = actionDetails.customer || response.data.id
            dispatch('fetchSelectedCustomer', customerId).then(customer => {
              if (state.isBrandHasDeliveryOrder) {
                dispatch('selectedAddress', customer.customer_addresses[0])
                commit('location/SET_MODAL', '#order-confirmation', {
                  root: true,
                })
              }
            })
          }

          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  },

  editAction({ commit }, actionDetails) {
    let customer_id = state.customer._id
    const params = [
      actionDetails.id,
      customer_id,
      actionDetails.model,
      actionDetails.action,
    ]
    localStorage.setItem('editItemKey', actionDetails.id)
    CustomerService.globalEdit(...params).then(response => {
      commit(mutation.SET_EDIT_DETAILS, response.data.item)
    })
  },

  updateAction({ commit, dispatch }, actionDetails) {
    let customer_id =
      typeof state.customer != 'undefined' ? state.customer._id : false
    const params = [
      actionDetails.id,
      customer_id,
      actionDetails.model,
      actionDetails.action,
      actionDetails.data,
    ]
    CustomerService.globalUpdate(...params).then(response => {
      commit(mutation.SET_RESPONSE_MESSAGES, response.data)
      dispatch('fetchSelectedCustomer', customer_id)
      dispatch('fetchAll')
    })
  },

  setDefaultSettingsGlobalAddUpdate({ commit, state }, setDefaultSettings) {
    if (setDefaultSettings === 'address') {
      commit(mutation.SET_ADD_DETAILS, state.crm_address_fields)
    } else {
      commit(mutation.SET_ADD_DETAILS, setDefaultSettings)
    }
  },

  fetchDeliveryArea({ commit, rootGetters }, query) {
    if (rootGetters['auth/multistore']) {
      let msDeliveryAreas = MultistoreHelper.filter(
        state.multistoreDeliveryArea,
        '_id'
      )
      commit(mutation.GET_DELIVERY_AREAS, {
        deliveryAreas: msDeliveryAreas,
        multistore: false,
      })
    } else {
      CustomerService.fetchDeliveryAreas(query, false).then(response => {
        commit(mutation.GET_DELIVERY_AREAS, {
          deliveryAreas: response.data.data,
          multistore: false,
        })
      })
    }
  },

  fetchMultiStore({ rootState, commit, rootGetters }, stores) {
    //don't repeat in case storeId is provided otherwise it ll just loop in
    //load discounts for all stores both item and order
    stores.forEach(storeId => {
      //skip current store
      if (storeId !== rootState.context.storeId) {
        CustomerService.fetchDeliveryAreas('', storeId).then(response => {
          //Fetch Delivery Areas in add Customer Address and Add new customer form
          let msDeliveryAreas = response.data.data
          let setMSDeliveryArea = {
            deliveryAreas: msDeliveryAreas,
            multistore: storeId
              ? storeId
              : rootGetters['auth/multistore']
              ? rootState.context.storeId
              : false,
          }
          commit(mutation.GET_DELIVERY_AREAS, setMSDeliveryArea)
        })
      }
    })
  },
  setCustomerAddressById({ dispatch, state, getters }, addressId) {
    return new Promise(resolve => {
      let customerAddress = state.customer || false
      if (customerAddress) {
        let address = state.customer.customer_addresses.find(
          address => address._id.$oid == addressId
        )
        address.delivery_area = getters.getDeliveryArea(
          address.delivery_area_id
        )
        dispatch('selectedAddress', address).then(() => resolve())
      }
    })
  },

  setOfflineData({ commit }, data) {
    commit(mutation.SET_OFFLINE_DATA, data)
  },

  reset({ commit, rootGetters }, force) {
    commit(mutation.RESET, {
      force: force,
      multistore: rootGetters['auth/multistore'],
    })
    commit(mutation.LOYALTY, false)
    commit(mutation.LOYALTY_FILTER)
  },
}

const mutations = {
  [mutation.CUSTOMER_LIST](state, customersDetail) {
    state.customer_list = customersDetail
  },
  [mutation.SET_CUSTOMER_ID](state, id) {
    state.customerId = id
  },
  [mutation.PAGINATE_DETAILS](state, paginateDetails) {
    const paginate = { ...state.paginate }
    paginate.totalPages = paginateDetails
    state.paginate = paginate
  },
  [mutation.PAST_ORDER_PAGINATE_DETAILS](state, paginateDetails) {
    state.pastOrdersPaginate.totalPages = paginateDetails
  },
  [mutation.SET_CURRENT_PAGE_NO](state, pageNumber) {
    state.params.page_number = pageNumber
  },
  [mutation.FETCH_ALL](state, pageId) {
    state.pageId = pageId
    state.params.query = ''
  },
  [mutation.PARAMS](state, paramsCollection) {
    state.params = paramsCollection
  },
  [mutation.GET_DELIVERY_AREAS](state, { deliveryAreas, multistore }) {
    if (multistore) {
      state.multistoreDeliveryArea = {
        ...state.multistoreDeliveryArea,
        [multistore]: deliveryAreas,
      }
      state.multistore = true
    }
    state.fetchDeliveryAreas = deliveryAreas
  },
  [mutation.SET_PAST_ORDER_CURRENT_PAGE_NO](state, pageNumber) {
    state.params.past_order_page_number = pageNumber
  },
  [mutation.SET_SEARCH_TERMS](state, searchTerms) {
    state.params.query = searchTerms
    state.pageId = 'brand_customers_main_tbl'
    //  searchTerms.length > 0 ? 'main_crm_list' : 'brand_customers_main_tbl'
    state.params.page_number = 1
  },
  [mutation.SET_CUSTOMER_GROUP](state, customerGroup) {
    state.customer_group = customerGroup
  },
  [mutation.BUILDING_AREA](state, buildingAreas) {
    state.buildingAreas = buildingAreas
  },
  [mutation.SET_EDIT_DETAILS](state, details) {
    state.editInformation = details
    state.modalStatus = 'Edit'
  },
  [mutation.SET_ADD_DETAILS](state, details) {
    state.editInformation = details
    state.modalStatus = 'Add'
  },
  [mutation.LAST_ORDERS](state, orders) {
    state.lastOrder = orders
  },
  [mutation.PAGE_LOOKUP](state, lookups) {
    state.lookups = lookups
  },
  /*[mutation.CUSTOMER_LAST_ORDERS](state, customerLastOrder) {
    state.customerLastOrderDetails = customerLastOrder
  },*/
  [mutation.SET_RESPONSE_MESSAGES](state, customerCreateResponse) {
    if (customerCreateResponse.status == 'form_errors') {
      state.responseInformation.status = customerCreateResponse.status
      state.responseInformation.message = customerCreateResponse.form_errors
    } else {
      state.responseInformation.status = customerCreateResponse.status
      state.responseInformation.message = customerCreateResponse
    }
  },
  [mutation.SELECTED_CUSTOMER](state, customerDetails) {
    state.customer = customerDetails.customerData
    if (state.multistore) {
      let msDeliveryAreas = []
      state.fetchDeliveryAreas.forEach(area => {
        if (
          customerDetails.deliveryAreas &&
          typeof customerDetails.deliveryAreas[area._id] !== 'undefined'
        ) {
          msDeliveryAreas[area._id] = customerDetails.deliveryAreas[area._id]
        }
      })
      state.deliveryAreas = msDeliveryAreas
    } else {
      state.deliveryAreas = customerDetails.deliveryAreas
    }
    state.pastOrders = customerDetails.pastOrders
  },
  [mutation.SELECTED_CUSTOMER_ADDRESS](state, selectedAddress) {
    state.address = selectedAddress
  },
  [mutation.PAST_ORDERS](state, pastOrders) {
    state.pastOrders = pastOrders
  },
  /*[mutation.FETCH_CUSTOMER_ADDRESSES](state, addressList) {
    state.allOnlineAddress = addressList
  },*/
  [mutation.SET_OFFLINE_DATA](state, data) {
    state.offlineData = data
  },
  [mutation.RESET](state, { force, multistore }) {
    if (!force && multistore) {
      return false
    }
    state.offlineData = null
    state.address = false
    state.customer = false
    state.customerId = null
    state.loyalty = { card: false, details: false }
  },
  [mutation.SET_LOADING](state, status) {
    state.loading = status
  },
  [mutation.SET_CUSTOMER_LOADING](state, status) {
    state.customerLoading = status
  },
  [mutation.SET_ERROR](state, error) {
    state.error = error
  },
  SET_CUSTOMER_FIELDS: (state, fields) => {
    state.crm_fields = fields.group
    state.all_crm_fields = fields.all_fields
  },
  CRM_ADDRESS_FIELD: (state, fields) => {
    state.crm_address_fields = fields
  },
  IS_BRAND_HAS_DELIVERY_ORDER: (state, status) => {
    state.isBrandHasDeliveryOrder = status
  },
  SET_CUSTOMER_MANDATORY_FIELDS: (state, mandate_fields) =>
    (state.mandatory_fields = mandate_fields),
  [mutation.LOYALTY](state, loyalty) {
    if (loyalty) {
      if (loyalty.card && loyalty.card.length) {
        state.loyalty.card = loyalty.card[0]
      }

      if (loyalty.details) {
        let loyaltyDetails = LookupData.get({
          collection: loyalty.details._id,
          matchWith: state.loyalty.card.program,
          selection: false,
        })
        state.loyalty.details = loyaltyDetails ? loyaltyDetails : false
      }
    } else {
      state.loyalty.card = false
      state.loyalty.details = false
      state.loyalty.points = false
    }
  },
  [mutation.LOYALTY_FILTER](
    state,
    // eslint-disable-next-line no-unused-vars
    { loyalty, orderType, orderCurrency, orderAmount } = {
      loyalty: null,
      orderType: null,
      orderCurrency: null,
      orderAmount: null,
    }
  ) {
    if (loyalty) {
      if (
        orderType == 'walk_in' &&
        state.loyalty.details.walk_in_spend_points !== true
      ) {
        state.loyalty.card = false
        state.loyalty.details = false
        state.loyalty.points = false
      }
      if (
        orderType == 'call_center' &&
        state.loyalty.details.call_center_spend_points !== true
      ) {
        state.loyalty.card = false
        state.loyalty.details = false
        state.loyalty.points = false
      }
      if (
        orderType == 'dine_in' &&
        state.loyalty.details.dine_in_spend_points !== true
      ) {
        state.loyalty.card = false
        state.loyalty.details = false
        state.loyalty.points = false
      }
      if (state.loyalty.details.currency != orderCurrency) {
        state.loyalty.card = false
        state.loyalty.details = false
        state.loyalty.points = false
      } else {
        // if (state.loyalty.details.min_order > orderAmount) {
        //   state.loyalty.card = false
        //   state.loyalty.details = false
        //   state.loyalty.points = false
        // } else {
        /* do noting */
      }
    } else {
      state.loyalty.card = false
      state.loyalty.details = false
      state.loyalty.points = false
    }
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

import * as mutation from './customer/mutation-types'
import CustomerService from '@/services/data/CustomerService'
import LookupData from '@/plugins/helpers/LookupData'
import OrderService from '@/services/data/OrderService'

const state = {
  customer_list: [],
  customer: false,
  customerId: null,
  customer_group: {},
  paginate: {},
  lastOrder: false,
  pastOrders: false,
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
  customer: state => {
    return state.customer
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
    if (
      typeof deliveryAreas._id !== 'undefined' &&
      deliveryAreas._id === addressId
    ) {
      return deliveryAreas.item_status
    }
    if (typeof deliveryAreas[addressId] !== 'undefined') {
      const area = deliveryAreas[addressId]
      return area.item_status === true ? area : false
    }
    return false
  },
  getDeliveryArea: state => addressId => {
    return LookupData.check({
      collection: state.deliveryAreas,
      matchWith: addressId,
      selection: 'name',
    })
  },
  getCustomerAddresses: (state, getters, rootState) => {
    let data = {}
    if (state.customer && state.customer.customer_addresses) {
      data = state.customer.customer_addresses.filter(area => {
        let checkDeliveryArea = getters.checkDeliveryArea(
          area.delivery_area_id,
          state.deliveryAreas
        )
        if (area.store_id == rootState.context.storeId && checkDeliveryArea) {
          return area
        }
      })
    }
    return data
  },
}
const actions = {
  fetchAllCustomers({ commit, dispatch }) {
    commit(mutation.FETCH_ALL, 'brand_customers_main_tbl')
    dispatch('fetchAll')
  },
  addCustomer({ dispatch }) {
    const params = [
      {
        nearest_landmark: '',
        alternative_phone: '',
        gender: 'undisclosed',
        birthday: '',
        customer_group: '',
        delivery_area_id: '',
        street: '',
        building: '',
        flat_number: '',
        email: '',
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
        'last_order_datetime',
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
                ? response.data.collected_data.page_lookups.delivery_areas._id[
                    Object.keys(
                      response.data.collected_data.page_lookups.delivery_areas
                        ._id
                    )[0]
                  ]
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
    dispatch('reset')
  },
  selectedAddress({ commit, dispatch }, address) {
    // eslint-disable-next-line no-console
    console.log(address)
    commit(mutation.SELECTED_CUSTOMER_ADDRESS, address)
    let orderType = { OTview: 'Delivery', OTApi: 'call_center' }
    dispatch('order/updateOrderType', orderType, { root: true })
  },

  createAction({ commit, dispatch, rootState }, actionDetails) {
    return new Promise((resolve, reject) => {
      const params = [
        { ...actionDetails.data, store_id: rootState.context.storeId },
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

  setDefaultSettingsGlobalAddUpdate({ commit }, setDefaultSettings) {
    commit(mutation.SET_ADD_DETAILS, setDefaultSettings)
  },

  fetchDeliveryArea({ commit, rootState }, query) {
    CustomerService.fetchDeliveryAreas(query).then(response => {
      //Fetch Delivery Areas in add Customer Address and Add new customer form
      let data = response.data.data.filter(function(u) {
        if (
          u.store_id == rootState.context.storeId ||
          (u.stores && u.stores.includes(rootState.context.storeId))
        ) {
          return u.item_status
        }
      })
      commit(mutation.GET_DELIVERY_AREAS, data)
    })
  },

  setCustomerAddressById({ dispatch, state, getters }, addressId) {
    let address = state.customer.customer_addresses.find(
      address => address._id.$oid == addressId
    )
    address.delivery_area = getters.getDeliveryArea(address.delivery_area_id)
    dispatch('selectedAddress', address)
  },

  setOfflineData({ commit }, data) {
    commit(mutation.SET_OFFLINE_DATA, data)
  },

  reset({ commit }) {
    commit(mutation.RESET)
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
  [mutation.GET_DELIVERY_AREAS](state, fetchDeliveryAreas) {
    state.fetchDeliveryAreas = fetchDeliveryAreas
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
    state.deliveryAreas = customerDetails.deliveryAreas
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
  [mutation.RESET](state) {
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
      } else if (state.loyalty.details.min_order > orderAmount) {
        state.loyalty.card = false
        state.loyalty.details = false
        state.loyalty.points = false
      } else {
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

import * as mutation from './customer/mutation-types'
import CustomerService from '@/services/data/CustomerService'
import LookupData from '@/plugins/helpers/LookupData'

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
  checkDeliveryArea: (addressId, deliveryAreas) => {
    if (typeof deliveryAreas[addressId] !== 'undefined') {
      const area = deliveryAreas[addressId]
      return area.item_status === true ? area : false
    }
    return false
  },
  getDeliveryArea: state => addressId => {
    return LookupData.get({
      collection: state.deliveryAreas,
      matchWith: addressId,
      selection: 'name',
    })
  },
  getCustomerAddresses: state => {
    let data = {}
    if (state.customer && state.customer.customer_addresses) {
      // return state.customer.customer_addresses
      data = state.customer.customer_addresses.filter(area => {
        if (
          getters.checkDeliveryArea(area.delivery_area_id, state.deliveryAreas)
        ) {
          return area
        }
      })
    }
    return data
  },
}
const actions = {
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
      },
    ]
    dispatch('setDefaultSettingsGlobalAddUpdate', ...params)
  },
  fetchAll({ commit, rootState, dispatch, state }) {
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
          if (response.data.data.length) {
            let totalPages = Math.ceil(
              parseInt(response.data.count) / parseInt(state.params.page_size)
            )
            commit(mutation.PAGINATE_DETAILS, totalPages)
            commit(mutation.LAST_ORDERS, response.data.page_lookups.orders)
            commit(mutation.CUSTOMER_LIST, response.data.data)
            resolve(response.data.data)
          } else {
            reject(response.data.data)
          }
        })
        .catch(error => reject(error))

      //fetch customer deliver areas
      resolve()
      dispatch('fetchDeliveryArea', '')
      // get Customer Group
      CustomerService.customerGroupList().then(response => {
        commit(mutation.SET_CUSTOMER_GROUP, response.data.data)
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

  /*customerLastOrder({ state, commit }, customerId) {
    let customerLastOrderDetails = false
    const lastOrder = Object.entries(state.lastOrder._id)
    for (const [value] of lastOrder) {
      if (value.customer == customerId) {
        customerLastOrderDetails = value
      }
    }
    commit(mutation.CUSTOMER_LAST_ORDERS, customerLastOrderDetails)
  },*/
  fetchSelectedCustomer({ state, commit, dispatch, rootGetters }, customerId) {
    commit(mutation.SET_CUSTOMER_LOADING, true)
    dispatch('location/updateModalSelectionDelivery', '#loyalty-payment', {
      root: true,
    })
    return new Promise((resolve, reject) => {
      commit(mutation.SET_CUSTOMER_ID, customerId)
      CustomerService.fetchCustomer(customerId)
        .then(response => {
          let totalPages = Math.ceil(
            parseInt(response.data.item.total_orders) /
              parseInt(state.params.page_size)
          )
          commit(mutation.PAST_ORDER_PAGINATE_DETAILS, totalPages)
          commit(
            mutation.PAGE_LOOKUP,
            response.data.collected_data.page_lookups
          )
          let loyalty = {},
            orderType = null,
            orderCurrency = null,
            orderAmount = null
          orderType = rootGetters['order/orderType']
          orderCurrency = rootGetters['location/currency']
          orderAmount = rootGetters['checkoutForm/orderTotal']

          loyalty.card = response.data.collected_data.loyalty_cards
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
            pastOrders: response.data.collected_data.orders,
            deliveryAreas:
              response.data.collected_data.page_lookups.store_delivery_areas
                ._id,
          })
          commit(mutation.SET_CUSTOMER_LOADING, false)
          resolve(response.data.item)
        })
        .catch(error => reject(error))
    })
  },

  selectedAddress({ commit, dispatch }, address) {
    commit(mutation.SELECTED_CUSTOMER_ADDRESS, address)
    let orderType = { OTview: 'Delivery', OTApi: 'call_center' }
    dispatch('order/updateOrderType', orderType, { root: true })
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
        if (u.store_id == rootState.context.storeId) {
          return u.item_status
        }
      })
      commit(mutation.GET_DELIVERY_AREAS, data)
    })
  },

  setOfflineData({ commit }, data) {
    commit(mutation.SET_OFFLINE_DATA, data)
  },

  reset({ commit }) {
    commit(mutation.RESET)
    commit(mutation.LOYALTY)
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
    state.paginate.totalPages = paginateDetails
  },
  [mutation.PAST_ORDER_PAGINATE_DETAILS](state, paginateDetails) {
    state.pastOrdersPaginate.totalPages = paginateDetails
  },
  [mutation.PARAMS](state, paramsCollection) {
    state.params = paramsCollection
  },
  [mutation.GET_DELIVERY_AREAS](state, fetchDeliveryAreas) {
    state.fetchDeliveryAreas = fetchDeliveryAreas
  },
  [mutation.SET_CURRENT_PAGE_NO](state, pageNumber) {
    state.params.page_number = pageNumber
  },
  [mutation.SET_PAST_ORDER_CURRENT_PAGE_NO](state, pageNumber) {
    state.params.past_order_page_number = pageNumber
  },
  [mutation.SET_SEARCH_TERMS](state, searchTerms) {
    state.params.query = searchTerms
    state.pageId = 'main_crm_list'
    state.params.page_number = 1
  },
  [mutation.SET_CUSTOMER_GROUP](state, customerGroup) {
    state.customer_group = customerGroup
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
  /*[mutation.FETCH_CUSTOMER_ADDRESSES](state, addressList) {
    state.allOnlineAddress = addressList
  },*/
  [mutation.SET_OFFLINE_DATA](state, data) {
    state.offlineData = data
  },
  [mutation.RESET](state) {
    state.offlineData = null
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
      state.loyalty.card = loyalty.card.length ? loyalty.card[0] : 0
      let loyaltyDetails = LookupData.get({
        collection: loyalty.details._id,
        matchWith: state.loyalty.card.program,
        selection: false,
      })
      state.loyalty.details = loyaltyDetails ? loyaltyDetails : false
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

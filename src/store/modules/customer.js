import * as mutation from './customer/mutation-types'
import customerService from '@/services/data/CustomerService'
import CustomerService from '../../services/data/CustomerService'
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
  address: false,
  allOnlineAddress: false,
  offlineData: null,
  loading: false,
  error: false,
  loyalty: { card: false, details: false },
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
  getDeliveryArea: state => addressId => {
    return LookupData.get({
      collection: state.deliveryAreas,
      matchWith: addressId,
      selection: 'name',
    })
  },
}
const actions = {
  fetchAll({ commit, rootState, dispatch, state }) {
    return new Promise((resolve, reject) => {
      const params = [
        rootState.context.storeId,
        state.params.query /*query*/,
        state.params.page_number /*page_number*/,
        'last_order_datetime',
        state.params.page_size /*page_size*/,
      ]
      customerService
        .customerList(...params)
        .then(response => {
          if (response.data.data.length) {
            let totalPages = Math.ceil(
              parseInt(response.data.count) / parseInt(state.params.page_size)
            )
            commit(mutation.CUSTOMER_LIST, response.data.data)
            commit(mutation.PAGINATE_DETAILS, totalPages)
            commit(mutation.LAST_ORDERS, response.data.page_lookups.orders)
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
      customerService.customerGroupList().then(response => {
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
      customerService.globalCreate(...params).then(response => {
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
  fetchSelectedCustomer({ state, commit, dispatch }, customerId) {
    dispatch('location/updateModalSelectionDelivery', '#loyalty-payment', {
      root: true,
    })
    return new Promise((resolve, reject) => {
      commit(mutation.SET_CUSTOMER_ID, customerId)
      customerService
        .fetchCustomer(customerId)
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
          let loyalty = {}
          loyalty.card = response.data.collected_data.loyalty_cards
          loyalty.details = state.lookups.brand_loyalty_programs
          commit(mutation.LOYALTY, loyalty)
          commit(mutation.SELECTED_CUSTOMER, {
            customerData: response.data.item,
            pastOrders: response.data.collected_data.orders,
            deliveryAreas:
              response.data.collected_data.page_lookups.store_delivery_areas
                ._id,
          })
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
    const params = [
      actionDetails.data,
      actionDetails.customer,
      actionDetails.model,
    ]
    customerService.globalCreate(...params).then(response => {
      commit(mutation.SET_RESPONSE_MESSAGES, response.data)
      if (actionDetails.customer) {
        dispatch('fetchSelectedCustomer', actionDetails.customer)
      } else {
        dispatch('fetchAll')
      }
    })
  },

  editAction({ commit }, actionDetails) {
    // eslint-disable-next-line no-console
    console.log(actionDetails)
    let customer_id = state.customer._id
    const params = [
      actionDetails.id,
      customer_id,
      actionDetails.model,
      actionDetails.action,
    ]
    localStorage.setItem('editItemKey', actionDetails.id)
    customerService.globalEdit(...params).then(response => {
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
    customerService.globalUpdate(...params).then(response => {
      commit(mutation.SET_RESPONSE_MESSAGES, response.data)
      dispatch('fetchSelectedCustomer', customer_id)
    })
  },

  setDefaultSettingsGlobalAddUpdate({ commit }, setDefaultSettings) {
    commit(mutation.SET_ADD_DETAILS, setDefaultSettings)
  },

  fetchDeliveryArea({ commit }, query) {
    CustomerService.fetchDeliveryAreas(query).then(response => {
      commit(mutation.GET_DELIVERY_AREAS, response.data.data)
    })
  },
  fetchCustomerAddress({ commit, rootState }) {
    let allOnlineOrders = false
    if (JSON.parse(localStorage.getItem('onlineOrders')) != null) {
      allOnlineOrders = JSON.parse(localStorage.getItem('onlineOrders')).orders
    }
    let customerIds = []
    if (allOnlineOrders) {
      allOnlineOrders.forEach(order => {
        // if (customerIds.indexOf(order.customer_id) == -1) {
        if (customerIds.includes(order.customer_id)) {
          customerIds.push(order.customer_id)
        }
      })
      const params = [customerIds, rootState.location.location]
      customerService.getCustomerDetails(...params).then(response => {
        commit(mutation.FETCH_CUSTOMER_ADDRESSES, response.data.data)
      })
    }
  },

  setOfflineData({ commit }, data) {
    commit(mutation.SET_OFFLINE_DATA, data)
  },

  reset({ commit }) {
    commit(mutation.RESET)
    commit(mutation.LOYALTY, false)
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
      state.responseInformation.message = customerCreateResponse.error
    } else {
      state.responseInformation.status = customerCreateResponse.status
      state.responseInformation.message = customerCreateResponse.data
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
  [mutation.FETCH_CUSTOMER_ADDRESSES](state, addressList) {
    state.allOnlineAddress = addressList
  },
  [mutation.SET_OFFLINE_DATA](state, data) {
    state.offlineData = data
  },
  [mutation.RESET](state) {
    state.offlineData = null
  },
  [mutation.SET_LOADING](state, status) {
    state.loading = status
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
      state.loyalty.card = 0
      state.loyalty.details = false
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

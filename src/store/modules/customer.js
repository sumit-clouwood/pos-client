import * as mutation from './customer/mutation-types'
import customerService from '@/services/data/CustomerService'

const state = {
  customer_list: [],
  customer: false,
  customerId: null,
  customer_group: {},
  paginate: {},
  params: { page_number: 1, page_size: 10, search: '' },
  responseInformation: { status: 0, message: '' },
  address: false,
  allOnlineAddress: false,
  fetchCustomerAddressOnly: false,
  offlineData: null,
}
const getters = {
  customer: state => {
    return state.customer ? state.customer.customer_list : false
  },
  selectedAddress: state => {
    if (state.address) {
      const addressId = state.address.id
      if (state.customer) {
        return state.customer.customer_list.customer_details.find(
          address => address._id == addressId
        )
      } else {
        return state.fetchCustomerAddressOnly.customer_list[0].customer_details.find(
          address => address._id == addressId
        )
      }
    }
  },
}
const actions = {
  fetchAll({ commit, rootState }) {
    let paginateDetails = {}
    const params = [
      rootState.location.location,
      state.params.search /*search*/,
      state.params.page_number /*page_number*/,
      'pos' /*origin set pos for checking api is origin*/,
      '' /*validate*/,
      rootState.sync.date,
      rootState.sync.compress,
      state.params.page_size /*page_size*/,
    ]
    customerService.customerList(...params).then(response => {
      if (response.data.data.length) {
        paginateDetails.currentPage = response.data.page_number
        paginateDetails.totalCustomers = response.data.count
        paginateDetails.totalPages = response.data.max_page_number
        paginateDetails.customarPerPage = response.data.page_size

        commit(mutation.CUSTOMER_LIST, response.data.data)
        commit(mutation.PAGINATE_DETAILS, paginateDetails)
      }
    })

    // get Customer Group
    const customerGroupParams = [rootState.sync.date, rootState.sync.compress]
    customerService.customerGroupList(...customerGroupParams).then(response => {
      commit(mutation.SET_CUSTOMER_GROUP, response.data.data)
    })
  },

  setPageNumber: function({ commit, dispatch }, pageNumber) {
    commit(mutation.SET_CURRENT_PAGE_NO, pageNumber)
    dispatch('fetchAll')
  },

  searchCustomer: function({ commit, dispatch }, searchTerms) {
    if (searchTerms !== '') {
      commit(mutation.SET_SEARCH_TERMS, searchTerms)
      dispatch('fetchAll')
    }
  },

  addNote({ commit, rootState }, note) {
    if (typeof state.customer.customer_list !== 'undefined') {
      const params = [
        state.customer.customer_list._id,
        rootState.auth.userDetails._id,
        note,
      ]
      customerService.addNote(...params).then(response => {
        commit(mutation.SET_RESPONSE_MESSAGES, response.data)
      })
    } else {
      alert('Customer not selected yet')
    }
  },

  fetchSelectedCustomer({ commit, rootState }, { customerId, addressOnly }) {
    commit(mutation.SET_CUSTOMER_ID, customerId)
    const params = [customerId, rootState.location.location]
    if (typeof addressOnly != 'undefined') {
      customerService.getCustomerDetails(...params).then(response => {
        commit(mutation.FETCH_CUSTOMER_ADDRESSES_ONLY, response.data.data)
        //dispatch('giftcard/setCustomerGiftCards', response.data.data)
      })
    } else {
      customerService.fetchCustomer(...params).then(response => {
        commit(mutation.SELECTED_CUSTOMER, response.data.data)
        //dispatch('giftcard/setCustomerGiftCards', response.data.data)
      })
    }
  },

  selectedAddress({ commit }, selected_address_id, area) {
    let selectedAddress = {}
    selectedAddress.id = selected_address_id
    selectedAddress.delivery_area = area
    commit(mutation.SELECTED_CUSTOMER_ADDRESS, selectedAddress)
  },

  CreateCustomer({ commit }, newCustomerDetails) {
    customerService.createCustomer(newCustomerDetails).then(response => {
      commit(mutation.SET_RESPONSE_MESSAGES, response.data)
    })
  },

  CreateAddress({ commit }, newAddressDetails) {
    newAddressDetails.customer_id = state.customer.customer_list._id
    customerService.createAddress(newAddressDetails).then(response => {
      commit(mutation.SET_RESPONSE_MESSAGES, response.data)
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
    state.paginate = paginateDetails
  },
  [mutation.PARAMS](state, paramsCollection) {
    state.params = paramsCollection
  },
  [mutation.SET_CURRENT_PAGE_NO](state, pageNumber) {
    state.params.page_number = pageNumber
  },
  [mutation.SET_SEARCH_TERMS](state, searchTerms) {
    state.params.search = searchTerms
  },
  [mutation.SET_CUSTOMER_GROUP](state, customerGroup) {
    state.customer_group = customerGroup
  },
  [mutation.SET_RESPONSE_MESSAGES](state, message) {
    state.responseInformation.message = message
  },
  [mutation.SET_RESPONSE_MESSAGES](state, customerCreateResponse) {
    if (customerCreateResponse.status == 0) {
      state.responseInformation.status = customerCreateResponse.status
      state.responseInformation.message = customerCreateResponse.error
    } else {
      state.responseInformation.status = customerCreateResponse.status
      state.responseInformation.message = customerCreateResponse.data
    }
  },
  [mutation.SELECTED_CUSTOMER](state, customerDetails) {
    state.customer = customerDetails
  },
  [mutation.SELECTED_CUSTOMER_ADDRESS](state, selectedAddress) {
    state.address = selectedAddress
  },
  [mutation.FETCH_CUSTOMER_ADDRESSES](state, addressList) {
    state.allOnlineAddress = addressList
  },
  [mutation.FETCH_CUSTOMER_ADDRESSES_ONLY](state, customerAddressList) {
    state.fetchCustomerAddressOnly = customerAddressList
  },
  [mutation.SET_OFFLINE_DATA](state, data) {
    state.offlineData = data
  },
  [mutation.RESET](state) {
    state.offlineData = null
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

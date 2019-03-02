import * as mutation from './customer/mutation-types'
import customerService from '@/services/data/CustomerService'

const state = {
  customer_list: [],
  customer: {},
  customer_group: {},
  paginate: {},
  params: { page_number: 1, page_size: 10, search: '' },
  message: {},
  address: {},
}
const getters = {}
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
      const params = [state.customer.customer_list._id, rootState.auth.userDetails._id, note]
      customerService.addNote(...params).then(response => {
        commit(mutation.SET_RESPONSE_MESSAGES, response.message)
      })
    } else {
      alert('Customer not selected yet')
    }
  },

  fetchSelectedCustomer({ commit, rootState }, customer_id) {
    const params = [customer_id, rootState.location.location]
    customerService.fetchCustomer(...params).then(response => {
      commit(mutation.SELECTED_CUSTOMER, response.data.data)
    })
  },
  selectedAddress({ commit }, selected_address_id) {
    let selectedAddress = {}
    selectedAddress.id = selected_address_id
    selectedAddress.delivery_area = 'lalgarh'
    commit(mutation.SELECTED_CUSTOMER_ADDRESS, selectedAddress)
  },
}
const mutations = {
  [mutation.CUSTOMER_LIST](commit, customersDetail) {
    state.customer_list = customersDetail
  },
  [mutation.PAGINATE_DETAILS](commit, paginateDetails) {
    state.paginate = paginateDetails
  },
  [mutation.PARAMS](commit, paramsCollection) {
    state.params = paramsCollection
  },
  [mutation.SET_CURRENT_PAGE_NO](commit, pageNumber) {
    state.params.page_number = pageNumber
  },
  [mutation.SET_SEARCH_TERMS](commit, searchTerms) {
    state.params.search = searchTerms
  },
  [mutation.SET_CUSTOMER_GROUP](commit, customerGroup) {
    state.customer_group = customerGroup
  },
  [mutation.SET_RESPONSE_MESSAGES](commit, message) {
    state.message.note = message
  },
  [mutation.SELECTED_CUSTOMER](commit, customerDetails) {
    state.customer = customerDetails
  },
  [mutation.SELECTED_CUSTOMER_ADDRESS](commit, selectedAddress) {
    state.address = selectedAddress
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

import * as mutation from './customer/mutation-types'
import customerService from '@/services/data/CustomerService'

const state = {
  customersDetail: [],
  customers: {},
  paginate: {},
  params: { page_number: 1, page_size: 10, search: '' },
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
  },
  setPageNumber({ commit, dispatch }, pageNumber) {
    commit(mutation.SET_CURRENT_PAGE_NO, pageNumber)
    dispatch('fetchAll')
  },
  searchCustomer: function(searchTerms) {
    let params = {}
    params.search = searchTerms
    commit(mutation.PARAMS, searchTerms)
    this.fetchAll()
  },
}
const mutations = {
  [mutation.CUSTOMER_LIST](commit, customersDetail) {
    state.customersDetail = customersDetail
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
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

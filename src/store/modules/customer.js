import * as mutation from './customer/mutation-types'
import customerService from '@/services/data/CustomerService'

const state = {
  customer_list: [],
  customer: false,
  customerId: null,
  customer_group: {},
  paginate: {},
  pastOrdersPaginate: {},
  params: {
    page_number: 1,
    page_size: 10,
    search: '',
    past_order_page_number: 1,
  },
  responseInformation: { status: 0, message: '' },
  address: false,
  allOnlineAddress: false,
  fetchCustomerAddressOnly: false,
  offlineData: null,
  loading: false,
  error: false,
  loyalty: false,
}
const getters = {
  find: state => customerId => {
    //look into already having customers
    return state.fetchCustomerAddressOnly.find(
      customer => customer._id == customerId
    )
  },
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
    return new Promise((resolve, reject) => {
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
      customerService
        .customerList(...params)
        .then(response => {
          if (response.data.data.length) {
            paginateDetails.currentPage = response.data.page_number
            paginateDetails.totalCustomers = response.data.count
            paginateDetails.totalPages = response.data.max_page_number
            paginateDetails.customarPerPage = response.data.page_size

            commit(mutation.CUSTOMER_LIST, response.data.data)
            commit(mutation.PAGINATE_DETAILS, paginateDetails)
            resolve(response.data.data)
          } else {
            reject(response.data.data)
          }
        })
        .catch(error => reject(error))

      // get Customer Group
      const customerGroupParams = [rootState.sync.date, rootState.sync.compress]
      customerService
        .customerGroupList(...customerGroupParams)
        .then(response => {
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
    let customerId = state.customer.customer_list._id
    dispatch('fetchSelectedCustomer', { customerId: customerId })
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
        .catch(error => reject(error))
        .finally(() => commit(mutation.SET_LOADING, false))
    })
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

  fetchSelectedCustomer(
    { state, commit, rootState, dispatch },
    { customerId, addressOnly }
  ) {
    return new Promise((resolve, reject) => {
      dispatch('location/updateModalSelectionDelivery', '#loyalty-payment', {
        root: true,
      })
      commit(mutation.SET_CUSTOMER_ID, customerId)

      if (typeof addressOnly != 'undefined') {
        const params = [customerId, rootState.location.location]
        customerService
          .getCustomerDetails(...params)
          .then(response => {
            commit(mutation.FETCH_CUSTOMER_ADDRESSES_ONLY, response.data.data)

            if (state.fetchCustomerAddressOnly.customer_list) {
              if (
                !state.fetchCustomerAddressOnly.customer_list[0]
                  .customer_details.length
              ) {
                commit(mutation.SET_ERROR, true)
              } else {
                commit(mutation.SET_ERROR, false)
              }
            }
            resolve(response.data.data.customer_list[0])
            //dispatch('giftcard/setCustomerGiftCards', response.data.data)
          })
          .catch(error => reject(error))
      } else {
        let limit = 10
        let pgno = state.params.past_order_page_number
        const params = [customerId, rootState.location.location, limit, pgno]
        let pastOrdersPaginate = {}
        customerService
          .fetchCustomer(...params)
          .then(response => {
            commit(mutation.SELECTED_CUSTOMER, response.data.data)
            pastOrdersPaginate.currentPage = pgno
            pastOrdersPaginate.totalOrder =
              response.data.data.customer_list.totalOrders
            pastOrdersPaginate.totalPages =
              response.data.data.customer_list.totalpages
            pastOrdersPaginate.customarPerPage = limit
            commit(mutation.PAST_ORDER_PAGINATE_DETAILS, pastOrdersPaginate)
            if (response.data.data.customer_list != null) {
              commit(
                mutation.LOYALTY,
                response.data.data.customer_list.loyalty_point
              )
            } else {
              commit(mutation.LOYALTY, false)
            }

            resolve(response)
            //dispatch('giftcard/setCustomerGiftCards', response.data.data)
            //console.log(response.data.data.customer_list.loyalty_point)
          })
          .catch(error => reject(error))
      }
    })
  },

  selectedAddress({ commit, dispatch }, selected_address_id, area) {
    let selectedAddress = {}
    selectedAddress.id = selected_address_id
    selectedAddress.delivery_area = area
    commit(mutation.SELECTED_CUSTOMER_ADDRESS, selectedAddress)
    dispatch('order/updateOrderType','delivery',{ root: true })
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
    state.paginate = paginateDetails
  },
  [mutation.PAST_ORDER_PAGINATE_DETAILS](state, paginateDetails) {
    state.pastOrdersPaginate = paginateDetails
  },
  [mutation.PARAMS](state, paramsCollection) {
    state.params = paramsCollection
  },
  [mutation.SET_CURRENT_PAGE_NO](state, pageNumber) {
    state.params.page_number = pageNumber
  },
  [mutation.SET_PAST_ORDER_CURRENT_PAGE_NO](state, pageNumber) {
    state.params.past_order_page_number = pageNumber
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
  [mutation.SET_LOADING](state, status) {
    state.loading = status
  },
  [mutation.SET_ERROR](state, error) {
    state.error = error
  },
  [mutation.LOYALTY](state, loyalty) {
    state.loyalty = loyalty.length > 0 ? loyalty[0] : false
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

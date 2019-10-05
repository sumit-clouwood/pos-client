import * as mutation from './printingServer/mutation-type'
import OrderService from '@/services/data/OrderService'
import PrintingServerService from '@/services/data/PrintingServerService'
import LookupData from '@/plugins/helpers/LookupData'

const state = {
  kitchenitems: [],
  printingservers: [],
  orderDetails: {},
  pageLookups: {},
}

const actions = {
  //Fetch printing servers Ips
  fetchAllPrintingServers({ commit }) {
    return new Promise((resolve, reject) => {
      PrintingServerService.allKitchenServers()
        .then(response => {
          if (response.data.data) {
            commit(mutation.SET_PRINTING_SERVERS, response.data.data)
          }
          resolve()
        })
        .catch(error => reject(error))
    })
  },

  //Fetch All Kitchens
  fetchAllKitchens({ commit }) {
    return new Promise((resolve, reject) => {
      PrintingServerService.allKitchenSectionsItems()
        .then(response => {
          if (response.data.menu_items) {
            commit(mutation.SET_KITCHENS_ITEMS, response.data.menu_items)
          }
          resolve()
        })
        .catch(error => reject(error))
    })
  },

  //Create A JSON Request to send in Local Server API for Generating Invoices from a software.
  printingServerInvoiceRaw({ state, rootState, dispatch }, orderData) {
    let printingServers = state.printingservers //Get All Printing Servers
    if (printingServers && orderData) {
      let staff = rootState.auth.userDetails
      let customerDetails = rootState.customer
      let locationData = rootState.location
      let customerId = orderData.customer
      let customerData = [] //Customer Information
      let delivery_area = {} //Delivery Area
      let kitchen_menu_items = {}

      //Customer Data
      if (customerId) {
        //get customer name by customer id
        dispatch('customer/fetchSelectedCustomer', customerId, {
          root: true,
        }).then(customer => {
          customerData.push(customer)
        })
        if (orderData.order_delivery_area && customerDetails.deliveryAreas) {
          delivery_area = Object.values(customerDetails.deliveryAreas).find(
            delivery_area => delivery_area._id === orderData.order_delivery_area
          )
        }
      }
      //Item according to Kitchens Sections
      let kitchenSectionsItems = state.kitchenitems
      if (kitchenSectionsItems.length) {
        orderData.items.forEach(item => {
          let itemKitchen = kitchenSectionsItems.find(
            kitchenItem => kitchenItem._id === item.entity_id
          )
          if (itemKitchen) {
            kitchen_menu_items._id = itemKitchen._id
            kitchen_menu_items.category = itemKitchen.category
            kitchen_menu_items.kitchen = itemKitchen.kitchen
          }
        })
      }
      //Created Date
      let timezoneString = locationData.timezoneString
      let created_date = LookupData.convertDatetimeCustom(
        orderData.real_created_datetime,
        timezoneString,
        'DD-MMM-YYYY'
      )
      //Created Time
      let created_time = LookupData.convertDatetimeCustom(
        orderData.real_created_datetime,
        timezoneString,
        'HH:mm A'
      )
      //Crm Module Permission
      let crm_module_enabled = false
      let cb = locationData.brand
      for (var module of cb.enabled_modules) {
        if (module == 'CRM') {
          crm_module_enabled = true
        }
      }
      if (!rootState.invoice.templates) {
        return
      }
      //Invoice
      let invoiceTemplate = rootState.invoice.templates.data.data.find(
        invoice => invoice
      )
      let orderTypeLabel = orderData.order_type + '_label'
      //Final JSON
      let jsonResponse = {
        status: 'ok',
        brand_logo: locationData.brand.company_logo
          ? locationData.brand.company_logo
          : '',
        order: orderData,
        menu_items: kitchen_menu_items,
        staff: staff.item.name,
        customer: customerData,
        delivery_area: delivery_area,
        template: invoiceTemplate,
        order_type: invoiceTemplate[orderTypeLabel],
        created_date: created_date,
        created_time: created_time,
        crm_module_enabled: crm_module_enabled,
        translations: rootState.payment.appInvoiceData, //Unstable
        default_header_brand: locationData.brand.name,
        default_header_branch: locationData.store.city + ' Branch',
        default_header_phone: 'Tel No. ' + locationData.brand.contact_phone,
        generate_time: orderData.real_created_datetime,
        flash_message: 'Order Details',
        store_id: rootState.context.storeId,
      }
      if (jsonResponse) {
        printingServers.forEach(item => {
          let APIURL = item.ip_address
          OrderService.invoiceAPI(jsonResponse, APIURL) //Run API for sending invoice to Window APP
        })
        // eslint-disable-next-line no-console
        console.log(jsonResponse)
      }
    }
  },
}

const mutations = {
  [mutation.SET_KITCHENS_ITEMS](state, kitchenitems) {
    state.kitchenitems = kitchenitems
  },
  [mutation.SET_PRINTING_SERVERS](state, printingservers) {
    state.printingservers = printingservers
  },
}

export default {
  namespaced: true,
  actions,
  state,
  mutations,
}

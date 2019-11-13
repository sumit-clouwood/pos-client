import * as mutation from './printingServer/mutation-type'
// import OrderService from '@/services/data/OrderService'
import PrintingServerService from '@/services/data/PrintingServerService'
// import LookupData from '@/plugins/helpers/LookupData'
import moment from 'moment-timezone'
import { compressToBase64 } from 'lz-string'
const state = {
  kitchenitems: [],
  printingservers: [],
  orderDetails: {},
  pageLookups: {},
  createdDateTime: { date: '', time: '' },
  kitchenInvoiceResponse: true,
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

  convertDatetime({ rootState, commit }, { datetime, format }) {
    let tz = rootState.location.timezoneString
    moment.locale(tz)
    let value =
      datetime != null && typeof datetime.$date != 'undefined'
        ? parseInt(datetime.$date.$numberLong)
        : datetime
    let result = ''
    if (value) {
      if (!moment.utc(value).isValid()) return ''
      var fmt_in = moment(value)._f
      result = moment
        .utc(value, fmt_in)
        .tz(tz)
        .format(format)
    }
    if (format == 'h:mm:ss A') {
      commit(mutation.CREATED_TIME, result)
    } else {
      commit(mutation.CREATED_DATE, result)
    }
    return result
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
      let kitchen_menu_items = []

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
            kitchen_menu_items.push({
              _id: itemKitchen._id,
              category: itemKitchen.category,
              kitchen: itemKitchen.kitchen,
            })
          }
        })
      }
      dispatch('convertDatetime', {
        datetime: orderData.real_created_datetime,
        format: 'Do MMMM YYYY',
      })
      dispatch('convertDatetime', {
        datetime: orderData.real_created_datetime,
        format: 'h:mm:ss A',
      })
      //Created Date
      // let timezoneString = locationData.timezoneString
      let created_date = state.createdDateTime.date
      //Created Time
      let created_time = state.createdDateTime.time
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
      orderData.order_no = orderData.orderNumber //Custom Order No to give appropriate field for Habib
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
      let x = JSON.stringify(jsonResponse)
      // let b = new Buffer(x)
      // let stringifyResponse = b.toString('base64')
      let decodedData = compressToBase64(x)
      let url = `/printorder?len=` + decodedData.length + `&data=` + decodedData
      localStorage.setItem('orderKitchenInvoiceData', url) //This localstorage variable hold Kitchen invoice api request collection for IOS Webviews. IOS Webviews does not display default Browser Print Window.
      // eslint-disable-next-line no-console
      if (jsonResponse) {
        printingServers.forEach(item => {
          let APIURL = item.ip_address
          dispatch('centeredPopup', {
            url: APIURL + url,
            winName: 'Kitchen invoice printing',
            w: '700',
            h: '300',
            scroll: 'yes ',
          })
          setTimeout(function() {
            // eslint-disable-next-line no-console
            console.log(state.kitchenInvoiceResponse.closed)
            if (
              typeof state.kitchenInvoiceResponse.closed != 'undefined' &&
              !state.kitchenInvoiceResponse.closed
            ) {
              // eslint-disable-next-line no-console
              console.log('close')
              state.kitchenInvoiceResponse.close()
            }
          }, 3000)
          // OrderService.invoiceAPI(jsonResponse, APIURL) //Run API for sending invoice to Window APP
        })
      }
    }
  },

  // eslint-disable-next-line no-empty-pattern
  centeredPopup({ commit }, details) {
    // eslint-disable-next-line no-console
    console.log(details)
    setTimeout(function() {
      let LeftPosition = screen.width ? (screen.width - details.w) / 2 : 0
      let TopPosition = screen.height ? (screen.height - details.h) / 2 : 0
      let settings =
        'height=' +
        details.h +
        ',width=' +
        details.w +
        ',top=' +
        TopPosition +
        ',left=' +
        LeftPosition +
        ',scrollbars=' +
        scroll +
        ',resizable'
      let win = false
      try {
        win = window.open(details.url, details.winName, settings)
        // eslint-disable-next-line no-console
        console.log(details.ipUrl)
        win.onerror = function(msg, url, lineNo, columnNo) {
          // ... handle error ...
          // eslint-disable-next-line no-console
          console.log(msg, url, lineNo, columnNo)
          return false
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
      }
      // let win = window.open(details.url, details.winName, settings)
      commit(mutation.KITCHEN_RESPONSE, win)
    }, 100)
  },
}

const mutations = {
  [mutation.SET_KITCHENS_ITEMS](state, kitchenitems) {
    state.kitchenitems = kitchenitems
  },
  [mutation.SET_PRINTING_SERVERS](state, printingservers) {
    state.printingservers = printingservers
  },
  [mutation.CREATED_DATE](state, date) {
    state.createdDateTime.date = date
  },
  [mutation.CREATED_TIME](state, time) {
    state.createdDateTime.time = time
  },
  [mutation.KITCHEN_RESPONSE](state, status) {
    state.kitchenInvoiceResponse = status
  },
}

export default {
  namespaced: true,
  actions,
  state,
  mutations,
}

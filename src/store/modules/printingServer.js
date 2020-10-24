/* eslint-disable no-undef */
import * as mutation from './printingServer/mutation-type'
// import OrderService from '@/services/data/OrderService'
import PrintingServerService from '@/services/data/PrintingServerService'
// import LookupData from '@/plugins/helpers/LookupData'
import moment from 'moment-timezone'
// import { compressToBase64 } from 'lz-string'
const state = {
  kitchenitems: [],
  printingservers: [],
  orderDetails: {},
  pageLookups: {},
  createdDateTime: { date: '', time: '' },
  kitchenInvoiceResponse: true,
  orderData: false,
  kitchens: '',
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
  printingSetup({ state, rootState, dispatch }, orderData) {
    let printingServers = state.printingservers
    let staff = rootState.auth.userDetails
    let customerDetails = rootState.customer
    let locationData = rootState.location
    let customerId = orderData.customer
    let delivery_area = {} //Delivery Area
    let kitchen_menu_items = []
    let jsonResponse = false
    // eslint-disable-next-line no-console
    console.log(orderData, 'orderData')
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
      if (module === 'CRM') {
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
    // orderData.order_no = orderData.orderNumber || orderData.order_no //Custom Order No to give appropriate field for Habib
    let orderNo = orderData.orderNumber || orderData.order_no //Custom Order No to give appropriate field for Habib
    let dateTime = orderData.real_created_datetime
      .toString()
      .replace(/[\s-:]/g, '')
    if (orderNo) {
      orderData.order_no = orderNo
    } else {
      orderData.order_no = dateTime
      orderData.orderNumber = dateTime
    }
    let dt = rootState.auth.deviceType
    let isIOS = dt.osType
    if (isIOS) {
      let orderReferral = {}
      if (orderData.referral) {
        let referralId = orderData.referral
        let brandReferrals = JSON.parse(localStorage.getItem('brand_referrals'))
        var filteredArr = brandReferrals.filter(function(itm) {
          return itm._id === referralId
          // return [referralId].indexOf(itm._id) > -1
        })
        if (filteredArr.length) {
          orderReferral = filteredArr[0]
        }
      }
      orderData.order_referral = orderReferral
    }
    orderData.real_created_datetime = created_date
    orderData.created_at = null
    //Final JSON
    /*get selected table no*/

    //Customer Data
    if (customerId) {
      if (orderData.order_delivery_area && customerDetails.deliveryAreas) {
        delivery_area = Object.values(customerDetails.deliveryAreas).find(
          delivery_area => delivery_area._id === orderData.order_delivery_area
        )
      }
      //get customer name by customer id
      dispatch('customer/fetchSelectedCustomer', customerId, {
        root: true,
      }).then(customerData => {
        // eslint-disable-next-line no-console
        // console.log(customerData, 'customercustomercustomercustomer')
        dispatch('setInvoiceDetails', {
          locationData,
          orderData,
          kitchen_menu_items,
          staff,
          customerData,
          delivery_area,
          invoiceTemplate,
          orderTypeLabel,
          created_date,
          created_time,
          crm_module_enabled,
        }).then(response => {
          jsonResponse = response
          // eslint-disable-next-line no-console
          console.log(
            customerData,
            'customercustomercustomercustomer',
            jsonResponse
          )
          dispatch('orderDataMerging', { jsonResponse, printingServers })
        })
      })
    } else {
      let customerData = false //Customer Information
      dispatch('setInvoiceDetails', {
        locationData,
        orderData,
        kitchen_menu_items,
        staff,
        customerData,
        delivery_area,
        invoiceTemplate,
        orderTypeLabel,
        created_date,
        created_time,
        crm_module_enabled,
      }).then(response => {
        jsonResponse = response
        dispatch('orderDataMerging', { jsonResponse, printingServers })
      })
    }
  },
  orderDataMerging({ rootState }, { jsonResponse, printingServers }) {
    let _order = {}
    if (window.PrintHandle != null) {
      jsonResponse.windows_app = true
      _order['printingServers'] = printingServers
      _order['orderData'] = jsonResponse
      // eslint-disable-next-line no-console
      console.log(window.PrintHandle, 'window.PrintHandle')
      // eslint-disable-next-line no-console
      console.log(_order, '_order')
      window.PrintHandle.Print(
        JSON.stringify(_order),
        function callbackfunction(data) {
          // eslint-disable-next-line no-console
          console.log('callbackfunction')
          //perform your action in case of success or leave empty
          // eslint-disable-next-line no-console
          console.log(
            data,
            'callbackfunction result',
            rootState.payment.appInvoiceData
          )
        }
      )
    }
  },
  setInvoiceDetails(
    { rootState, dispatch, state },
    {
      locationData,
      orderData,
      kitchen_menu_items,
      staff,
      customerData,
      delivery_area,
      invoiceTemplate,
      orderTypeLabel,
      created_date,
      created_time,
      crm_module_enabled,
    }
  ) {
    let dt = rootState.auth.deviceType
    let isIOS = dt.osType
    if (isIOS) {
      //Added new field for detecting reprint or new order for IOS and Android App.
      orderData.isReprint =
        typeof orderData.isReprint != 'undefined' ? orderData.isReprint : 0
    }

    // eslint-disable-next-line no-console
    console.log(locationData, 'locationData', customerData)
    return new Promise(resolve => {
      let table_no = rootState.dinein.selectedTable
        ? rootState.dinein.selectedTable.number
        : false
      let jsonResponse = {
        status: 'ok',
        brand_logo: locationData.brand.company_logo || '',
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
        token_manager: rootState.location.store.token_manager,
        windows_app: false,
      }
      if (
        orderData.order_type === 'DINE-IN' ||
        orderData.order_type === 'dine_in'
      ) {
        if (!table_no) {
          table_no = rootState.dinein.selectedTableRservationData
        }

        Object.assign(jsonResponse, { table_number: table_no })
        // jsonResponse.table_number = table_no
        // eslint-disable-next-line no-console
        console.log(jsonResponse, orderData, 'table number section')
      }
      if (isIOS) {
        Object.assign(jsonResponse, { kitchens: state.kitchens })
        // eslint-disable-next-line no-console
        console.log(jsonResponse, 'ff')
        localStorage.setItem('orderInvoiceColData', '')
        localStorage.setItem(
          'orderInvoiceColData',
          JSON.stringify(jsonResponse)
        )
      }
      //Temp- later remove once IOS KOT App delivers.
      localStorage.setItem('orderInvoiceColData', JSON.stringify(jsonResponse))
      if (customerData) {
        dispatch('customer/resetCustomer', true, { root: true }).then(() => {
          resolve(jsonResponse)
        })
      } else {
        resolve(jsonResponse)
      }
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
  printingServerInvoiceRaw({ rootState, dispatch }, orderData) {
    // eslint-disable-next-line no-console
    console.log('IN', rootState.checkout.paymentAction, orderData)
    let dt = rootState.auth.deviceType
    let isIOS = dt.osType
    if (
      ['dine-in-place-order'].includes(rootState.checkout.paymentAction) &&
      !isIOS
    ) {
      return false
    }
    // eslint-disable-next-line no-console
    console.log(isIOS, JSON.stringify(orderData))
    if (isIOS) {
      // if (!dt.standalone && !dt.browserType) {
      //This is  a uiwebview
      const urlParams = new URLSearchParams(window.location.search)
      urlParams.set('iosprint', '1')
      window.location.search = urlParams
      // }
      localStorage.setItem(
        'initiateWebView',
        Math.floor(Math.random() * 100 + 1)
      )
      // localStorage.setItem('orderInvoiceColData', '')
    }
    let printingServers = state.printingservers
    if ((printingServers || isIOS) && orderData) {
      dispatch('printingSetup', orderData)
    }
  },
  getKitchens({ commit, rootState }) {
    return new Promise(resolve => {
      PrintingServerService.kitchens().then(response => {
        commit(mutation.KITCHENS, response.data)
        let dt = rootState.auth.deviceType
        let isIOS = dt.osType
        if (isIOS) {
          localStorage.setItem('kitchen_data', JSON.stringify(state.kitchens))
        }
        resolve(response.data)
      })
    })
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
        // eslint-disable-next-line no-console
        console.log(settings, 'settings')
        /*win = window.open(details.url, details.winName, settings)
        // eslint-disable-next-line no-console
        console.log(details.ipUrl)
        win.onerror = function(msg, url, lineNo, columnNo) {
          // ... handle error ...
          // eslint-disable-next-line no-console
          console.log(msg, url, lineNo, columnNo)
          return false
        }*/
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
  [mutation.KITCHENS](state, kitchens) {
    state.kitchens = kitchens
  },
}

export default {
  namespaced: true,
  actions,
  state,
  mutations,
}

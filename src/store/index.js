import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import printingServer from './modules/printingServer'
import category from './modules/category'
import modifier from './modules/modifier'
import order from './modules/order'
import sync from './modules/sync'
import location from './modules/location'
import orderForm from './modules/order/form'
import tax from './modules/tax'
import surcharge from './modules/surcharge'
import customer from './modules/customer'
import discount from './modules/discount'
import checkout from './modules/checkout'
import checkoutForm from './modules/checkout/form'
import giftcard from './modules/giftcard'
import dineinReservation from './modules/dineinReservation'
import announcement from './modules/announcement'
import holdOrders from './modules/holdOrders'
import transactionOrders from './modules/transactionOrders'
import payment from './modules/payment'
import invoice from './modules/invoice'
import store from './modules/store'
import brand from './modules/brand'
import loyalty from './modules/loyalty'
import context from './modules/context'
import reports from './modules/reports'
import modules from './modules/modules'
import deliveryManager from './modules/deliveryManager'
import mobile from './mobile'
import dinein from './modules/dinein'
import carhop from './modules/carhop'
import combo from './modules/combo'
import Datetime from 'vue-datetime'

// You need a specific loader for CSS files
import 'vue-datetime/dist/vue-datetime.css'

//to take snapshot
//import createLogger from 'vuex/dist/logger'

import { CoolSelectPlugin } from 'vue-cool-select'

// paste the line below only if you need "bootstrap" theme
import 'vue-cool-select/dist/themes/bootstrap.css'
// paste the line below only if you need "material-design" theme
//import 'vue-cool-select/dist/themes/material-design.css'
// you can also import your theme

Vue.use(CoolSelectPlugin)

Vue.use(Vuex)
Vue.use(Datetime)

//const debug = process.env.NODE_ENV !== 'production'

const xstore = new Vuex.Store({
  modules: {
    auth,
    store,
    sync,
    location,
    modifier,
    customer,
    printingServer,
    category,
    orderForm,
    tax,
    surcharge,
    order,
    discount,
    checkout,
    checkoutForm,
    deliveryManager,
    giftcard,
    announcement,
    holdOrders,
    transactionOrders,
    invoice,
    payment,
    loyalty,
    context,
    modules,
    mobile,
    dinein,
    carhop,
    reports,
    dineinReservation,
    combo,
    brand,
  },
  strict: false,
  //plugins: debug ? [createLogger()] : [],
})

// store.subscribe(mutation => {
//   switch (mutation.type) {
//     case 'APPLY_ITEM_DISCOUNT':
//       store.dispatch('order/recalculatePrices')
//       break
//   }
//   // called after every mutation.
//   // The mutation comes in the format of `{ type, payload }`.
// })

export default xstore

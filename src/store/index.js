import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
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
import announcement from './modules/announcement'
import holdOrders from './modules/holdOrders'
import payment from './modules/payment'
import invoice from './modules/invoice'
import loyalty from './modules/loyalty'
import context from './modules/context'
import modules from './modules/modules'
import deliveryManager from './modules/deliveryManager'
import Datetime from 'vue-datetime'
// You need a specific loader for CSS files
import 'vue-datetime/dist/vue-datetime.css'

//to take snapshot
//import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)
Vue.use(Datetime)

//const debug = process.env.NODE_ENV !== 'production'

const store = new Vuex.Store({
  modules: {
    tax,
    auth,
    sync,
    location,
    modifier,
    customer,
    category,
    orderForm,
    surcharge,
    order,
    discount,
    checkout,
    checkoutForm,
    deliveryManager,
    giftcard,
    announcement,
    holdOrders,
    invoice,
    payment,
    loyalty,
    context,
    modules,
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

export default store

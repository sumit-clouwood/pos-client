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
// import paginate from 'vuejs-paginate'

//to take snapshot
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)
// Vue.use(paginate)

const debug = process.env.NODE_ENV !== 'production'

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
    giftcard,
  },
  strict: debug,
  plugins: debug ? [createLogger()] : [],
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

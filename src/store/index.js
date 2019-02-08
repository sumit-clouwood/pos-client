import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
//import cart from './modules/cart'
import category from './modules/category'
import sync from './modules/sync'
import location from './modules/location'
//to take snapshot 
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    auth,
    sync,
    location,
  //  cart,
    category,

  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
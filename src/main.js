//entry point: The main.js file is what renders our App.vue component (and everything nested within it) and mounts it to the DOM.

//imort vue
import '@babel/polyfill'

import Vue from 'vue'

//import main component
import App from './App.vue'

import VueSocketIOExt from 'vue-socket.io-extended'
import io from 'socket.io-client'

const socket = io(process.env.VUE_APP_SOCKET_ENDPOINT)
// eslint-disable-next-line no-console
console.log('check 1', socket.connected)
socket.on('connect', function() {
  // eslint-disable-next-line no-console
  console.log('check 2', socket.connected)
})
socket.on('disconnect', function() {
  // eslint-disable-next-line no-console
  console.log('check 2', 'disconnect')
})
Vue.use(VueSocketIOExt, socket)

//import service worker
import './registerServiceWorker'

//import redux/vuex store
import store from './store'

//import routers
import router from './router'

import i18n from './i18n'

import Translate from './mixins/global/Translate'

import './plugins/constants_mixin'
import './plugins/helper_mixin'
import './mixins/global/PermissionsMixin'

Vue.config.performance = true

Vue.mixin(Translate)

//create new vue isntance to use store and routers and render App to root component
//this ll mounted to the dom <div id="app"> found in index.html
new Vue({
  store,
  router,
  i18n,
  render: h => h(App),
}).$mount('#app')

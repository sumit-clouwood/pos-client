//entry point: The main.js file is what renders our App.vue component (and everything nested within it) and mounts it to the DOM.

//imort vue
import Vue from 'vue'

//import main component
import App from './App.vue'

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

Vue.mixin(Translate)

//create new vue isntance to use store and routers and render App to root component
//this ll mounted to the dom <div id="app"> found in index.html
new Vue({
  store,
  router,
  i18n,
  render: h => h(App),
}).$mount('#app')

import Vue from 'vue'
import store from '@/store'
Vue.mixin({
  methods: {
    isWaiter() {
      return store.getters['auth/waiter']
    },
    isCarhop() {
      return store.getters['auth/carhop']
    },
    isDimsPosApp() {
      // Mixin to check if DIMS POS App
      if (
        window.PrintHandle != null &&
        window.PrintHandle.GetAgent() === 'Dimspos.App'
      ) {
        return true
      }
      return false
    },
  },
})

import Vue from 'vue'
import store from '@/store'
import * as Permissions from '@/Permissions'
Vue.mixin({
  data() {
    return {
      PERMISSIONS: Permissions,
    }
  },
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

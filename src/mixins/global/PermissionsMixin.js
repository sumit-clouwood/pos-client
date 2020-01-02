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
  },
})

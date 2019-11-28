import Vue from 'vue'
import store from '@/store'
import * as Permissions from '@/permissions'
Vue.mixin({
  data() {
    return {
      PERMISSIONS: Permissions,
    }
  },
  methods: {
    isPermitted(permission) {
      if (store.state.auth.rolePermissions) {
        return store.state.auth.rolePermissions.some(role => {
          return role.brand_permissions.includes(permission)
        })
      }
    },
    isWaiter() {
      return store.getters['auth/waiter']
    },
    isCarhop() {
      return store.getters['auth/carhop']
    },
  },
})

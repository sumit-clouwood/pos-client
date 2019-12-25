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
    isPermitted(permission) {
      if (store.state.auth.rolePermissions) {
        return store.state.auth.rolePermissions.some(role => {
          let userDetails = store.state.auth.userDetails.item
            ? store.state.auth.userDetails.item.name
            : ''
          return (
            (role.brand_permissions.includes(permission) ||
              role.store_permissions.includes(permission)) &&
            (role.name == store.getters['auth/roleName'] ||
              (userDetails === 'Super Admin' &&
                store.getters['auth/roleName'] == ''))
          )
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

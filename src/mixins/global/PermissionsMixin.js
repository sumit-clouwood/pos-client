import Vue from 'vue'
import store from '@/store'
import * as BrandPermissions from '@/BrandPermissions'
import * as StorePermissions from '@/StorePermissions'
Vue.mixin({
  data() {
    return {
      BRAND_PERMISSIONS: BrandPermissions,
      STORE_PERMISSIONS: StorePermissions,
    }
  },
  methods: {
    isPermitted(permission) {
      if (store.state.auth.rolePermissions) {
        return store.state.auth.rolePermissions.some(role => {
          return (
            (role.brand_permissions.includes(permission) ||
              role.store_permissions.includes(permission)) &&
            (role.name == store.getters['auth/roleName'] ||
              (store.state.auth.userDetails.item.name === 'Super Admin' &&
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

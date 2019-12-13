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
      /* eslint-disable */
      const rolePermissions = store.getters['auth/getPermissionsOfCurrenUser']
      if (store.state.auth.userDetails.item.name === 'Super Admin' &&
        store.getters['auth/roleName'] === ''
      ) {
        if(permission === Permissions.CARHOP_USER || permission==Permissions.WAITER)
{        return false
}
        return true
      }
      if (rolePermissions) {        
        return (rolePermissions.brand_permissions.includes(permission) ||
          rolePermissions.store_permissions.includes(permission)
        )
      }
    },
    canPerformAction(){
      return !this.isPermitted(this.PERMISSIONS.CARHOP_USER) && !this.isPermitted(this.PERMISSIONS.WAITER)
    }
  },
})

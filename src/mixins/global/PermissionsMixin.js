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
      if (rolePermissions) {
        if (
          store.state.auth.userDetails.item.name === 'Super Admin' &&
          store.getters['auth/roleName'] == ''
        ) {
          return (
            permission == Permissions.CAN_RECEIVE_PAYMENTS ||
            permission == Permissions.CAN_GIVE_DISCOUNTS
          )
        }
        return (rolePermissions.brand_permissions.includes(permission) ||
          rolePermissions.store_permissions.includes(permission)
        )
      }
    },
  },
})

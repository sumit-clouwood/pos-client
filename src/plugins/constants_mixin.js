import Vue from 'vue'
import * as CONSTANTS from '@/constants'
import * as PERMISSIONS from '@/const/permissions'

Vue.mixin({
  data: function() {
    return {
      CONST: CONSTANTS,
      PERMS: PERMISSIONS,
    }
  },
})

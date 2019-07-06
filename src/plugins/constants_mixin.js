import Vue from 'vue'
import * as CONSTANTS from '@/constants'

Vue.mixin({
  data: function() {
    return {
      CONST: CONSTANTS,
    }
  },
})

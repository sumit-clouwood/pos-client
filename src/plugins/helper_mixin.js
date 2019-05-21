import Vue from 'vue'
import Num from './helpers/Num'

Vue.mixin({
  data: function() {
    return {
      Num: Num,
    }
  },
})
